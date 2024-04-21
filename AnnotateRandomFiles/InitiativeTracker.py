import os

class Character:
    def __init__(self, name, initiative):
        self.name = name
        self.initiative = initiative

class InitiativeTracker:
    def __init__(self):
        self.characters = []
        self.current_turn = 0

    def add_character(self, name, initiative):
        if initiative < 0:
            print("Initiative value must be a non-negative integer.")
            return
        self.characters.append(Character(name, initiative))

    def remove_character(self, num):
        if not isinstance(num, int) or num <= 0:
            print("Invalid character number. Please enter a positive integer.")
            return
        try:
            del self.characters[num - 1]
            if num - 1 < self.current_turn:
                self.current_turn -= 1
            elif num - 1 == self.current_turn and self.current_turn > 0:
                self.current_turn -= 1
        except IndexError:
            print("Invalid character number.")

    def sort_initiative(self):
        self.characters.sort(key=lambda x: x.initiative, reverse=True)

    def print_initiative(self):
        os.system('cls' if os.name == 'nt' else 'clear')
        print("\nInitiative List:")
        for i, character in enumerate(self.characters, 1):
            if i == self.current_turn + 1:
                print(f"==> {i}. {character.name}: {character.initiative} <==")
            else:
                print(f"{i}. {character.name}: {character.initiative}")

    def next_turn(self):
        if self.current_turn < len(self.characters) - 1:
            self.current_turn += 1
        else:
            self.current_turn = 0

def main():
    tracker = InitiativeTracker()

    while True:
        print("\nInitiative Tracker")
        print("1. Add Character")
        print("2. Sort and Start Combat")
        print("3. Quit")

        choice = input("Choose an option: ")

        if choice == "1":
            name = input("Enter character's name: ")
            try:
                initiative = int(input("Enter character's initiative: "))
                tracker.add_character(name, initiative)
            except ValueError:
                print("Invalid initiative value. Please enter a non-negative integer.")
        elif choice == "2":
            tracker.sort_initiative()
            tracker.print_initiative()
            break
        elif choice == "3":
            break
        else:
            print("Invalid choice. Please choose again.")

    if tracker.characters:
        while True:
            tracker.print_initiative()
            print(f"\nCurrent turn: {tracker.characters[tracker.current_turn].name}")
            print("1. Next Turn")
            print("2. Remove Character")
            print("3. Quit")

            choice = input("Choose an option: ")

            if choice == "1":
                tracker.next_turn()
            elif choice == "2":
                num = int(input("Enter character's number to remove: "))
                tracker.remove_character(num)
            elif choice == "3":
                print("\033[92mThanks for using the Initiative Tracker! Have a great day!\033[0m")
                break
            else:
                print("Invalid choice. Please choose again.")
    else:
        print("\033[92mThanks for using the Initiative Tracker! Have a great day!\033[0m")

if __name__ == "__main__":
    main()