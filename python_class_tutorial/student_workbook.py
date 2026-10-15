"""Python Classes Lab — 120-minute student workbook.
Prerequisites: functions, loops, conditions, lists, dictionaries.
Core: one task per section. Stretch tasks on the website are optional.
Keep each task in a separate file or run one selected section at a time.
"""

# SECTION 1: Objects before syntax (0–10 minutes)
# Create two players
# Build the smallest possible player model, using manual attributes for this first task.
# - Define an empty Player class.
# - Create player_one with name "Ari" and score 10.
# - Create a separate player_two with name "Bo" and score 3.
class Player:
    pass

# Create player_one and player_two, then assign their attributes.



# SECTION 2: Initialize with self (10–25 minutes)
# Initialize a Rectangle
# Replace manual setup with an initializer.
# - Define Rectangle(width, height=1).
# - Store width and height as instance attributes.
# - Different rectangles must keep independent dimensions.
class Rectangle:
    def __init__(self, width, height=1):
        # Store both values on this object.
        pass

# Try Rectangle(8, 3) and Rectangle(8).



# SECTION 3: Methods that change state (25–40 minutes)
# Build a reusable Counter
# Complete an object that keeps a running value.
# - Counter(start=0) stores value.
# - increment(step=1) adds step and returns the new value.
# - reset() sets value to 0 and returns None.
class Counter:
    def __init__(self, start=0):
        self.value = start

    def increment(self, step=1):
        pass

    def reset(self):
        pass



# SECTION 4: Keep objects valid (40–55 minutes)
# Protect a wallet's balance
# Use integer cents and preserve a nonnegative balance. Assume all numeric arguments are integers.
# - Wallet(balance_cents=0) rejects a negative initial balance.
# - Store _balance; get_balance() returns it.
# - deposit(amount) accepts only amount > 0.
# - withdraw(amount) accepts only 0 < amount <= current balance.
# - Invalid operations raise ValueError before mutation; deposit and withdraw return None.
class Wallet:
    def __init__(self, balance_cents=0):
        # Validate, then store _balance.
        pass

    def get_balance(self):
        pass

    def deposit(self, amount):
        pass

    def withdraw(self, amount):
        pass



# SECTION 5: Shared state & aliases (55–70 minutes)
# Give every playlist its own songs
# Accept an optional starting list of song-title strings without sharing the caller's outer list.
# - Playlist(name, songs=None) stores name.
# - When songs is omitted, create a new empty list.
# - When songs is supplied, copy it using list(songs).
# - add(song) appends to this playlist's songs and returns None.
class Playlist:
    def __init__(self, name, songs=None):
        self.name = name
        # Give this instance its own songs list.

    def add(self, song):
        pass



# SECTION 6: Compose objects (70–85 minutes)
# Build a ShoppingCart
# The Product model is supplied. Store products with quantities and calculate the current total in cents.
# - ShoppingCart() starts empty.
# - add(product, quantity=1) stores the product and quantity; quantity <= 0 raises ValueError before mutation.
# - total() returns the sum of price_cents * quantity; an empty cart totals 0.
# - Use each product's current price when total() is called.
class Product:
    def __init__(self, name, price_cents):
        self.name = name
        self.price_cents = price_cents

class ShoppingCart:
    def __init__(self):
        self.items = []

    def add(self, product, quantity=1):
        pass

    def total(self):
        pass



# SECTION 7: Inherit & specialize (85–100 minutes)
# Specialize an Animal
# The base class is supplied. Add Dog with extra data and behavior.
# - Dog inherits from Animal.
# - Dog(name, breed) uses super().__init__(name), then stores breed.
# - speak() returns "<name> says woof".
# - __str__() returns "<name> (<breed>)".
class Animal:
    def __init__(self, name):
        self.name = name

    def speak(self):
        return "..."

class Dog(Animal):
    # Add initializer, speak, and __str__.
    pass



# SECTION 8: Build a lending library (100–120 minutes)
# Capstone: a lending library
# Complete Library while keeping the supplied Book model. Assume title and author are strings and each book belongs to just one library in this exercise.
# - Library() starts with a separate books dictionary.
# - add_book(book) stores the object by title; duplicate titles raise ValueError without replacement.
# - borrow(title) raises KeyError for an unknown title and ValueError if already borrowed; otherwise set borrowed to True and return the same Book.
# - return_book(title) raises KeyError if unknown and ValueError if not borrowed; otherwise set borrowed to False and return None.
# - available_titles() returns a sorted list of titles that are not borrowed.
class Book:
    def __init__(self, title, author):
        self.title = title
        self.author = author
        self.borrowed = False

    def __str__(self):
        return f"{self.title} by {self.author}"

class Library:
    def __init__(self):
        # Create the collection.
        pass

    def add_book(self, book):
        pass

    def borrow(self, title):
        pass

    def return_book(self, title):
        pass

    def available_titles(self):
        pass

# Try: add a Book, borrow it, inspect available_titles(), return it.
