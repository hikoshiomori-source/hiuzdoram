# Lab 4B, Task 8 - the Java habit that broke the search
#
# 8.1  Python has no overloading. A class body is just code that runs, and
#      "def search" is an assignment to the name search. The second def
#      replaces the first one, so the class keeps only one search, the one with
#      two parameters. Calling ps.search("iphone") then misses the filters
#      argument and that is the TypeError (and the 500).
# 8.2  filters={} as a default is created once, when the def line runs, and the
#      same dict is then shared by every call. If any code puts something into
#      it, the filter stays there for all later calls, as in Lab 4A Task 1. I
#      use filters=None and build a real dict inside.
# 8.3  I chose the keyword-only dictionary, search('iphone', filters={...}).
#      The filters come from the HTTP query as a dict anyway, so I do not have
#      to unpack and pack them again. With **kwargs a filter named "query" or a
#      future parameter like "limit" or "page" would collide with my own
#      parameter names, and a typo like brnad='Apple' would look like a normal
#      argument. Keyword-only also means nobody can pass filters by position by
#      mistake. kwargs reads nicer in a console, but this is a web API.
# 8.4  pyflakes on the original file says:
#         task08_original.py:15:5: redefinition of unused 'search' from line 11
#      So the linter sees it before any review or test: the first search is
#      defined and never used, because the second one overwrote it.


class ProductSearch:
    def __init__(self, products):
        self.products = products

    def search(self, query, *, filters=None):
        if filters is None:
            filters = {}

        q = query.lower()
        result = [p for p in self.products if q in p["title"].lower()]
        for key, value in filters.items():
            result = [p for p in result if p.get(key) == value]
        return result


PRODUCTS = [
    {"title": "iPhone 15", "brand": "Apple"},
    {"title": "iPhone 13", "brand": "Apple"},
    {"title": "Galaxy S24", "brand": "Samsung"},
]


# ---------- tests ----------

def test_search_without_filters():
    ps = ProductSearch(PRODUCTS)
    titles = [p["title"] for p in ps.search("iphone")]
    assert titles == ["iPhone 15", "iPhone 13"]


def test_search_with_filters():
    ps = ProductSearch(PRODUCTS)
    found = ps.search("galaxy", filters={"brand": "Samsung"})
    assert [p["title"] for p in found] == ["Galaxy S24"]


def test_filter_that_matches_nothing():
    ps = ProductSearch(PRODUCTS)
    assert ps.search("iphone", filters={"brand": "Samsung"}) == []


def test_filters_must_be_given_by_name():
    ps = ProductSearch(PRODUCTS)
    try:
        ps.search("iphone", {"brand": "Apple"})
    except TypeError:
        pass
    else:
        raise AssertionError("filters is keyword only")


def test_one_call_does_not_change_the_next_one():
    ps = ProductSearch(PRODUCTS)
    my_filters = {"brand": "Apple"}
    ps.search("iphone", filters=my_filters)
    assert my_filters == {"brand": "Apple"}        # not touched
    assert len(ps.search("iphone")) == 2           # default is still empty
