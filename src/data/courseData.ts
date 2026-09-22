import { Chapter, AwardMilestone } from "../types";

export const MILESTONES: AwardMilestone[] = [
  {
    id: "milestone-foundation",
    level: "foundation",
    requiredCredits: 300,
    title: "Foundation Level Mastery",
    badgeName: "Python Apprentice",
    badgeIcon: "Award",
    certificateTitle: "Python Foundation & Scripting Specialist",
    description: "Awarded for mastering fundamental Python syntax, dynamic typing, control flow, loops, and function architecture.",
    skillsCertified: [
      "Python Execution & Dynamic Typing",
      "Control Flow & Conditional Logic",
      "Algorithmic Loops & Sequence Processing",
      "Functional Decomposition & Parameter Handling",
    ],
  },
  {
    id: "milestone-medium",
    level: "medium",
    requiredCredits: 750,
    title: "Medium Level Mastery (OOP)",
    badgeName: "OOP Master Craftsman",
    badgeIcon: "ShieldCheck",
    certificateTitle: "Certified Object-Oriented Python Developer",
    description: "Awarded for deep mastery of Object-Oriented Programming (OOPS): Classes, Encapsulation, Inheritance, Polymorphism, Abstraction, and Dunder Magic Methods.",
    skillsCertified: [
      "Classes, Instances & Constructor Architecture",
      "Encapsulation & Managed Attributes (@property)",
      "Inheritance Hierarchies & super()",
      "Polymorphism & Duck Typing Patterns",
      "Abstract Base Classes (abc.ABC)",
      "Dunder Methods & Operator Overloading",
      "Pythonic Comprehensions & Exception Handling",
    ],
  },
  {
    id: "milestone-advanced",
    level: "advanced",
    requiredCredits: 1350,
    title: "Advanced Level Mastery",
    badgeName: "Python Systems Architect",
    badgeIcon: "Crown",
    certificateTitle: "Certified Master Python Software Architect",
    description: "Awarded for advanced software engineering: Decorators, Generator streaming, Context Managers, Metaclasses, Type Hints, and Asynchronous Concurrency.",
    skillsCertified: [
      "Metaprogramming & Higher-Order Decorators",
      "Streaming Generators & Custom Iterator Protocols",
      "Deterministic Resource Context Managers",
      "Metaclass Interception & Dynamic Class Factory",
      "Static Type Signatures & Protocol Subtyping",
      "Asyncio Coroutines & Concurrent Event Loops",
    ],
  },
];

export const CHAPTERS: Chapter[] = [
  // ==========================================
  // LEVEL 1: FOUNDATION (WHAT IS PYTHON)
  // ==========================================
  {
    id: "ch-1-what-is-python",
    chapterNumber: 1,
    level: "foundation",
    title: "What is Python & The Interactive World",
    shortDesc: "Discover what makes Python special: interpreted execution, dynamic typing, and readable syntax.",
    estimatedMinutes: 15,
    tags: ["Basics", "Interpreted", "Print", "Variables"],
    content: {
      overview:
        "Python is a high-level, interpreted programming language created by Guido van Rossum in 1991. Known for its human-readable syntax and 'batteries-included' philosophy, Python powers everything from web applications to machine learning, robotics, and scientific computing.",
      childAnalogy:
        "Imagine computers speak a secret robot language of 0s and 1s. Python is like a magical friendly translator! Instead of typing confusing machine codes, you write instructions almost like regular English, and Python instantly tells the computer what to do.",
      studentConcept:
        "Python is dynamically typed and garbage-collected. Unlike compiled languages (C++, Rust) that require an explicit compilation step into machine code, Python source code is parsed into bytecode (.pyc) and executed on the Python Virtual Machine (PVM).",
      proDeepDive:
        "CPython is the reference implementation written in C. It uses a Global Interpreter Lock (GIL) for memory thread safety and employs reference counting augmented by a cyclic generational garbage collector (gc module). Everything in Python is a first-class PyObject pointer in heap memory.",
      codeExamples: [
        {
          title: "Your First Python Script",
          code: `# Welcome to Python!
greeting = "Hello, Python Explorer!"
version = 3.12
is_fun = True

print(greeting)
print(f"Running on modern Python {version}. Fun status: {is_fun}")
print(f"Data type of greeting is: {type(greeting).__name__}")`,
          explanation: "In Python, variables do not require explicit type declarations. The interpreter deduces the type at runtime.",
        },
      ],
    },
    exercise: {
      id: "ex-1",
      title: "Create the Academy Welcome Function",
      instructions:
        "Define a function named `format_welcome(student_name, course_level)` that takes a student name and their level, and returns a formatted string: `'Welcome [student_name] to Python Academy [course_level] Level!'`. For example, calling `format_welcome('Alex', 'Foundation')` should return `'Welcome Alex to Python Academy Foundation Level!'`.",
      starterCode: `def format_welcome(student_name, course_level):
    # Your code here
    pass`,
      solutionCode: `def format_welcome(student_name, course_level):
    return f"Welcome {student_name} to Python Academy {course_level} Level!"`,
      hints: [
        "Use Python's f-strings: f'Welcome {student_name} to Python Academy {course_level} Level!'",
        "Make sure the spelling and exclamation mark match the instructions exactly.",
      ],
      testCases: [
        {
          id: "t1",
          description: "Returns greeting for Alex in Foundation",
          testCode: "format_welcome('Alex', 'Foundation')",
          expectedOutput: "Welcome Alex to Python Academy Foundation Level!",
        },
        {
          id: "t2",
          description: "Returns greeting for Maya in Advanced",
          testCode: "format_welcome('Maya', 'Advanced')",
          expectedOutput: "Welcome Maya to Python Academy Advanced Level!",
        },
      ],
      creditReward: 100,
      targetConcepts: ["Functions", "F-Strings", "Return Values"],
    },
  },

  {
    id: "ch-2-control-flow",
    chapterNumber: 2,
    level: "foundation",
    title: "Control Flow & Decision Making",
    shortDesc: "Guide your programs with if, elif, and else logic blocks and truthiness.",
    estimatedMinutes: 20,
    tags: ["Conditions", "Booleans", "Logic"],
    content: {
      overview:
        "Programs need to make decisions based on changing conditions. Python uses `if`, `elif`, and `else` statements alongside indentation (typically 4 spaces) rather than curly braces to define scope blocks.",
      childAnalogy:
        "Think of a traffic light! If the light is green, your toy car zooms forward. Elif it's yellow, it slows down. Else (it's red), it stops completely. That's exactly how `if-elif-else` works in Python!",
      studentConcept:
        "Python evaluates boolean truthiness. Values like `0`, `None`, empty sequences `[]`, `''`, `{}`, and `()` evaluate to `False`. All other values evaluate to `True`. Comparison operators include `==`, `!=`, `<`, `>`, `<=`, `>=`, and boolean keywords `and`, `or`, `not`.",
      proDeepDive:
        "Python evaluates `and` / `or` using short-circuit evaluation, returning the actual operand rather than a strict boolean (e.g. `None or 'default'` yields `'default'`). Since Python 3.10, structural pattern matching (`match-case`) is also available.",
      codeExamples: [
        {
          title: "Conditional Rating Example",
          code: `def get_badge(score):
    if score >= 90:
        return "Gold Star"
    elif score >= 75:
        return "Silver Star"
    elif score >= 50:
        return "Bronze Star"
    else:
        return "Practice Token"

print(f"Score 82 gets: {get_badge(82)}")`,
          explanation: "Statements are checked top-to-bottom. As soon as a condition evaluates to True, its block executes.",
        },
      ],
    },
    exercise: {
      id: "ex-2",
      title: "Evaluate Student Performance Tier",
      instructions:
        "Write a function `grade_performance(score)` that takes an integer score (0 to 100) and returns:\n- `'Mastery'` if score >= 90\n- `'Proficient'` if score >= 70 and < 90\n- `'Developing'` if score >= 50 and < 70\n- `'Needs Practice'` if score < 50",
      starterCode: `def grade_performance(score):
    # Return 'Mastery', 'Proficient', 'Developing', or 'Needs Practice'
    pass`,
      solutionCode: `def grade_performance(score):
    if score >= 90:
        return "Mastery"
    elif score >= 70:
        return "Proficient"
    elif score >= 50:
        return "Developing"
    else:
        return "Needs Practice"`,
      hints: [
        "Check conditions in descending order (>= 90 first, then >= 70, etc.).",
        "Make sure string capitalizations match the requirements.",
      ],
      testCases: [
        {
          id: "t1",
          description: "Scores 95 returns Mastery",
          testCode: "grade_performance(95)",
          expectedOutput: "Mastery",
        },
        {
          id: "t2",
          description: "Score 74 returns Proficient",
          testCode: "grade_performance(74)",
          expectedOutput: "Proficient",
        },
        {
          id: "t3",
          description: "Score 42 returns Needs Practice",
          testCode: "grade_performance(42)",
          expectedOutput: "Needs Practice",
        },
      ],
      creditReward: 100,
      targetConcepts: ["Conditionals", "elif", "Comparisons"],
    },
  },

  {
    id: "ch-3-loops-iteration",
    chapterNumber: 3,
    level: "foundation",
    title: "Loops & Sequence Iteration",
    shortDesc: "Automate repetitive tasks with for-in loops, while loops, and range generator.",
    estimatedMinutes: 20,
    tags: ["Loops", "Range", "Iteration"],
    content: {
      overview:
        "Computers excel at repeating operations millions of times without fatigue. Python provides two primary loop constructs: `for` loops (for iterating over iterables like lists, strings, and ranges) and `while` loops (repeating as long as a condition holds true).",
      childAnalogy:
        "Imagine eating a bag of delicious star cookies. A for-loop is like: 'For every cookie in my bag, eat it with a smile!' You don't have to count manually; Python visits each one automatically until the bag is empty!",
      studentConcept:
        "The `range(start, stop, step)` function generates an arithmetic progression in lazy fashion. The `break` keyword terminates the innermost loop, while `continue` skips the remainder of the current iteration. Python also uniquely supports an `else` block on loops, which runs only if the loop was not broken.",
      proDeepDive:
        "Python's `for` statement leverages the iterator protocol behind the scenes: calling `iter(obj)` to obtain an iterator, then repeatedly invoking `next(it)` until `StopIteration` is caught. This makes Python's loops clean, uniform, and memory-friendly.",
      codeExamples: [
        {
          title: "Iterating Sequences",
          code: `fruits = ["apple", "banana", "cherry"]
for index, fruit in enumerate(fruits, start=1):
    print(f"Fruit #{index}: {fruit.capitalize()}")

# While loop with counter
count = 3
while count > 0:
    print(f"Countdown: {count}")
    count -= 1
print("Blast off!")`,
          explanation: "enumerate() provides both index and item simultaneously, avoiding manual index counter tracking.",
        },
      ],
    },
    exercise: {
      id: "ex-3",
      title: "Calculate Filtered Sum",
      instructions:
        "Create a function `sum_even_squares(numbers)` that takes a list of integers, finds only the even numbers, squares each of them, and returns the total sum of those squares. If no even numbers exist, return `0`.\nExample: `sum_even_squares([1, 2, 3, 4])` -> 2^2 + 4^2 = 4 + 16 = `20`.",
      starterCode: `def sum_even_squares(numbers):
    # Iterate through numbers, filter evens, square them, and return total
    pass`,
      solutionCode: `def sum_even_squares(numbers):
    total = 0
    for num in numbers:
        if num % 2 == 0:
            total += num * num
    return total`,
      hints: [
        "A number `n` is even if `n % 2 == 0`.",
        "Accumulate `num * num` or `num ** 2` into a running total initialized to 0.",
      ],
      testCases: [
        {
          id: "t1",
          description: "Calculates sum for [1, 2, 3, 4]",
          testCode: "sum_even_squares([1, 2, 3, 4])",
          expectedOutput: "20",
        },
        {
          id: "t2",
          description: "Handles list with no evens [1, 3, 5]",
          testCode: "sum_even_squares([1, 3, 5])",
          expectedOutput: "0",
        },
        {
          id: "t3",
          description: "Handles empty list []",
          testCode: "sum_even_squares([])",
          expectedOutput: "0",
        },
      ],
      creditReward: 100,
      targetConcepts: ["For Loops", "Accumulators", "Modulo"],
    },
  },

  {
    id: "ch-4-functions-data-structures",
    chapterNumber: 4,
    level: "foundation",
    title: "Data Structures & Flexible Functions",
    shortDesc: "Master lists, dictionaries, tuples, and dynamic arguments (*args, **kwargs).",
    estimatedMinutes: 25,
    tags: ["Lists", "Dicts", "*args", "**kwargs"],
    content: {
      overview:
        "Data structures organize information. Lists (`[]`) are mutable ordered sequences, Tuples (`()`) are immutable, Sets (`{}`) store unique elements, and Dictionaries (`{'key': 'val'}`) map keys to values with O(1) average lookup time.",
      childAnalogy:
        "A list is like a toy train where cars are in line: car 0, car 1, car 2. A dictionary is like a labeled treasure chest: you stick a label named 'gold' on one box, and whenever you ask for 'gold', Python hands you the coins inside instantly!",
      studentConcept:
        "Function parameters can be positional or keyword-based. Using `*args` collects arbitrary positional arguments into a tuple, while `**kwargs` gathers arbitrary keyword arguments into a dictionary.",
      proDeepDive:
        "Python dicts are ordered by insertion order since 3.7 using a compact hash table design with two arrays (dense array of key-hash-value tuples and sparse indices array). Beware mutable default arguments: `def fn(a=[])` shares a single list instance across invocations!",
      codeExamples: [
        {
          title: "Dictionaries & Flexible Arguments",
          code: `def build_profile(username, *skills, **metadata):
    return {
        "user": username,
        "skills_count": len(skills),
        "skills": list(skills),
        "extra_info": metadata
    }

user = build_profile("coder99", "Python", "Algorithms", role="Student", level="Foundations")
print(user)`,
          explanation: "Positional args after username are gathered into `skills`, and keyword pairs become `metadata`.",
        },
      ],
    },
    exercise: {
      id: "ex-4",
      title: "Build an Inventory Item Analyzer",
      instructions:
        "Write a function `analyze_inventory(items_dict)` that receives a dictionary of `{item_name: quantity}`.\nReturn a summary dictionary with:\n- `'total_items'`: total sum of all quantities\n- `'out_of_stock'`: list of names of items with quantity == 0 (sorted alphabetically)\n- `'most_stocked'`: name of the item with the highest quantity (if tied, any is fine; return `None` if dict is empty).",
      starterCode: `def analyze_inventory(items_dict):
    # Process items_dict and return dict with keys:
    # 'total_items', 'out_of_stock', 'most_stocked'
    pass`,
      solutionCode: `def analyze_inventory(items_dict):
    if not items_dict:
        return {"total_items": 0, "out_of_stock": [], "most_stocked": None}
    
    total = sum(items_dict.values())
    out_of_stock = sorted([name for name, qty in items_dict.items() if qty == 0])
    most_stocked = max(items_dict.items(), key=lambda pair: pair[1])[0]
    
    return {
        "total_items": total,
        "out_of_stock": out_of_stock,
        "most_stocked": most_stocked
    }`,
      hints: [
        "Iterate over `items_dict.items()` to inspect both item name and count.",
        "Remember to handle the empty dictionary case where `most_stocked` should be `None`.",
      ],
      testCases: [
        {
          id: "t1",
          description: "Analyzes standard inventory",
          testCode: "analyze_inventory({'pencils': 15, 'erasers': 0, 'notebooks': 42, 'markers': 0})",
          expectedOutput: "{'total_items': 57, 'out_of_stock': ['erasers', 'markers'], 'most_stocked': 'notebooks'}",
        },
        {
          id: "t2",
          description: "Handles empty dictionary gracefully",
          testCode: "analyze_inventory({})",
          expectedOutput: "{'total_items': 0, 'out_of_stock': [], 'most_stocked': None}",
        },
      ],
      creditReward: 120,
      targetConcepts: ["Dictionaries", "Aggregations", "Sorting"],
    },
  },

  // ==========================================
  // LEVEL 2: MEDIUM (OBJECT ORIENTED PROGRAMMING)
  // ==========================================
  {
    id: "ch-5-classes-and-objects",
    chapterNumber: 5,
    level: "medium",
    title: "OOP Fundamentals: Classes & Instances",
    shortDesc: "The blueprint of object-oriented design: class definitions, self, and constructor initialization.",
    estimatedMinutes: 25,
    tags: ["OOPS", "Classes", "__init__", "self"],
    content: {
      overview:
        "Object-Oriented Programming (OOP) models software around entities called objects that bundle state (attributes) and behavior (methods). A `class` serves as the blueprint, while instances are individual objects instantiated from that blueprint.",
      childAnalogy:
        "Think of a cookie cutter! The cookie cutter is the `Class`. Every cookie you bake with it is an `Object`! Each cookie can have its own colored sprinkles or frosting (attributes), but they all know how to be a cookie (methods).",
      studentConcept:
        "The `__init__` method is the initializer (constructor) invoked automatically when creating an instance. The parameter `self` refers to the specific instance being operated on. Instance attributes are attached to `self`, while class attributes reside on the class object itself.",
      proDeepDive:
        "Instance instantiation actually involves two steps: `__new__` (which allocates the raw object instance) followed by `__init__` (which populates attributes). In Python, methods are bound at lookup time via the descriptor protocol, which binds `self` as the first argument automatically.",
      codeExamples: [
        {
          title: "Defining a Robot Companion Class",
          code: `class Robot:
    # Class attribute (shared by all robots)
    manufacturer = "Python Robotics Lab"

    def __init__(self, name: str, battery_level: int = 100):
        # Instance attributes (unique to each robot)
        self.name = name
        self.battery = battery_level

    def say_hello(self) -> str:
        return f"Beep boop! I am {self.name} with {self.battery}% power."

    def charge(self, amount: int):
        self.battery = min(100, self.battery + amount)

bot1 = Robot("Sparky", 80)
print(bot1.say_hello())`,
          explanation: "self.name and self.battery belong to bot1, while manufacturer is shared across all instances.",
        },
      ],
    },
    exercise: {
      id: "ex-5",
      title: "Build a BankAccount Class",
      instructions:
        "Create a class named `BankAccount` with:\n1. `__init__(self, owner: str, balance: float = 0.0)` that saves `owner` and `balance`.\n2. `deposit(self, amount: float)`: adds amount to balance if amount > 0 and returns the new balance. If amount <= 0, do not change balance and return `'Invalid deposit'`.\n3. `withdraw(self, amount: float)`: subtracts amount from balance if amount <= balance and amount > 0, returning new balance. If amount > balance, return `'Insufficient funds'`.\n4. `get_status(self)`: returns `f'{self.owner} has \${self.balance:.2f}'`.",
      starterCode: `class BankAccount:
    def __init__(self, owner, balance=0.0):
        # Initialize owner and balance
        pass

    def deposit(self, amount):
        # Deposit logic
        pass

    def withdraw(self, amount):
        # Withdraw logic
        pass

    def get_status(self):
        # Return formatted string
        pass`,
      solutionCode: `class BankAccount:
    def __init__(self, owner, balance=0.0):
        self.owner = owner
        self.balance = float(balance)

    def deposit(self, amount):
        if amount <= 0:
            return "Invalid deposit"
        self.balance += amount
        return self.balance

    def withdraw(self, amount):
        if amount <= 0:
            return "Invalid withdrawal"
        if amount > self.balance:
            return "Insufficient funds"
        self.balance -= amount
        return self.balance

    def get_status(self):
        return f"{self.owner} has \${self.balance:.2f}"`,
      hints: [
        "Store balance as a float or number on `self.balance`.",
        "Check `amount > self.balance` before subtracting in `withdraw`.",
      ],
      testCases: [
        {
          id: "t1",
          description: "Initializes and checks deposit",
          testCode: "acc = BankAccount('Priya', 100.0); acc.deposit(50.0)",
          expectedOutput: "150.0",
        },
        {
          id: "t2",
          description: "Withdraws and checks status string",
          testCode: "acc = BankAccount('Priya', 150.0); acc.withdraw(30.0); acc.get_status()",
          expectedOutput: "Priya has $120.00",
        },
        {
          id: "t3",
          description: "Rejects excessive withdrawal",
          testCode: "acc = BankAccount('Priya', 20.0); acc.withdraw(50.0)",
          expectedOutput: "Insufficient funds",
        },
      ],
      creditReward: 120,
      targetConcepts: ["Classes", "Instance Methods", "State Mutation"],
    },
  },

  {
    id: "ch-6-encapsulation-properties",
    chapterNumber: 6,
    level: "medium",
    title: "Encapsulation & Managed Properties",
    shortDesc: "Protect internal state using private conventions and elegant @property getters and setters.",
    estimatedMinutes: 25,
    tags: ["Encapsulation", "@property", "Private", "Getters"],
    content: {
      overview:
        "Encapsulation restricts direct external modification of an object's internal representation, preventing unintended bugs and enforcing validation rules. In Python, encapsulation is achieved through conventions (`_protected`), name-mangling (`__private`), and the `@property` decorator.",
      childAnalogy:
        "Imagine a piggy bank! You can't just slice open the belly to grab coins whenever you want. You have to slide coins through the coin slot. The piggy bank checks the coin and keeps the money safe inside!",
      studentConcept:
        "A single underscore `_attr` warns developers that the attribute is private to the class. A double underscore `__attr` activates name mangling (renamed internally to `_ClassName__attr`). The `@property` decorator lets you expose a method like a normal attribute while executing validation behind the scenes.",
      proDeepDive:
        "The `@property` decorator is a high-level wrapper around Python's C-level descriptor protocol (`__get__`, `__set__`, `__delete__`). It allows seamless backward compatibility: you can expose public attributes initially and later convert them to managed properties without breaking external API contracts.",
      codeExamples: [
        {
          title: "Managed Temperature Property",
          code: `class Thermostat:
    def __init__(self, celsius: float):
        self._celsius = celsius  # Protected attribute

    @property
    def celsius(self) -> float:
        return self._celsius

    @celsius.setter
    def celsius(self, value: float):
        if value < -273.15:
            raise ValueError("Temperature cannot fall below absolute zero!")
        self._celsius = value

    @property
    def fahrenheit(self) -> float:
        return (self._celsius * 9/5) + 32

t = Thermostat(25)
print(f"{t.celsius}°C is {t.fahrenheit}°F")
t.celsius = 30
print(f"Updated: {t.fahrenheit}°F")`,
          explanation: "t.celsius behaves like a regular field, but reading and writing triggers validation and derived calculations.",
        },
      ],
    },
    exercise: {
      id: "ex-6",
      title: "Encapsulated Student Grade Tracker",
      instructions:
        "Create a class `StudentTracker` with:\n1. `__init__(self, name: str, gpa: float)` storing name in `self.name` and private `_gpa`.\n2. A property `gpa` that returns `_gpa`.\n3. A setter `gpa.setter` that verifies the new GPA is between `0.0` and `4.0` (inclusive). If valid, update `_gpa`. If invalid (< 0.0 or > 4.0), do NOT update `_gpa` and return `'Invalid GPA'` (or maintain previous value).\n4. A property `honors` returning `True` if `gpa >= 3.5`, else `False`.",
      starterCode: `class StudentTracker:
    def __init__(self, name, gpa):
        self.name = name
        self._gpa = 0.0
        self.gpa = gpa  # Use property setter

    @property
    def gpa(self):
        pass

    @gpa.setter
    def gpa(self, value):
        pass

    @property
    def honors(self):
        pass`,
      solutionCode: `class StudentTracker:
    def __init__(self, name, gpa):
        self.name = name
        self._gpa = 0.0
        self.gpa = gpa

    @property
    def gpa(self):
        return self._gpa

    @gpa.setter
    def gpa(self, value):
        if 0.0 <= value <= 4.0:
            self._gpa = float(value)
        else:
            return "Invalid GPA"

    @property
    def honors(self):
        return self._gpa >= 3.5`,
      hints: [
        "In `@gpa.setter`, check `0.0 <= value <= 4.0` before assigning `self._gpa = value`.",
        "`@property def honors(self):` simply returns `self._gpa >= 3.5`.",
      ],
      testCases: [
        {
          id: "t1",
          description: "Sets valid GPA and checks honors",
          testCode: "s = StudentTracker('Kiran', 3.8); (s.gpa, s.honors)",
          expectedOutput: "(3.8, True)",
        },
        {
          id: "t2",
          description: "Rejects negative GPA and preserves state",
          testCode: "s = StudentTracker('Kiran', 3.2); s.gpa = -1.5; s.gpa",
          expectedOutput: "3.2",
        },
        {
          id: "t3",
          description: "Non-honors GPA check",
          testCode: "s = StudentTracker('Sam', 3.2); s.honors",
          expectedOutput: "False",
        },
      ],
      creditReward: 130,
      targetConcepts: ["Encapsulation", "@property", "Validation"],
    },
  },

  {
    id: "ch-7-inheritance-polymorphism",
    chapterNumber: 7,
    level: "medium",
    title: "Inheritance & Polymorphism",
    shortDesc: "Build reusable class hierarchies with super() and leverage dynamic duck typing.",
    estimatedMinutes: 25,
    tags: ["Inheritance", "super()", "Polymorphism", "Duck Typing"],
    content: {
      overview:
        "Inheritance allows a subclass to inherit attributes and methods from a superclass, fostering code reuse and domain modeling. Polymorphism enables different classes to implement methods with the same name, allowing client code to treat them interchangeably.",
      childAnalogy:
        "Think of Animals! All animals can `make_sound()`. A Dog is an Animal, so it barks! A Cat is an Animal, so it meows! If you tell any pet to 'make sound', they know how to do it in their own special way. That's Polymorphism!",
      studentConcept:
        "Subclasses call `super().__init__(...)` to initialize base class attributes. Subclasses can override methods to customize behavior. In Python, polymorphism is rooted in Duck Typing: 'If it walks like a duck and quacks like a duck, it is a duck.' You don't need formal interfaces to achieve polymorphism.",
      proDeepDive:
        "Python's `super()` does not simply refer to the direct parent class; it delegates to the next class in the runtime Method Resolution Order (MRO). This makes cooperative multiple inheritance safe and extensible when all classes properly invoke `super()`.",
      codeExamples: [
        {
          title: "Inheritance and super() in Action",
          code: `class Employee:
    def __init__(self, name: str, base_salary: float):
        self.name = name
        self.base_salary = base_salary

    def calculate_pay(self) -> float:
        return self.base_salary

class Manager(Employee):
    def __init__(self, name: str, base_salary: float, bonus: float):
        super().__init__(name, base_salary)
        self.bonus = bonus

    def calculate_pay(self) -> float:
        return super().calculate_pay() + self.bonus

staff = [Employee("Alice", 5000), Manager("Bob", 8000, 2000)]
# Polymorphic iteration
for member in staff:
    print(f"{member.name} payout: \${member.calculate_pay()}")`,
          explanation: "Both Employee and Manager respond to calculate_pay(), executing the appropriate specialized version.",
        },
      ],
    },
    exercise: {
      id: "ex-7",
      title: "Build a Vehicle Fleet Hierarchy",
      instructions:
        "Create an inheritance hierarchy:\n1. Base class `Vehicle` with `__init__(self, brand: str, speed: int)` and method `describe(self)` returning `f'{self.brand} moving at {self.speed} km/h'`.\n2. Subclass `Car(Vehicle)` with `__init__(self, brand, speed, fuel_type: str)`. Calls `super().__init__(brand, speed)`. Overrides `describe()` to return `f'{super().describe()} running on {self.fuel_type}'`.\n3. Subclass `ElectricCar(Car)` with `__init__(self, brand, speed, battery_kwh: int)`. Calls `super().__init__(brand, speed, 'Electric')`. Adds method `get_battery_status()` returning `f'{self.battery_kwh} kWh battery'`.",
      starterCode: `class Vehicle:
    def __init__(self, brand, speed):
        pass

    def describe(self):
        pass

class Car(Vehicle):
    def __init__(self, brand, speed, fuel_type):
        pass

    def describe(self):
        pass

class ElectricCar(Car):
    def __init__(self, brand, speed, battery_kwh):
        pass

    def get_battery_status(self):
        pass`,
      solutionCode: `class Vehicle:
    def __init__(self, brand, speed):
        self.brand = brand
        self.speed = speed

    def describe(self):
        return f"{self.brand} moving at {self.speed} km/h"

class Car(Vehicle):
    def __init__(self, brand, speed, fuel_type):
        super().__init__(brand, speed)
        self.fuel_type = fuel_type

    def describe(self):
        return f"{super().describe()} running on {self.fuel_type}"

class ElectricCar(Car):
    def __init__(self, brand, speed, battery_kwh):
        super().__init__(brand, speed, "Electric")
        self.battery_kwh = battery_kwh

    def get_battery_status(self):
        return f"{self.battery_kwh} kWh battery"`,
      hints: [
        "In `Car.__init__`, call `super().__init__(brand, speed)`.",
        "In `ElectricCar.__init__`, pass `'Electric'` as the fuel_type to `super().__init__`.",
      ],
      testCases: [
        {
          id: "t1",
          description: "Car describes brand, speed, and fuel",
          testCode: "c = Car('Toyota', 120, 'Gasoline'); c.describe()",
          expectedOutput: "Toyota moving at 120 km/h running on Gasoline",
        },
        {
          id: "t2",
          description: "ElectricCar inherits fuel_type and adds battery method",
          testCode: "e = ElectricCar('Tesla', 150, 75); (e.describe(), e.get_battery_status())",
          expectedOutput: "('Tesla moving at 150 km/h running on Electric', '75 kWh battery')",
        },
      ],
      creditReward: 140,
      targetConcepts: ["Inheritance", "super()", "Method Overriding"],
    },
  },

  {
    id: "ch-8-abstraction-abc",
    chapterNumber: 8,
    level: "medium",
    title: "Abstraction & Abstract Base Classes (ABC)",
    shortDesc: "Enforce API contracts and interface compliance with abc.ABC and @abstractmethod.",
    estimatedMinutes: 25,
    tags: ["Abstraction", "ABC", "abstractmethod", "Contracts"],
    content: {
      overview:
        "Abstraction hides complex implementation details and exposes only essential operations through interfaces. Python's `abc` (Abstract Base Class) module prevents incomplete classes from being instantiated and mandates that subclasses implement specified methods.",
      childAnalogy:
        "Think of a video game controller! Every racing car in the game must have an 'Accelerate' button and a 'Brake' button. The game rules say: 'You CANNOT add a new car to the game unless you program what those two buttons do!' That's an Abstract Base Class!",
      studentConcept:
        "Inherit from `abc.ABC` and decorate required methods with `@abstractmethod`. If any subclass fails to implement all abstract methods, Python raises a `TypeError: Can't instantiate abstract class with abstract methods` at instantiation time.",
      proDeepDive:
        "Abstract Base Classes in Python also support virtual subclassing via `ABC.register()` or `__subclasshook__`. This allows existing standard classes (like `dict` or custom sequences) to satisfy `isinstance()` checks against collections interfaces without concrete inheritance.",
      codeExamples: [
        {
          title: "Payment Gateway Contract",
          code: `from abc import ABC, abstractmethod

class PaymentGateway(ABC):
    @abstractmethod
    def process_payment(self, amount: float) -> str:
        """Must be implemented by concrete gateways."""
        pass

class CreditCardGateway(PaymentGateway):
    def process_payment(self, amount: float) -> str:
        return f"Charging \${amount:.2f} to Credit Card."

class CryptoGateway(PaymentGateway):
    def process_payment(self, amount: float) -> str:
        return f"Broadcasting \${amount:.2f} crypto transaction."

# Instantiating PaymentGateway() directly would raise TypeError!
gateway = CreditCardGateway()
print(gateway.process_payment(99.50))`,
          explanation: "Any class inheriting PaymentGateway is contractually required to implement process_payment.",
        },
      ],
    },
    exercise: {
      id: "ex-8",
      title: "Create a Shape Area & Perimeter Contract",
      instructions:
        "Implement an abstract geometry framework:\n1. Abstract base class `Shape(ABC)` with two `@abstractmethod` signatures:\n   - `area(self) -> float`\n   - `perimeter(self) -> float`\n2. Concrete class `Rectangle(Shape)` with `__init__(self, width: float, height: float)`.\n   - `area()` returns width * height\n   - `perimeter()` returns 2 * (width + height)\n3. Concrete class `Circle(Shape)` with `__init__(self, radius: float)`.\n   - Use `3.14159` for pi.\n   - `area()` returns pi * radius^2\n   - `perimeter()` returns 2 * pi * radius (rounded to 2 decimals).",
      starterCode: `from abc import ABC, abstractmethod

class Shape(ABC):
    @abstractmethod
    def area(self):
        pass

    @abstractmethod
    def perimeter(self):
        pass

class Rectangle(Shape):
    def __init__(self, width, height):
        pass

    def area(self):
        pass

    def perimeter(self):
        pass

class Circle(Shape):
    def __init__(self, radius):
        pass

    def area(self):
        pass

    def perimeter(self):
        pass`,
      solutionCode: `from abc import ABC, abstractmethod

class Shape(ABC):
    @abstractmethod
    def area(self):
        pass

    @abstractmethod
    def perimeter(self):
        pass

class Rectangle(Shape):
    def __init__(self, width, height):
        self.width = float(width)
        self.height = float(height)

    def area(self):
        return self.width * self.height

    def perimeter(self):
        return 2 * (self.width + self.height)

class Circle(Shape):
    def __init__(self, radius):
        self.radius = float(radius)

    def area(self):
        return round(3.14159 * (self.radius ** 2), 2)

    def perimeter(self):
        return round(2 * 3.14159 * self.radius, 2)`,
      hints: [
        "Inherit both `Rectangle` and `Circle` from `Shape`.",
        "Round float returns to 2 decimal places using `round(val, 2)` if needed.",
      ],
      testCases: [
        {
          id: "t1",
          description: "Calculates Rectangle area and perimeter",
          testCode: "r = Rectangle(4, 5); (r.area(), r.perimeter())",
          expectedOutput: "(20.0, 18.0)",
        },
        {
          id: "t2",
          description: "Calculates Circle area and perimeter",
          testCode: "c = Circle(10); (c.area(), c.perimeter())",
          expectedOutput: "(314.16, 62.83)",
        },
      ],
      creditReward: 140,
      targetConcepts: ["ABC", "Abstract Methods", "Interface Contracts"],
    },
  },

  {
    id: "ch-9-dunder-methods",
    chapterNumber: 9,
    level: "medium",
    title: "Dunder (Magic) Methods & Operator Overloading",
    shortDesc: "Make your custom classes behave like native Python objects with __str__, __repr__, __len__, and __add__.",
    estimatedMinutes: 25,
    tags: ["Dunder", "Magic Methods", "__str__", "__add__"],
    content: {
      overview:
        "Dunder (double underscore) methods allow custom classes to hook into Python's built-in operators and syntax. By defining `__str__`, `__len__`, `__eq__`, or `__add__`, your custom objects seamlessly integrate with functions like `print()`, `len()`, and operators like `+`.",
      childAnalogy:
        "Imagine your custom class gets magical superpowers! When you put a `+` between two of your objects, Python asks your secret dunder spell `__add__`: 'How should these two combine?' You get to write the rules of magic!",
      studentConcept:
        "`__str__` is for end users (readable text), while `__repr__` is for developers (unambiguous, code-like representation). Implementing `__eq__` enables `==` equality checks. Implementing `__add__` enables the `+` operator.",
      proDeepDive:
        "If `a + b` fails because `type(a)` doesn't know how to add `b`, Python falls back to `b.__radd__(a)`. For sequence-like classes, implementing `__getitem__` and `__len__` automatically gives your class slicing and iteration capabilities for free.",
      codeExamples: [
        {
          title: "2D Vector with Operator Overloading",
          code: `class Vector2D:
    def __init__(self, x: float, y: float):
        self.x = x
        self.y = y

    def __repr__(self):
        return f"Vector2D({self.x}, {self.y})"

    def __str__(self):
        return f"({self.x}, {self.y})"

    def __add__(self, other):
        if not isinstance(other, Vector2D):
            return NotImplemented
        return Vector2D(self.x + other.x, self.y + other.y)

    def __eq__(self, other):
        if not isinstance(other, Vector2D):
            return False
        return self.x == other.x and self.y == other.y

v1 = Vector2D(2, 3)
v2 = Vector2D(4, 5)
v3 = v1 + v2
print(f"Result: {v3} | Repr: {repr(v3)}")
print(f"v3 equals Vector2D(6, 8): {v3 == Vector2D(6, 8)}")`,
          explanation: "Defining __add__ lets us cleanly add vectors together using the natural '+' operator.",
        },
      ],
    },
    exercise: {
      id: "ex-9",
      title: "Build a Custom ShoppingCart with Dunders",
      instructions:
        "Create a class `ShoppingCart` that holds items with prices:\n1. `__init__(self)` initializes an empty dictionary `self.items = {}` where keys are item names and values are prices.\n2. `add_item(self, name: str, price: float)` adds or updates item price.\n3. `__len__(self)` returns total number of unique items.\n4. `__getitem__(self, item_name)` returns the price of the item, or `0.0` if not present.\n5. `__add__(self, other)` combines two shopping carts into a brand new `ShoppingCart` containing all items from both carts (if an item exists in both, use the price from `other`).",
      starterCode: `class ShoppingCart:
    def __init__(self):
        self.items = {}

    def add_item(self, name, price):
        pass

    def __len__(self):
        pass

    def __getitem__(self, item_name):
        pass

    def __add__(self, other):
        pass`,
      solutionCode: `class ShoppingCart:
    def __init__(self):
        self.items = {}

    def add_item(self, name, price):
        self.items[name] = float(price)

    def __len__(self):
        return len(self.items)

    def __getitem__(self, item_name):
        return self.items.get(item_name, 0.0)

    def __add__(self, other):
        if not isinstance(other, ShoppingCart):
            return NotImplemented
        new_cart = ShoppingCart()
        new_cart.items = {**self.items, **other.items}
        return new_cart`,
      hints: [
        "In `__len__`, return `len(self.items)`.",
        "In `__getitem__`, return `self.items.get(item_name, 0.0)`.",
        "In `__add__`, merge the dictionaries: `{**self.items, **other.items}`.",
      ],
      testCases: [
        {
          id: "t1",
          description: "Checks cart length and bracket indexing",
          testCode: "c = ShoppingCart(); c.add_item('Book', 15.0); c.add_item('Pen', 3.0); (len(c), c['Book'])",
          expectedOutput: "(2, 15.0)",
        },
        {
          id: "t2",
          description: "Adds two carts together with + operator",
          testCode: "c1 = ShoppingCart(); c1.add_item('A', 10); c2 = ShoppingCart(); c2.add_item('B', 20); c3 = c1 + c2; len(c3)",
          expectedOutput: "2",
        },
      ],
      creditReward: 150,
      targetConcepts: ["Dunders", "__len__", "__getitem__", "__add__"],
    },
  },

  {
    id: "ch-10-comprehensions-exceptions",
    chapterNumber: 10,
    level: "medium",
    title: "Pythonic Comprehensions & Custom Exceptions",
    shortDesc: "Write expressive list/dict comprehensions and design bulletproof custom exception hierarchies.",
    estimatedMinutes: 20,
    tags: ["Comprehensions", "Exceptions", "try-except", "Pythonic"],
    content: {
      overview:
        "Python values brevity and expressiveness without sacrificing readability. Comprehensions provide a concise syntax for transforming and filtering iterables. Robust applications combine this with explicit exception hierarchies (`try-except-else-finally`) to handle runtime faults gracefully.",
      childAnalogy:
        "A comprehension is like a magical sorting conveyor belt! Instead of picking through apples one by one with three different hands, the conveyor belt picks out only the shiny red ones and shines them up in a single smooth line!",
      studentConcept:
        "List comprehension syntax: `[expression for item in iterable if condition]`. Custom exceptions subclass `Exception`. The `else` block in `try-except` executes only when NO exception was raised, while `finally` always executes (ideal for cleanup).",
      proDeepDive:
        "Dict comprehensions `{k: v for ...}` and set comprehensions `{item for ...}` share the same bytecode optimization as list comprehensions (running at C-speed without repeated `list.append` attribute lookups). Always derive custom exceptions from `Exception` rather than `BaseException` (which handles `KeyboardInterrupt` and `SystemExit`).",
      codeExamples: [
        {
          title: "Custom Exception and Dict Comprehension",
          code: `class InsufficientStockError(Exception):
    """Raised when an order exceeds available inventory."""
    def __init__(self, item, requested, available):
        super().__init__(f"Cannot order {requested}x '{item}'. Only {available} available.")
        self.item = item
        self.requested = requested

# Dict comprehension example
prices_usd = {"laptop": 1200, "mouse": 25, "keyboard": 75}
euro_rate = 0.92
prices_eur = {item: round(price * euro_rate, 2) for item, price in prices_usd.items() if price > 50}
print("Items above $50 in EUR:", prices_eur)`,
          explanation: "Comprehensions filter and map data cleanly, while custom exceptions convey exact failure states.",
        },
      ],
    },
    exercise: {
      id: "ex-10",
      title: "Safe Student Registry with Custom Exception",
      instructions:
        "1. Define a custom exception `InvalidStudentError(Exception)`.\n2. Write a function `register_students(raw_records)` where `raw_records` is a list of tuples `(name, age, grade)`.\n   - If any `age < 5` or `age > 100`, raise `InvalidStudentError(f'Invalid age: {age}')`.\n   - Return a dictionary mapping `{name: {'age': age, 'grade': grade}}` for all valid students using a dictionary comprehension.",
      starterCode: `class InvalidStudentError(Exception):
    pass

def register_students(raw_records):
    # Validate records and return dictionary
    pass`,
      solutionCode: `class InvalidStudentError(Exception):
    pass

def register_students(raw_records):
    for name, age, grade in raw_records:
        if age < 5 or age > 100:
            raise InvalidStudentError(f"Invalid age: {age}")
    
    return {name: {"age": age, "grade": grade} for name, age, grade in raw_records}`,
      hints: [
        "First check all records for `age < 5 or age > 100`.",
        "Construct the final dict with `{name: {'age': age, 'grade': grade} for name, age, grade in raw_records}`.",
      ],
      testCases: [
        {
          id: "t1",
          description: "Builds valid student registry",
          testCode: "register_students([('Aarav', 12, '7th'), ('Zoe', 15, '10th')])",
          expectedOutput: "{'Aarav': {'age': 12, 'grade': '7th'}, 'Zoe': {'age': 15, 'grade': '10th'}}",
        },
        {
          id: "t2",
          description: "Catches invalid age and raises custom exception",
          testCode: "try:\n    register_students([('Baby', 2, 'K')])\n    res = 'Failed'\nexcept InvalidStudentError:\n    res = 'Caught'",
          expectedOutput: "Caught",
        },
      ],
      creditReward: 140,
      targetConcepts: ["Custom Exceptions", "Dict Comprehensions", "Data Validation"],
    },
  },

  // ==========================================
  // LEVEL 3: ADVANCED (PRO ENGINEERING & INTERNALS)
  // ==========================================
  {
    id: "ch-11-decorators-closures",
    chapterNumber: 11,
    level: "advanced",
    title: "Decorators & Function Closures",
    shortDesc: "Master higher-order metaprogramming, execution wrapping, closures, and functools.wraps.",
    estimatedMinutes: 30,
    tags: ["Decorators", "Closures", "Higher-Order", "@wraps"],
    content: {
      overview:
        "Decorators dynamically alter or extend the behavior of a function or class without modifying its source code. In Python, functions are first-class citizens: they can be passed as arguments, assigned to variables, and returned from other functions.",
      childAnalogy:
        "Imagine you baked a plain vanilla cupcake. A decorator is like putting colorful icing, a cherry, and sprinkles on top! The cupcake inside is still delicious vanilla, but now it has awesome new powers and looks spectacular!",
      studentConcept:
        "A decorator takes a target function `func`, defines an inner `wrapper(*args, **kwargs)` that executes pre/post logic around `func`, and returns `wrapper`. Using `@functools.wraps(func)` preserves original metadata like docstrings and function name `__name__`.",
      proDeepDive:
        "Decorators can accept arguments (requiring a 3-tier nested factory function). Class-based decorators implement `__call__`. Decorators are heavily utilized in enterprise frameworks for cross-cutting concerns: caching (e.g. `@functools.lru_cache`), authentication guards, rate-limiting, and distributed tracing telemetry.",
      codeExamples: [
        {
          title: "Execution Logger & Timer Decorator",
          code: `import functools
import time

def log_execution(func):
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        print(f"[START] Executing {func.__name__}...")
        start_time = time.perf_counter()
        result = func(*args, **kwargs)
        elapsed = time.perf_counter() - start_time
        print(f"[END] Completed {func.__name__} in {elapsed:.6f}s")
        return result
    return wrapper

@log_execution
def compute_cube(n: int) -> int:
    return n ** 3

print("Result:", compute_cube(5))`,
          explanation: "The decorator intercepts the function call, logs before and after, and preserves return value.",
        },
      ],
    },
    exercise: {
      id: "ex-11",
      title: "Build a Call Counter & Cache Decorator",
      instructions:
        "Write a decorator named `count_and_cache` that:\n1. Keeps track of how many times the function was called on an attribute `wrapper.call_count` (initialized to 0).\n2. Caches previously computed results for positional arguments in a dictionary `wrapper.cache`.\n3. If the argument tuple has already been calculated, return the cached result without re-executing the function (do not increment `call_count` on cache hit).\n4. If not cached, increment `wrapper.call_count += 1`, compute the result, store it in `wrapper.cache`, and return it.",
      starterCode: `import functools

def count_and_cache(func):
    # Implement count_and_cache decorator
    pass`,
      solutionCode: `import functools

def count_and_cache(func):
    @functools.wraps(func)
    def wrapper(*args):
        if args in wrapper.cache:
            return wrapper.cache[args]
        wrapper.call_count += 1
        res = func(*args)
        wrapper.cache[args] = res
        return res
    wrapper.call_count = 0
    wrapper.cache = {}
    return wrapper`,
      hints: [
        "Store `wrapper.call_count = 0` and `wrapper.cache = {}` directly on the wrapper function.",
        "Check `if args in wrapper.cache: return wrapper.cache[args]`.",
      ],
      testCases: [
        {
          id: "t1",
          description: "Caches computation and avoids redundant calls",
          testCode: "@count_and_cache\ndef square(x): return x * x\nsquare(4); square(4); square(5); square(4); (square.call_count, len(square.cache))",
          expectedOutput: "(2, 2)",
        },
      ],
      creditReward: 160,
      targetConcepts: ["Decorators", "Closures", "Function Caching"],
    },
  },

  {
    id: "ch-12-generators-iterators",
    chapterNumber: 12,
    level: "advanced",
    title: "Generators & Memory-Efficient Streaming",
    shortDesc: "Process infinite streams and massive datasets using yield, yield from, and the iterator protocol.",
    estimatedMinutes: 25,
    tags: ["Generators", "yield", "Iterators", "Memory Efficiency"],
    content: {
      overview:
        "Standard functions calculate and return an entire collection in memory all at once. Generator functions pause execution with `yield`, producing one item at a time on demand. This enables processing gigabyte-scale data streams in constant O(1) memory space.",
      childAnalogy:
        "Imagine ordering a giant pizza. Instead of dumping 50 hot pizzas on your table all at once so they get cold, a super-chef brings you one hot fresh slice whenever you raise your fork! That's a Generator!",
      studentConcept:
        "Any function containing `yield` becomes a generator factory. When called, it returns a generator object. Calling `next(gen)` resumes execution until the next `yield` statement. When execution completes, `StopIteration` is raised.",
      proDeepDive:
        "Generators maintain their own stack frame (local variables, instruction pointer) suspended in heap memory. Python 3.3+ introduced `yield from subgen`, which delegates iteration directly to a sub-generator, establishing a bidirectional communication channel for coroutines.",
      codeExamples: [
        {
          title: "Streaming Fibonacci Generator",
          code: `def fibonacci_stream(limit: int):
    """Yields Fibonacci numbers up to limit without storing in a list."""
    a, b = 0, 1
    count = 0
    while count < limit:
        yield a
        a, b = b, a + b
        count += 1

# Consuming lazily
for num in fibonacci_stream(7):
    print(num, end=" ")
print()`,
          explanation: "Memory consumption stays constant regardless of whether limit is 10 or 10,000,000.",
        },
      ],
    },
    exercise: {
      id: "ex-12",
      title: "Chunking Stream Generator",
      instructions:
        "Create a generator function `chunked_stream(iterable, chunk_size: int)` that takes an iterable sequence and yields successive chunks of items as lists of length `chunk_size`.\nThe final chunk may contain fewer elements if the total items are not evenly divisible.\nExample: `list(chunked_stream([1, 2, 3, 4, 5], 2))` -> `[[1, 2], [3, 4], [5]]`.",
      starterCode: `def chunked_stream(iterable, chunk_size):
    # Yield lists of chunk_size elements
    pass`,
      solutionCode: `def chunked_stream(iterable, chunk_size):
    chunk = []
    for item in iterable:
        chunk.append(item)
        if len(chunk) == chunk_size:
            yield chunk
            chunk = []
    if chunk:
        yield chunk`,
      hints: [
        "Maintain a `chunk = []` list. When `len(chunk) == chunk_size`, `yield chunk` and reset `chunk = []`.",
        "Don't forget to `yield chunk` after the loop if `chunk` still has leftover elements!",
      ],
      testCases: [
        {
          id: "t1",
          description: "Chunks list of 5 items by 2",
          testCode: "list(chunked_stream([1, 2, 3, 4, 5], 2))",
          expectedOutput: "[[1, 2], [3, 4], [5]]",
        },
        {
          id: "t2",
          description: "Chunks evenly divisible sequence",
          testCode: "list(chunked_stream(['a', 'b', 'c', 'd'], 2))",
          expectedOutput: "[['a', 'b'], ['c', 'd']]",
        },
      ],
      creditReward: 160,
      targetConcepts: ["Generators", "yield", "Lazy Evaluation"],
    },
  },

  {
    id: "ch-13-context-managers",
    chapterNumber: 13,
    level: "advanced",
    title: "Context Managers & Resource Safety",
    shortDesc: "Guarantee clean resource allocation and tear-down using the with statement and __enter__ / __exit__.",
    estimatedMinutes: 25,
    tags: ["Context Managers", "with", "__enter__", "__exit__"],
    content: {
      overview:
        "Acquiring and releasing resources (file handles, database connections, locks, network sockets) is prone to leaks if an unexpected exception occurs. Context managers (`with` statement) guarantee that cleanup code runs unconditionally.",
      childAnalogy:
        "Imagine borrowing a book from the library. The `with` statement is like an automatic library door: when you walk in, it stamps your card (`__enter__`). Even if you drop your ice cream or trip inside, as soon as you walk out, the door makes sure the book is returned safely (`__exit__`)!",
      studentConcept:
        "The context management protocol requires two dunder methods:\n- `__enter__(self)`: prepares the resource and returns an object assigned to `as target`.\n- `__exit__(self, exc_type, exc_val, exc_tb)`: cleans up the resource. Returning `True` suppresses any caught exception.",
      proDeepDive:
        "The `contextlib` module provides `@contextmanager`, which lets you write context managers using a simple generator with a `try...finally` block. Modern Python also supports `contextlib.ExitStack` for managing dynamic numbers of context managers safely.",
      codeExamples: [
        {
          title: "Custom Performance Timer Context Manager",
          code: `import time

class ExecutionTimer:
    def __init__(self, label: str):
        self.label = label
        self.elapsed = 0.0

    def __enter__(self):
        self.start = time.perf_counter()
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        self.elapsed = time.perf_counter() - self.start
        print(f"[{self.label}] Elapsed: {self.elapsed:.6f}s")
        # Returning None or False propagates any exception

with ExecutionTimer("Data Processing") as timer:
    total = sum(i ** 2 for i in range(100_000))
print("Finished compute.")`,
          explanation: "__enter__ captures start time, and __exit__ measures elapsed time even if an error is raised.",
        },
      ],
    },
    exercise: {
      id: "ex-13",
      title: "Build a Transaction Rollback Context Manager",
      instructions:
        "Create a class `DictionaryTransaction` that acts as a context manager for a dictionary:\n1. `__init__(self, target_dict)` stores reference to `target_dict` and creates a shallow snapshot copy `_backup`.\n2. `__enter__(self)` returns `self.target_dict`.\n3. `__exit__(self, exc_type, exc_val, exc_tb)`: If an exception occurred (`exc_type is not None`), restore `target_dict` back to the exact state in `_backup` (clear target_dict and update with _backup), then return `True` to suppress the exception. If no error occurred, keep modifications.",
      starterCode: `class DictionaryTransaction:
    def __init__(self, target_dict):
        pass

    def __enter__(self):
        pass

    def __exit__(self, exc_type, exc_val, exc_tb):
        pass`,
      solutionCode: `class DictionaryTransaction:
    def __init__(self, target_dict):
        self.target_dict = target_dict
        self._backup = dict(target_dict)

    def __enter__(self):
        return self.target_dict

    def __exit__(self, exc_type, exc_val, exc_tb):
        if exc_type is not None:
            self.target_dict.clear()
            self.target_dict.update(self._backup)
            return True # suppress error
        return False`,
      hints: [
        "In `__init__`, save `self._backup = dict(target_dict)`.",
        "In `__exit__`, check `if exc_type is not None:` and restore `self.target_dict`.",
      ],
      testCases: [
        {
          id: "t1",
          description: "Rolls back changes upon exception",
          testCode: "data = {'balance': 100}\nwith DictionaryTransaction(data) as d:\n    d['balance'] = 500\n    raise ValueError('DB crash')\ndata['balance']",
          expectedOutput: "100",
        },
        {
          id: "t2",
          description: "Commits changes when no exception occurs",
          testCode: "data = {'balance': 100}\nwith DictionaryTransaction(data) as d:\n    d['balance'] = 250\ndata['balance']",
          expectedOutput: "250",
        },
      ],
      creditReward: 160,
      targetConcepts: ["Context Managers", "__enter__", "__exit__", "Rollback"],
    },
  },

  {
    id: "ch-14-metaclasses-internals",
    chapterNumber: 14,
    level: "advanced",
    title: "Metaclasses & Class Factory Metaprogramming",
    shortDesc: "Understand how classes are created: type, __new__, and metaclass interception.",
    estimatedMinutes: 30,
    tags: ["Metaclasses", "type", "__new__", "Metaprogramming"],
    content: {
      overview:
        "In Python, classes are themselves objects instantiated from a metaclass. The default metaclass is `type`. Metaclasses allow you to intercept, validate, transform, or auto-register classes at the moment they are defined in code.",
      childAnalogy:
        "If a class is a cookie cutter that stamps out cookies, a Metaclass is the master blacksmith that forges the cookie cutter itself! It makes sure every cookie cutter is built with the right safety handles before anyone bakes with it!",
      studentConcept:
        "`type(name, bases, attrs)` can dynamically construct a class. When you define `class MyMeta(type):`, you can override `__new__(mcs, name, bases, attrs)` to modify or validate class attributes at definition time. Specify `class MyClass(metaclass=MyMeta):`.",
      proDeepDive:
        "Metaclasses power major Python libraries like Django ORM, Pydantic, and SQLAlchemy for schema validation and field mapping. In Python 3.6+, `__init_subclass__` provides a simpler alternative for many common metaclass use cases.",
      codeExamples: [
        {
          title: "Attribute Validation Metaclass",
          code: `class EnforceUppercaseMeta(type):
    def __new__(mcs, name, bases, attrs):
        # Automatically uppercase all string attribute values
        new_attrs = {}
        for key, val in attrs.items():
            if isinstance(val, str) and not key.startswith("__"):
                new_attrs[key] = val.upper()
            else:
                new_attrs[key] = val
        return super().__new__(mcs, name, bases, new_attrs)

class Config(metaclass=EnforceUppercaseMeta):
    app_name = "python academy"
    mode = "production"

print(Config.app_name) # "PYTHON ACADEMY"
print(Config.mode)     # "PRODUCTION"`,
          explanation: "The metaclass intercepts class creation and transforms attributes before the class is ever instantiated.",
        },
      ],
    },
    exercise: {
      id: "ex-14",
      title: "Build a Strict Method Validator Metaclass",
      instructions:
        "Create a metaclass `RequireDocstringsMeta(type)`:\nWhen a class is defined using this metaclass, inspect all functions/methods defined directly in `attrs` (skip dunder methods starting with `__`).\nIf any non-dunder method does NOT have a docstring (`method.__doc__ is None` or empty string `\"\"`), raise a `TypeError(f'Method {key} in class {name} must have a docstring!')`.",
      starterCode: `import inspect

class RequireDocstringsMeta(type):
    def __new__(mcs, name, bases, attrs):
        # Validate that all methods have docstrings
        pass`,
      solutionCode: `import inspect

class RequireDocstringsMeta(type):
    def __new__(mcs, name, bases, attrs):
        for key, val in attrs.items():
            if not key.startswith("__") and callable(val):
                if not getattr(val, "__doc__", None):
                    raise TypeError(f"Method {key} in class {name} must have a docstring!")
        return super().__new__(mcs, name, bases, attrs)`,
      hints: [
        "Iterate over `attrs.items()` and check `callable(val)` for keys that don't start with `'__'`. ",
        "Check `if not getattr(val, '__doc__', None): raise TypeError(...)`.",
      ],
      testCases: [
        {
          id: "t1",
          description: "Passes when methods have docstrings",
          testCode: "class Service(metaclass=RequireDocstringsMeta):\n    def run(self):\n        \"\"\"Runs the service.\"\"\"\n        return True\ns = Service(); s.run()",
          expectedOutput: "True",
        },
        {
          id: "t2",
          description: "Rejects class with missing docstring",
          testCode: "try:\n    class Bad(metaclass=RequireDocstringsMeta):\n        def undocumented(self):\n            pass\n    res = 'Failed'\nexcept TypeError:\n    res = 'Caught'",
          expectedOutput: "Caught",
        },
      ],
      creditReward: 170,
      targetConcepts: ["Metaclasses", "__new__", "Inspection", "Type Validation"],
    },
  },

  {
    id: "ch-15-typing-async",
    chapterNumber: 15,
    level: "advanced",
    title: "Modern Typing & Asynchronous Python",
    shortDesc: "Write enterprise-ready typed Python with Protocols, TypeVar, and understand asyncio concurrency.",
    estimatedMinutes: 30,
    tags: ["Type Hints", "Protocol", "asyncio", "Concurrency"],
    content: {
      overview:
        "Modern Python marries dynamic agility with static type safety using PEP 484 type annotations and `typing.Protocol` (structural subtyping). Concurrently, `asyncio` empowers high-throughput I/O-bound applications using single-threaded cooperative multitasking.",
      childAnalogy:
        "Imagine an octopus chef juggling 8 pans on a stove! The octopus doesn't hire 8 different chefs (threads); instead, while pasta is boiling in pan #1, the octopus instantly chops garlic for pan #2. That's cooperative `asyncio`!",
      studentConcept:
        "`typing.Protocol` enables static duck-typing: any class that implements the methods of a Protocol satisfies the type without explicit inheritance. `async def` defines coroutines, and `await` pauses execution until an I/O operation completes, freeing the event loop to run other tasks.",
      proDeepDive:
        "Python's GIL (Global Interpreter Lock) restricts bytecodes to one thread at a time, making CPU-bound multi-threading ineffective (use `multiprocessing` instead). However, `asyncio` eliminates thread context-switching overhead entirely for network and file I/O operations.",
      codeExamples: [
        {
          title: "Structural Protocol & Type Hints",
          code: `from typing import Protocol, List

class Renderable(Protocol):
    def render(self) -> str:
        ...

class TextCard:
    def __init__(self, text: str):
        self.text = text
    def render(self) -> str:
        return f"[Card: {self.text}]"

def display_all(items: List[Renderable]) -> str:
    return " | ".join(item.render() for item in items)

card = TextCard("Hello Protocol!")
print(display_all([card]))`,
          explanation: "TextCard implements Renderable structurally without needing to explicitly inherit from it.",
        },
      ],
    },
    exercise: {
      id: "ex-15",
      title: "Build a Typed Event Bus Handler",
      instructions:
        "Create an event dispatch registry:\n1. Class `EventBus` with:\n   - `__init__(self)` initializing `self.subscribers = {}` mapping event names to list of handler callbacks.\n   - `subscribe(self, event_name: str, handler)`: appends `handler` to the event's subscriber list.\n   - `publish(self, event_name: str, **payload)`: calls every subscribed handler passing `**payload`, collects the return values in a list, and returns that list. If no handlers exist, return `[]`.",
      starterCode: `class EventBus:
    def __init__(self):
        pass

    def subscribe(self, event_name, handler):
        pass

    def publish(self, event_name, **payload):
        pass`,
      solutionCode: `class EventBus:
    def __init__(self):
        self.subscribers = {}

    def subscribe(self, event_name, handler):
        if event_name not in self.subscribers:
            self.subscribers[event_name] = []
        self.subscribers[event_name].append(handler)

    def publish(self, event_name, **payload):
        if event_name not in self.subscribers:
            return []
        results = []
        for handler in self.subscribers[event_name]:
            results.append(handler(**payload))
        return results`,
      hints: [
        "In `publish`, iterate over `self.subscribers.get(event_name, [])` and call `handler(**payload)`.",
        "Return the list of all handler call outputs.",
      ],
      testCases: [
        {
          id: "t1",
          description: "Subscribes and publishes payload to handlers",
          testCode: "bus = EventBus()\nbus.subscribe('login', lambda user: f'User {user} logged in')\nbus.subscribe('login', lambda user: f'Audit: {user}')\nbus.publish('login', user='subrahmanya')",
          expectedOutput: "['User subrahmanya logged in', 'Audit: subrahmanya']",
        },
        {
          id: "t2",
          description: "Returns empty list for unregistered events",
          testCode: "bus = EventBus()\nbus.publish('unknown_event')",
          expectedOutput: "[]",
        },
      ],
      creditReward: 180,
      targetConcepts: ["Event Driven", "Callbacks", "Dynamic Kwargs"],
    },
  },
];
