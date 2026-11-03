# Lab 4B, Task 3 - students charged without VAT
#
# 3.1  The missing line is super().__init__(user, months). Without it the object
#      has only self.members, so self.months and self.base_monthly never exist.
#      Python creates attributes when you assign them, not from the class body,
#      so __init__ finishes fine and the AttributeError comes later, when
#      price() is the first code that reads self.months.
# 3.2  Every child now overrides only net(). price() lives in the parent and
#      adds VAT there, one time.
# 3.4  I changed VAT_PERCENT in Subscription, one line, and opened one class.
#      The children do not know about VAT at all.


class Subscription:
    VAT_PERCENT = 12

    def __init__(self, user, months):
        self.user = user
        self.months = months
        self.base_monthly = 50_000

    def net(self):
        """Price before VAT."""
        return self.base_monthly * self.months

    def price(self):
        return self.net() * (100 + self.VAT_PERCENT) // 100


class StudentSubscription(Subscription):
    def net(self):
        return super().net() // 2               # 50 % off


class FamilySubscription(Subscription):
    def __init__(self, user, months, members):
        super().__init__(user, months)          # this was missing
        self.members = members

    def net(self):
        extra = 20_000 * (len(self.members) - 1) * self.months
        return super().net() + extra


# ---------- tests ----------

def test_standard_subscription_for_three_months():
    assert Subscription("ali", 3).price() == 168_000


def test_student_subscription_for_three_months():
    # net 75 000 + 12 % VAT
    assert StudentSubscription("ali", 3).price() == 84_000


def test_family_subscription_with_four_members_for_three_months():
    family = FamilySubscription("ali", 3, ["ali", "dilnoza", "umid", "zarina"])
    # net 150 000 + 3 extra members * 20 000 * 3 months = 330 000, + 12 % VAT
    assert family.price() == 369_600


def test_family_object_is_built_without_an_error():
    family = FamilySubscription("ali", 1, ["ali", "dilnoza"])
    assert family.user == "ali"
    assert family.months == 1


def test_changing_vat_in_one_line_changes_every_kind():
    Subscription.VAT_PERCENT = 15               # 3.4: the one line
    try:
        members = ["ali", "dilnoza", "umid", "zarina"]
        family = FamilySubscription("ali", 3, members)
        assert Subscription("ali", 3).price() == 172_500
        assert StudentSubscription("ali", 3).price() == 86_250
        assert family.price() == 379_500
    finally:
        Subscription.VAT_PERCENT = 12       # put it back for the other tests
