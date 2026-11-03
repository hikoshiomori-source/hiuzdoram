# Lab 4B, E3 - do we need classes at all?
#
# E3.1  The first two rules fit apply(total) -> int without a problem. The third
#       one does not: "free delivery above 150 000" does not change the total of
#       the goods, it changes the delivery price, and apply() cannot even see
#       the delivery price or say "delivery is free now". I had to return the
#       discount equal to the delivery price, which means the rule must already
#       know that price from somewhere. So the interface is too narrow: it was
#       written for one kind of rule and takes a number instead of the order.
#       If the rules took the cart (goods, delivery, customer) and returned a
#       discount, all three would fit.
# E3.2  The "never below 0" rule lives in Cart.total(). It is one rule about the
#       final sum, not about one discount, and if every rule had to check it,
#       the next new rule would forget it. Cart also knows the order of the
#       rules, so it is the only place that sees the running sum.
# E3.3  Code-review comment:
#         "Plain functions are enough while a rule is only apply(total) and
#          nothing else. We now need a name for the receipt and a validity
#          period per rule, and that is data that belongs next to the
#          behaviour. With functions I would either hang attributes on the
#          function object or pass (name, start, end, func) tuples around, and
#          every place that uses a rule would have to unpack them. So I would
#          move to classes here: a small base class with name, valid_from,
#          valid_to and apply(). I would keep the simple percent and fixed-sum
#          rules as thin classes built from one formula, so marketing still
#          adds a rule in one line."

from datetime import date


# ---------- style 1: classes ----------

class DiscountRule:
    def __init__(self, name, valid_from=None, valid_to=None):
        self.name = name
        self.valid_from = valid_from
        self.valid_to = valid_to

    def applies_on(self, day):
        if self.valid_from and day < self.valid_from:
            return False
        if self.valid_to and day > self.valid_to:
            return False
        return True

    def apply(self, total):
        raise NotImplementedError


class PercentOff(DiscountRule):
    def __init__(self, percent, name, valid_from=None, valid_to=None):
        super().__init__(name, valid_from, valid_to)
        self.percent = percent

    def apply(self, total):
        return total * self.percent // 100


class FixedOffAbove(DiscountRule):
    def __init__(self, amount, minimum, name, valid_from=None, valid_to=None):
        super().__init__(name, valid_from, valid_to)
        self.amount = amount
        self.minimum = minimum

    def apply(self, total):
        if total > self.minimum:
            return self.amount
        return 0


class FreeDeliveryAbove(DiscountRule):
    """E3.1: this one does not really fit apply(total)."""

    def __init__(self, minimum, delivery_price, name, valid_from=None, valid_to=None):
        super().__init__(name, valid_from, valid_to)
        self.minimum = minimum
        self.delivery_price = delivery_price

    def apply(self, total):
        if total > self.minimum:
            return self.delivery_price      # it has to guess the price itself
        return 0


# ---------- style 2: plain functions ----------

def percent_off(percent):
    def rule(total):
        return total * percent // 100
    return rule


def fixed_off_above(amount, minimum):
    def rule(total):
        return amount if total > minimum else 0
    return rule


def free_delivery_above(minimum, delivery_price):
    def rule(total):
        return delivery_price if total > minimum else 0
    return rule


# ---------- the cart ----------

class Cart:
    def __init__(self, goods_total, rules):
        self.goods_total = goods_total
        self.rules = rules

    def total(self):
        total = self.goods_total
        for rule in self.rules:
            discount = rule.apply(total) if hasattr(rule, "apply") else rule(total)
            total -= discount
        return max(total, 0)                # E3.2: one place, here


# ---------- tests ----------

CLASS_RULES = [
    PercentOff(10, "Student discount -10%"),
    FixedOffAbove(20_000, 200_000, "-20 000 above 200 000"),
]

FUNCTION_RULES = [
    percent_off(10),
    fixed_off_above(20_000, 200_000),
]


def test_both_styles_give_the_same_total():
    # 300 000 - 10 % = 270 000, then -20 000 = 250 000
    assert Cart(300_000, CLASS_RULES).total() == 250_000
    assert Cart(300_000, FUNCTION_RULES).total() == 250_000


def test_small_order_gets_only_the_percent():
    assert Cart(100_000, CLASS_RULES).total() == 90_000
    assert Cart(100_000, FUNCTION_RULES).total() == 90_000


def test_the_total_never_goes_below_zero():
    huge = [PercentOff(100, "everything free"), FixedOffAbove(50_000, 0, "and more")]
    assert Cart(100_000, huge).total() == 0


def test_free_delivery_rule_has_to_know_the_delivery_price():
    rule = FreeDeliveryAbove(150_000, 25_000, "Free delivery")
    assert rule.apply(200_000) == 25_000
    assert rule.apply(100_000) == 0


def test_only_the_class_style_can_carry_a_name_and_a_period():
    rule = PercentOff(
        10,
        "Student discount -10%",
        valid_from=date(2025, 9, 1),
        valid_to=date(2025, 9, 30),
    )
    assert rule.name == "Student discount -10%"
    assert rule.applies_on(date(2025, 9, 15))
    assert not rule.applies_on(date(2025, 10, 1))

    plain = percent_off(10)
    assert not hasattr(plain, "name")
