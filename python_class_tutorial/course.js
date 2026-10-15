const COURSE = {
  "title": "Python Classes Lab",
  "duration": 120,
  "lessons": [
    {
      "title": "Objects before syntax",
      "minutes": 10,
      "label": "MODEL ONE THING",
      "timing": [
        2,
        2,
        4,
        2
      ],
      "description": "You already know functions, lists, and dictionaries. A class lets you describe a kind of thing whose data and behavior belong together. An object is one particular instance of that class.",
      "goals": [
        "Distinguish a class from an instance.",
        "Read and write attributes with dot notation.",
        "Recognize when grouping data and behavior helps."
      ],
      "concepts": [
        [
          "From records to objects",
          "A dictionary is a good record. A class becomes useful when many records share operations or rules. Model a player with a name and score; later, methods will control how that score changes. A simple calculation can still be a function."
        ],
        [
          "Definition, creation, access",
          "class Player defines a new type. Player() creates an instance. player.score reads an attribute; player.score = 10 assigns one. A class name uses CapWords by convention; instance and method names use snake_case."
        ],
        [
          "Two instances, two states",
          "Creating Player() twice gives two different objects. Each may have its own attributes. pass is a temporary empty body, not a special class feature. We assign attributes manually here to make object creation visible; the next section automates setup."
        ]
      ],
      "examples": [
        {
          "title": "A record, then a tiny object",
          "code": "record = {\"name\": \"Ari\", \"score\": 10}\nprint(record[\"name\"])\n\nclass Player:\n    pass\n\nplayer = Player()\nplayer.name = \"Ari\"\nplayer.score = 10\nprint(player.name, player.score)\n",
          "output": "Ari\nAri 10",
          "notes": [
            "The dictionary uses a key; the object uses an attribute.",
            "Player is the type. player is one instance."
          ]
        },
        {
          "title": "Independent objects",
          "code": "class Player:\n    pass\n\nfirst = Player()\nsecond = Player()\nfirst.score = 10\nsecond.score = 3\nfirst.score += 5\nprint(first.score, second.score)\nprint(first is second)\n",
          "output": "15 3\nFalse",
          "notes": [
            "is compares identity: whether two names refer to the same object.",
            "Changing first does not change the separately created second."
          ]
        }
      ],
      "practices": [
        {
          "id": "players",
          "title": "Create two players",
          "prompt": "Build the smallest possible player model, using manual attributes for this first task.",
          "requirements": [
            "Define an empty Player class.",
            "Create player_one with name \"Ari\" and score 10.",
            "Create a separate player_two with name \"Bo\" and score 3."
          ],
          "starter": "class Player:\n    pass\n\n# Create player_one and player_two, then assign their attributes.\n",
          "solution": "class Player:\n    pass\n\nplayer_one = Player()\nplayer_one.name = \"Ari\"\nplayer_one.score = 10\nplayer_two = Player()\nplayer_two.name = \"Bo\"\nplayer_two.score = 3\n",
          "tests": [
            {
              "name": "Both values are Player instances",
              "code": "assert isinstance(player_one, Player) and isinstance(player_two, Player)\n"
            },
            {
              "name": "Each player has the requested data",
              "code": "assert (player_one.name, player_one.score) == (\"Ari\", 10)\nassert (player_two.name, player_two.score) == (\"Bo\", 3)\n"
            },
            {
              "name": "The players are different objects",
              "code": "assert player_one is not player_two\nplayer_one.score += 1\nassert player_two.score == 3\n"
            }
          ],
          "hint": [
            "Call Player() for each player.",
            "Use player_one.name and player_one.score to assign data; repeat for player_two."
          ],
          "why": "Two constructor calls make two instances. Assigning the same object to both names would create aliases.",
          "optional": false
        },
        {
          "id": "rectangle-record",
          "title": "Model a rectangle",
          "prompt": "Use attributes to group the dimensions of one rectangle.",
          "requirements": [
            "Define an empty Rectangle class.",
            "Create rect with width 8 and height 3.",
            "Store rect.width * rect.height in the variable area."
          ],
          "starter": "class Rectangle:\n    pass\n\n# Create rect and calculate area.\n",
          "solution": "class Rectangle:\n    pass\n\nrect = Rectangle()\nrect.width = 8\nrect.height = 3\narea = rect.width * rect.height\n",
          "tests": [
            {
              "name": "Rectangle data is grouped on rect",
              "code": "assert isinstance(rect, Rectangle)\nassert (rect.width, rect.height) == (8, 3)\n"
            },
            {
              "name": "The calculated area is 24",
              "code": "assert area == 24\n"
            }
          ],
          "hint": [
            "Create the object before assigning attributes.",
            "Dot notation reads a stored dimension just as a variable reads a value."
          ],
          "why": "The calculation still works like ordinary arithmetic; the dimensions now belong to rect.",
          "optional": true
        }
      ],
      "questions": [
        {
          "stem": "Which statement creates an instance of Player?",
          "options": [
            "class Player:",
            "Player()",
            "Player.name",
            "def Player():"
          ],
          "correct": 1,
          "explanation": "Calling the class creates an instance; defining the class creates the type.",
          "code": ""
        },
        {
          "stem": "After the code below, what is b.score?",
          "options": [
            "0",
            "7",
            "None",
            "An error"
          ],
          "correct": 0,
          "explanation": "a and b came from separate Player() calls. Updating a.score does not update b.score.",
          "code": "class Player:\n    pass\na = Player()\nb = Player()\na.score = 0\nb.score = 0\na.score = 7\n"
        },
        {
          "stem": "When is a class especially helpful?",
          "options": [
            "Every time a program has a number",
            "When related data and repeated behavior belong together",
            "Only when using inheritance",
            "Whenever a loop is needed"
          ],
          "correct": 1,
          "explanation": "A class can group state and the operations that manage it. It is a design choice, not a requirement for all code.",
          "code": ""
        }
      ]
    },
    {
      "title": "Initialize with self",
      "minutes": 15,
      "label": "GIVE EVERY OBJECT A START",
      "timing": [
        3,
        3,
        7,
        2
      ],
      "description": "Use __init__ to give every new instance a consistent starting state. Connect each parameter to an attribute, and understand why self appears in definitions but usually not in calls.",
      "goals": [
        "Write __init__ with required and default parameters.",
        "Distinguish a local parameter from an instance attribute.",
        "Trace which object self refers to."
      ],
      "concepts": [
        [
          "An initializer runs automatically",
          "Calling Rectangle(8, 3) creates an instance and calls its __init__ method with that instance. __init__ initializes an already created object; it should not return a useful value. It normally finishes with the default return value None."
        ],
        [
          "self is the current instance",
          "In self.width = width, the right-hand width is the local parameter; self.width is data kept on the instance after the call ends. self is the conventional first parameter name for instance methods, not a Python keyword."
        ],
        [
          "Arguments at the call site",
          "For __init__(self, width, height=1), write Rectangle(8, 3) or Rectangle(8). Python supplies the instance as self. Forgetting self can produce an argument-count error; writing width = width stores no attribute."
        ]
      ],
      "examples": [
        {
          "title": "Two rectangles, one initializer",
          "code": "class Rectangle:\n    def __init__(self, width, height):\n        self.width = width\n        self.height = height\n\nwide = Rectangle(8, 3)\ntall = Rectangle(2, 9)\nprint(wide.width, wide.height)\nprint(tall.width, tall.height)\n",
          "output": "8 3\n2 9",
          "notes": [
            "For the first call, self is wide, width is 8, and height is 3.",
            "For the second call, self is a different instance."
          ]
        },
        {
          "title": "Defaults and keyword arguments",
          "code": "class Ticket:\n    def __init__(self, event, price_cents=0):\n        self.event = event\n        self.price_cents = price_cents\n\nfree = Ticket(\"Club meeting\")\npaid = Ticket(event=\"Science fair\", price_cents=500)\nprint(free.event, free.price_cents)\nprint(paid.event, paid.price_cents)\n",
          "output": "Club meeting 0\nScience fair 500",
          "notes": [
            "Default values let callers omit an argument.",
            "The two Ticket instances retain different data."
          ]
        }
      ],
      "practices": [
        {
          "id": "rectangle-init",
          "title": "Initialize a Rectangle",
          "prompt": "Replace manual setup with an initializer.",
          "requirements": [
            "Define Rectangle(width, height=1).",
            "Store width and height as instance attributes.",
            "Different rectangles must keep independent dimensions."
          ],
          "starter": "class Rectangle:\n    def __init__(self, width, height=1):\n        # Store both values on this object.\n        pass\n\n# Try Rectangle(8, 3) and Rectangle(8).\n",
          "solution": "class Rectangle:\n    def __init__(self, width, height=1):\n        self.width = width\n        self.height = height\n",
          "tests": [
            {
              "name": "Required arguments are stored",
              "code": "r = Rectangle(8, 3)\nassert (r.width, r.height) == (8, 3)\n"
            },
            {
              "name": "Height defaults to 1",
              "code": "assert Rectangle(8).height == 1\n"
            },
            {
              "name": "Instances keep independent values",
              "code": "a = Rectangle(2, 3)\nb = Rectangle(5, 6)\na.width = 9\nassert b.width == 5\n"
            },
            {
              "name": "Keyword arguments work",
              "code": "r = Rectangle(height=4, width=7)\nassert (r.width, r.height) == (7, 4)\n"
            }
          ],
          "hint": [
            "Keep self first in the definition.",
            "The pattern is self.attribute = parameter."
          ],
          "why": "Parameters are local names. Assigning them to self keeps their values on the new instance.",
          "optional": false
        },
        {
          "id": "student-init",
          "title": "A student profile",
          "prompt": "Practice a required input and a default string.",
          "requirements": [
            "Define Student(name, level=\"beginner\").",
            "Store name and level as instance attributes."
          ],
          "starter": "class Student:\n    # Write an initializer.\n    pass\n",
          "solution": "class Student:\n    def __init__(self, name, level=\"beginner\"):\n        self.name = name\n        self.level = level\n",
          "tests": [
            {
              "name": "Default level works",
              "code": "s = Student(\"Ari\")\nassert (s.name, s.level) == (\"Ari\", \"beginner\")\n"
            },
            {
              "name": "Explicit level works",
              "code": "assert Student(\"Bo\", \"intermediate\").level == \"intermediate\"\n"
            }
          ],
          "hint": [
            "Name the initializer __init__, with two underscores on each side.",
            "Use level=\"beginner\" in the parameter list."
          ],
          "why": "The default belongs in the signature, while the chosen value is stored on each instance.",
          "optional": true
        }
      ],
      "questions": [
        {
          "stem": "What does self refer to in an instance method?",
          "options": [
            "The class name as a string",
            "The instance receiving the method call",
            "Every object at once",
            "A reserved keyword"
          ],
          "correct": 1,
          "explanation": "Python passes the receiving instance as the first argument. self is the conventional parameter name.",
          "code": ""
        },
        {
          "stem": "Which assignment keeps the supplied name on the instance?",
          "options": [
            "name = name",
            "self = name",
            "self.name = name",
            "return name"
          ],
          "correct": 2,
          "explanation": "self.name is an instance attribute. The plain name on the right is the initializer parameter.",
          "code": ""
        },
        {
          "stem": "What should __init__ normally return?",
          "options": [
            "The new object",
            "A dictionary",
            "A string",
            "None, usually by ending without return"
          ],
          "correct": 3,
          "explanation": "Object creation happens before initialization. Returning a value other than None from __init__ raises TypeError.",
          "code": ""
        }
      ]
    },
    {
      "title": "Methods that change state",
      "minutes": 15,
      "label": "MAKE OBJECTS DO SOMETHING",
      "timing": [
        3,
        3,
        7,
        2
      ],
      "description": "An instance method can read or change its object's attributes. Design a small API: clear method names, predictable state changes, and useful return values.",
      "goals": [
        "Write methods that use self.",
        "Separate changing state from returning a value.",
        "Trace method calls on two instances."
      ],
      "concepts": [
        [
          "A method is a function reached through an object",
          "counter.increment(2) calls the method with counter as self and 2 as step. For an ordinary instance method, Counter.increment(counter, 2) has the same effect. Callers normally use the first form."
        ],
        [
          "State outlives a call",
          "A local value disappears when a call ends; self.value stays on the instance. Use self.value += step to update stored state. value += step would look for a local name and can raise an error."
        ],
        [
          "Change, return, or both",
          "A method may change an attribute and return the new value. return does not automatically display anything; print does. If a method has no return statement, callers receive None. Make that contract explicit."
        ]
      ],
      "examples": [
        {
          "title": "A counter with a small API",
          "code": "class Counter:\n    def __init__(self, start=0):\n        self.value = start\n\n    def increment(self, step=1):\n        self.value += step\n        return self.value\n\nclicks = Counter()\nprint(clicks.increment())\nprint(clicks.increment(4))\nprint(clicks.value)\n",
          "output": "1\n5\n5",
          "notes": [
            "The first call changes 0 to 1; the second changes 1 to 5.",
            "Returning a value lets another expression use it."
          ]
        },
        {
          "title": "A query leaves state alone",
          "code": "class Rectangle:\n    def __init__(self, width, height):\n        self.width = width\n        self.height = height\n\n    def area(self):\n        return self.width * self.height\n\n    def scale(self, factor):\n        self.width *= factor\n        self.height *= factor\n\nrect = Rectangle(3, 2)\nprint(rect.area())\nresult = rect.scale(2)\nprint(rect.area())\nprint(result)\n",
          "output": "6\n24\nNone",
          "notes": [
            "area() computes a value without changing dimensions.",
            "scale() changes dimensions and returns None."
          ]
        }
      ],
      "practices": [
        {
          "id": "counter",
          "title": "Build a reusable Counter",
          "prompt": "Complete an object that keeps a running value.",
          "requirements": [
            "Counter(start=0) stores value.",
            "increment(step=1) adds step and returns the new value.",
            "reset() sets value to 0 and returns None."
          ],
          "starter": "class Counter:\n    def __init__(self, start=0):\n        self.value = start\n\n    def increment(self, step=1):\n        pass\n\n    def reset(self):\n        pass\n",
          "solution": "class Counter:\n    def __init__(self, start=0):\n        self.value = start\n\n    def increment(self, step=1):\n        self.value += step\n        return self.value\n\n    def reset(self):\n        self.value = 0\n",
          "tests": [
            {
              "name": "Default counter starts at zero",
              "code": "assert Counter().value == 0\n"
            },
            {
              "name": "Increment changes and returns the value",
              "code": "c = Counter(2)\nassert c.increment() == 3\nassert c.increment(4) == 7\nassert c.value == 7\n"
            },
            {
              "name": "Reset clears state and returns None",
              "code": "c = Counter(9)\nassert c.reset() is None\nassert c.value == 0\n"
            },
            {
              "name": "Two counters remain independent",
              "code": "a = Counter()\nb = Counter(10)\na.increment()\nassert b.value == 10\n"
            }
          ],
          "hint": [
            "Use self.value so the change stays on the object.",
            "In increment, update first and return self.value. reset needs an assignment but no return."
          ],
          "why": "A short public API makes the object's behavior predictable. The return value and the stored state are separate parts of the contract.",
          "optional": false
        },
        {
          "id": "rectangle-methods",
          "title": "Area and scale",
          "prompt": "Add a query and a state-changing method to a rectangle.",
          "requirements": [
            "Rectangle(width, height) stores both dimensions.",
            "area() returns width times height.",
            "scale(factor) multiplies both dimensions and returns None."
          ],
          "starter": "class Rectangle:\n    def __init__(self, width, height):\n        self.width = width\n        self.height = height\n\n    # Add area() and scale(factor).\n",
          "solution": "class Rectangle:\n    def __init__(self, width, height):\n        self.width = width\n        self.height = height\n\n    def area(self):\n        return self.width * self.height\n\n    def scale(self, factor):\n        self.width *= factor\n        self.height *= factor\n",
          "tests": [
            {
              "name": "Area is computed from stored dimensions",
              "code": "assert Rectangle(3, 4).area() == 12\n"
            },
            {
              "name": "Scaling changes both dimensions",
              "code": "r = Rectangle(3, 4)\nassert r.scale(2) is None\nassert (r.width, r.height, r.area()) == (6, 8, 48)\n"
            }
          ],
          "hint": [
            "Read attributes with self.",
            "If both dimensions double, the area becomes four times as large."
          ],
          "why": "Methods can either answer a question or change state. Their names and return values should make that distinction clear.",
          "optional": true
        }
      ],
      "questions": [
        {
          "stem": "Which call is equivalent to c.increment(2) for this ordinary instance method?",
          "options": [
            "Counter.increment(2)",
            "Counter.increment(c, 2)",
            "c.increment(c, 2)",
            "Counter(c, 2)"
          ],
          "correct": 1,
          "explanation": "The bound call supplies c as self. Calling the function through the class requires passing c explicitly.",
          "code": ""
        },
        {
          "stem": "What does the final line print?",
          "options": [
            "1",
            "0",
            "None",
            "An error"
          ],
          "correct": 2,
          "explanation": "increment changes state but has no return statement, so it returns None.",
          "code": "class Counter:\n    def __init__(self):\n        self.value = 0\n    def increment(self):\n        self.value += 1\nc = Counter()\nprint(c.increment())\n"
        },
        {
          "stem": "Which method is a query that should leave state unchanged?",
          "options": [
            "reset()",
            "deposit(10)",
            "area()",
            "scale(2)"
          ],
          "correct": 2,
          "explanation": "area() normally calculates a result from dimensions without modifying them. The contract still depends on how a method is defined.",
          "code": ""
        }
      ]
    },
    {
      "title": "Keep objects valid",
      "minutes": 15,
      "label": "RULES BELONG WITH STATE",
      "timing": [
        3,
        3,
        7,
        2
      ],
      "description": "Methods can protect an object's rules. Check inputs before changing state, then report invalid operations with an exception the caller can handle.",
      "goals": [
        "State an invariant in plain language.",
        "Reject invalid input with ValueError.",
        "Keep state unchanged when an operation fails."
      ],
      "concepts": [
        [
          "An invariant is a rule that should remain true",
          "For this wallet model, the balance cannot become negative. Validate the initial balance and every operation that could break the rule. Assume callers supply integer cents; type validation is outside this exercise."
        ],
        [
          "Validate before you mutate",
          "For a withdrawal, first reject an amount at or below zero, then reject an amount larger than the balance. Only after both checks should you subtract. If a check fails, raise ValueError and leave the object as it was."
        ],
        [
          "A convention is not a lock",
          "A leading underscore, such as _balance, tells other programmers that an attribute is internal. It does not prevent access or enforce privacy. Here the intended API is deposit(), withdraw(), and get_balance()."
        ]
      ],
      "examples": [
        {
          "title": "Reject an invalid initial state",
          "code": "class Temperature:\n    def __init__(self, celsius):\n        if celsius < -273.15:\n            raise ValueError(\"Below absolute zero\")\n        self.celsius = celsius\n\nprint(Temperature(20).celsius)\ntry:\n    Temperature(-300)\nexcept ValueError as error:\n    print(error)\n",
          "output": "20\nBelow absolute zero",
          "notes": [
            "A rejected constructor call does not produce a usable initialized instance.",
            "The caller decides how to handle the exception."
          ]
        },
        {
          "title": "A failed operation preserves state",
          "code": "class Stock:\n    def __init__(self, quantity):\n        self.quantity = quantity\n\n    def remove(self, amount):\n        if amount <= 0 or amount > self.quantity:\n            raise ValueError(\"Invalid amount\")\n        self.quantity -= amount\n\nstock = Stock(5)\ntry:\n    stock.remove(8)\nexcept ValueError:\n    print(\"Rejected\")\nprint(stock.quantity)\n",
          "output": "Rejected\n5",
          "notes": [
            "The example assumes the starting quantity is valid.",
            "The guard runs before subtraction, so failure leaves quantity at 5."
          ]
        }
      ],
      "practices": [
        {
          "id": "wallet",
          "title": "Protect a wallet's balance",
          "prompt": "Use integer cents and preserve a nonnegative balance. Assume all numeric arguments are integers.",
          "requirements": [
            "Wallet(balance_cents=0) rejects a negative initial balance.",
            "Store _balance; get_balance() returns it.",
            "deposit(amount) accepts only amount > 0.",
            "withdraw(amount) accepts only 0 < amount <= current balance.",
            "Invalid operations raise ValueError before mutation; deposit and withdraw return None."
          ],
          "starter": "class Wallet:\n    def __init__(self, balance_cents=0):\n        # Validate, then store _balance.\n        pass\n\n    def get_balance(self):\n        pass\n\n    def deposit(self, amount):\n        pass\n\n    def withdraw(self, amount):\n        pass\n",
          "solution": "class Wallet:\n    def __init__(self, balance_cents=0):\n        if balance_cents < 0:\n            raise ValueError(\"Negative balance\")\n        self._balance = balance_cents\n\n    def get_balance(self):\n        return self._balance\n\n    def deposit(self, amount):\n        if amount <= 0:\n            raise ValueError(\"Amount must be positive\")\n        self._balance += amount\n\n    def withdraw(self, amount):\n        if amount <= 0 or amount > self._balance:\n            raise ValueError(\"Invalid withdrawal\")\n        self._balance -= amount\n",
          "tests": [
            {
              "name": "Valid operations update the balance",
              "code": "w = Wallet(100)\nassert w.deposit(50) is None\nassert w.withdraw(40) is None\nassert w.get_balance() == 110\n"
            },
            {
              "name": "Default balance is zero",
              "code": "assert Wallet().get_balance() == 0\n"
            },
            {
              "name": "Negative initial balances are rejected",
              "code": "try:\n    Wallet(-1)\nexcept ValueError:\n    pass\nelse:\n    raise AssertionError('Expected ValueError')\n"
            },
            {
              "name": "Invalid deposits preserve state",
              "code": "w = Wallet(100)\nfor amount in [0, -5]:\n    try:\n        w.deposit(amount)\n    except ValueError:\n        pass\n    else:\n        raise AssertionError('Expected ValueError')\n    assert w.get_balance() == 100\n"
            },
            {
              "name": "Invalid withdrawals preserve state",
              "code": "w = Wallet(100)\nfor amount in [0, -5, 101]:\n    try:\n        w.withdraw(amount)\n    except ValueError:\n        pass\n    else:\n        raise AssertionError('Expected ValueError')\n    assert w.get_balance() == 100\n"
            },
            {
              "name": "Withdrawing the exact balance is allowed",
              "code": "w = Wallet(100)\nw.withdraw(100)\nassert w.get_balance() == 0\n"
            }
          ],
          "hint": [
            "Write each guard before the line that updates _balance.",
            "Use raise ValueError(...) for invalid inputs; an early exception skips the later mutation."
          ],
          "why": "The invariant holds after successful calls and after rejected calls. _balance signals the intended boundary without making it inaccessible.",
          "optional": false
        },
        {
          "id": "stock",
          "title": "Validate stock changes",
          "prompt": "Generalize the same guard pattern to an inventory.",
          "requirements": [
            "Stock(quantity=0) rejects quantity < 0.",
            "remove(amount) rejects amount <= 0 or amount > quantity.",
            "A valid remove subtracts the amount and returns None."
          ],
          "starter": "class Stock:\n    # Store quantity and implement remove(amount).\n    pass\n",
          "solution": "class Stock:\n    def __init__(self, quantity=0):\n        if quantity < 0:\n            raise ValueError(\"Negative quantity\")\n        self.quantity = quantity\n\n    def remove(self, amount):\n        if amount <= 0 or amount > self.quantity:\n            raise ValueError(\"Invalid amount\")\n        self.quantity -= amount\n",
          "tests": [
            {
              "name": "Valid removal works",
              "code": "s = Stock(5)\nassert s.remove(2) is None\nassert s.quantity == 3\n"
            },
            {
              "name": "Invalid removal leaves quantity unchanged",
              "code": "s = Stock(5)\ntry:\n    s.remove(6)\nexcept ValueError:\n    pass\nelse:\n    raise AssertionError('Expected ValueError')\nassert s.quantity == 5\n"
            },
            {
              "name": "Negative initialization is rejected",
              "code": "try:\n    Stock(-1)\nexcept ValueError:\n    pass\nelse:\n    raise AssertionError('Expected ValueError')\n"
            }
          ],
          "hint": [
            "Reuse the rule-checking order from Wallet.",
            "The quantity rule belongs in both initialization and removal."
          ],
          "why": "Putting rules beside state makes it easier to reuse the model safely.",
          "optional": true
        }
      ],
      "questions": [
        {
          "stem": "Why validate a withdrawal before subtracting?",
          "options": [
            "To make Python run faster",
            "To keep state unchanged if the operation is rejected",
            "To hide the method",
            "Because subtraction cannot be used in classes"
          ],
          "correct": 1,
          "explanation": "A failed check should leave the object valid. Mutating first can break the invariant.",
          "code": ""
        },
        {
          "stem": "What does a leading underscore in _balance mean?",
          "options": [
            "Python makes it completely private",
            "The value cannot change",
            "It is internal by convention",
            "Only subclasses can read it"
          ],
          "correct": 2,
          "explanation": "The underscore communicates intended use. It is not access control.",
          "code": ""
        },
        {
          "stem": "For this API, what should happen when withdraw(0) is called?",
          "options": [
            "Subtract zero and silently succeed",
            "Return the whole wallet",
            "Raise ValueError and keep the balance",
            "Set the balance to zero"
          ],
          "correct": 2,
          "explanation": "The stated contract accepts only positive amounts. The caller can catch the exception.",
          "code": ""
        }
      ]
    },
    {
      "title": "Shared state & aliases",
      "minutes": 15,
      "label": "WHO OWNS THIS VALUE?",
      "timing": [
        3,
        3,
        7,
        2
      ],
      "description": "Some class bugs are ordinary reference bugs in disguise. Learn which values belong to a class, which belong to each instance, and when two names share one object.",
      "goals": [
        "Distinguish class and instance attributes.",
        "Fix a shared mutable list.",
        "Avoid shared mutable defaults and unwanted aliases."
      ],
      "concepts": [
        [
          "Class attributes are shared through lookup",
          "A value assigned in the class body is a class attribute. Python looks on the instance first, then on its class. Assigning an instance attribute with the same name usually shadows the class attribute for that instance."
        ],
        [
          "Mutable data needs deliberate ownership",
          "A list assigned in a class body can be mutated by every instance that finds it there. For a separate list per object, create self.songs inside __init__. Also avoid songs=[] as a parameter default: defaults are evaluated once, so repeated calls can share that list."
        ],
        [
          "Assignment does not copy",
          "backup = playlist gives a second name to the same instance. list(songs) makes a shallow copy of an input list: the outer container is new, but any nested mutable elements would still be shared. Our playlist contains only strings."
        ]
      ],
      "examples": [
        {
          "title": "Spot the shared list, then fix it",
          "code": "class BrokenPlaylist:\n    songs = []\n\na = BrokenPlaylist()\nb = BrokenPlaylist()\na.songs.append(\"Orbit\")\nprint(b.songs)\n\nclass Playlist:\n    def __init__(self):\n        self.songs = []\n\nx = Playlist()\ny = Playlist()\nx.songs.append(\"Orbit\")\nprint(y.songs)\n",
          "output": "['Orbit']\n[]",
          "notes": [
            "BrokenPlaylist has one shared class list.",
            "Playlist creates a new list for every initialized instance."
          ]
        },
        {
          "title": "Lookup, shadowing, and aliasing",
          "code": "class Pet:\n    species = \"cat\"\n\n    def __init__(self, name):\n        self.name = name\n\na = Pet(\"Pixel\")\nb = Pet(\"Miso\")\na.species = \"robot\"\nprint(a.species, b.species, Pet.species)\n\nalias = b\nalias.name = \"Bean\"\nprint(b.name)\nprint(alias is b)\n",
          "output": "robot cat cat\nBean\nTrue",
          "notes": [
            "a.species shadows the class value; it does not change Pet.species.",
            "alias and b refer to the same object."
          ]
        }
      ],
      "practices": [
        {
          "id": "playlist",
          "title": "Give every playlist its own songs",
          "prompt": "Accept an optional starting list of song-title strings without sharing the caller's outer list.",
          "requirements": [
            "Playlist(name, songs=None) stores name.",
            "When songs is omitted, create a new empty list.",
            "When songs is supplied, copy it using list(songs).",
            "add(song) appends to this playlist's songs and returns None."
          ],
          "starter": "class Playlist:\n    def __init__(self, name, songs=None):\n        self.name = name\n        # Give this instance its own songs list.\n\n    def add(self, song):\n        pass\n",
          "solution": "class Playlist:\n    def __init__(self, name, songs=None):\n        self.name = name\n        self.songs = [] if songs is None else list(songs)\n\n    def add(self, song):\n        self.songs.append(song)\n",
          "tests": [
            {
              "name": "Defaults do not share a list",
              "code": "a = Playlist(\"A\")\nb = Playlist(\"B\")\na.add(\"Orbit\")\nassert a.songs == [\"Orbit\"]\nassert b.songs == []\n"
            },
            {
              "name": "The caller's list is copied",
              "code": "source = [\"Orbit\"]\np = Playlist(\"Mix\", source)\np.add(\"Nova\")\nassert source == [\"Orbit\"]\nassert p.songs == [\"Orbit\", \"Nova\"]\n"
            },
            {
              "name": "Later source changes do not change the playlist",
              "code": "source = [\"Orbit\"]\np = Playlist(\"Mix\", source)\nsource.append(\"Nova\")\nassert p.songs == [\"Orbit\"]\n"
            },
            {
              "name": "Name and return contract work",
              "code": "p = Playlist(\"Study\")\nassert p.name == \"Study\"\nassert p.add(\"Calm\") is None\n"
            }
          ],
          "hint": [
            "Create the list inside __init__, not in the class body.",
            "Use [] if songs is None else list(songs)."
          ],
          "why": "Separate containers prevent surprising cross-object updates. The shallow copy is enough for the strings in this task.",
          "optional": false
        },
        {
          "id": "team-list",
          "title": "Repair a team's shared members",
          "prompt": "Turn a shared mutable class attribute into instance state while keeping the shared sport label.",
          "requirements": [
            "Keep Team.sport equal to \"football\".",
            "Team(name) gets an independent members list.",
            "add_member(name) appends a member."
          ],
          "starter": "class Team:\n    sport = \"football\"\n    members = []\n\n    def __init__(self, name):\n        self.name = name\n\n    def add_member(self, name):\n        self.members.append(name)\n",
          "solution": "class Team:\n    sport = \"football\"\n\n    def __init__(self, name):\n        self.name = name\n        self.members = []\n\n    def add_member(self, name):\n        self.members.append(name)\n",
          "tests": [
            {
              "name": "Team member lists are independent",
              "code": "a = Team(\"A\")\nb = Team(\"B\")\na.add_member(\"Ari\")\nassert a.members == [\"Ari\"]\nassert b.members == []\n"
            },
            {
              "name": "The shared label stays on the class",
              "code": "assert Team.sport == \"football\"\n"
            }
          ],
          "hint": [
            "The shared string label can stay in the class body.",
            "Move the list creation into __init__ and assign it to self.members."
          ],
          "why": "Sharing an immutable label is useful. Sharing one growing members list across unrelated teams is a bug.",
          "optional": true
        }
      ],
      "questions": [
        {
          "stem": "Why is songs = [] in the class body often a bug?",
          "options": [
            "Lists cannot be attributes",
            "Instances can all find and mutate the same list",
            "The list is automatically copied",
            "Only strings are allowed in classes"
          ],
          "correct": 1,
          "explanation": "Class-level mutable values are shared unless an instance shadows them. Mutating that shared list affects other instances.",
          "code": ""
        },
        {
          "stem": "What does alias is original evaluate to?",
          "options": [
            "False",
            "True",
            "None",
            "The object name"
          ],
          "correct": 1,
          "explanation": "Assignment binds another name to the same object; it does not copy the instance.",
          "code": "original = Playlist(\"Study\")\nalias = original\n"
        },
        {
          "stem": "Why use songs=None instead of songs=[] in the initializer signature?",
          "options": [
            "None automatically becomes a list",
            "A list default is evaluated once and may be shared",
            "Python forbids default lists",
            "It makes the list private"
          ],
          "correct": 1,
          "explanation": "Create a fresh list inside the call when songs is None. A mutable default can otherwise be reused across calls.",
          "code": ""
        }
      ]
    },
    {
      "title": "Compose objects",
      "minutes": 15,
      "label": "BUILD WITH SMALL PARTS",
      "timing": [
        3,
        3,
        7,
        2
      ],
      "description": "Objects can contain other objects. Use composition when one thing has another thing: a cart has products, and a classroom has students.",
      "goals": [
        "Store and use objects inside another class.",
        "Delegate a calculation to contained objects.",
        "Choose composition for a has-a relationship."
      ],
      "concepts": [
        [
          "One object can hold references to others",
          "A cart's items can be a list of Product objects and quantities. Product owns the product data; Cart owns the collection and the total calculation. Each class has a smaller responsibility."
        ],
        [
          "Work through the public API",
          "Ask a contained object for its data or behavior through its attributes and methods. Calling product.cost(quantity) is delegation: Cart lets Product perform the product-level calculation."
        ],
        [
          "Choose the relationship deliberately",
          "A cart has products; it is not a kind of product. Composition models that relationship directly. Storing an object reference does not clone it, so later changes to the shared product may be visible through the cart. This course's cart uses current product prices."
        ]
      ],
      "examples": [
        {
          "title": "A line item delegates to its product",
          "code": "class Product:\n    def __init__(self, name, price_cents):\n        self.name = name\n        self.price_cents = price_cents\n\n    def cost(self, quantity):\n        return self.price_cents * quantity\n\nclass LineItem:\n    def __init__(self, product, quantity):\n        self.product = product\n        self.quantity = quantity\n\n    def subtotal(self):\n        return self.product.cost(self.quantity)\n\nitem = LineItem(Product(\"Notebook\", 250), 3)\nprint(item.product.name)\nprint(item.subtotal())\n",
          "output": "Notebook\n750",
          "notes": [
            "LineItem holds a Product reference.",
            "subtotal delegates the unit-price calculation to Product.cost."
          ]
        },
        {
          "title": "A collection of objects",
          "code": "class Student:\n    def __init__(self, name, score):\n        self.name = name\n        self.score = score\n\nclass Classroom:\n    def __init__(self):\n        self.students = []\n\n    def add(self, student):\n        self.students.append(student)\n\n    def names(self):\n        return [student.name for student in self.students]\n\nroom = Classroom()\nroom.add(Student(\"Ari\", 80))\nroom.add(Student(\"Bo\", 90))\nprint(room.names())\n",
          "output": "['Ari', 'Bo']",
          "notes": [
            "Classroom manages the collection; Student holds one student's data.",
            "This is a has-a relationship, so no inheritance is needed."
          ]
        }
      ],
      "practices": [
        {
          "id": "cart",
          "title": "Build a ShoppingCart",
          "prompt": "The Product model is supplied. Store products with quantities and calculate the current total in cents.",
          "requirements": [
            "ShoppingCart() starts empty.",
            "add(product, quantity=1) stores the product and quantity; quantity <= 0 raises ValueError before mutation.",
            "total() returns the sum of price_cents * quantity; an empty cart totals 0.",
            "Use each product's current price when total() is called."
          ],
          "starter": "class Product:\n    def __init__(self, name, price_cents):\n        self.name = name\n        self.price_cents = price_cents\n\nclass ShoppingCart:\n    def __init__(self):\n        self.items = []\n\n    def add(self, product, quantity=1):\n        pass\n\n    def total(self):\n        pass\n",
          "solution": "class Product:\n    def __init__(self, name, price_cents):\n        self.name = name\n        self.price_cents = price_cents\n\nclass ShoppingCart:\n    def __init__(self):\n        self.items = []\n\n    def add(self, product, quantity=1):\n        if quantity <= 0:\n            raise ValueError(\"Quantity must be positive\")\n        self.items.append((product, quantity))\n\n    def total(self):\n        return sum(product.price_cents * quantity\n                   for product, quantity in self.items)\n",
          "tests": [
            {
              "name": "Empty carts total zero",
              "code": "assert ShoppingCart().total() == 0\n"
            },
            {
              "name": "Quantities and multiple products are included",
              "code": "c = ShoppingCart()\nc.add(Product(\"Pen\", 150), 2)\nc.add(Product(\"Book\", 500))\nassert c.total() == 800\n"
            },
            {
              "name": "Different carts have separate collections",
              "code": "a = ShoppingCart()\nb = ShoppingCart()\na.add(Product(\"Pen\", 150))\nassert b.total() == 0\n"
            },
            {
              "name": "Invalid additions preserve the cart",
              "code": "c = ShoppingCart()\np = Product(\"Pen\", 150)\nc.add(p)\nfor qty in [0, -2]:\n    try:\n        c.add(p, qty)\n    except ValueError:\n        pass\n    else:\n        raise AssertionError(\"Expected ValueError\")\nassert c.total() == 150\n"
            },
            {
              "name": "Totals use the current product price",
              "code": "c = ShoppingCart()\np = Product(\"Pen\", 150)\nc.add(p, 2)\np.price_cents = 200\nassert c.total() == 400\n"
            }
          ],
          "hint": [
            "A list of (product, quantity) tuples is one suitable representation.",
            "Loop through the pairs, multiplying each product.price_cents by its quantity, or use sum with a generator."
          ],
          "why": "The cart composes Product instances. The exercise explicitly uses live product references; a checkout system might instead require a snapshot price.",
          "optional": false
        },
        {
          "id": "classroom",
          "title": "A classroom average",
          "prompt": "Compose Student objects and answer an aggregate question.",
          "requirements": [
            "Student(name, score) stores both values.",
            "Classroom() starts with an empty students list; add(student) stores a Student.",
            "average() returns None when empty; otherwise return the mean score."
          ],
          "starter": "class Student:\n    def __init__(self, name, score):\n        self.name = name\n        self.score = score\n\nclass Classroom:\n    # Add __init__, add, and average.\n    pass\n",
          "solution": "class Student:\n    def __init__(self, name, score):\n        self.name = name\n        self.score = score\n\nclass Classroom:\n    def __init__(self):\n        self.students = []\n\n    def add(self, student):\n        self.students.append(student)\n\n    def average(self):\n        if not self.students:\n            return None\n        return sum(s.score for s in self.students) / len(self.students)\n",
          "tests": [
            {
              "name": "An empty classroom has no average",
              "code": "assert Classroom().average() is None\n"
            },
            {
              "name": "Scores are averaged correctly",
              "code": "c = Classroom()\nc.add(Student(\"Ari\", 80))\nc.add(Student(\"Bo\", 90))\nassert c.average() == 85\n"
            }
          ],
          "hint": [
            "Handle the empty list before dividing.",
            "Read each contained student's score, then divide the sum by the number of students."
          ],
          "why": "A container object can calculate across its contained objects while preserving their individual responsibilities.",
          "optional": true
        }
      ],
      "questions": [
        {
          "stem": "A ShoppingCart contains Product objects. Which relationship fits?",
          "options": [
            "ShoppingCart is a Product",
            "ShoppingCart has Products",
            "Product inherits from every cart",
            "The objects must be copied"
          ],
          "correct": 1,
          "explanation": "Composition models a has-a relationship. A cart is not a specialized product.",
          "code": ""
        },
        {
          "stem": "Why might changing product.price_cents change this cart's total?",
          "options": [
            "Numbers are always shared class variables",
            "The cart holds a reference and reads the current price",
            "Python reruns __init__",
            "total() must be a class method"
          ],
          "correct": 1,
          "explanation": "The cart stores the Product object, not a frozen copy of its attributes. The stated API uses its current price.",
          "code": ""
        },
        {
          "stem": "What is delegation in the LineItem example?",
          "options": [
            "Deleting an object",
            "Calling Product.cost() to perform its part of the work",
            "Making all attributes private",
            "Replacing every method with a function"
          ],
          "correct": 1,
          "explanation": "The containing object relies on another object's behavior instead of duplicating its calculation.",
          "code": ""
        }
      ]
    },
    {
      "title": "Inherit & specialize",
      "minutes": 15,
      "label": "ONE INTERFACE, DIFFERENT BEHAVIOR",
      "timing": [
        3,
        3,
        7,
        2
      ],
      "description": "Inheritance fits a genuine is-a relationship. A subclass can reuse initialization and replace selected methods. Keep this first step to single inheritance.",
      "goals": [
        "Define a subclass and override a method.",
        "Use super().__init__ to initialize base state.",
        "Explain polymorphism and implement __str__."
      ],
      "concepts": [
        [
          "A subclass specializes a base class",
          "class Dog(Animal) makes Dog a subclass. A Dog is an Animal, so isinstance(dog, Animal) is true. If a method is missing on Dog, Python looks in Animal. Do not use inheritance merely to store another object."
        ],
        [
          "Reuse setup, override behavior",
          "When a subclass defines its own __init__, the base initializer is not automatically called. In our single-inheritance examples, super().__init__(name) invokes the inherited setup before the subclass stores its own attributes."
        ],
        [
          "Same call, different behavior",
          "Calling speak() on different objects can produce different results. This is polymorphism. Python can use this pattern even without a common base class. __str__ customizes str(obj) and print(obj); it must return a string."
        ]
      ],
      "examples": [
        {
          "title": "Override an inherited method",
          "code": "class Animal:\n    def __init__(self, name):\n        self.name = name\n\n    def speak(self):\n        return \"...\"\n\nclass Dog(Animal):\n    def speak(self):\n        return f\"{self.name} says woof\"\n\nclass Cat(Animal):\n    def speak(self):\n        return f\"{self.name} says meow\"\n\nfor animal in [Dog(\"Pixel\"), Cat(\"Miso\")]:\n    print(animal.speak())\n",
          "output": "Pixel says woof\nMiso says meow",
          "notes": [
            "Both subclasses inherit Animal.__init__.",
            "The same speak() call dispatches to different implementations."
          ]
        },
        {
          "title": "Extend initialization and customize text",
          "code": "class Animal:\n    def __init__(self, name):\n        self.name = name\n\nclass Dog(Animal):\n    def __init__(self, name, breed):\n        super().__init__(name)\n        self.breed = breed\n\n    def __str__(self):\n        return f\"{self.name} ({self.breed})\"\n\ndog = Dog(\"Pixel\", \"terrier\")\nprint(dog)\nprint(isinstance(dog, Animal))\n",
          "output": "Pixel (terrier)\nTrue",
          "notes": [
            "The subclass explicitly calls base initialization.",
            "__str__ returns the text that print uses."
          ]
        }
      ],
      "practices": [
        {
          "id": "dog",
          "title": "Specialize an Animal",
          "prompt": "The base class is supplied. Add Dog with extra data and behavior.",
          "requirements": [
            "Dog inherits from Animal.",
            "Dog(name, breed) uses super().__init__(name), then stores breed.",
            "speak() returns \"<name> says woof\".",
            "__str__() returns \"<name> (<breed>)\"."
          ],
          "starter": "class Animal:\n    def __init__(self, name):\n        self.name = name\n\n    def speak(self):\n        return \"...\"\n\nclass Dog(Animal):\n    # Add initializer, speak, and __str__.\n    pass\n",
          "solution": "class Animal:\n    def __init__(self, name):\n        self.name = name\n\n    def speak(self):\n        return \"...\"\n\nclass Dog(Animal):\n    def __init__(self, name, breed):\n        super().__init__(name)\n        self.breed = breed\n\n    def speak(self):\n        return f\"{self.name} says woof\"\n\n    def __str__(self):\n        return f\"{self.name} ({self.breed})\"\n",
          "tests": [
            {
              "name": "Dog is an Animal with both attributes",
              "code": "d = Dog(\"Pixel\", \"terrier\")\nassert isinstance(d, Animal)\nassert (d.name, d.breed) == (\"Pixel\", \"terrier\")\n"
            },
            {
              "name": "The speech method is overridden",
              "code": "assert Dog(\"Miso\", \"poodle\").speak() == \"Miso says woof\"\n"
            },
            {
              "name": "String conversion uses __str__",
              "code": "assert str(Dog(\"Pixel\", \"terrier\")) == \"Pixel (terrier)\"\n"
            },
            {
              "name": "The base behavior is unchanged",
              "code": "assert Animal(\"A\").speak() == \"...\"\n"
            },
            {
              "name": "Subclass initialization calls base setup",
              "code": "calls = []\noriginal_init = Animal.__init__\ndef recording_init(self, name):\n    calls.append(name)\n    original_init(self, name)\nAnimal.__init__ = recording_init\ntry:\n    Dog(\"Check\", \"mix\")\nfinally:\n    Animal.__init__ = original_init\nassert calls == [\"Check\"]\n"
            }
          ],
          "hint": [
            "Start with class Dog(Animal):.",
            "Call super().__init__(name), then set self.breed. Both text methods need return, not print."
          ],
          "why": "The subclass keeps Animal's setup while replacing the behavior that differs. __str__ integrates the object with Python's printing API.",
          "optional": false
        },
        {
          "id": "shapes",
          "title": "One call for different shapes",
          "prompt": "Use the same area() interface across two simple classes.",
          "requirements": [
            "Rectangle(width, height).area() returns width * height.",
            "Square(side).area() returns side * side.",
            "The two classes do not need a common base class."
          ],
          "starter": "class Rectangle:\n    pass\n\nclass Square:\n    pass\n\n# Try summing shape.area() for different shapes.\n",
          "solution": "class Rectangle:\n    def __init__(self, width, height):\n        self.width = width\n        self.height = height\n\n    def area(self):\n        return self.width * self.height\n\nclass Square:\n    def __init__(self, side):\n        self.side = side\n\n    def area(self):\n        return self.side * self.side\n",
          "tests": [
            {
              "name": "Both shapes implement area()",
              "code": "assert Rectangle(3, 4).area() == 12\nassert Square(5).area() == 25\n"
            },
            {
              "name": "One loop works with both types",
              "code": "shapes = [Rectangle(3, 4), Square(5)]\nassert sum(shape.area() for shape in shapes) == 37\n"
            }
          ],
          "hint": [
            "The shared method name is enough for the loop.",
            "Each class stores only the dimensions it needs."
          ],
          "why": "Python supports polymorphism through a compatible interface; inheritance is one way, but not a requirement.",
          "optional": true
        }
      ],
      "questions": [
        {
          "stem": "A subclass defines its own __init__. How does it reuse the base initializer here?",
          "options": [
            "The base initializer always runs automatically",
            "super().__init__(name)",
            "return Animal",
            "self = Animal(name)"
          ],
          "correct": 1,
          "explanation": "With its own initializer, the subclass explicitly invokes inherited setup through super() in this example.",
          "code": ""
        },
        {
          "stem": "What must __str__ return?",
          "options": [
            "A string",
            "A printed message and nothing else",
            "The instance itself",
            "A list"
          ],
          "correct": 0,
          "explanation": "str(obj) and print(obj) expect __str__ to return text. Printing inside it would not satisfy that contract.",
          "code": ""
        },
        {
          "stem": "Does Python require a shared base class for objects to support the same area() call?",
          "options": [
            "Yes, always",
            "Only for lists",
            "No, compatible methods can be enough",
            "Only if self is renamed"
          ],
          "correct": 2,
          "explanation": "Python commonly uses compatible interfaces, often called duck typing. The caller needs the required behavior.",
          "code": ""
        }
      ]
    },
    {
      "title": "Build a lending library",
      "minutes": 20,
      "label": "PUT IT ALL TOGETHER",
      "timing": [
        2,
        2,
        14,
        2
      ],
      "description": "Build a small system with clear responsibilities: Book holds one book's state; Library manages books and controls borrowing. This capstone is part of the two-hour core course.",
      "goals": [
        "Combine initialization, methods, validation, and composition.",
        "Implement a written API and verify edge cases.",
        "Explain a design decision in your own words."
      ],
      "concepts": [
        [
          "Plan before typing · 2 minutes",
          "Use a dictionary keyed by title to hold Book objects. For this teaching model, titles are unique and there is one copy of each book. Library has books; it is not a subclass of Book. Keep the supplied Book class."
        ],
        [
          "Build in stages · 14 minutes",
          "Spend about 4 minutes on __init__, add_book, and available_titles; 6 minutes on borrow and return_book; then 4 minutes running checks and fixing edge cases. Read the exact contract below before coding."
        ],
        [
          "Review and explain · 2 minutes",
          "Explain why two libraries need separate dictionaries, why borrowing twice must fail, and why composition fits better than inheritance. Run both the ordinary flow and the rejected-operation cases. The remaining 2 minutes are for reading the reference examples."
        ]
      ],
      "examples": [
        {
          "title": "The supplied Book model",
          "code": "class Book:\n    def __init__(self, title, author):\n        self.title = title\n        self.author = author\n        self.borrowed = False\n\n    def __str__(self):\n        return f\"{self.title} by {self.author}\"\n\nbook = Book(\"The Moon Map\", \"Ari\")\nprint(book)\nprint(book.borrowed)\n",
          "output": "The Moon Map by Ari\nFalse",
          "notes": [
            "Book holds title, author, and borrowed state.",
            "Library will coordinate the state changes."
          ]
        },
        {
          "title": "A smaller composition pattern to borrow",
          "code": "class Label:\n    def __init__(self, text):\n        self.text = text\n\nclass LabelBox:\n    def __init__(self):\n        self.labels = {}\n\n    def add(self, label):\n        if label.text in self.labels:\n            raise ValueError(\"Duplicate label\")\n        self.labels[label.text] = label\n\n    def names(self):\n        return sorted(self.labels)\n\nbox = LabelBox()\nbox.add(Label(\"Zebra\"))\nbox.add(Label(\"Atlas\"))\nprint(box.names())\n",
          "output": "['Atlas', 'Zebra']",
          "notes": [
            "A dictionary provides fast lookup by a unique key.",
            "The duplicate guard runs before storing anything."
          ]
        }
      ],
      "practices": [
        {
          "id": "library",
          "title": "Capstone: a lending library",
          "prompt": "Complete Library while keeping the supplied Book model. Assume title and author are strings and each book belongs to just one library in this exercise.",
          "requirements": [
            "Library() starts with a separate books dictionary.",
            "add_book(book) stores the object by title; duplicate titles raise ValueError without replacement.",
            "borrow(title) raises KeyError for an unknown title and ValueError if already borrowed; otherwise set borrowed to True and return the same Book.",
            "return_book(title) raises KeyError if unknown and ValueError if not borrowed; otherwise set borrowed to False and return None.",
            "available_titles() returns a sorted list of titles that are not borrowed."
          ],
          "starter": "class Book:\n    def __init__(self, title, author):\n        self.title = title\n        self.author = author\n        self.borrowed = False\n\n    def __str__(self):\n        return f\"{self.title} by {self.author}\"\n\nclass Library:\n    def __init__(self):\n        # Create the collection.\n        pass\n\n    def add_book(self, book):\n        pass\n\n    def borrow(self, title):\n        pass\n\n    def return_book(self, title):\n        pass\n\n    def available_titles(self):\n        pass\n\n# Try: add a Book, borrow it, inspect available_titles(), return it.\n",
          "solution": "class Book:\n    def __init__(self, title, author):\n        self.title = title\n        self.author = author\n        self.borrowed = False\n\n    def __str__(self):\n        return f\"{self.title} by {self.author}\"\n\nclass Library:\n    def __init__(self):\n        self.books = {}\n\n    def add_book(self, book):\n        if book.title in self.books:\n            raise ValueError(\"Duplicate title\")\n        self.books[book.title] = book\n\n    def borrow(self, title):\n        book = self.books[title]\n        if book.borrowed:\n            raise ValueError(\"Already borrowed\")\n        book.borrowed = True\n        return book\n\n    def return_book(self, title):\n        book = self.books[title]\n        if not book.borrowed:\n            raise ValueError(\"Not borrowed\")\n        book.borrowed = False\n\n    def available_titles(self):\n        return sorted(title for title, book in self.books.items()\n                      if not book.borrowed)\n",
          "tests": [
            {
              "name": "A new library has no available books",
              "code": "assert Library().available_titles() == []\n"
            },
            {
              "name": "Adding books produces sorted titles",
              "code": "lib = Library()\nlib.add_book(Book(\"Zebra\", \"Bo\"))\nlib.add_book(Book(\"Atlas\", \"Ari\"))\nassert lib.available_titles() == [\"Atlas\", \"Zebra\"]\n"
            },
            {
              "name": "Borrowing returns the same book and hides it",
              "code": "lib = Library()\nbook = Book(\"Atlas\", \"Ari\")\nlib.add_book(book)\nassert lib.borrow(\"Atlas\") is book\nassert book.borrowed is True\nassert lib.available_titles() == []\n"
            },
            {
              "name": "Returning a book restores availability",
              "code": "lib = Library()\nlib.add_book(Book(\"Atlas\", \"Ari\"))\nlib.borrow(\"Atlas\")\nassert lib.return_book(\"Atlas\") is None\nassert lib.available_titles() == [\"Atlas\"]\n"
            },
            {
              "name": "Duplicate titles are rejected without replacement",
              "code": "lib = Library()\nfirst = Book(\"Atlas\", \"Ari\")\nlib.add_book(first)\ntry:\n    lib.add_book(Book(\"Atlas\", \"Bo\"))\nexcept ValueError:\n    pass\nelse:\n    raise AssertionError(\"Expected ValueError\")\nassert lib.borrow(\"Atlas\") is first\n"
            },
            {
              "name": "Borrowing twice is rejected without changing state",
              "code": "lib = Library()\nbook = Book(\"Atlas\", \"Ari\")\nlib.add_book(book)\nlib.borrow(\"Atlas\")\ntry:\n    lib.borrow(\"Atlas\")\nexcept ValueError:\n    pass\nelse:\n    raise AssertionError(\"Expected ValueError\")\nassert book.borrowed is True\n"
            },
            {
              "name": "Unknown titles raise KeyError",
              "code": "lib = Library()\nfor action in [lib.borrow, lib.return_book]:\n    try:\n        action(\"Missing\")\n    except KeyError:\n        pass\n    else:\n        raise AssertionError(\"Expected KeyError\")\n"
            },
            {
              "name": "Returning an available book is rejected",
              "code": "lib = Library()\nbook = Book(\"Atlas\", \"Ari\")\nlib.add_book(book)\ntry:\n    lib.return_book(\"Atlas\")\nexcept ValueError:\n    pass\nelse:\n    raise AssertionError(\"Expected ValueError\")\nassert book.borrowed is False\n"
            },
            {
              "name": "Each library owns a separate collection",
              "code": "a = Library()\nb = Library()\na.add_book(Book(\"Atlas\", \"Ari\"))\nassert b.available_titles() == []\n"
            }
          ],
          "hint": [
            "Start with self.books = {}. Store self.books[book.title] = book after checking the title is new.",
            "A dictionary lookup self.books[title] already raises KeyError for an unknown title. Validate borrowed state before updating it.",
            "Build the available list from self.books.items(), filter on not book.borrowed, and sort the titles."
          ],
          "why": "The model combines independent instance state, a public API, validation before mutation, and composition. Keeping the original Book reference lets callers observe its borrowed flag.",
          "optional": false
        },
        {
          "id": "library-search",
          "title": "Extend the library with search",
          "prompt": "After the capstone works, add a query without changing borrowing behavior.",
          "requirements": [
            "Keep all core Library behavior.",
            "find_by_author(author) returns a sorted list of matching titles, including borrowed books.",
            "A missing author returns an empty list; matching is case-sensitive."
          ],
          "starter": "class Book:\n    def __init__(self, title, author):\n        self.title = title\n        self.author = author\n        self.borrowed = False\n\n    def __str__(self):\n        return f\"{self.title} by {self.author}\"\n\nclass Library:\n    def __init__(self):\n        self.books = {}\n\n    def add_book(self, book):\n        if book.title in self.books:\n            raise ValueError(\"Duplicate title\")\n        self.books[book.title] = book\n\n    def borrow(self, title):\n        book = self.books[title]\n        if book.borrowed:\n            raise ValueError(\"Already borrowed\")\n        book.borrowed = True\n        return book\n\n    def return_book(self, title):\n        book = self.books[title]\n        if not book.borrowed:\n            raise ValueError(\"Not borrowed\")\n        book.borrowed = False\n\n    def available_titles(self):\n        return sorted(title for title, book in self.books.items()\n                      if not book.borrowed)\n\n    def find_by_author(self, author):\n        # Add the query without changing any borrowed flag.\n        pass\n",
          "solution": "class Book:\n    def __init__(self, title, author):\n        self.title = title\n        self.author = author\n        self.borrowed = False\n\n    def __str__(self):\n        return f\"{self.title} by {self.author}\"\n\nclass Library:\n    def __init__(self):\n        self.books = {}\n\n    def add_book(self, book):\n        if book.title in self.books:\n            raise ValueError(\"Duplicate title\")\n        self.books[book.title] = book\n\n    def borrow(self, title):\n        book = self.books[title]\n        if book.borrowed:\n            raise ValueError(\"Already borrowed\")\n        book.borrowed = True\n        return book\n\n    def return_book(self, title):\n        book = self.books[title]\n        if not book.borrowed:\n            raise ValueError(\"Not borrowed\")\n        book.borrowed = False\n\n    def available_titles(self):\n        return sorted(title for title, book in self.books.items()\n                      if not book.borrowed)\n\n    def find_by_author(self, author):\n        return sorted(title for title, book in self.books.items()\n                      if book.author == author)\n",
          "tests": [
            {
              "name": "Search includes all matching books in sorted order",
              "code": "lib = Library()\nlib.add_book(Book(\"Zebra\", \"Ari\"))\nlib.add_book(Book(\"Atlas\", \"Ari\"))\nlib.add_book(Book(\"Moon\", \"Bo\"))\nlib.borrow(\"Atlas\")\nassert lib.find_by_author(\"Ari\") == [\"Atlas\", \"Zebra\"]\n"
            },
            {
              "name": "Search is case-sensitive and handles no matches",
              "code": "lib = Library()\nlib.add_book(Book(\"Atlas\", \"Ari\"))\nassert lib.find_by_author(\"ari\") == []\nassert lib.find_by_author(\"Unknown\") == []\n"
            },
            {
              "name": "Search does not change borrowed state",
              "code": "lib = Library()\nbook = Book(\"Atlas\", \"Ari\")\nlib.add_book(book)\nlib.borrow(\"Atlas\")\nlib.find_by_author(\"Ari\")\nassert book.borrowed is True\n"
            }
          ],
          "hint": [
            "This is a query: do not assign to borrowed.",
            "Filter books by book.author, collect their titles, then use sorted()."
          ],
          "why": "Extending a clear API can be a small change. Search uses existing state and preserves the object's rules.",
          "optional": true
        }
      ],
      "questions": [
        {
          "stem": "Why should Library use composition with Book?",
          "options": [
            "A library is a specialized book",
            "A library has books and manages their collection",
            "Inheritance cannot contain dictionaries",
            "Books must all share one borrowed flag"
          ],
          "correct": 1,
          "explanation": "The has-a relationship matches the responsibilities. Library manages many Book instances.",
          "code": ""
        },
        {
          "stem": "Which edge case checks that a rejected operation preserves state?",
          "options": [
            "Borrow a book only once",
            "Print the class name",
            "Borrow twice, catch ValueError, then confirm borrowed is still True",
            "Create a new string"
          ],
          "correct": 2,
          "explanation": "The test checks both rejection and the invariant after failure.",
          "code": ""
        },
        {
          "stem": "Where should the books dictionary be created for independent libraries?",
          "options": [
            "As books = {} in the class body",
            "As self.books = {} inside __init__",
            "As one global variable",
            "Inside every call to available_titles"
          ],
          "correct": 1,
          "explanation": "Each initializer call creates a new collection for that instance. A class or global dictionary would be shared.",
          "code": ""
        }
      ]
    }
  ]
};
