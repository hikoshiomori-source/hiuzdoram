"""Ride is an event with data, and it owns the money rule."""

import math

from .errors import BikeShareError


class Ride:
    """One ride from one station to another one.

    I keep all four numbers of the price here, each one written only once.
    Nobody outside this class is allowed to count money.
    """

    FREE_MINUTES = 15
    BLOCK_MINUTES = 5
    PRICE_PER_BLOCK = 500
    MAX_FEE = 20_000

    def __init__(self, user, bike, start_station, start_time):
        self._user = user
        self._bike = bike
        self._start_station = start_station
        self._start_time = start_time
        self._end_station = None
        self._end_time = None
        self._fee = None
        # the counter of failed returns belongs to the ride, because the
        # requirement says "the same ride fails 2 times" -> this is ride data
        self._failed_returns = 0

    @property
    def user(self):
        return self._user

    @property
    def bike(self):
        return self._bike

    @property
    def start_station(self):
        return self._start_station

    @property
    def end_station(self):
        return self._end_station

    @property
    def start_time(self):
        return self._start_time

    @property
    def end_time(self):
        return self._end_time

    @property
    def fee(self):
        return self._fee

    @property
    def failed_returns(self):
        return self._failed_returns

    @property
    def is_finished(self):
        return self._end_time is not None

    @property
    def duration_minutes(self):
        """Full minutes of the ride. Only for the receipt."""
        if self._end_time is None:
            raise BikeShareError("ride is not finished yet")
        return int((self._end_time - self._start_time).total_seconds() // 60)

    @classmethod
    def fee_for_seconds(cls, seconds):
        """First 15 minutes free, then 500 sum for every started 5 minutes,
        but never more than 20 000 sum.
        """
        if seconds < 0:
            raise ValueError("ride cannot be shorter than zero")
        paid_seconds = seconds - cls.FREE_MINUTES * 60
        if paid_seconds <= 0:
            return 0
        # ceil, because a started block is already a paid block
        blocks = math.ceil(paid_seconds / (cls.BLOCK_MINUTES * 60))
        return min(blocks * cls.PRICE_PER_BLOCK, cls.MAX_FEE)

    def finish(self, end_station, end_time):
        """Close the ride and count the fee. Returns the fee."""
        if self.is_finished:
            raise BikeShareError("ride is already finished")
        if end_time < self._start_time:
            raise ValueError("end time is before start time")
        self._end_station = end_station
        self._end_time = end_time
        seconds = (end_time - self._start_time).total_seconds()
        self._fee = self.fee_for_seconds(seconds)
        return self._fee

    def return_failed(self):
        """Station was full. The clock keeps running, I only count the try."""
        self._failed_returns += 1
        return self._failed_returns

    def __str__(self):
        if not self.is_finished:
            return f"{self._user.name}: {self._start_station.name} -> ... (open)"
        return (
            f"{self._user.name}: {self._start_station.name} -> "
            f"{self._end_station.name}, {self.duration_minutes} min, {self._fee} sum"
        )

    def __repr__(self):
        return (
            f"Ride(user={self._user.name!r}, bike={self._bike.bike_id!r}, "
            f"from={self._start_station.name!r}, finished={self.is_finished}, "
            f"fee={self._fee!r}, failed_returns={self._failed_returns})"
        )
