"""All errors of the app in one file, so I do not invent new error names later."""


class BikeShareError(Exception):
    """Base error. Every error of this app is a BikeShareError."""


class DockOccupiedError(BikeShareError):
    """Dock already has a bike."""


class NoBikeError(BikeShareError):
    """Station (or dock) has no bike that can be taken."""


class RideActiveError(BikeShareError):
    """Rider already has one active ride."""


class NoActiveRideError(BikeShareError):
    """Rider tries to return a bike, but he has no ride."""


class StationFullError(BikeShareError):
    """No free dock on return. After 2 tries it also carries a redirect station."""

    def __init__(self, message, redirect_to=None):
        super().__init__(message)
        self.redirect_to = redirect_to
