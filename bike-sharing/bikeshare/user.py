"""Rider. In the app I call him User, like in the requirement text."""

from .errors import NoActiveRideError, RideActiveError


class User:
    """User remembers only his active ride. One ride at a time."""

    def __init__(self, name):
        self._name = name
        self._active_ride = None

    @property
    def name(self):
        return self._name

    @property
    def active_ride(self):
        return self._active_ride

    def start_ride(self, ride):
        """This is the place where the rule 'one active ride only' lives."""
        if self._active_ride is not None:
            raise RideActiveError(f"{self._name} already has an active ride")
        self._active_ride = ride

    def finish_ride(self):
        if self._active_ride is None:
            raise NoActiveRideError(f"{self._name} has no active ride")
        ride = self._active_ride
        self._active_ride = None
        return ride

    def __str__(self):
        if self._active_ride is None:
            return f"{self._name} (no ride)"
        return f"{self._name} (riding)"

    def __repr__(self):
        return f"User(name={self._name!r}, has_active_ride={self._active_ride is not None})"
