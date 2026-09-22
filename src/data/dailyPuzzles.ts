import { DailyPuzzle } from "../types";

export const DAILY_PUZZLES: DailyPuzzle[] = [
  {
    id: "puzzle-palindrome-clean",
    title: "Palindrome Pal",
    category: "Strings",
    difficulty: "Easy",
    bonusCredits: 50,
    description: `Write a function \`is_clean_palindrome(text: str) -> bool\` that determines if a string reads the same forwards and backwards.
Important: Ignore casing, spaces, and punctuation (keep only alphanumeric characters \`a-z\`, \`0-9\`).

Example:
\`\`\`python
is_clean_palindrome("A man, a plan, a canal: Panama") # True
is_clean_palindrome("Python 3") # False
\`\`\``,
    starterCode: `def is_clean_palindrome(text: str) -> bool:
    # Clean the string to keep only alphanumeric characters in lowercase
    # Your code here:
    pass
`,
    hints: [
      "Use char.isalnum() to check if each character is alphanumeric.",
      "Convert characters to lowercase with .lower() before checking.",
      "Compare the cleaned string with its reverse: cleaned == cleaned[::-1]",
    ],
    testCases: [
      {
        description: "Classic palindrome sentence with punctuation",
        testCode: "is_clean_palindrome('A man, a plan, a canal: Panama')",
        expectedOutput: "True",
      },
      {
        description: "Non-palindrome string",
        testCode: "is_clean_palindrome('Python 3')",
        expectedOutput: "False",
      },
      {
        description: "Single character is always palindrome",
        testCode: "is_clean_palindrome('Z!')",
        expectedOutput: "True",
      },
      {
        description: "Mixed case and numbers",
        testCode: "is_clean_palindrome('RaceCar 101 racecar')",
        expectedOutput: "True",
      },
    ],
    authorTip: "String slicing `[::-1]` is the most Pythonic way to reverse a string in constant-time C speed!",
  },
  {
    id: "puzzle-temp-converter-oop",
    title: "OOP Weather Station",
    category: "OOPS",
    difficulty: "Medium",
    bonusCredits: 60,
    description: `Build an Object-Oriented class \`Temperature\` that stores a temperature in Celsius.
Requirements:
1. \`__init__(self, celsius: float)\` stores the value in an attribute \`celsius\`.
2. Method \`to_fahrenheit(self) -> float\` returns the Fahrenheit conversion rounded to 1 decimal place: \`F = (C * 9/5) + 32\`.
3. Method \`to_kelvin(self) -> float\` returns the Kelvin conversion rounded to 1 decimal place: \`K = C + 273.15\`.
4. Method \`is_freezing(self) -> bool\` returns \`True\` if celsius <= 0, else \`False\`.`,
    starterCode: `class Temperature:
    def __init__(self, celsius: float):
        self.celsius = celsius

    def to_fahrenheit(self) -> float:
        # Your code here
        pass

    def to_kelvin(self) -> float:
        # Your code here
        pass

    def is_freezing(self) -> bool:
        # Your code here
        pass
`,
    hints: [
      "Remember round(val, 1) to round to one decimal point.",
      "Freezing threshold is celsius <= 0.",
    ],
    testCases: [
      {
        description: "Water boiling point conversion to Fahrenheit",
        testCode: "Temperature(100).to_fahrenheit()",
        expectedOutput: "212.0",
      },
      {
        description: "Water freezing point conversion to Kelvin",
        testCode: "Temperature(0).to_kelvin()",
        expectedOutput: "273.1",
      },
      {
        description: "Freezing detection at 0 degrees",
        testCode: "Temperature(0).is_freezing()",
        expectedOutput: "True",
      },
      {
        description: "Freezing detection at 22 degrees room temperature",
        testCode: "Temperature(22).is_freezing()",
        expectedOutput: "False",
      },
    ],
    authorTip: "Encapsulating unit conversions into an OOP model ensures data consistency and single-responsibility code.",
  },
  {
    id: "puzzle-even-squares-comprehension",
    title: "Even Squares Filter",
    category: "Pythonic",
    difficulty: "Easy",
    bonusCredits: 45,
    description: `Write a function \`even_squares(numbers: list[int]) -> list[int]\` using list comprehension that takes a list of integers and returns the square of all even numbers.

Example:
\`even_squares([1, 2, 3, 4, 5, 6])\` -> \`[4, 16, 36]\``,
    starterCode: `def even_squares(numbers: list[int]) -> list[int]:
    # Use a Pythonic list comprehension: [x**2 for x in ... if ...]
    pass
`,
    hints: [
      "Check evenness with `x % 2 == 0`.",
      "Square an integer with `x ** 2`.",
    ],
    testCases: [
      {
        description: "Even squares from 1 through 6",
        testCode: "even_squares([1, 2, 3, 4, 5, 6])",
        expectedOutput: "[4, 16, 36]",
      },
      {
        description: "List with all odd numbers returns empty list",
        testCode: "even_squares([1, 3, 5, 7])",
        expectedOutput: "[]",
      },
      {
        description: "List with negatives and zero",
        testCode: "even_squares([-4, -3, 0, 2])",
        expectedOutput: "[16, 0, 4]",
      },
    ],
    authorTip: "List comprehensions in Python execute faster than manual `.append()` loops because the iteration is handled in C bytecode!",
  },
  {
    id: "puzzle-magic-counter",
    title: "Magic Counter Class",
    category: "OOPS",
    difficulty: "Medium",
    bonusCredits: 65,
    description: `Create an OOP class \`Counter\` that implements Python dunder methods:
1. \`__init__(self, initial: int = 0)\` stores the count.
2. \`increment(self, amount: int = 1)\` increases count by amount and returns self.
3. \`__add__(self, other)\` allows adding two Counter instances together, returning a new \`Counter\` whose count is the sum of both.
4. \`__int__(self)\` returns the internal count as an integer.
5. \`__repr__(self)\` returns \`"Counter(value)"\`.`,
    starterCode: `class Counter:
    def __init__(self, initial: int = 0):
        self.count = initial

    def increment(self, amount: int = 1):
        self.count += amount
        return self

    def __add__(self, other):
        # Return a new Counter instance
        pass

    def __int__(self):
        # Return count as int
        pass

    def __repr__(self):
        # Return Counter(count)
        pass
`,
    hints: [
      "In __add__, check isinstance(other, Counter) or access other.count directly.",
      "__int__ simply returns int(self.count).",
      "__repr__ returns f'Counter({self.count})'.",
    ],
    testCases: [
      {
        description: "Incrementing counter by 5",
        testCode: "int(Counter(10).increment(5))",
        expectedOutput: "15",
      },
      {
        description: "Adding two counters with + operator",
        testCode: "repr(Counter(3) + Counter(7))",
        expectedOutput: "'Counter(10)'",
      },
      {
        description: "Chain increment and int cast",
        testCode: "int(Counter().increment().increment(2))",
        expectedOutput: "3",
      },
    ],
    authorTip: "Dunder methods make your custom classes behave just like built-in Python primitives!",
  },
  {
    id: "puzzle-word-frequency",
    title: "Word Frequency Counter",
    category: "Logic",
    difficulty: "Easy",
    bonusCredits: 50,
    description: `Write a function \`word_frequencies(sentence: str) -> dict[str, int]\` that counts the occurrences of each word in a string.
- Words should be case-insensitive (convert all words to lowercase).
- Ignore leading and trailing punctuation attached to words (or split on whitespace and strip punctuation).
- Return a dictionary mapping each word to its frequency.

Example:
\`word_frequencies("The dog saw the cat and the dog barked")\`
-> \`{'the': 3, 'dog': 2, 'saw': 1, 'cat': 1, 'and': 1, 'barked': 1}\``,
    starterCode: `def word_frequencies(sentence: str) -> dict[str, int]:
    # Your code here
    pass
`,
    hints: [
      "Split sentence with sentence.lower().split().",
      "Strip punctuation with word.strip('.,!?:;') if needed.",
      "Use dict.get(word, 0) + 1 to increment counts.",
    ],
    testCases: [
      {
        description: "Repeated words counting",
        testCode: "word_frequencies('The dog saw the cat and the dog barked')['the']",
        expectedOutput: "3",
      },
      {
        description: "Case-insensitive counting",
        testCode: "word_frequencies('Python python PYTHON')['python']",
        expectedOutput: "3",
      },
      {
        description: "Single word frequency",
        testCode: "word_frequencies('hello world')['world']",
        expectedOutput: "1",
      },
    ],
    authorTip: "In standard library Python, `collections.Counter` does this automatically, but building it manually strengthens core dictionary fluency.",
  },
  {
    id: "puzzle-martian-rover-oop",
    title: "OOP Martian Rover",
    category: "OOPS",
    difficulty: "Medium",
    bonusCredits: 60,
    description: `Design a Mars Rover class \`Rover\` that navigates a 2D coordinate grid.
1. \`__init__(self, x: int = 0, y: int = 0)\` initializes position at coordinates (x, y).
2. Method \`move(self, command: str)\` accepts a command string of directions:
   - 'N': increase y by 1
   - 'S': decrease y by 1
   - 'E': increase x by 1
   - 'W': decrease x by 1
   Commands can be chained like \`"NNESW"\`.
3. Method \`position(self) -> tuple[int, int]\` returns \`(self.x, self.y)\`.
4. Method \`distance_from_origin(self) -> int\` returns Manhattan distance \`abs(x) + abs(y)\`.`,
    starterCode: `class Rover:
    def __init__(self, x: int = 0, y: int = 0):
        self.x = x
        self.y = y

    def move(self, command: str):
        # Iterate over characters in command and adjust self.x, self.y
        pass

    def position(self) -> tuple[int, int]:
        return (self.x, self.y)

    def distance_from_origin(self) -> int:
        return abs(self.x) + abs(self.y)
`,
    hints: [
      "Loop over each char in command: if char == 'N': self.y += 1 ...",
      "Make sure to return self if you want method chaining, or test position directly.",
    ],
    testCases: [
      {
        description: "Moving North twice and East once",
        testCode: "r = Rover(0, 0); r.move('NNE'); r.position()",
        expectedOutput: "(1, 2)",
      },
      {
        description: "Round trip back to origin",
        testCode: "r = Rover(5, 5); r.move('NESW'); r.position()",
        expectedOutput: "(5, 5)",
      },
      {
        description: "Manhattan distance from origin",
        testCode: "r = Rover(0, 0); r.move('NNNEE'); r.distance_from_origin()",
        expectedOutput: "5",
      },
    ],
    authorTip: "Stateful classes excel at modeling robots, game characters, and simulation agents.",
  },
  {
    id: "puzzle-anagram-detector",
    title: "Secret Code Anagrams",
    category: "Strings",
    difficulty: "Easy",
    bonusCredits: 45,
    description: `Write a function \`are_anagrams(word1: str, word2: str) -> bool\` that checks whether two words are anagrams of each other (contain the exact same letters in different order).
- Disregard whitespace and letter casing.

Examples:
\`are_anagrams("listen", "silent")\` -> \`True\`
\`are_anagrams("Debit Card", "Bad Credit")\` -> \`True\`
\`are_anagrams("apple", "pale")\` -> \`False\``,
    starterCode: `def are_anagrams(word1: str, word2: str) -> bool:
    # Clean both strings (lowercase, remove spaces)
    # Check if sorted letters are identical
    pass
`,
    hints: [
      "Remove spaces with .replace(' ', '') and convert to .lower().",
      "Compare sorted lists of characters: sorted(clean1) == sorted(clean2)",
    ],
    testCases: [
      {
        description: "Classic anagram: listen and silent",
        testCode: "are_anagrams('listen', 'silent')",
        expectedOutput: "True",
      },
      {
        description: "Multi-word anagram with spaces: Debit Card and Bad Credit",
        testCode: "are_anagrams('Debit Card', 'Bad Credit')",
        expectedOutput: "True",
      },
      {
        description: "Different letter counts: apple and pale",
        testCode: "are_anagrams('apple', 'pale')",
        expectedOutput: "False",
      },
    ],
    authorTip: "Sorting both strings takes O(N log N) time, while a frequency hash map takes O(N) linear time!",
  },
  {
    id: "puzzle-flatten-nested-list",
    title: "Matrix Flattener",
    category: "Algorithms",
    difficulty: "Medium",
    bonusCredits: 55,
    description: `Write a function \`flatten_matrix(matrix: list[list[int]]) -> list[int]\` that converts a 2D list of integers into a single 1D list in row-major order.

Example:
\`flatten_matrix([[1, 2, 3], [4, 5], [6, 7, 8, 9]])\` -> \`[1, 2, 3, 4, 5, 6, 7, 8, 9]\``,
    starterCode: `def flatten_matrix(matrix: list[list[int]]) -> list[int]:
    # You can use a nested list comprehension: [item for row in matrix for item in row]
    pass
`,
    hints: [
      "Syntax for nested list comprehension: [item for row in matrix for item in row]",
      "Or initialize an empty list and use .extend(row) for each row.",
    ],
    testCases: [
      {
        description: "Standard 3x3 matrix flattening",
        testCode: "flatten_matrix([[1, 2, 3], [4, 5, 6], [7, 8, 9]])",
        expectedOutput: "[1, 2, 3, 4, 5, 6, 7, 8, 9]",
      },
      {
        description: "Irregular row lengths",
        testCode: "flatten_matrix([[1], [2, 3], [], [4]])",
        expectedOutput: "[1, 2, 3, 4]",
      },
      {
        description: "Empty matrix",
        testCode: "flatten_matrix([])",
        expectedOutput: "[]",
      },
    ],
    authorTip: "Nested list comprehensions read left-to-right in the same order as nested for-loops!",
  },
  {
    id: "puzzle-invert-dictionary",
    title: "Dictionary Inverter",
    category: "Pythonic",
    difficulty: "Medium",
    bonusCredits: 55,
    description: `Write a function \`invert_dict(d: dict) -> dict\` that inverts a dictionary so that values become keys and keys become values.
Assume all values in the original dictionary are unique and hashable.

Example:
\`invert_dict({"a": 1, "b": 2, "c": 3})\` -> \`{1: "a", 2: "b", 3: "c"}\``,
    starterCode: `def invert_dict(d: dict) -> dict:
    # Use a dictionary comprehension: {val: key for key, val in d.items()}
    pass
`,
    hints: [
      "Use dict comprehension: {v: k for k, v in d.items()}",
    ],
    testCases: [
      {
        description: "Basic dictionary inversion",
        testCode: "invert_dict({'a': 1, 'b': 2, 'c': 3})[2]",
        expectedOutput: "'b'",
      },
      {
        description: "String to string inversion",
        testCode: "invert_dict({'apple': 'red', 'banana': 'yellow'})['yellow']",
        expectedOutput: "'banana'",
      },
      {
        description: "Empty dictionary",
        testCode: "invert_dict({})",
        expectedOutput: "{}",
      },
    ],
    authorTip: "Dictionary comprehensions `{v: k for k, v in d.items()}` are clean, expressive, and run at C speed.",
  },
  {
    id: "puzzle-fibonacci-gen",
    title: "Fibonacci Generator",
    category: "Algorithms",
    difficulty: "Tricky",
    bonusCredits: 70,
    description: `Write a Python generator function \`fibonacci_sequence(n: int)\` that yields the first \`n\` numbers in the Fibonacci sequence starting with \`0, 1, 1, 2, 3, 5, 8...\`.

Example:
\`list(fibonacci_sequence(5))\` -> \`[0, 1, 1, 2, 3]\``,
    starterCode: `def fibonacci_sequence(n: int):
    # Use yield to stream each number
    a, b = 0, 1
    for _ in range(n):
        yield a
        a, b = b, a + b
`,
    hints: [
      "Use tuple unpacking: a, b = b, a + b to compute the next term seamlessly.",
      "The generator yields a at each iteration.",
    ],
    testCases: [
      {
        description: "First 6 Fibonacci numbers",
        testCode: "list(fibonacci_sequence(6))",
        expectedOutput: "[0, 1, 1, 2, 3, 5]",
      },
      {
        description: "Zero terms returns empty list",
        testCode: "list(fibonacci_sequence(0))",
        expectedOutput: "[]",
      },
      {
        description: "Single term",
        testCode: "list(fibonacci_sequence(1))",
        expectedOutput: "[0]",
      },
    ],
    authorTip: "Generators have O(1) space complexity because they produce items on-demand without allocating full lists in memory.",
  },
];

/**
 * Deterministically picks a daily puzzle based on date string (YYYY-MM-DD).
 */
export function getDailyPuzzle(dateString?: string): DailyPuzzle {
  const dateKey = dateString || new Date().toISOString().split("T")[0];
  let hash = 0;
  for (let i = 0; i < dateKey.length; i++) {
    hash = (hash << 5) - hash + dateKey.charCodeAt(i);
    hash |= 0;
  }
  const index = Math.abs(hash) % DAILY_PUZZLES.length;
  return DAILY_PUZZLES[index];
}

/**
 * Returns a randomized puzzle from the pool (optionally excluding a specific ID).
 */
export function getRandomPuzzle(excludeId?: string): DailyPuzzle {
  const pool = excludeId
    ? DAILY_PUZZLES.filter((p) => p.id !== excludeId)
    : DAILY_PUZZLES;
  const randomIndex = Math.floor(Math.random() * pool.length);
  return pool[randomIndex] || DAILY_PUZZLES[0];
}
