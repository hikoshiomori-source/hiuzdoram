# Lab 4B, E5 - events that survive a deploy
#
# E5.4  from_dict is a @classmethod because it has to build an object, and for
#       that it needs the class. cls is the class that was really asked, so if
#       OrderPlacedV2 inherits from_dict from OrderPlaced, cls is
#       OrderPlacedV2 and the method returns a V2 object without being
#       rewritten. A @staticmethod would have to write OrderPlaced(...) by
#       hand, and every subclass would then get the parent's class back, which
#       is wrong, or would have to copy the whole method.

import json


class OrderPlaced:
    TYPE = "order_placed"
    VERSION = 1

    def __init__(self, order_id, total_tiyin, currency):
        self.order_id = order_id
        self.total_tiyin = total_tiyin
        self.currency = currency

    def to_dict(self):
        return {
            "type": self.TYPE,
            "version": self.VERSION,
            "order_id": self.order_id,
            "total_tiyin": self.total_tiyin,
            "currency": self.currency,
        }

    @classmethod
    def from_dict(cls, data):
        # only the fields this version knows, everything else is ignored
        return cls(data["order_id"], data["total_tiyin"], data["currency"])

    def __eq__(self, other):
        if not isinstance(other, OrderPlaced):
            return NotImplemented
        return self.to_dict() == other.to_dict()


class OrderPlacedV2(OrderPlaced):
    VERSION = 2

    def __init__(self, order_id, total_tiyin, currency, promo_code=None):
        super().__init__(order_id, total_tiyin, currency)
        self.promo_code = promo_code

    def to_dict(self):
        data = super().to_dict()
        data["promo_code"] = self.promo_code
        return data

    @classmethod
    def from_dict(cls, data):
        return cls(
            data["order_id"],
            data["total_tiyin"],
            data["currency"],
            data.get("promo_code"),         # missing in version 1 messages
        )


class OrderCancelled:
    TYPE = "order_cancelled"
    VERSION = 1

    def __init__(self, order_id, reason):
        self.order_id = order_id
        self.reason = reason

    def to_dict(self):
        return {
            "type": self.TYPE,
            "version": self.VERSION,
            "order_id": self.order_id,
            "reason": self.reason,
        }

    @classmethod
    def from_dict(cls, data):
        return cls(data["order_id"], data["reason"])

    def __eq__(self, other):
        if not isinstance(other, OrderCancelled):
            return NotImplemented
        return self.to_dict() == other.to_dict()


# the new consumer knows version 2 of OrderPlaced
EVENT_TYPES = {
    OrderPlacedV2.TYPE: OrderPlacedV2,
    OrderCancelled.TYPE: OrderCancelled,
}

# the consumer that still runs the old code
OLD_EVENT_TYPES = {
    OrderPlaced.TYPE: OrderPlaced,
    OrderCancelled.TYPE: OrderCancelled,
}


def decode(payload, event_types=None):
    if event_types is None:
        event_types = EVENT_TYPES

    data = json.loads(payload)
    event_class = event_types.get(data.get("type"))
    if event_class is None:
        print(f"skipping unknown event type: {data.get('type')!r}")
        return None                         # the consumer keeps running
    return event_class.from_dict(data)


# ---------- tests ----------

V1_PAYLOAD = json.dumps(
    OrderPlaced("A-1", 12_000_000, "UZS").to_dict()
)
V2_PAYLOAD = json.dumps(
    OrderPlacedV2("A-2", 15_000_000, "UZS", promo_code="STUDENT10").to_dict()
)


def test_round_trip():
    event = OrderCancelled("A-9", "out of stock")
    again = decode(json.dumps(event.to_dict()))
    assert again == event


def test_new_code_reads_an_old_message():
    event = decode(V1_PAYLOAD)
    assert isinstance(event, OrderPlacedV2)
    assert event.order_id == "A-1"
    assert event.promo_code is None         # the field was not in version 1


def test_new_code_reads_a_new_message():
    event = decode(V2_PAYLOAD)
    assert event.promo_code == "STUDENT10"


def test_old_code_reads_a_new_message_and_ignores_the_extra_field():
    event = decode(V2_PAYLOAD, OLD_EVENT_TYPES)
    assert type(event) is OrderPlaced
    assert event.total_tiyin == 15_000_000
    assert not hasattr(event, "promo_code")


def test_old_code_reads_an_old_message():
    event = decode(V1_PAYLOAD, OLD_EVENT_TYPES)
    assert event.order_id == "A-1"


def test_an_unknown_type_does_not_stop_the_consumer():
    queue = [
        V1_PAYLOAD,
        json.dumps(
            {"type": "order_refunded", "version": 1, "order_id": "A-3"}
        ),
        V2_PAYLOAD,
    ]
    decoded = [decode(payload) for payload in queue]

    assert decoded[1] is None
    assert decoded[0].order_id == "A-1"
    assert decoded[2].order_id == "A-2"


def test_classmethod_gives_the_right_class_to_the_subclass():
    data = json.loads(V1_PAYLOAD)
    assert type(OrderPlaced.from_dict(data)) is OrderPlaced
    assert type(OrderPlacedV2.from_dict(data)) is OrderPlacedV2
