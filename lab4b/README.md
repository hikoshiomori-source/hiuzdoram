# Lab 4B - Inheritance, Polymorphism and Composition

My solutions for Lab 4B (Design of Software System, Turin Polytechnic
University in Tashkent). Python 3.10+ and pytest.

## How to run

One file per task, with the tests inside the same file:

```
pytest task01.py
```

or everything at once (that is what `pytest.ini` is for, pytest only looks
inside `test_*.py` files by default):

```
pytest
```

Task 6 also wants mypy and task 8 wants pyflakes:

```
pip install pytest mypy pyflakes
mypy task06.py                  # reports 1 error on purpose, see 6.4
python -m pyflakes task08_original.py
```

`mypy task06.py` is supposed to fail. The last lines of that file pass an
object without `write()` so that mypy has something to catch, which is what
6.4 asks for. `task08_original.py` is the broken code from the lab text, kept
only so pyflakes has something to report for 8.4.

## Files

| File | Task |
| --- | --- |
| task01.py | abstract PaymentMethod, Checkout without if/elif |
| task02.py | abstract Notifier, the typo found at creation |
| task03.py | VAT in one place, children override net() only |
| task04.py | append-only AuditLog with composition |
| task05.py | Employee has a role, promotion keeps the object |
| task06.py | duck typing and typing.Protocol for the export target |
| task07.py | Money value object with operators |
| task08.py | one search() instead of two, no mutable default |
| task09.py | mixins, MRO and the broken super() chain |
| task10.py | one registry from string to class |
| extra1.py | E1, Headers with UserDict |
| extra2.py | E2, \_\_init_subclass\_\_ self registration |
| extra3.py | E3, classes against plain functions |
| extra4.py | E4, Null Object for loyalty cards |
| extra5.py | E5, events with to_dict / from_dict and versions |

The short answers are comments at the top of each file.
