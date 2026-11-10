"""Network: the class that runs take and return."""

from .errors import NoActiveRideError, RideActiveError, StationFullError
from .receipt import ReceiptPrinter
from .ride import Ride


class Network:
    """Tashkent bike network.

    Stations are made outside and given to the network, so if I delete the
    network the stations are still alive. Rides are made here, inside.
    """

    MAX_RETURN_TRIES = 2

    def __init__(self, stations):
        stations = tuple(stations)
        if len(stations) < 1:
            raise ValueError("network needs at least one station")
        self._stations = stations
        self._printer = ReceiptPrinter()
        self._finished_rides = []

    @property
    def stations(self):
        return self._stations

    @property
    def finished_rides(self):
        return tuple(self._finished_rides)

    def station(self, name):
        for station in self._stations:
            if station.name == name:
                return station
        raise ValueError(f"no station with name {name!r}")

    def best_station(self):
        """Station with the most free docks. If equal -> name A-Z."""
        return sorted(self._stations, key=lambda s: (-s.free_docks, s.name))[0]

    def take_bike(self, user, station, now):
        """Rider taps Take."""
        if user.active_ride is not None:
            raise RideActiveError(f"{user.name} already has an active ride")
        bike = station.take_bike()  # NoBikeError if there is nothing to take
        ride = Ride(user, bike, station, now)
        user.start_ride(ride)
        return ride

    def return_bike(self, user, station, now):
        """Rider taps Return."""
        ride = user.active_ride
        if ride is None:
            raise NoActiveRideError(f"{user.name} has no active ride")

        try:
            station.park(ride.bike)
        except StationFullError:
            tries = ride.return_failed()
            redirect = None
            message = f"{station.name} is full"
            if tries >= self.MAX_RETURN_TRIES:
                redirect = self.best_station()
                message += f", go to {redirect.name} ({redirect.free_docks} free docks)"
            # the clock is still running, the ride is not closed
            raise StationFullError(message, redirect_to=redirect) from None

        ride.finish(station, now)
        user.finish_ride()
        self._finished_rides.append(ride)
        self._printer.print(ride)
        return ride

    def report(self):
        """Optional part: the manager view, biggest number of free docks first."""
        lines = []
        for station in sorted(self._stations, key=lambda s: (-s.free_docks, s.name)):
            lines.append(
                f"{station.name}: {station.free_docks} free docks "
                f"({station.docked_bikes}/{station.dock_count} bikes)"
            )
        for line in lines:
            print(line)
        return lines

    def __len__(self):
        return len(self._stations)

    def __str__(self):
        return f"Tashkent bike network: {len(self._stations)} stations"

    def __repr__(self):
        return (
            f"Network(stations={[s.name for s in self._stations]!r}, "
            f"finished_rides={len(self._finished_rides)})"
        )
