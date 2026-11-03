# Lab 4B, E1 - headers that came back in capitals
#
# E1.1  I ran the original. It prints
#         {'Accept': 'application/json', 'content-type': 'text/plain',
#          'Content-Type': 'application/json', 'X-Request-Id': '42'}
#       Only h["Content-Type"] = ... went through my __setitem__. The
#       constructor, update() and setdefault() are written in C inside dict and
#       they put the key into the hash table without calling __setitem__. So
#       Accept and X-Request-Id kept their capitals, and update() even added a
#       second Content-Type next to the lower-cased one. That is why requests
#       went out with the header twice.
# E1.2  collections.UserDict is a normal Python class that keeps a real dict in
#       self.data, and all of its methods go through __getitem__ and
#       __setitem__. So overriding those two is enough and the constructor,
#       update() and setdefault() follow my rule (see the tests).
# E1.3  For case-insensitive reading I override __getitem__, __contains__ and
#       __delitem__. get(), pop() and setdefault() come from the Mapping part
#       of UserDict and they use those three, so I do not have to write them.

from collections import UserDict


class Headers(UserDict):
    def __setitem__(self, key, value):
        super().__setitem__(key.lower(), value)

    def __getitem__(self, key):
        return super().__getitem__(key.lower())

    def __contains__(self, key):
        return key.lower() in self.data

    def __delitem__(self, key):
        super().__delitem__(key.lower())


# ---------- tests ----------

def test_every_way_of_adding_a_key_lower_cases_it():
    h = Headers({"Accept": "application/json"})     # constructor
    h["Content-Type"] = "text/plain"                # __setitem__
    h.update({"X-Trace": "abc"})                    # update
    h.setdefault("X-Request-Id", "42")              # setdefault

    assert sorted(h.keys()) == [
        "accept",
        "content-type",
        "x-request-id",
        "x-trace",
    ]


def test_one_header_name_is_stored_only_once():
    h = Headers()
    h["Content-Type"] = "text/plain"
    h.update({"content-type": "application/json"})
    h.setdefault("CONTENT-TYPE", "text/html")       # already there, ignored

    assert len(h) == 1
    assert h["Content-Type"] == "application/json"


def test_reading_is_case_insensitive():
    h = Headers({"Content-Type": "application/json"})

    assert h["CONTENT-TYPE"] == "application/json"
    assert h["content-type"] == "application/json"
    assert "CONTENT-TYPE" in h
    assert h.get("Content-Type") == "application/json"


def test_deleting_is_case_insensitive():
    h = Headers({"Content-Type": "application/json"})
    del h["CONTENT-TYPE"]
    assert len(h) == 0


def test_the_old_dict_version_really_was_broken():
    class OldHeaders(dict):
        def __setitem__(self, key, value):
            super().__setitem__(key.lower(), value)

    old = OldHeaders({"Accept": "application/json"})
    old.setdefault("X-Request-Id", "42")
    assert "Accept" in old.keys()           # capitals survived
    assert "X-Request-Id" in old.keys()
