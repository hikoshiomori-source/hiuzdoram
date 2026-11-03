# Lab 4B, Task 7 - dollars added to sums
#
# 7.1  @dataclass(order=True) compares the fields in the order they are written,
#      so it compares amount first and only looks at currency when the amounts
#      are equal. Money(100, 'USD') > Money(1, 'UZS') gives True, which means
#      nothing: 1 dollar is not smaller than 1 tiyin. It also never complains
#      about different currencies. So I wrote __lt__ myself and it raises
#      CurrencyMismatchError when the currencies differ.
# 7.2  sum() starts from 0, so the first operation is 0 + Money. int does not
#      know Money, so Python asks Money for __radd__, and without it the error
#      is "TypeError: unsupported operand type(s) for +: 'int' and 'Money'".
#      I chose __radd__ that accepts 0. In production many places call
#      sum(items) and nobody will remember the start= argument; with start= one
#      forgotten call is a crash, and it also forces you to guess the currency
#      before you look at the list. The price is that sum([]) returns 0 and not
#      a Money, so code that sums a possibly empty list must still be careful.
# 7.3  They must return NotImplemented. Then Python tries the other operand's
#      __radd__ or __eq__, and only if that also fails it raises TypeError (for
#      __eq__ it falls back to "is", so the answer is False). Returning False or
#      raising would stop Python from asking the other object at all.
# 7.4  No. Money * Money would be "sum squared" and has no meaning, and
#      Money / Money is only a plain number (a ratio), which is not money, so
#      the operator would be confusing. Slide 40 says to add an operator only
#      when the meaning is obvious, so I keep Money * int and Money + Money.

from dataclasses import dataclass


class CurrencyMismatchError(Exception):
    pass


@dataclass(frozen=True)
class Money:
    amount: int          # minor units: tiyin, cents
    currency: str        # 'UZS', 'USD'

    def _same_currency(self, other):
        if other.currency != self.currency:
            raise CurrencyMismatchError(
                f"cannot mix {self.currency} and {other.currency}"
            )

    def __add__(self, other):
        if other == 0:                       # so that sum() works
            return self
        if not isinstance(other, Money):
            return NotImplemented
        self._same_currency(other)
        return Money(self.amount + other.amount, self.currency)

    __radd__ = __add__

    def __mul__(self, times):
        if not isinstance(times, int):
            return NotImplemented
        return Money(self.amount * times, self.currency)

    __rmul__ = __mul__

    def __lt__(self, other):
        if not isinstance(other, Money):
            return NotImplemented
        self._same_currency(other)
        return self.amount < other.amount

    def __str__(self):
        return f"{self.amount} {self.currency}"


# ---------- tests ----------

def test_adding_the_same_currency():
    assert Money(500, "UZS") + Money(300, "UZS") == Money(800, "UZS")


def test_adding_different_currencies_is_an_error():
    try:
        Money(500, "UZS") + Money(1, "USD")
    except CurrencyMismatchError:
        pass
    else:
        raise AssertionError("mixing currencies must not be allowed")


def test_multiplying_by_a_quantity():
    price = Money(12_000, "UZS")
    assert price * 3 == Money(36_000, "UZS")
    assert 3 * price == Money(36_000, "UZS")


def test_sum_of_a_list_works():
    items = [Money(100, "UZS"), Money(200, "UZS"), Money(300, "UZS")]
    assert sum(items) == Money(600, "UZS")


def test_comparing_and_sorting():
    assert Money(100, "UZS") < Money(200, "UZS")
    prices = [Money(300, "UZS"), Money(100, "UZS"), Money(200, "UZS")]
    assert sorted(prices) == [
        Money(100, "UZS"),
        Money(200, "UZS"),
        Money(300, "UZS"),
    ]


def test_comparing_different_currencies_is_an_error():
    try:
        Money(100, "USD") < Money(1, "UZS")
    except CurrencyMismatchError:
        pass
    else:
        raise AssertionError("comparing currencies must not be allowed")


def test_money_is_not_equal_to_a_plain_number():
    assert (Money(500, "UZS") == 500) is False
    assert Money(500, "UZS") != 500


def test_money_can_be_a_dictionary_key():
    counter = {Money(500, "UZS"): 2}
    counter[Money(500, "UZS")] += 1
    assert counter == {Money(500, "UZS"): 3}


def test_money_never_changes():
    price = Money(500, "UZS")
    try:
        price.amount = 1
    except Exception:
        pass
    else:
        raise AssertionError("Money must be frozen")
    assert price.amount == 500
