"""Console demo of the bike network. Run:  python main.py

Time is always given as a parameter, I never call datetime.now() inside a class.
"""

from datetime import datetime

from bikeshare import (
    Bike,
    Network,
    NoActiveRideError,
    NoBikeError,
    RideActiveError,
    Station,
    StationFullError,
    User,
)


def title(text):
    print()
    print(text)
    print("-" * len(text))


def build_network():
    """Three stations. Bikes are parked from outside, the station only keeps them."""
    chilonzor = Station("Chilonzor", 10)
    yunusobod = Station("Yunusobod", 3)
    olmazor = Station("Olmazor", 6)

    for i in range(1, 10):
        chilonzor.park(Bike(f"C{i}"))
    for i in range(1, 3):
        yunusobod.park(Bike(f"Y{i}"))
    # Olmazor is empty, it is a new station

    return Network([chilonzor, yunusobod, olmazor])


def main():
    network = build_network()
    chilonzor = network.station("Chilonzor")
    yunusobod = network.station("Yunusobod")
    olmazor = network.station("Olmazor")

    ali = User("Ali")
    bek = User("Bek")

    title("1. Stations at the start")
    for station in network.stations:
        print(station)          # __str__  ->  Chilonzor: 9/10 bikes
    print("len(Chilonzor) =", len(chilonzor))
    print("repr for the log:", repr(yunusobod))

    title("2. Manager view (report)")
    network.report()

    title("3. One bike goes to repair")
    broken = chilonzor.send_to_repair("C1")
    print("bike C1 status:", broken.status.value)
    print("it still stands in the dock:", chilonzor.docks[0].bike is broken)
    print("Chilonzor bikes that can be taken:", chilonzor.available_bikes)

    title("4. Happy path: take a bike and return it to a free dock")
    ride = network.take_bike(ali, chilonzor, datetime(2026, 11, 10, 9, 0))
    print("Ali took", ride.bike.bike_id, "status:", ride.bike.status.value)
    print("Chilonzor now:", chilonzor)
    print("receipt:", end=" ")
    network.return_bike(ali, yunusobod, datetime(2026, 11, 10, 9, 23))
    print("Yunusobod now:", yunusobod, "- it is full")

    title("5. Errors that must happen")
    try:
        network.return_bike(ali, chilonzor, datetime(2026, 11, 10, 9, 25))
    except NoActiveRideError as error:
        print("NoActiveRideError:", error)

    try:
        network.take_bike(ali, olmazor, datetime(2026, 11, 10, 9, 26))
    except NoBikeError as error:
        print("NoBikeError:", error)

    ride2 = network.take_bike(bek, chilonzor, datetime(2026, 11, 10, 9, 30))
    try:
        network.take_bike(bek, chilonzor, datetime(2026, 11, 10, 9, 31))
    except RideActiveError as error:
        print("RideActiveError:", error)

    title("6. Failure path: return to a full station, 2 times")
    for minute, try_number in ((40, 1), (50, 2)):
        try:
            network.return_bike(bek, yunusobod, datetime(2026, 11, 10, 9, minute))
        except StationFullError as error:
            print(f"try {try_number}: StationFullError: {error}")
            print(f"   redirect = {error.redirect_to}")
            print(f"   ride is still open: {not ride2.is_finished}, "
                  f"failed returns: {ride2.failed_returns}")
            redirect = error.redirect_to

    title("7. Recovery path: return to the redirected station")
    print("receipt:", end=" ")
    network.return_bike(bek, redirect, datetime(2026, 11, 10, 9, 55))
    print("ride finished:", ride2.is_finished, "| fee:", ride2.fee, "sum")

    title("8. Stations at the end")
    network.report()
    print("sorted(stations) by free docks:", [s.name for s in sorted(network.stations)])


if __name__ == "__main__":
    main()
