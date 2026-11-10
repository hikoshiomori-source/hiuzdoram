# Laboratory 4.2 - Bike sharing network

Console bike sharing app for the Tashkent bike network: classes, relationships and
encapsulation. Python 3.10+, standard library only (no files, no database, no threads).

Class discovery, all nouns and the CRC cards are in **[docs/design.md](docs/design.md)**.

## How to run

```bash
python main.py          # the console demo (the same scenario as in the video)
pip install pytest
pytest -v               # 32 tests
```

## Project files

```
bike-sharing/
├── bikeshare/
│   ├── bike.py        Bike + BikeStatus enum   (dataclass, status is read-only)
│   ├── dock.py        Dock                     (at most one bike)
│   ├── station.py     Station                  (owns its docks, counts free docks)
│   ├── user.py        User (rider)             (one active ride only)
│   ├── ride.py        Ride                     (owns the money rule)
│   ├── receipt.py     ReceiptPrinter           (only formats and prints)
│   ├── network.py     Network                  (runs Take and Return)
│   └── errors.py      all exceptions
├── docs/design.md     nouns + CRC cards
├── main.py            console demo
└── tests/             pytest, one test per "If" line of the task
```

<details>
<summary><b>Demo video (click to open, 38 seconds)</b></summary>

<!-- put the file demo.mp4 next to this README, GitHub shows the player here -->

https://github.com/TTPU-ORG/bike-sharing/assets/demo.mp4

### Exact scenario of the video, step by step

| # | Second | What I do | What must be seen |
|---|---|---|---|
| 1 | 0-3 | `python main.py` | Chilonzor: 9/10 bikes, Yunusobod: 2/3, Olmazor: 0/6 |
| 2 | 3-6 | manager report | Olmazor 6 free docks first, biggest first |
| 3 | 6-9 | bike `C1` is sent to repair | status `REPAIR`, still in dock 1, bikes that can be taken: 8 |
| 4 | 9-14 | **happy path**: Ali takes a bike at Chilonzor at 09:00 | bike `C2` is `IN_USE`, Chilonzor: 8/10 bikes |
| 5 | 14-18 | Ali returns it at Yunusobod at 09:23 (free dock) | receipt `Chilonzor → Yunusobod, 23 min, 1 000 sum`, Yunusobod: 3/3 - full |
| 6 | 18-22 | three errors on purpose | `NoActiveRideError`, `NoBikeError`, `RideActiveError` |
| 7 | 22-28 | **failure path**: Bek took a bike at 09:30, tries Yunusobod (full) at 09:40 and 09:50 | try 1: no redirect; try 2: `go to Olmazor (6 free docks)`; ride still open, failed returns 2 |
| 8 | 28-33 | **recovery path**: Bek returns it at Olmazor at 09:55 | receipt `Chilonzor → Olmazor, 25 min, 1 000 sum`, ride finished, fee 1000 |
| 9 | 33-38 | `pytest -v` | 32 passed |

</details>

## The rule "a bike is in exactly one place"

A bike is either **in a dock** or **in the hands of a rider**, never in both places and
never nowhere. I did not write any special class for this rule. It works because of three
things: only `Dock` keeps the link to a bike, the link is moved in one step, and the
bike's status is changed by the same method that moves the link.

```python
# 1. ONE LINK. The link bike <-> place exists only in Dock._bike.
#    Station does not keep a list of bikes, Network does not keep bikes,
#    Ride keeps the bike only to know "which bike", not "where it is".
#    So the question "where is this bike" has exactly one answer.
class Dock:
    def __init__(self, number):
        self._bike = None          # the only place where a bike is stored

# 2. OUT of the dock and IN_USE happen in the same method, and the dock is
#    emptied before the bike is given away. There is no moment when two
#    docks hold the same bike.
    def take_bike(self):                     # dock.py
        if self._bike is None:
            raise NoBikeError(...)           # cannot take from an empty dock
        if self._bike.status is BikeStatus.REPAIR:
            raise NoBikeError(...)           # repair bike stays in its dock
        bike = self._bike
        self._bike = None                    # dock becomes free here
        bike.mark_in_use()                   # ...and the bike becomes IN_USE here
        return bike

# 3. INTO the dock: if the dock is busy, nothing changes at all.
#    The bike stays IN_USE, so it is still "in the rider's hands" - one place again.
    def park(self, bike):                    # dock.py
        if self._bike is not None:
            raise DockOccupiedError(...)     # first line, before any change
        self._bike = bike
        bike.mark_docked()
```

Two more things protect it from outside:

* `dock.bike` and `bike.status` are read-only properties, so no outside code can put the
  same bike into a second dock or write a status that does not match the real place;
* `Station._docks` is a **tuple**, so `station.docks.append(...)` is impossible - nobody
  can add a dock that the station does not control.

And the status always tells the truth about the place:

| Status | Where the bike is |
|---|---|
| `AVAILABLE` | in a dock, can be taken |
| `IN_USE` | with a rider, in no dock |
| `REPAIR` | in a dock, cannot be taken |

## Relationships table (UML)

One row per connected pair. `file:line` is the line that proves the row.

| Pair | Relationship | Multiplicity | Proof (file:line) |
|---|---|---|---|
| Station - Dock | **composition** | Station `1` --- `1..*` Dock | `bikeshare/station.py:20` - the docks are created inside `Station.__init__` |
| Dock - Bike | **aggregation** | Dock `1` --- `0..1` Bike | `bikeshare/dock.py:31` - the dock keeps a bike that was made outside |
| Network - Station | **aggregation** | Network `1` --- `1..*` Station | `bikeshare/network.py:21` - the stations come as a parameter and live on |
| Network - Ride | **composition** | Network `1` --- `0..*` Ride | `bikeshare/network.py:48` + `:72` - `Network` creates every `Ride` and keeps the history |
| Network - ReceiptPrinter | **composition** | Network `1` --- `1` ReceiptPrinter | `bikeshare/network.py:22` - made inside `__init__` |
| Network - User | **dependency** | - (parameter only) | `bikeshare/network.py:43` - `user` is only a parameter, `Network` stores no users |
| User - Ride | **association** | User `1` --- `0..1` Ride | `bikeshare/user.py:25` - the user keeps a link to a ride he did not create |
| Ride - User | **association** | Ride `1` --- `1` User | `bikeshare/ride.py:21` |
| Ride - Bike | **association** | Ride `1` --- `1` Bike | `bikeshare/ride.py:22` |
| Ride - Station | **association** | Ride `1` --- `1` start, `0..1` end | `bikeshare/ride.py:23` (start), `bikeshare/ride.py:95` (end) |
| Station - Bike | **dependency** | - (parameter only) | `bikeshare/station.py:53` - `park(bike)` only passes the bike to a dock |
| ReceiptPrinter - Ride | **dependency** | - (parameter only) | `bikeshare/receipt.py:10` - the ride is only a parameter |

### Lifetime test for every aggregation and composition

| Pair | "If I delete X, does Y disappear?" | Answer |
|---|---|---|
| Station --- Dock (composition) | delete the Station -> do its Docks disappear? | **Yes.** The docks exist only in `Station._docks` and nobody else has a link to them, so they die with the station. |
| Dock --- Bike (aggregation) | delete the Dock -> does the Bike disappear? | **No.** The bike was made outside (`main.py`), and during a ride the bike lives in `Ride._bike` while no dock holds it. |
| Network --- Station (aggregation) | delete the Network -> do the Stations disappear? | **No.** They are created in `build_network()` and only passed into the constructor, so `main.py` still holds the `chilonzor` / `yunusobod` / `olmazor` variables and can print them after the network object is gone. |
| Network --- Ride (composition) | delete the Network -> do the Rides disappear? | **Yes** for the history: `Network._finished_rides` is the only list that keeps finished rides. An *open* ride also lives in `User._active_ride`, so while a ride is running it survives - this is the weak side of this composition and I keep it on purpose, because the rider must not lose his ride if the app object is recreated. |
| Network --- ReceiptPrinter (composition) | delete the Network -> does the printer disappear? | **Yes.** It is created in `__init__` and nothing outside has a link to it. |

### Multiplicity that was not enforced by the code

While filling the table I found three multiplicities that were only words, so I enforced
them in the code:

1. **Station `1..*` Dock** - a station with 0 docks was possible.
   Enforced: `bikeshare/station.py:17` raises `ValueError`.
   Test: `test_if_station_is_created_with_zero_docks_then_value_error`.
2. **Network `1..*` Station** - an empty network was possible, and then `best_station()`
   would crash. Enforced: `bikeshare/network.py:20` raises `ValueError`.
   Test: `test_if_network_is_created_without_stations_then_value_error`.
3. **User `0..1` Ride** - this is the "one active ride" rule.
   Enforced twice, on purpose: `bikeshare/user.py:24` (the user protects his own data) and
   `bikeshare/network.py:46` (so the bike is not taken out of the dock before the check).
   Test: `test_if_rider_already_has_an_active_ride_then_ride_active_error`.

**Dock `0..1` Bike** needs no extra check: the dock simply cannot hold two bikes, because
`Dock.park()` raises `DockOccupiedError` before it touches `_bike`
(`bikeshare/dock.py:30`).

## Tests

Every test name is the "If" line of the task that it proves.

```
$ pytest -v
============================= test session starts ==============================
platform linux -- Python 3.13.18, pytest-9.2.0, pluggy-1.7.0 -- /usr/local/bin/python3
cachedir: .pytest_cache
rootdir: /home/user/hiuzdoram/bike-sharing
plugins: anyio-4.15.1
collecting ... collected 32 items

tests/test_bike_dock_station.py::test_if_dock_is_free_then_bike_is_docked_and_status_is_available PASSED
tests/test_bike_dock_station.py::test_if_dock_is_occupied_then_dock_occupied_error_and_bike_stays_in_use PASSED
tests/test_bike_dock_station.py::test_if_outside_code_writes_dock_bike_then_it_must_fail PASSED
tests/test_bike_dock_station.py::test_if_outside_code_writes_bike_status_then_it_must_fail PASSED
tests/test_bike_dock_station.py::test_if_outside_code_appends_to_station_docks_then_it_must_fail PASSED
tests/test_bike_dock_station.py::test_if_two_stations_are_created_then_each_has_its_own_docks PASSED
tests/test_bike_dock_station.py::test_if_bike_is_in_repair_then_it_stays_in_the_dock_but_cannot_be_taken PASSED
tests/test_bike_dock_station.py::test_if_bike_is_not_a_docked_free_bike_then_it_cannot_be_sent_to_repair PASSED
tests/test_bike_dock_station.py::test_if_print_station_then_chilonzor_4_of_10_bikes PASSED
tests/test_bike_dock_station.py::test_if_len_station_then_docked_bikes PASSED
tests/test_bike_dock_station.py::test_if_repr_station_then_it_is_for_logs PASSED
tests/test_bike_dock_station.py::test_if_station_is_created_with_zero_docks_then_value_error PASSED
tests/test_bike_dock_station.py::test_optional_if_sorted_stations_then_ordered_by_free_docks PASSED
tests/test_network.py::test_if_rider_has_no_active_ride_and_station_has_a_free_bike_then_ride_starts PASSED
tests/test_network.py::test_if_rider_already_has_an_active_ride_then_ride_active_error PASSED
tests/test_network.py::test_if_station_has_no_free_bike_then_no_bike_error PASSED
tests/test_network.py::test_if_return_without_a_ride_then_no_active_ride_error PASSED
tests/test_network.py::test_if_station_is_full_on_return_then_station_full_error_and_clock_keeps_running PASSED
tests/test_network.py::test_if_the_same_ride_fails_2_times_then_error_carries_the_redirect PASSED
tests/test_network.py::test_if_two_stations_have_the_same_free_docks_then_redirect_takes_name_a_to_z PASSED
tests/test_network.py::test_if_rider_returns_the_bike_to_the_redirected_station_then_ride_is_closed PASSED
tests/test_network.py::test_if_network_is_created_without_stations_then_value_error PASSED
tests/test_network.py::test_optional_if_network_report_then_stations_by_free_docks_biggest_first PASSED
tests/test_ride_fee.py::test_if_ride_lasted_15_00_then_0_sum PASSED
tests/test_ride_fee.py::test_if_ride_lasted_15_01_then_500_sum PASSED
tests/test_ride_fee.py::test_if_ride_lasted_20_00_then_500_sum PASSED
tests/test_ride_fee.py::test_if_ride_lasted_20_01_then_1000_sum PASSED
tests/test_ride_fee.py::test_if_ride_is_very_long_then_20000_sum_cap PASSED
tests/test_ride_fee.py::test_if_end_time_is_before_start_time_then_value_error PASSED
tests/test_ride_fee.py::test_if_the_fee_numbers_live_in_ride_then_each_one_is_written_once PASSED
tests/test_ride_fee.py::test_if_receipt_printer_print_ride_then_chilonzor_yunusobod_23_min_1000_sum PASSED
tests/test_ride_fee.py::test_if_ride_is_not_finished_then_it_has_no_fee PASSED

============================== 32 passed in 0.07s ==============================
```
