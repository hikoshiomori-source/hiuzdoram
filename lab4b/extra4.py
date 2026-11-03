# Lab 4B, E4 - 'NoneType' object has no attribute 'discount_percent'
#
# E4.2  Customer.__init__ creates it. If the caller passes nothing, Customer
#       puts a NoLoyalty() in self.loyalty, so from the outside loyalty is
#       never None and no other module has to know about NoLoyalty at all.
# E4.4  A Null Object is wrong when "nothing" is a real answer that somebody
#       must see or decide about. A customer without a saved bank card is not a
#       card with 0 money: if payment silently charges a null card, the order
#       looks paid and nobody asks the user to add a card. The same for a
#       missing delivery address, an unknown exam grade (0 is a mark, "not
#       written yet" is not), or a missing phone number. Those must stay None,
#       or be their own state, so the code is forced to handle them.


class LoyaltyCard:
    def __init__(self, level):
        self.level = level

    def discount_percent(self):
        return {"silver": 3, "gold": 5, "platinum": 10}[self.level]

    def points_for(self, amount):
        return amount // 10_000


class NoLoyalty:
    """Same methods, but a customer without a card gets nothing."""

    level = None

    def discount_percent(self):
        return 0

    def points_for(self, amount):
        return 0


class Customer:
    def __init__(self, name, loyalty=None):
        self.name = name
        self.loyalty = loyalty if loyalty is not None else NoLoyalty()


def checkout_summary(customer, amount):
    discount = amount * customer.loyalty.discount_percent() // 100
    points = customer.loyalty.points_for(amount)
    return discount, points


# ---------- tests ----------

def test_customer_with_a_gold_card():
    ali = Customer("Ali", LoyaltyCard("gold"))
    assert checkout_summary(ali, 200_000) == (10_000, 20)


def test_customer_without_a_card():
    guest = Customer("Guest")
    assert checkout_summary(guest, 200_000) == (0, 0)


def test_loyalty_is_never_none():
    assert Customer("Guest").loyalty is not None
    assert isinstance(Customer("Guest").loyalty, NoLoyalty)


def test_every_level():
    for level, percent in [("silver", 3), ("gold", 5), ("platinum", 10)]:
        customer = Customer("Ali", LoyaltyCard(level))
        discount, _ = checkout_summary(customer, 100_000)
        assert discount == 100_000 * percent // 100
