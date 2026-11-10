"""Part 4 tests: take, return, failure and recovery."""

from datetime import datetime, timedelta

import pytest

from bikeshare import (
    Bike,
    BikeStatus,
    Network,
    NoActiveRideError,
    NoBikeError,
    RideActiveError,
    Station,
    StationFullError,
    User,
)

NINE = datetime(2026, 11, 10, 9, 0)


def make_network():
    """Chilonzor has bikes, Yunusobod is full, Olmazor is empty."""
    chilonzor = Station("Chilonzor", 10)
    yunusobod = Station("Yunusobod", 3)
    olmazor = Station("Olmazor", 6)
    for i in range(1, 10):
        chilonzor.park(Bike(f"C{i}"))
    for i in range(1, 4):
        yunusobod.park(Bike(f"Y{i}"))
    return Network([chilonzor, yunusobod, olmazor])


def test_if_rider_has_no_active_ride_and_station_has_a_free_bike_then_ride_starts():
    network = make_network()
    ali = User("Ali")

    ride = network.take_bike(ali, network.station("Chilonzor"), NINE)

    assert ride.bike.status is BikeStatus.IN_USE
    assert ali.active_ride is ride
    assert len(network.station("Chilonzor")) == 8


def test_if_rider_already_has_an_active_ride_then_ride_active_error():
    network = make_network()
    ali = User("Ali")
    network.take_bike(ali, network.station("Chilonzor"), NINE)

    with pytest.raises(RideActiveError):
        network.take_bike(ali, network.station("Chilonzor"), NINE + timedelta(minutes=1))


def test_if_station_has_no_free_bike_then_no_bike_error():
    network = make_network()

    with pytest.raises(NoBikeError):
        network.take_bike(User("Ali"), network.station("Olmazor"), NINE)


def test_if_return_without_a_ride_then_no_active_ride_error():
    network = make_network()

    with pytest.raises(NoActiveRideError):
        network.return_bike(User("Ali"), network.station("Chilonzor"), NINE)


def test_if_station_is_full_on_return_then_station_full_error_and_clock_keeps_running():
    network = make_network()
    ali = User("Ali")
    ride = network.take_bike(ali, network.station("Chilonzor"), NINE)

    with pytest.raises(StationFullError) as error:
        network.return_bike(ali, network.station("Yunusobod"), NINE + timedelta(minutes=10))

    assert error.value.redirect_to is None       # first try, no redirect yet
    assert ride.is_finished is False             # clock keeps running
    assert ali.active_ride is ride               # rider can try again
    assert ride.bike.status is BikeStatus.IN_USE


def test_if_the_same_ride_fails_2_times_then_error_carries_the_redirect():
    network = make_network()
    ali = User("Ali")
    ride = network.take_bike(ali, network.station("Chilonzor"), NINE)
    yunusobod = network.station("Yunusobod")

    with pytest.raises(StationFullError):
        network.return_bike(ali, yunusobod, NINE + timedelta(minutes=10))
    with pytest.raises(StationFullError) as error:
        network.return_bike(ali, yunusobod, NINE + timedelta(minutes=20))

    assert ride.failed_returns == 2
    assert error.value.redirect_to is network.station("Olmazor")  # 6 free docks


def test_if_two_stations_have_the_same_free_docks_then_redirect_takes_name_a_to_z():
    anhor = Station("Anhor", 5)
    beruniy = Station("Beruniy", 5)
    network = Network([beruniy, anhor])

    assert network.best_station() is anhor


def test_if_rider_returns_the_bike_to_the_redirected_station_then_ride_is_closed(capsys):
    network = make_network()
    ali = User("Ali")
    ride = network.take_bike(ali, network.station("Chilonzor"), NINE)
    yunusobod = network.station("Yunusobod")

    for minute in (10, 20):
        with pytest.raises(StationFullError) as error:
            network.return_bike(ali, yunusobod, NINE + timedelta(minutes=minute))
    redirect = error.value.redirect_to

    network.return_bike(ali, redirect, NINE + timedelta(minutes=23))

    assert ride.is_finished is True
    assert ride.fee == 1000                       # 23 min
    assert ali.active_ride is None
    assert ride.bike.status is BikeStatus.AVAILABLE
    assert len(redirect) == 1
    printed = capsys.readouterr().out.strip()
    assert printed == "Chilonzor → Olmazor, 23 min, 1 000 sum"


def test_if_network_is_created_without_stations_then_value_error():
    with pytest.raises(ValueError):
        Network([])


def test_optional_if_network_report_then_stations_by_free_docks_biggest_first():
    network = make_network()

    lines = network.report()

    assert lines[0].startswith("Olmazor: 6 free docks")
    assert lines[1].startswith("Chilonzor: 1 free docks")
    assert lines[2].startswith("Yunusobod: 0 free docks")
