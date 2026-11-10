"""Printing the receipt. This class only prints, it never counts money."""

from .errors import BikeShareError


class ReceiptPrinter:
    """Takes a finished ride as a parameter and makes one line of text."""

    @staticmethod
    def line(ride):
        if not ride.is_finished:
            raise BikeShareError("cannot print a receipt of an open ride")
        # 1000 -> "1 000", like we write money here
        money = f"{ride.fee:,}".replace(",", " ")
        return (
            f"{ride.start_station.name} → {ride.end_station.name}, "
            f"{ride.duration_minutes} min, {money} sum"
        )

    @staticmethod
    def print(ride):
        text = ReceiptPrinter.line(ride)
        print(text)
        return text
