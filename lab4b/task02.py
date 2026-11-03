# Lab 4B, Task 2 - the notifier that silently did nothing
#
# 2.1  There is no error because the typo made a new method. sned() is just an
#      extra method that nobody calls, and send() is still the empty one from
#      Notifier, so notify() calls it, it does pass, and nothing happens. Python
#      does not check that a child really overrode the parent method.
# 2.3  send() is abstract, every channel must write it. notify() and max_length
#      are concrete and shared, the cutting rule is written once in the parent.

from abc import ABC, abstractmethod


class Notifier(ABC):
    max_length = 1000

    @abstractmethod
    def send(self, recipient, text):
        """Really deliver the message."""

    def notify(self, recipient, text):
        self.send(recipient, text[: self.max_length])


class TelegramNotifier(Notifier):
    max_length = 4096

    def __init__(self):
        self.sent = []

    def send(self, recipient, text):
        self.sent.append((recipient, text))
        print(f"telegram -> {recipient}: {text}")


class SmsNotifier(Notifier):
    max_length = 160

    def __init__(self):
        self.sent = []

    def send(self, recipient, text):
        self.sent.append((recipient, text))
        print(f"sms -> {recipient}: {text}")


class BrokenTelegramNotifier(Notifier):
    """The class as it was released, with the typo. Kept here for the test."""

    max_length = 4096

    def sned(self, recipient, text):           # typo
        print(f"telegram -> {recipient}: {text}")


# ---------- tests ----------

def test_the_typo_is_found_when_the_object_is_created():
    try:
        BrokenTelegramNotifier()
    except TypeError as error:
        assert "send" in str(error)
    else:
        raise AssertionError("the class with the typo should not be creatable")


def test_notifier_itself_cannot_be_created():
    try:
        Notifier()
    except TypeError:
        pass
    else:
        raise AssertionError("Notifier is abstract")


def test_every_channel_cuts_the_text_to_its_own_limit():
    long_text = "a" * 5000

    telegram = TelegramNotifier()
    telegram.notify("@ali", long_text)
    assert len(telegram.sent[0][1]) == 4096

    sms = SmsNotifier()
    sms.notify("+998901234567", long_text)
    assert len(sms.sent[0][1]) == 160


def test_short_text_is_not_cut():
    sms = SmsNotifier()
    sms.notify("+998901234567", "Exam at 10:00")
    assert sms.sent == [("+998901234567", "Exam at 10:00")]
