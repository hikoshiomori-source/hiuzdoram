"""One dock of a station."""

from .bike import BikeStatus
from .errors import DockOccupiedError, NoBikeError


class Dock:
    """A dock holds at most one bike. This rule is protected here, nowhere else."""

    def __init__(self, number):
        self._number = number
        self._bike = None

    @property
    def number(self):
        return self._number

    @property
    def bike(self):
        """Read only. dock.bike = x fails, because this property has no setter."""
        return self._bike

    @property
    def is_free(self):
        return self._bike is None

    def park(self, bike):
        """Park a bike. If the dock is already busy the bike stays IN_USE."""
        if self._bike is not None:
            raise DockOccupiedError(f"dock {self._number} is occupied")
        self._bike = bike
        bike.mark_docked()

    def take_bike(self):
        """Take the bike out. A bike in REPAIR must stay in the dock."""
        if self._bike is None:
            raise NoBikeError(f"dock {self._number} is empty")
        if self._bike.status is BikeStatus.REPAIR:
            raise NoBikeError(f"bike {self._bike.bike_id} is in repair")
        bike = self._bike
        self._bike = None
        bike.mark_in_use()
        return bike

    def __str__(self):
        if self._bike is None:
            return f"dock {self._number}: free"
        return f"dock {self._number}: {self._bike}"

    def __repr__(self):
        return f"Dock(number={self._number!r}, free={self.is_free})"
