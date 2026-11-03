# Lab 4B, Task 6 - the export that refused the cloud
#
# 6.1  export_report only needs one thing from target: a write() that takes
#      bytes. It never seeks, never reads, never closes. The isinstance check
#      asked for a whole file object, which is much more than that, so S3Upload
#      was refused even though it can do the only thing we use.
# 6.4  If the object has no write(), nothing happens until the first row is
#      written, and then it is AttributeError in the middle of the export. Some
#      rows may already be gone to a half-written target. mypy does find it
#      before the program runs: see the last lines of this file, it reports that
#      the argument is not a Writable because it has no write method.

import io
from typing import Protocol


class Writable(Protocol):
    def write(self, data: bytes) -> int: ...


def export_report(rows, target: Writable) -> None:
    for row in rows:
        target.write((",".join(map(str, row)) + "\n").encode())


class S3Upload:
    def __init__(self, bucket, key):
        self.bucket, self.key = bucket, key
        self.parts = []

    def write(self, data: bytes) -> int:
        self.parts.append(data)          # real code uploads them later
        return len(data)


class FakeTarget:
    """My own target for the test. No parent in common with the other two."""

    def __init__(self):
        self.written = b""

    def write(self, data: bytes) -> int:
        self.written += data
        return len(data)


ROWS = [("iPhone 15", 12_000_000), ("Mouse", 150_000)]
EXPECTED = b"iPhone 15,12000000\nMouse,150000\n"


# ---------- tests ----------

def test_export_to_a_real_file_in_memory():
    target = io.BytesIO()
    export_report(ROWS, target)
    assert target.getvalue() == EXPECTED


def test_export_to_s3():
    target = S3Upload("reports", "2025-11.csv")
    export_report(ROWS, target)
    assert b"".join(target.parts) == EXPECTED


def test_export_to_my_own_fake():
    target = FakeTarget()
    export_report(ROWS, target)
    assert target.written == EXPECTED


def test_the_three_targets_have_no_common_parent():
    assert S3Upload.__bases__ == (object,)
    assert FakeTarget.__bases__ == (object,)
    assert not issubclass(S3Upload, io.IOBase)


def test_a_target_without_write_fails_only_when_writing():
    class NoWrite:
        pass

    try:
        export_report(ROWS, NoWrite())
    except AttributeError as error:
        assert "write" in str(error)
    else:
        raise AssertionError("duck typing should fail at the first write")


# ---------- 6.4, on purpose for mypy ----------
# This function is never called. It is here so that "mypy task06.py" has
# something to complain about. mypy says:
#   task06.py: error: Argument 2 to "export_report" has incompatible type
#   "Broken"; expected "Writable"
class Broken:
    pass


def _check_with_mypy() -> None:
    export_report(ROWS, Broken())
