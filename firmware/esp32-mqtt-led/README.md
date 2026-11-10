# ESP32 MQTT LED

Arduino sketch for an ESP32 that connects to WiFi, connects to the TTPU MQTT
broker, and switches four LEDs on command.

## Hardware

| LED    | GPIO |
| ------ | ---- |
| red    | 26   |
| green  | 27   |
| blue   | 14   |
| yellow | 12   |

Each LED is driven active-high (anode to the GPIO through a resistor, cathode
to GND).

## Build

Arduino IDE or `arduino-cli`, with the ESP32 core and the **PubSubClient**
library installed:

```bash
arduino-cli lib install PubSubClient
```

```bash
arduino-cli compile --fqbn esp32:esp32:esp32 firmware/esp32-mqtt-led
```

```bash
arduino-cli upload -p /dev/ttyUSB0 --fqbn esp32:esp32:esp32 firmware/esp32-mqtt-led
```

Set `WIFI_SSID` / `WIFI_PASSWORD` at the top of the sketch before flashing.
Serial monitor runs at 115200 baud.

## MQTT

Broker `turin.iotserver.uz:2890`, client id = the device MAC address.

| Topic            | Direction  | Payload                               |
| ---------------- | ---------- | ------------------------------------- |
| `ttpu/led`       | subscribed | LED command (see below)               |
| `ttpu/led/state` | published  | `red=off green=on blue=off yellow=off` |
| `time/now`       | subscribed | broker clock broadcast, printed only  |

Status is published on its own topic so the device does not receive its own
status message back and try to parse it as a command.

### Commands

```
red on
green off
blue toggle
yellow 1
all off
state
```

`on`/`1`/`high` and `off`/`0`/`low` are equivalent, `toggle` flips, `all`
applies to every LED, and `state` just republishes the current status.
Commands are case-insensitive and surrounding whitespace is ignored. An
unknown colour or action is reported on serial and otherwise ignored.

Example with `mosquitto_pub`:

```bash
mosquitto_pub -h turin.iotserver.uz -p 2890 -u userTTPU -P mqttpass -t ttpu/led -m "red on"
```

## Behaviour notes

- All LEDs start off, and the state is published right after each connect.
- WiFi drops are retried in `loop()`.
- A failed MQTT connect no longer halts the sketch: it is retried every 5 s.
