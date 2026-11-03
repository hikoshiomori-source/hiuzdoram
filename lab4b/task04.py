# Lab 4B, Task 4 - the audit log that could be erased
#
# 4.1  An AuditLog is not a list. A list lets you change and remove items, and
#      the audit rule says entries are only added. So "is-a" is false: the log
#      only needs a list inside it. Three list methods that break the rule:
#      clear() deletes everything, pop() removes the last entry, sort() changes
#      the order of what happened. (remove(), insert(), reverse() and
#      log[3] = ... are the same problem.)
# 4.3  One entry is a namedtuple, so it cannot be changed after it is recorded.
#      A dict or a normal class with attributes could be edited later.
# 4.4  Overriding clear() and pop() is worse because you have to find and block
#      every dangerous method, and there are many: dir(list) shows 48 names and
#      11 of them are normal methods (append, clear, copy, count, extend, index,
#      insert, pop, remove, reverse, sort). You also have to block __setitem__,
#      __delitem__, __iadd__ and slice assignment. If a new Python version adds
#      a method, the hole is back and nobody notices. With composition nothing
#      is open by default, so I do not have to guess what to close.

from collections import namedtuple

AuditEntry = namedtuple("AuditEntry", ["user", "action"])


class AuditLog:
    def __init__(self):
        self._entries = []

    def record(self, user, action):
        self._entries.append(AuditEntry(user, action))

    def last(self, n):
        return tuple(self._entries[-n:])

    def __len__(self):
        return len(self._entries)

    def __iter__(self):
        return iter(self._entries)


# ---------- tests ----------

def test_recording_and_reading():
    log = AuditLog()
    log.record("admin", "approve_loan#77")
    log.record("ali", "login")

    assert len(log) == 2
    assert [entry.action for entry in log] == ["approve_loan#77", "login"]


def test_last_returns_the_newest_entries():
    log = AuditLog()
    for number in range(5):
        log.record("admin", f"action#{number}")

    assert log.last(2) == (
        AuditEntry("admin", "action#3"),
        AuditEntry("admin", "action#4"),
    )


def test_the_log_cannot_be_cleared_or_sorted():
    log = AuditLog()
    log.record("admin", "approve_loan#77")

    assert not hasattr(log, "clear")
    assert not hasattr(log, "sort")
    assert not hasattr(log, "pop")

    try:
        log[0] = AuditEntry("hacker", "nothing happened")
    except TypeError:
        pass
    else:
        raise AssertionError("entries must not be replaceable")

    assert len(log) == 1


def test_one_entry_cannot_be_changed():
    log = AuditLog()
    log.record("admin", "approve_loan#77")
    entry = log.last(1)[0]

    try:
        entry.user = "hacker"
    except AttributeError:
        pass
    else:
        raise AssertionError("an entry must be read only")
