# Design: nouns and CRC cards

This file is the first part of the lab. No code here, only the requirement text,
the nouns from it and the CRC cards.

## 1. The requirement text

> Tashkent bike network has stations. Every station has a fixed number of docks and a dock
> holds at most one bike. A rider (the app calls them users) takes a bike from any station
> and returns it to any free dock of any station. Every ride is recorded with start station,
> end station and times. First 15 minutes are free, after that the rider pays 500 sum for
> every started 5 minutes, but not more than 20 000 sum per ride. One rider can have one
> active ride only. A bike sent to repair stays in its dock and nobody can take it.
> The manager sees how many free docks each station has.

## 2. All nouns, sorted

I took every noun from the text and put it into one of five groups.

### 2.1 Class (has data **and** behaviour) - 6 classes

| Noun | Why it is a class |
|---|---|
| network | has the list of stations, and it runs take/return |
| station | has docks and a name, finds a free dock, counts free docks |
| dock | has one bike or nothing, and it protects the rule "at most one bike" |
| bike | has an id and a status, and the status changes |
| rider / user | has a name and his active ride, and he refuses a second ride |
| ride | has stations and times, and it counts the fee |

The task also says `ReceiptPrinter.print(ride)` must work, so I have one more small
class, `ReceiptPrinter`. It is not from the requirement text, it is from the
interface the task asks for, and it only formats text.

### 2.2 Attribute (only a value)

| Noun | Whose attribute |
|---|---|
| name of the station | `Station._name` |
| fixed number of docks | `len(Station._docks)` |
| dock number | `Dock._number` |
| bike id | `Bike.bike_id` |
| status (available, in use, repair) | `Bike._status`, it is an enum |
| start station, end station | `Ride._start_station`, `Ride._end_station` |
| times (start, end) | `Ride._start_time`, `Ride._end_time` |
| sum / money / fee | `Ride._fee`, plain `int` |
| active ride | `User._active_ride` |
| free docks | computed by `Station.free_docks`, I do not store it |

### 2.3 Value / constant (only a number, never an object)

15 minutes, 5 minutes, 500 sum, 20 000 sum. All four live inside `Ride`
(`FREE_MINUTES`, `BLOCK_MINUTES`, `PRICE_PER_BLOCK`, `MAX_FEE`), each one written
only once.

### 2.4 Actor (outside the program)

* **manager** - he only looks at the report, he has no data inside my app, so he is
  not a class. His view is `Station.free_docks` and `Network.report()`.
* **repair worker** - the text does not say anything about him, so he stays outside.
  Repair is only a status of the bike.
* **Tashkent** - just a place name.

### 2.5 Merged names (two names for one thing)

* **rider = user** -> one class, `User` (the text itself says "the app calls them users").
* **payment = fee = money** -> one attribute, `Ride._fee`.
* **bike slot = dock** -> `Dock`.

### 2.6 Vague words - questions for the customer

1. "every **started** 5 minutes" - do the 5-minute blocks start counting from minute 0
   or from minute 15? I decided from minute 15 (15:01 = 500 sum), but it must be confirmed.
2. "returns it to **any** free dock of **any** station" - can the rider return the bike
   to the same station where he took it? I allowed it.
3. Does a repaired bike come back into the **same** dock, and who makes it available again?
4. Is 20 000 sum a cap **per ride** or **per day**? The text says per ride, I did that.
5. When all stations are full, what should the rider do? I only send him to the station
   with the most free docks.
6. Does the rider pay at the end of each ride, or once per month? I only print the receipt.

## 3. The event with data

The noun I cannot touch with my hand is the **ride**. It is not a thing, it is an event,
but it has data (bike, rider, two stations, two times) and it has a rule, so it is a class.

**The money rule belongs to `Ride.fee_for_seconds()`**, and `Ride.finish()` calls it.
Why: the fee needs the start time and the end time, and only the ride has both of them
(Information Expert). If `Network` counted the money, it would have to ask the ride for
both times first, and that is a sign the method is in the wrong class.

## 4. CRC cards

Every card has 4 responsibilities or less. When a card had 5, I split it
(`Station` first also had "print the receipt" and "count the fee" - both went away:
the fee to `Ride`, the printing to `ReceiptPrinter`).

| Class | Responsibilities | Collaborators |
|---|---|---|
| **Bike** | 1. Know my id.<br>2. Know my status.<br>3. Change my status when I am docked, taken or sent to repair. | Dock, Station |
| **Dock** | 1. Keep at most one bike.<br>2. Say if I am free.<br>3. Park a bike, or refuse if I am occupied.<br>4. Give my bike out, but never a bike in repair. | Bike, Station |
| **Station** | 1. Know my name and own my docks.<br>2. Count free docks and bikes (manager view).<br>3. Find a free dock on return, find a free bike on take.<br>4. Send a docked free bike to repair. | Dock, Bike, Network |
| **User** (rider) | 1. Know my name.<br>2. Know my one active ride.<br>3. Refuse a second ride.<br>4. Forget the ride when it is closed. | Ride, Network |
| **Ride** | 1. Know the rider, bike, both stations and both times.<br>2. Count the fee and refuse a wrong end time.<br>3. Say if I am finished.<br>4. Count how many times my return failed. | User, Bike, Station |
| **Network** | 1. Hold the stations.<br>2. Run "Take".<br>3. Run "Return", with the full-station error and the redirect.<br>4. Show the manager report. | Station, Ride, User, ReceiptPrinter |
| **ReceiptPrinter** | 1. Make one receipt line from a finished ride.<br>2. Print it. | Ride |

## 5. Scenario read aloud: "rider returns bike to a full station"

I read every step and wrote which card does it.

| # | Step | Owner card |
|---|---|---|
| 1 | Rider taps "Return" at Yunusobod | Network (`return_bike`) |
| 2 | Does this rider have an active ride? | User (`active_ride`) |
| 3 | Is there a free dock in Yunusobod? | Station (`park`) -> Dock (`is_free`) |
| 4 | No free dock -> raise `StationFullError` | Station (`park`) |
| 5 | The ride is not closed, the clock keeps running | Ride (`is_finished` stays False) |
| 6 | The bike is still with the rider | Bike (`status` stays `IN_USE`) |
| 7 | Count this failed try | **Ride** (`return_failed`) - see round 2 below |
| 8 | Was it already the 2nd failure? | Network (`MAX_RETURN_TRIES`) + Ride (`failed_returns`) |
| 9 | Find the station with the most free docks, tie -> name A-Z | **Network** (`best_station`) - see round 2 |
| 10 | Put that station into the error | StationFullError (`redirect_to`) |
| 11 | Rider goes there and taps "Return" again | Network (`return_bike`) |
| 12 | Free dock found, bike parked, status `AVAILABLE` | Station -> Dock (`park`) -> Bike (`mark_docked`) |
| 13 | Close the ride and count the fee | Ride (`finish`) |
| 14 | Rider forgets the ride | User (`finish_ride`) |
| 15 | Print the receipt | ReceiptPrinter (`print`) |

### Rounds

**Round 1.** Steps 7 and 9 had no owner. My first cards were Bike, Dock, Station, User,
Ride, Network, and none of them said "count the failed returns" or "choose the best station".

**Round 2.** I tried to move them:

* Step 7 - I thought about `Network` ("it runs the return") and about `User`
  ("he is the one who failed"). Both are wrong: if the counter is in `Network`, two riders
  share one counter; if it is in `User`, the counter stays after the ride is closed. The
  requirement says "**the same ride** fails 2 times", so the counted thing is ride data.
* Step 9 - `Station` cannot do it, because one station only knows itself.

After 2 rounds I still had no natural owner, so I used **Information Expert** and wrote why:

* **Step 7 -> `Ride`**, because the data is "how many times *this ride* failed to return",
  and the ride is the only object that lives exactly as long as that counter must live.
  Code: `Ride.return_failed()` in `bikeshare/ride.py`.
* **Step 9 -> `Network`**, because the data is "the free docks of *all* stations", and
  `Network` is the only object that has the full list of stations.
  Code: `Network.best_station()` in `bikeshare/network.py`.
