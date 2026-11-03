# Lab 4B, Task 5 - a promotion that broke the payroll history
#
# 5.1  "A lecturer is an employee" is true, but "this object is a Lecturer" is
#      not true for the whole life of the object. The person stays the same
#      employee, only the job changes. So the role is not a type, it is a value
#      the employee has, and it changes with time.
# 5.4  Employee owns its role history (composition, has-a). The list belongs to
#      that one employee and dies with it. The roles themselves are only used by
#      the employee, they are not shared with anybody else.

from abc import ABC, abstractmethod
from datetime import date


class Role(ABC):
    @abstractmethod
    def monthly_pay(self):
        """Pay for one month in this role."""


class LecturerRole(Role):
    def __init__(self, hours):
        self.hours = hours

    def monthly_pay(self):
        return self.hours * 120_000


class HeadRole(Role):
    def __init__(self, salary):
        self.salary = salary

    def monthly_pay(self):
        return self.salary + 3_000_000      # management bonus


class Employee:
    def __init__(self, emp_id, name, role, since):
        self.emp_id = emp_id
        self.name = name
        self.role_history = [(role, since)]

    @property
    def role(self):
        return self.role_history[-1][0]

    def change_role(self, new_role, since):
        self.role_history.append((new_role, since))

    def role_on(self, day):
        """The role the employee had on that day."""
        role_then = None
        for role, since in self.role_history:
            if since <= day:
                role_then = role
        return role_then

    def monthly_pay(self):
        return self.role.monthly_pay()

    def monthly_pay_on(self, day):
        role_then = self.role_on(day)
        if role_then is None:
            return 0                        # not hired yet
        return role_then.monthly_pay()


# ---------- tests ----------

def test_pay_comes_from_the_role():
    ali = Employee(1, "Ali", LecturerRole(hours=100), date(2024, 9, 1))
    assert ali.monthly_pay() == 12_000_000


def test_promotion_keeps_the_same_object_and_id():
    ali = Employee(7, "Ali", LecturerRole(hours=100), date(2024, 9, 1))
    staff = [ali]
    timesheet_owner = ali                   # another module points to him

    ali.change_role(HeadRole(salary=14_000_000), date(2025, 2, 1))

    assert ali.emp_id == 7
    assert staff[0] is ali
    assert timesheet_owner is ali           # the old reference still works
    assert ali.monthly_pay() == 17_000_000


def test_payroll_of_last_month_uses_last_months_role():
    ali = Employee(7, "Ali", LecturerRole(hours=100), date(2024, 9, 1))
    ali.change_role(HeadRole(salary=14_000_000), date(2025, 2, 1))

    assert ali.monthly_pay_on(date(2025, 1, 31)) == 12_000_000
    assert ali.monthly_pay_on(date(2025, 2, 1)) == 17_000_000


def test_history_keeps_both_roles():
    ali = Employee(7, "Ali", LecturerRole(hours=100), date(2024, 9, 1))
    ali.change_role(HeadRole(salary=14_000_000), date(2025, 2, 1))

    assert len(ali.role_history) == 2
    assert isinstance(ali.role_history[0][0], LecturerRole)
