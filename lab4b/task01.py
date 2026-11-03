# Lab 4B, Task 1 - a new payment method must not touch Checkout
#
# 1.2  I wrote two classes, Click and Payme, even though the fee is 1% in both
#      today. They are two different companies and they set their own prices, so
#      when Payme goes to 1.2% next month I change only the Payme class. With one
#      class and two objects I would have to split it anyway at that moment.
# 1.4  I changed 0 lines of Checkout for BankTransfer. I only wrote a new class
#      and used it.

from abc import ABC, abstractmethod


class PaymentMethod(ABC):
    """What Checkout needs to know about any way of paying."""

    @abstractmethod
    def fee(self, amount):
        """Fee in sum for this amount."""

    @abstractmethod
    def is_refundable(self):
        """True if the money can be given back."""


class Card(PaymentMethod):
    def fee(self, amount):
        return amount * 15 // 1000      # 1.5 %

    def is_refundable(self):
        return True


class Click(PaymentMethod):
    def fee(self, amount):
        return amount * 10 // 1000      # 1 %

    def is_refundable(self):
        return True


class Payme(PaymentMethod):
    def fee(self, amount):
        return amount * 10 // 1000      # 1 %

    def is_refundable(self):
        return True


class Cash(PaymentMethod):
    def fee(self, amount):
        return 0

    def is_refundable(self):
        return False


class BankTransfer(PaymentMethod):
    def fee(self, amount):
        return 5_000                    # fixed fee

    def is_refundable(self):
        return True


class Checkout:
    def pay(self, method, amount):
        return {
            "charged": amount + method.fee(amount),
            "refundable": method.is_refundable(),
        }


# ---------- tests ----------

def test_card_pays_fee_of_one_and_a_half_percent():
    result = Checkout().pay(Card(), 100_000)
    assert result == {"charged": 101_500, "refundable": True}


def test_click_and_payme_cost_the_same_today():
    checkout = Checkout()
    assert checkout.pay(Click(), 100_000)["charged"] == 101_000
    assert checkout.pay(Payme(), 100_000)["charged"] == 101_000


def test_cash_has_no_fee_and_cannot_be_refunded():
    result = Checkout().pay(Cash(), 100_000)
    assert result == {"charged": 100_000, "refundable": False}


def test_bank_transfer_has_a_fixed_fee():
    result = Checkout().pay(BankTransfer(), 100_000)
    assert result == {"charged": 105_000, "refundable": True}
    # the fee does not grow with the amount
    assert Checkout().pay(BankTransfer(), 1_000_000)["charged"] == 1_005_000


def test_payment_method_is_abstract():
    try:
        PaymentMethod()
    except TypeError:
        pass
    else:
        raise AssertionError("PaymentMethod should not be possible to create")
