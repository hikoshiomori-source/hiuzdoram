# Lab 4B, E2 - payment methods that register themselves
#
# E2.2  inspect.isabstract(cls) does work inside __init_subclass__, but not for
#       the reason I first thought. __init_subclass__ runs while ABCMeta is
#       still building the class, so __abstractmethods__ does not exist yet; I
#       checked with hasattr and it is False. inspect.isabstract sees that and
#       then looks for the abstract methods by hand, so it gives the right
#       answer anyway: True for a middle class that still has an abstract
#       method, False for a finished one. That is what I use to let abstract
#       middle classes skip the name.
# E2.4  The class registers itself only when somebody imports its module, so
#       the explicit registry of Task 10 is better when the modules are not all
#       imported at start: plugins loaded on demand, classes in a package that
#       the server imports lazily, or a build that drops "unused" modules. It
#       is also better when the list of supported methods must be read or
#       changed in one file, for example turning Payme off for a week, or when
#       the same class is sold under two names in two countries. Self
#       registration wins when all the classes live in one package that is
#       always imported, because then you cannot forget the second step.

import inspect
from abc import ABC, abstractmethod


class UnknownPaymentMethodError(Exception):
    pass


class PaymentMethod(ABC):
    registry = {}

    def __init_subclass__(cls, name=None, **kwargs):
        super().__init_subclass__(**kwargs)

        if inspect.isabstract(cls):
            return                      # a middle class, it needs no name

        if name is None:
            raise TypeError(
                f"{cls.__name__} has no name. Write it like "
                f'class {cls.__name__}(PaymentMethod, name="..."):'
            )

        if name in PaymentMethod.registry:
            taken_by = PaymentMethod.registry[name].__name__
            raise TypeError(
                f"the name {name!r} is already used by {taken_by}"
            )

        PaymentMethod.registry[name] = cls

    @abstractmethod
    def fee(self, amount):
        """Fee in sum for this amount."""

    @abstractmethod
    def is_refundable(self):
        """True if the money can be given back."""


class OnlineWallet(PaymentMethod):
    """Middle class: still abstract, so no name here."""

    def is_refundable(self):
        return True


class Click(OnlineWallet, name="click"):
    def fee(self, amount):
        return amount * 10 // 1000


class Payme(OnlineWallet, name="payme"):
    def fee(self, amount):
        return amount * 10 // 1000


class Card(PaymentMethod, name="card"):
    def fee(self, amount):
        return amount * 15 // 1000

    def is_refundable(self):
        return True


class Cash(PaymentMethod, name="cash"):
    def fee(self, amount):
        return 0

    def is_refundable(self):
        return False


class BankTransfer(PaymentMethod, name="bank_transfer"):
    def fee(self, amount):
        return 5_000

    def is_refundable(self):
        return True


def create_payment_method(name):
    key = name.strip().lower()
    if key not in PaymentMethod.registry:
        supported = ", ".join(sorted(PaymentMethod.registry))
        raise UnknownPaymentMethodError(
            f"unknown payment method {name!r}. Supported names: {supported}"
        )
    return PaymentMethod.registry[key]()


# ---------- tests ----------

def test_the_classes_registered_themselves():
    assert sorted(PaymentMethod.registry) == [
        "bank_transfer",
        "card",
        "cash",
        "click",
        "payme",
    ]
    assert isinstance(create_payment_method(" PAYME "), Payme)


def test_the_abstract_middle_class_is_not_in_the_registry():
    assert OnlineWallet not in PaymentMethod.registry.values()
    assert inspect.isabstract(OnlineWallet)


def test_a_concrete_class_without_a_name_fails_at_once():
    try:
        class Humo(PaymentMethod):          # forgot name="humo"
            def fee(self, amount):
                return 0

            def is_refundable(self):
                return True
    except TypeError as error:
        assert "Humo" in str(error)
    else:
        raise AssertionError("a class without a name must fail")


def test_a_duplicate_name_fails_at_once():
    try:
        class Click2(PaymentMethod, name="click"):
            def fee(self, amount):
                return 0

            def is_refundable(self):
                return True
    except TypeError as error:
        assert "Click" in str(error)
    else:
        raise AssertionError("a duplicate name must fail")

    # the old class is still the one in the registry
    assert PaymentMethod.registry["click"] is Click
