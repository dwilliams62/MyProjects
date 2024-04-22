import os
import random
import re

class Character:
    def __init__(self, name, initiative, ac, current_hp, max_hp, is_henchman = False,
                 attack_name = None, attack_bonus = None, attack_damage = None, attack_type = None):
        self.name = name
        self.initiative = initiative
        self.ac = ac
        self.current_hp = current_hp
        self.max_hp = max_hp
        self.status_conditions = []
        self.is_henchman = is_henchman
        self.attack_name = attack_name
        self.attack_bonus = attack_bonus
        self.attack_damage = attack_damage
        self.attack_type = attack_type

    def add_status_condition(self, condition, duration):
        self.status_conditions.append((condition, duration))

    def remove_status_condition(self, condition):
        self.status_conditions = [(c, d) for c, d in self.status_conditions if c != condition]

    def change_hp(self, hp_change):
        new_hp = self.current_hp + hp_change
        if new_hp < 0:
            self.current_hp = 0
        elif new_hp > self.max_hp:
            self.current_hp = self.max_hp
        else:
            self.current_hp = new_hp

    def __str__(self):
        output = f"{self.initiative}: {self.name}, AC: {self.ac}, Current HP: {self.current_hp} / {self.max_hp}"
        if self.status_conditions:
            output += "; " + "; ".join(f"{condition}, {duration}" for condition, duration in self.status_conditions)
        return output

class InitiativeTracker:
    def __init__(self):
        self.characters = []
        self.current_turn = 0
    
    def add_character(self, name, initiative, ac, current_hp, max_hp, is_henchman = False, 
                      attack_name = None, attack_bonus = None, attack_damage = None, attack_type = None):
        if initiative < 0:
            print("Initiative value must be a non-negative integer.")
            return
        if not self.characters:  # Check if there are no characters
            self.characters.append(Character(name, initiative, ac, current_hp, max_hp, is_henchman, attack_name, attack_bonus, attack_damage, attack_type))
            self.sort_initiative()
            self.current_turn = 0  # Set the current turn to the first character
        else:
            current_turn_name = self.characters[self.current_turn].name
            self.characters.append(Character(name, initiative, ac, current_hp, max_hp, is_henchman, attack_name, attack_bonus, attack_damage, attack_type))
            self.sort_initiative()
            for i, character in enumerate(self.characters):
                if character.name == current_turn_name:
                    self.current_turn = i
                    break

    def remove_character(self, num):
        if not isinstance(num, int) or num <= 0:
            return
        try:
            del self.characters[num - 1]
            if num - 1 < self.current_turn:
                self.current_turn -= 1
            elif num - 1 == self.current_turn and self.current_turn >= len(self.characters):
                self.current_turn = len(self.characters) - 1
        except IndexError:
            return

    def sort_initiative(self):
        self.characters.sort(key=lambda x: x.initiative, reverse=True)

    def print_initiative(self):
        os.system('cls' if os.name == 'nt' else 'clear')
        print("\nInitiative List:")
        for i, character in enumerate(self.characters, 1):
            if i == self.current_turn + 1:
                print(f"==> {i}. {character} <==")
            else:
                print(f"{i}. {character}")

    def next_turn(self):
        ending_turn = self.characters[self.current_turn]
        starting_turn = self.characters[(self.current_turn + 1) % len(self.characters)]

        found_status_condition = False

        print()

        for i, (condition, duration) in enumerate(ending_turn.status_conditions):
            if duration.endswith("(E)"):
                print(f"Don't forget, {ending_turn.name} is {condition}!")
                found_status_condition = True
                if "turn" in duration.lower():
                    turns_left = int(duration.split(" ")[0]) - 1
                    if turns_left == 0:
                        print(f"{ending_turn.name}'s {condition} is over!")
                        del ending_turn.status_conditions[i]
                    else:
                        ending_turn.status_conditions[i] = (condition, f"{turns_left} turn{(turns_left > 1) * 's'} (E)")

        for i, (condition, duration) in enumerate(starting_turn.status_conditions):
            if duration.endswith("(B)"):
                print(f"Good goly! {starting_turn.name} is {condition}!")
                found_status_condition = True
                if "turn" in duration.lower():
                    turns_left = int(duration.split(" ")[0]) - 1
                    if turns_left == 0:
                        print(f"{starting_turn.name}'s {condition} is over!")
                        del starting_turn.status_conditions[i]
                    else:
                        starting_turn.status_conditions[i] = (condition, f"{turns_left} turn{(turns_left > 1) * 's'} (B)")

        if found_status_condition:
            input("Press Enter to continue...")

        self.current_turn = (self.current_turn + 1) % len(self.characters)

    def perform_henchman_attack(self, index):
        character = self.characters[index]

        attack_roll = random.randint(1, 20) + character.attack_bonus
        print(f"{character.name} attacks with a roll of {attack_roll}")

        damage_dice_str = character.attack_damage
        damage = self.roll_dice(damage_dice_str)
        print(f"{character.name} deals {damage} {character.attack_type} damage!")
        return attack_roll, damage

    def roll_dice(self, dice_str):  
        import random
        try:
            num_dice, die_type, modifier = map(int, re.findall(r"(\d+)d(\d+)([+-]\d+)?", dice_str)[0])
            rolls = [random.randint(1, die_type) for _ in range(num_dice)]
            total = sum(rolls) + modifier
            return total
        except:
            print("Invalid dice format.")
            return 0
