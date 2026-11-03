# Lab 4B, Task 10 - choosing the class from a string
#
# 10.4  Somewhere the string from the HTTP request has to become an object, and
#       that is a translation job, not a business rule. Here it happens once, at
#       the edge of the system, and the dictionary holds no knowledge about
#       fees, only names. The if/elif in Checkout was different: it held the
#       rules of every provider inside a class that should not care about them,
#       and every new provider meant editing working code that handled the
#       other providers. Now a new provider adds one line here and nothing
#       changes anywhere else, and the three modules that each had their own
#       if/elif call this one function, so they cannot disagree about "Payme"
#       and "payme" any more.
# 10.5  One place: the PAYMENT_METHODS dictionary. The class itself is in
#       task01.py, so two files in total and no existing code was changed.

from task01 import BankTransfer, Card, Cash, Click, Payme


class UnknownPaymentMethodError(Exception):
    pass


PAYMENT_METHODS = {
    "card": Card,
    "click": Click,
    "payme": Payme,
    "cash": Cash,
    "bank_transfer": BankTransfer,
}


def create_payment_method(name):
    key = name.strip().lower()
    if key not in PAYMENT_METHODS:
        supported = ", ".join(sorted(PAYMENT_METHODS))
        raise UnknownPaymentMethodError(
            f"unknown payment method {name!r}. Supported names: {supported}"
        )
    return PAYMENT_METHODS[key]()


# ---------- tests ----------

def test_a_name_becomes_the_right_object():
    assert isinstance(create_payment_method("click"), Click)
    assert isinstance(create_payment_method("cash"), Cash)
    assert isinstance(create_payment_method("bank_transfer"), BankTransfer)


def test_the_name_is_normalised():
    for written in ["payme", "Payme", "PAYME", "  Payme  ", "pAyMe"]:
        assert isinstance(create_payment_method(written), Payme)


def test_every_call_gives_a_new_object():
    assert create_payment_method("card") is not create_payment_method("card")


def test_an_unknown_name_lists_the_supported_ones():
    try:
        create_payment_method("bitcoin")
    except UnknownPaymentMethodError as error:
        message = str(error)
        assert "bitcoin" in message
        assert "click" in message and "bank_transfer" in message
    else:
        raise AssertionError("an unknown name must raise")


def test_the_object_can_be_used_by_checkout():
    from task01 import Checkout

    method = create_payment_method(" CLICK ")
    assert Checkout().pay(method, 100_000) == {
        "charged": 101_000,
        "refundable": True,
    }
