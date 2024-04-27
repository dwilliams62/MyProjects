from initiative_tracker import InitiativeTracker
import os
import random
import math
import json

def main():
    tracker = InitiativeTracker()
    initiative_tracker_dir = os.path.join(os.getcwd(), "Initiative_Tracker")
    characters_file = os.path.join(initiative_tracker_dir, "characterInfo.json")

    while True:
        os.system('cls' if os.name == 'nt' else 'clear')  # Clear the screen
        tracker.print_initiative()
        print()
        print("\033[1;32m- Enter 'a' to add character\033[0m")
        print("\033[1;32m- Enter 'l' to load a character from storage\033[0m")          
        print("\033[1;35m- Enter 'w' to write a character to JSON file.\033[0m")
        print("\033[1;36m- Enter 'h' to change character's HP\033[0m")
        print("\033[1;33m- Enter 's' to add status condition\033[0m")
        print("\033[1;34m- Enter 'c' to remove status condition\033[0m")                  
        print("\033[1;31m- Enter 'r' to remove character\033[0m")
        if tracker.characters and tracker.characters[tracker.current_turn].is_henchman:
            print("\033[1;34m- Enter 'x' to attack with a henchman attack\033[0m") 
        print("\033[1;32m- Enter 'n' for next turn\033[0m")
        print("\033[1;31m- Enter 'quit' to quit\033[0m")
        choice = input("Choose an option: ")

        if choice.lower() == "a":
            add_character(tracker)
        elif choice.lower() == "l":
            load_characters_from_json(characters_file, tracker)  # Refactor to a function
        elif choice.lower() == "w":
            write_character_to_json(characters_file, tracker)  # Refactor to a function
        elif choice.lower() == "h":
            change_characters_hp(tracker)  # Refactored
        elif choice.lower() == "s":
            add_status_condition(tracker)  # Add status, refactored
        elif choice.lower() == "c":
            remove_status_condition(tracker) # Remove status, refactored
        elif choice.lower() == "r":
            remove_character(tracker)  # Refactored
        elif choice.lower() == "x" and tracker.characters[tracker.current_turn].is_henchman:
            perform_henchman_attack(tracker)
        elif choice.lower() == "n":
            tracker.next_turn()
        elif choice.lower() == "quit":
            print("Goodbye!")
            break
        else:
            print("\033[1;31mInvalid choice. Please choose a valid option.\033[0m")


#
#   Takes in a character's name, AC, current HP, max HP, and initative to add them to the current list.
#
def add_character(tracker):
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


#
#  Takes in a name from the user and searches for that user in the character info JSON.
#  If found, asks for the initiative of the character if they aren't a henchman, or
#  the number of them added if they are.
#
def load_characters_from_json(characters_file, tracker):
    try:
        name = input("Enter the character name to load: ")

        with open(characters_file, 'r') as file:
            existing_characters = json.load(file)

        character_found = False
        for char in existing_characters:
            if char['name'] == name:
                character_found = True
                if char['is_henchman']:
                    num_henchmen = int(input(f"How many {name}s would you like to add: "))
                    for _ in range(num_henchmen):                   
                        initiative = random.randint(1, 20) + char.get('initiative_modifier', 0)
                        tracker.add_character(name, initiative, char['ac'], char['current_hp'], char['max_hp'], True, char['attack_name'], char['attack_bonus'], char['attack_damage'], char['attack_type']) 
                else:
                    initiative = int(input(f"Enter initiative for {name}: "))
                    tracker.add_character(name, initiative, char['ac'], char['current_hp'], char['max_hp'])
                break  # Exit the loop once character is added

    except (json.JSONDecodeError, FileNotFoundError):
        print("No character data found or error loading characters.")
    except KeyError:
        print("Character information is incomplete or corrupted in the JSON file.")
            
    if not character_found:
        print(f"Character with the name '{name}' not found.")


#
#  Takes in information about a character and appends them to the end of the JSON file
#
def write_character_to_json(characters_file, tracker):
    name = input("Enter the name of the character: ")
    ac = int(input("Enter the AC of the character: "))
    current_hp = int(input("Enter the current HP of the character: "))
    max_hp = int(input("Enter the maximum HP of the character: "))

    is_henchman = input("Is this enemy a henchman? (y/n): ").lower()
    if is_henchman == 'y':
        is_henchman = True
        attack_name = input("Enter attack name: ")
        attack_bonus = int(input("Enter attack to hit bonus: "))
        attack_damage = input("Enter attack damage (e.g., 2d6+4): ")
        attack_type = input("Enter attack damage type: ")
        initiative_modifier = int(input("Enter the initiative modifier of the enemy: "))
    else:
        is_henchman = False

    # Create a character dictionary to store the data
    character = {
        "name": name,
        "ac": ac,
        "current_hp": current_hp,
        "max_hp": max_hp,
        "is_henchman": is_henchman,
        "attack_name": attack_name if is_henchman else None, 
        "attack_bonus": attack_bonus if is_henchman else None,
        "attack_damage": attack_damage if is_henchman else None,
        "attack_type": attack_type if is_henchman else None,
        "initiative_modifier": initiative_modifier if is_henchman else None
    }
            
    #Load existing characters from JSON file (if any)
    with open(characters_file, 'r') as file:
        try:
            existing_characters = json.load(file)
        except json.JSONDecodeError:
            existing_characters = []
    
    # Append the new character to the list
    existing_characters.append(character)

    # Save the updated characters back to the JSON file
    with open(characters_file, 'w') as file:
        json.dump(existing_characters, file, indent=2)


#
#  Takes in information about a status condition and adds it to the specified character
#
def add_status_condition(tracker):
    try:
        num = int(input("Enter character number: "))
        condition = input("Enter status condition: ")

        print("Enter duration in the following format:")
        print("  * For effects at the beginning of a turn: '<number> turns (B)'")
        print("  * For effects at the end of a turn: '<number> turns (E)'")
        print("Example: '3 turns (E)' for an effect ending after 3 of the character's turns.")
        duration = input("Enter duration: ")

        tracker.characters[num - 1].add_status_condition(condition, duration)
    except (ValueError, IndexError):
        print("\033[1;31mInvalid input. Please enter a valid character number.\033[0m")
        input("Press Enter to continue...")


#
#   Removes a specified status condition from a user by name.
#
def remove_status_condition(tracker):
    try:
        num = int(input("Enter character number: "))
        condition = input("Enter status condition to remove: ")
        tracker.characters[num - 1].remove_status_condition(condition)
    except (ValueError, IndexError):
        print("\033[1;31mInvalid input. Please enter a valid character number.\033[0m")
        input("Press Enter to continue...")


#
#   Takes in a number to change the specified character's HP by
#
def change_characters_hp(tracker):
    try:
        num = int(input("Enter character number: "))
        hp_change = int(input("Enter HP change (negative to subtract, positive to add): "))
        tracker.characters[num - 1].change_hp(hp_change)
    except (ValueError, IndexError):
        print("\033[1;31mInvalid input. Please enter a valid character number and HP change.\033[0m")
        input("Press Enter to continue...")


#
#  Removes a character from the initative list
#
def remove_character(tracker):
    try:
        num = int(input("Enter character number to remove: "))
        tracker.remove_character(num)
    except (ValueError, IndexError):
        print("\033[1;31mInvalid input. Please enter a valid character number.\033[0m")
        input("Press Enter to continue...")


#
#  Uses information present in the storage of the character to automatically perform an attack (or basically
#  just rolls the number for it). The user decides who takes the attack or to just let it go.
#
def perform_henchman_attack(tracker):
    attack_roll, damage = tracker.perform_henchman_attack(tracker.current_turn)
    print("Would you like to apply this damage to someone?")
    num = input("Enter a number in the initative list, or anytihng else to discard the damage: ")
    if num.isdigit():
        num = int(num)
        if 1 <= int(num) <= len(tracker.characters):
            if tracker.characters[num-1].ac == attack_roll:
                tracker.characters[num-1].change_hp(math.ceil(damage / 2 * -1))
            if tracker.characters[num-1].ac < attack_roll:
                tracker.characters[num-1].change_hp(math.ceil(damage * -1))

if __name__ == "__main__":
    main()