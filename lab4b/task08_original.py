# The code as it was merged, kept only so that task 8.4 can be shown:
#     python -m pyflakes task08_original.py
# prints: redefinition of unused 'search' from line 11
# Do not import this file, the first search() is lost.


class ProductSearch:
    def __init__(self, products):
        self.products = products

    def search(self, query):
        q = query.lower()
        return [p for p in self.products if q in p["title"].lower()]

    def search(self, query, filters):
        q = query.lower()
        result = [p for p in self.products if q in p["title"].lower()]
        for key, value in filters.items():
            result = [p for p in result if p.get(key) == value]
        return result
