"""Station with a fixed number of docks."""

from .bike import BikeStatus
from .dock import Dock
from .errors import NoBikeError, StationFullError


class Station:
    """Station keeps its docks and answers how many docks are free.

    The docks are created inside __init__, so every Station object has
    its own tuple of docks. There is no mutable class attribute here.
    """

    def __init__(self, name, dock_count):
        if dock_count < 1:
            raise ValueError("station needs at least one dock")
        self._name = name
        # tuple, not list -> station.docks.append(...) is impossible
        self._docks = tuple(Dock(i + 1) for i in range(dock_count))

    @property
    def name(self):
        return self._name

    @property
    def docks(self):
        return self._docks

    @property
    def dock_count(self):
        return len(self._docks)

    @property
    def free_docks(self):
        """What the manager wants to see."""
        return sum(1 for dock in self._docks if dock.is_free)

    @property
    def docked_bikes(self):
        """All bikes standing here, bikes in repair are also counted."""
        return self.dock_count - self.free_docks

    @property
    def available_bikes(self):
        """Only the bikes a rider can really take."""
        return sum(
            1
            for dock in self._docks
            if not dock.is_free and dock.bike.status is BikeStatus.AVAILABLE
        )

    def park(self, bike):
        """Put the bike into the first free dock and return that dock."""
        for dock in self._docks:
            if dock.is_free:
                dock.park(bike)
                return dock
        raise StationFullError(f"{self._name} is full")

    def take_bike(self):
        """Give the first bike that is AVAILABLE."""
        for dock in self._docks:
            if not dock.is_free and dock.bike.status is BikeStatus.AVAILABLE:
                return dock.take_bike()
        raise NoBikeError(f"{self._name} has no free bike")

    def send_to_repair(self, bike_id):
        """Only a bike that is docked here and free can go to repair."""
        for dock in self._docks:
            if dock.is_free:
                continue
            if dock.bike.bike_id != bike_id:
                continue
            if dock.bike.status is not BikeStatus.AVAILABLE:
                raise NoBikeError(f"bike {bike_id} is not free, it cannot go to repair")
            dock.bike.mark_repair()
            return dock.bike
        raise NoBikeError(f"bike {bike_id} is not docked in {self._name}")

    def __len__(self):
        """len(station) = how many bikes stand in the station."""
        return self.docked_bikes

    def __str__(self):
        """For the user: Chilonzor: 4/10 bikes"""
        return f"{self._name}: {self.docked_bikes}/{self.dock_count} bikes"

    def __repr__(self):
        """For the logs, here I want to see everything at once."""
        return (
            f"Station(name={self._name!r}, docks={self.dock_count}, "
            f"bikes={self.docked_bikes}, free_docks={self.free_docks})"
        )

    def __lt__(self, other):
        """Optional part: sorted(stations) puts the emptiest station first."""
        if not isinstance(other, Station):
            return NotImplemented
        return (self.free_docks, self._name) < (other.free_docks, other._name)
