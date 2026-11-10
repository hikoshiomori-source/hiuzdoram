#include <WiFi.h>
#include <Arduino.h>
#include <PubSubClient.h>

WiFiClient espClient;
PubSubClient mqttClient(espClient);

// ---------------------------------------------------------------------------
// Credentials / broker settings
// ---------------------------------------------------------------------------
static const char* WIFI_SSID     = "Redmi Note 14";
static const char* WIFI_PASSWORD = "YOUR_WIFI_PASSWORD";

const char* mqtt_server = "turin.iotserver.uz";
const int   mqtt_port   = 2890;

const char* mqtt_user = "userTTPU";
const char* mqtt_pass = "mqttpass";

const char* mqtt_topic   = "ttpu/led";        // LED commands in
const char* status_topic = "ttpu/led/state";  // LED status out (separate, so our
                                              // own status is not re-parsed as a command)
const char* time_topic   = "time/now";        // broker clock broadcast

String deviceMac;

// ---------------------------------------------------------------------------
// LED wiring
// ---------------------------------------------------------------------------
#define RED    26
#define GREEN  27
#define BLUE   14
#define YELLOW 12

struct Led {
  const char* name;
  uint8_t     pin;
  bool        on;
};

Led leds[] = {
  { "red",    RED,    false },
  { "green",  GREEN,  false },
  { "blue",   BLUE,   false },
  { "yellow", YELLOW, false },
};

const size_t LED_COUNT = sizeof(leds) / sizeof(leds[0]);

// Reconnect bookkeeping (non-blocking, so loop() keeps servicing MQTT)
unsigned long lastMqttAttempt = 0;
const unsigned long MQTT_RETRY_MS = 5000;

// ---------------------------------------------------------------------------
// LED helpers
// ---------------------------------------------------------------------------
void applyLed(Led& led, bool on) {
  led.on = on;
  digitalWrite(led.pin, on ? HIGH : LOW);
}

void publishState() {
  String state;

  for (size_t i = 0; i < LED_COUNT; i++) {
    if (i > 0) {
      state += ' ';
    }
    state += leds[i].name;
    state += '=';
    state += leds[i].on ? "on" : "off";
  }

  mqttClient.publish(status_topic, state.c_str());
  Serial.print("State: ");
  Serial.println(state);
}

// Accepted commands on ttpu/led:
//   "red on", "green off", "blue toggle"
//   "all on", "all off"
//   "state"  -> republish current state
bool handleLedCommand(const String& raw) {
  String command = raw;
  command.trim();
  command.toLowerCase();

  if (command.length() == 0) {
    return false;
  }

  if (command == "state") {
    publishState();
    return true;
  }

  String target = command;
  String action = "on";

  int space = command.indexOf(' ');
  if (space >= 0) {
    target = command.substring(0, space);
    action = command.substring(space + 1);
    action.trim();
  }

  bool known = false;
  bool changed = false;

  for (size_t i = 0; i < LED_COUNT; i++) {
    if (target != "all" && target != leds[i].name) {
      continue;
    }

    known = true;

    if (action == "on" || action == "1" || action == "high") {
      applyLed(leds[i], true);
      changed = true;
    } else if (action == "off" || action == "0" || action == "low") {
      applyLed(leds[i], false);
      changed = true;
    } else if (action == "toggle") {
      applyLed(leds[i], !leds[i].on);
      changed = true;
    }
  }

  if (!known) {
    Serial.print("Unknown LED: ");
    Serial.println(target);
    return false;
  }

  if (!changed) {
    Serial.print("Unknown action: ");
    Serial.println(action);
    return false;
  }

  publishState();
  return true;
}

// ---------------------------------------------------------------------------
// MQTT callback
// ---------------------------------------------------------------------------
void kalbek(char* topic, byte* payload, unsigned int length) {

  String message;
  message.reserve(length);

  for (unsigned int i = 0; i < length; i++) {
    message += (char)payload[i];
  }

  Serial.println("\n----------------------");

  Serial.print("Topic: ");
  Serial.println(topic);

  Serial.print("Message: ");
  Serial.println(message);

  Serial.print("Received time: ");
  Serial.println(millis());

  if (strcmp(topic, mqtt_topic) == 0) {
    handleLedCommand(message);
  }

  Serial.println("----------------------");
}

// ---------------------------------------------------------------------------
// Connection helpers
// ---------------------------------------------------------------------------
void connectWifi() {
  WiFi.mode(WIFI_STA);
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);

  Serial.print("Connecting");

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("\nConnected!");

  Serial.print("IP address: ");
  Serial.println(WiFi.localIP());
}

bool connectMqtt() {
  Serial.print("Connecting to MQTT broker... ");

  if (!mqttClient.connect(deviceMac.c_str(), mqtt_user, mqtt_pass)) {
    Serial.print("failed, rc=");
    Serial.println(mqttClient.state());
    return false;
  }

  Serial.println("connected!");

  mqttClient.subscribe(mqtt_topic);
  mqttClient.subscribe(time_topic);

  Serial.print("Subscribed to ");
  Serial.print(mqtt_topic);
  Serial.print(" and ");
  Serial.println(time_topic);

  publishState();
  return true;
}

// ---------------------------------------------------------------------------
// setup / loop
// ---------------------------------------------------------------------------
void setup() {

  Serial.begin(115200);

  for (size_t i = 0; i < LED_COUNT; i++) {
    pinMode(leds[i].pin, OUTPUT);
    applyLed(leds[i], false);
  }

  connectWifi();

  // Device MAC address doubles as the MQTT client id
  deviceMac = WiFi.macAddress();

  mqttClient.setServer(mqtt_server, mqtt_port);
  mqttClient.setCallback(kalbek);

  if (!connectMqtt()) {
    lastMqttAttempt = millis();
  }
}

void loop() {

  // WiFi reconnect
  if (WiFi.status() != WL_CONNECTED) {

    Serial.println("WiFi disconnected. Attempting to reconnect...");

    WiFi.begin(WIFI_SSID, WIFI_PASSWORD);

    while (WiFi.status() != WL_CONNECTED) {
      delay(500);
      Serial.print(".");
    }

    Serial.println("\nReconnected!");
  }

  // MQTT reconnect, without blocking the sketch forever
  if (!mqttClient.connected()) {
    unsigned long now = millis();

    if (now - lastMqttAttempt >= MQTT_RETRY_MS) {
      lastMqttAttempt = now;
      connectMqtt();
    }

    return;
  }

  // Receive MQTT messages
  mqttClient.loop();
}
