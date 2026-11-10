"""Bike and its status."""

from dataclasses import dataclass
from enum import Enum


class BikeStatus(Enum):
    """Three states of a bike. I use an enum so I cannot write a wrong string."""

    AVAILABLE = "AVAILABLE"
    IN_USE = "IN_USE"
    REPAIR = "REPAIR"


@dataclass
class Bike:
    """Bike mostly holds data (id + status), so a dataclass is enough here.

    Status is private (_status). Outside code can only read bike.status,
    writing bike.status = ... raises AttributeError, because there is no setter.
    """

    bike_id: str
    _status: BikeStatus = BikeStatus.AVAILABLE

    @property
    def status(self):
        return self._status

    # Below are not setters. They are the three things that can happen to a bike,
    # and every one of them has a name from the requirement text.
    def mark_docked(self):
        """Bike is parked into a free dock -> it can be taken again."""
        self._status = BikeStatus.AVAILABLE

    def mark_in_use(self):
        """Rider took the bike out of the dock."""
        self._status = BikeStatus.IN_USE

    def mark_repair(self):
        """Bike is sent to repair. It stays in its dock, but nobody can take it."""
        self._status = BikeStatus.REPAIR

    def __str__(self):
        return f"{self.bike_id} ({self._status.value})"
