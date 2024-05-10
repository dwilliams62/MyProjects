import time
import random
import json

def roll_damage(num_sides):
    roll_sum = sum(random.randint(1, num_sides) for _ in range(27))
    return roll_sum + 6

def main():
    num_rolls = 10000
    total_time = 0
    averages = {}
    
    for num_sides in range(1, 51):
        damage_sum = 0
        start_time = time.time()
        for _ in range(num_rolls):
            damage = roll_damage(num_sides)
            damage_sum += damage
        total_time = time.time() - start_time

        average_damage = damage_sum / num_rolls
        averages[num_sides] = {
            "average_damage": round(average_damage),
            "execution_time": total_time
        }

    with open("averages.json", "w") as json_file:
        json.dump(averages, json_file, indent=4)

if __name__ == "__main__":
    main()