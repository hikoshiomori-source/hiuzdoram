# Lab 4B, Task 9 - invoices that were never saved
#
# 9.1  Before running it I expected all four lines: set updated_at, validate
#      fields, INSERT/UPDATE, write audit entry. What it really printed was only
#      two:
#         TimestampMixin: set updated_at
#         ValidateMixin: validate fields
#      Invoice.__mro__ is Invoice, TimestampMixin, ValidateMixin, AuditMixin,
#      Model, object. super().save() does not mean "the parent", it means "the
#      next class in this MRO". ValidateMixin printed its line and then stopped
#      without calling super(), so the chain broke there and AuditMixin and
#      Model were never reached. Nothing was inserted and nothing was logged,
#      and because no exception was raised the API still answered 201.
# 9.2  After adding super().save() to ValidateMixin the order is:
#         TimestampMixin: set updated_at
#         ValidateMixin: validate fields
#         Model.save: INSERT/UPDATE
#         AuditMixin: write audit entry
#      "write audit entry" is last because AuditMixin calls super().save()
#      first and prints after it comes back. That is the right order anyway: you
#      may only write "invoice saved" in the audit after the INSERT really
#      worked.
# 9.3  It must raise. A silent return looks exactly like success to everybody
#      above: save() returns normally, the view answers 201 Created, and the
#      user thinks the invoice exists. That is the same bug the team already
#      had. An exception stops the chain, so no INSERT and no audit entry
#      happen, and the API can answer 400 with the reason.
# 9.4  With class Invoice(TimestampMixin, AuditMixin, Model, ValidateMixin) I
#      predicted that validation would be skipped, and that is what happens:
#         TimestampMixin: set updated_at
#         Model.save: INSERT/UPDATE
#         AuditMixin: write audit entry
#      The MRO is Invoice, TimestampMixin, AuditMixin, Model, ValidateMixin.
#      Model.save() does not call super(), it is the end of the chain, so
#      everything written after Model is dead code. The rule: the real base
#      class goes last, after every mixin, because only the last class is
#      allowed to stop the chain.


class Model:
    def save(self):
        print("Model.save: INSERT/UPDATE")


class TimestampMixin:
    def save(self):
        print("TimestampMixin: set updated_at")
        super().save()


class ValidateMixin:
    def save(self):
        print("ValidateMixin: validate fields")
        if not self.is_valid():
            raise ValueError("invalid invoice")
        super().save()                      # this was missing

    def is_valid(self):
        return True


class AuditMixin:
    def save(self):
        super().save()
        print("AuditMixin: write audit entry")


class Invoice(TimestampMixin, ValidateMixin, AuditMixin, Model):
    def __init__(self, amount=100_000):
        self.amount = amount

    def is_valid(self):
        return self.amount > 0


class WronglyOrderedInvoice(TimestampMixin, AuditMixin, Model, ValidateMixin):
    """9.4: Model is not last, so ValidateMixin never runs."""

    def is_valid(self):
        return False                        # and still nothing complains


# ---------- tests ----------

def test_all_four_lines_in_the_right_order(capsys):
    Invoice().save()
    printed = capsys.readouterr().out.splitlines()
    assert printed == [
        "TimestampMixin: set updated_at",
        "ValidateMixin: validate fields",
        "Model.save: INSERT/UPDATE",
        "AuditMixin: write audit entry",
    ]


def test_the_mro_is_what_i_wrote_in_9_1():
    names = [cls.__name__ for cls in Invoice.__mro__]
    assert names == [
        "Invoice",
        "TimestampMixin",
        "ValidateMixin",
        "AuditMixin",
        "Model",
        "object",
    ]


def test_an_invalid_invoice_stops_before_the_insert(capsys):
    try:
        Invoice(amount=0).save()
    except ValueError:
        pass
    else:
        raise AssertionError("an invalid invoice must raise")

    printed = capsys.readouterr().out.splitlines()
    assert printed == [
        "TimestampMixin: set updated_at",
        "ValidateMixin: validate fields",
    ]
    assert "Model.save: INSERT/UPDATE" not in printed


def test_wrong_order_skips_the_validation(capsys):
    # no error, even though is_valid() returns False
    WronglyOrderedInvoice().save()
    printed = capsys.readouterr().out.splitlines()
    assert printed == [
        "TimestampMixin: set updated_at",
        "Model.save: INSERT/UPDATE",
        "AuditMixin: write audit entry",
    ]
