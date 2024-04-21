from initiative_tracker import InitiativeTracker, Character
import os
import random

def main():
    tracker = InitiativeTracker()

    while True:
        print("\033[1;35mWould you like to initialize the program with any enemies?\033[0m")
        print("\033[1;32m- Enter 'a' to add enemies\033[0m")
        print("\033[1;31m- Enter 'c' to continue\033[0m")
        choice = input("Choose an option: ")

        if choice.lower() == "a":
            num_enemies = int(input("How many of this enemy would you like to add? "))
            base_name = input("Enter the base name of the enemy: ")
            ac = int(input("Enter the AC of the enemy: "))
            max_hp = int(input("Enter the Max HP of the enemy: "))
            initiative_modifier = int(input("Enter the initiative modifier of the enemy: "))

            is_henchman = input("Is this enemy a henchman? (y/n): ").lower()
            if is_henchman == 'y':
                is_henchman = True
                attack_name = input("Enter attack name: ")
                attack_bonus = int(input("Enter attack to hit bonus: "))
                attack_damage = input("Enter attack damage (e.g., 2d6+4): ")
                attack_type = input("Enter attack damage type: ")
            else:
                is_henchman = False

            for i in range(num_enemies):
                name = base_name if num_enemies == 1 else f"{base_name} {i + 1}"
                initiative = random.randint(1, 20) + initiative_modifier
                if is_henchman:
                    name = f"{name} (H)"
                    tracker.add_character(name, initiative, ac, max_hp, max_hp, is_henchman, attack_name, attack_bonus, attack_damage, attack_type)
                else:
                    tracker.add_character(name, initiative, ac, max_hp, max_hp)

            tracker.print_initiative()
        elif choice.lower() == "c":
            break
        else:
            print("\033[1;31mInvalid choice. Please choose a valid option.\033[0m")

    while True:
        os.system('cls' if os.name == 'nt' else 'clear')
        tracker.print_initiative()
        print()
        print("\033[1;35m- Enter 'a' to add character\033[0m")
        print("\033[1;31m- Enter 'r' to remove character\033[0m")
        print("\033[1;32m- Enter 'n' for next turn\033[0m")
        print("\033[1;33m- Enter 's' to add status condition\033[0m")
        print("\033[1;34m- Enter 'c' to remove status condition\033[0m")  
        print("\033[1;36m- Enter 'h' to change character's HP\033[0m")  
        print("\033[1;34m- Enter 'quit' to quit\033[0m")
        choice = input("Choose an option: ")

        if choice.lower() == "a":
            name = input("Enter character name: ")
            try:
                initiative = int(input("Enter character initiative: "))
                ac = int(input("Enter character armor class: "))
                current_hp = int(input("Enter character current HP: "))
                max_hp = int(input("Enter character max HP: "))
                tracker.add_character(name, initiative, ac, current_hp, max_hp)
            except ValueError:
                print("\033[1;31mInvalid input. Please enter a valid number.\033[0m")
                input("Press Enter to continue...")
        elif choice.lower() == "s":
            try:
                num = int(input("Enter character number: "))
                condition = input("Enter status condition: ")
                duration = input("Enter duration: ")
                tracker.characters[num - 1].add_status_condition(condition, duration)
            except (ValueError, IndexError):
                print("\033[1;31mInvalid input. Please enter a valid character number.\033[0m")
                input("Press Enter to continue...")
        elif choice.lower() == "c":
            try:
                num = int(input("Enter character number: "))
                condition = input("Enter status condition to remove: ")
                tracker.characters[num - 1].remove_status_condition(condition)
            except (ValueError, IndexError):
                print("\033[1;31mInvalid input. Please enter a valid character number.\033[0m")
                input("Press Enter to continue...")
        elif choice.lower() == "h":  
            try:
                num = int(input("Enter character number: "))
                hp_change = int(input("Enter HP change (negative to subtract, positive to add): "))
                tracker.characters[num - 1].change_hp(hp_change)
            except (ValueError, IndexError):
                print("\033[1;31mInvalid input. Please enter a valid character number and HP change.\033[0m")
                input("Press Enter to continue...")
        elif choice.lower() == "r":
            try:
                num = int(input("Enter character number to remove: "))
                tracker.remove_character(num)
            except (ValueError, IndexError):
                print("\033[1;31mInvalid input. Please enter a valid character number.\033[0m")
                input("Press Enter to continue...")
        elif choice.lower() == "n":
            tracker.next_turn()
        elif choice.lower() == "quit":
            break
        else:
            print("\033[1;31mInvalid choice. Please choose a valid option.\033[0m")
            input("Press Enter to continue...")

if __name__ == "__main__":
    main()