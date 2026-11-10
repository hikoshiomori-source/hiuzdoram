"""Part 3 tests: the ride counts the money."""

from datetime import datetime, timedelta

import pytest

from bikeshare import Bike, ReceiptPrinter, Ride, Station, User

START = datetime(2026, 11, 10, 9, 0)


def make_ride():
    chilonzor = Station("Chilonzor", 10)
    bike = Bike("C1")
    chilonzor.park(bike)
    return Ride(User("Ali"), bike, chilonzor, START)


def fee_after(minutes=0, seconds=0):
    ride = make_ride()
    end = START + timedelta(minutes=minutes, seconds=seconds)
    return ride.finish(Station("Yunusobod", 3), end)


def test_if_ride_lasted_15_00_then_0_sum():
    assert fee_after(minutes=15) == 0


def test_if_ride_lasted_15_01_then_500_sum():
    assert fee_after(minutes=15, seconds=1) == 500


def test_if_ride_lasted_20_00_then_500_sum():
    assert fee_after(minutes=20) == 500


def test_if_ride_lasted_20_01_then_1000_sum():
    assert fee_after(minutes=20, seconds=1) == 1000


def test_if_ride_is_very_long_then_20000_sum_cap():
    assert fee_after(minutes=600) == 20000
    assert fee_after(minutes=10000) == 20000


def test_if_end_time_is_before_start_time_then_value_error():
    ride = make_ride()
    with pytest.raises(ValueError):
        ride.finish(Station("Yunusobod", 3), START - timedelta(minutes=1))


def test_if_the_fee_numbers_live_in_ride_then_each_one_is_written_once():
    assert Ride.FREE_MINUTES == 15
    assert Ride.BLOCK_MINUTES == 5
    assert Ride.PRICE_PER_BLOCK == 500
    assert Ride.MAX_FEE == 20000
    # the formula is also here, not in Network and not in ReceiptPrinter
    assert Ride.fee_for_seconds(23 * 60) == 1000


def test_if_receipt_printer_print_ride_then_chilonzor_yunusobod_23_min_1000_sum():
    ride = make_ride()
    ride.finish(Station("Yunusobod", 3), START + timedelta(minutes=23))

    assert ReceiptPrinter.print(ride) == "Chilonzor → Yunusobod, 23 min, 1 000 sum"


def test_if_ride_is_not_finished_then_it_has_no_fee():
    ride = make_ride()
    assert ride.is_finished is False
    assert ride.fee is None
