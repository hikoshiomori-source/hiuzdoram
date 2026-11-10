"""Part 2 tests. Every test name is the "If" line from the task."""

import pytest

from bikeshare import Bike, BikeStatus, Dock, DockOccupiedError, NoBikeError, Station


def test_if_dock_is_free_then_bike_is_docked_and_status_is_available():
    dock = Dock(1)
    bike = Bike("C1")
    bike.mark_in_use()

    dock.park(bike)

    assert dock.bike is bike
    assert dock.is_free is False
    assert bike.status is BikeStatus.AVAILABLE


def test_if_dock_is_occupied_then_dock_occupied_error_and_bike_stays_in_use():
    dock = Dock(1)
    dock.park(Bike("C1"))
    second = Bike("C2")
    second.mark_in_use()

    with pytest.raises(DockOccupiedError):
        dock.park(second)

    assert second.status is BikeStatus.IN_USE
    assert dock.bike.bike_id == "C1"


def test_if_outside_code_writes_dock_bike_then_it_must_fail():
    dock = Dock(1)
    with pytest.raises(AttributeError):
        dock.bike = Bike("C9")


def test_if_outside_code_writes_bike_status_then_it_must_fail():
    bike = Bike("C1")
    with pytest.raises(AttributeError):
        bike.status = BikeStatus.REPAIR


def test_if_outside_code_appends_to_station_docks_then_it_must_fail():
    station = Station("Chilonzor", 10)
    with pytest.raises(AttributeError):
        station.docks.append(Dock(11))
    assert station.dock_count == 10


def test_if_two_stations_are_created_then_each_has_its_own_docks():
    first = Station("Chilonzor", 10)
    second = Station("Yunusobod", 3)

    first.park(Bike("C1"))

    assert first.docks is not second.docks
    assert len(first) == 1
    assert len(second) == 0


def test_if_bike_is_in_repair_then_it_stays_in_the_dock_but_cannot_be_taken():
    station = Station("Chilonzor", 2)
    station.park(Bike("C1"))

    station.send_to_repair("C1")

    assert station.docks[0].bike.status is BikeStatus.REPAIR
    assert len(station) == 1          # it still stands in the dock
    assert station.available_bikes == 0
    with pytest.raises(NoBikeError):
        station.take_bike()


def test_if_bike_is_not_a_docked_free_bike_then_it_cannot_be_sent_to_repair():
    station = Station("Chilonzor", 2)
    station.park(Bike("C1"))
    station.take_bike()              # C1 is IN_USE now, not in the station

    with pytest.raises(NoBikeError):
        station.send_to_repair("C1")


def test_if_print_station_then_chilonzor_4_of_10_bikes():
    station = Station("Chilonzor", 10)
    for i in range(1, 5):
        station.park(Bike(f"C{i}"))

    assert str(station) == "Chilonzor: 4/10 bikes"


def test_if_len_station_then_docked_bikes():
    station = Station("Chilonzor", 10)
    for i in range(1, 5):
        station.park(Bike(f"C{i}"))
    station.send_to_repair("C1")     # repair bike stays, so it is still counted

    assert len(station) == 4
    assert station.free_docks == 6


def test_if_repr_station_then_it_is_for_logs():
    station = Station("Chilonzor", 10)
    station.park(Bike("C1"))

    text = repr(station)

    assert text != str(station)
    assert "Station(" in text
    assert "free_docks=9" in text


def test_if_station_is_created_with_zero_docks_then_value_error():
    with pytest.raises(ValueError):
        Station("Nowhere", 0)


def test_optional_if_sorted_stations_then_ordered_by_free_docks():
    chilonzor = Station("Chilonzor", 10)   # 10 free
    yunusobod = Station("Yunusobod", 3)    # 1 free
    olmazor = Station("Olmazor", 6)        # 6 free
    for i in range(1, 3):
        yunusobod.park(Bike(f"Y{i}"))

    assert [s.name for s in sorted([chilonzor, yunusobod, olmazor])] == [
        "Yunusobod",
        "Olmazor",
        "Chilonzor",
    ]
