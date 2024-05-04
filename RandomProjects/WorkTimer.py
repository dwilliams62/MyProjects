# Delivery Simulator - Dylan Williams 5/3/24
# This program simulates a delivery route, allowing the user to input the number of stops and the time it takes to complete each stop.
# The user can also choose to add additional information about each stop, such as the address, weight, vision number, customer notes, house notes, and delivery location.
# The program then simulates the delivery route, displaying the time left and the number of stops remaining.


import time
import threading
import keyboard

class Stop:
    def __init__(self):
        self.address = ""
        self.weight = 0
        self.vision_number = ""
        self.customer_notes = ""
        self.house_notes = ""
        self.delivery_location = ""

def main():
    # Get the number of stops from the user
    num_stops = int(input("Enter the number of stops for today: "))

    # Calculate the total time for the delivery route
    total_time = num_stops * 3

    # Print the total time for the delivery route
    print(f"You have {num_stops} stops today. It will take {total_time} minutes.")

    # Initialize an empty list to hold the stops
    stops = []

    # Initialize a variable to track whether auto-skip is enabled
    auto_skip = False

    # Loop through each stop
    for i in range(num_stops):
        # Check if auto-skip is enabled
        if auto_skip:
            # If auto-skip is enabled, skip the current stop
            print(f"Stop {i+1}: Auto-skipped")
            stops.append(Stop())
            continue

        # Ask the user if they want to add info for the current stop
        response = input(f"Stop {i+1}: Do you want to add info (y/n) or skip (s) or auto-skip all (a)? ")

        # Check the user's response
        if response.lower() == 'a':
            # If the user chooses auto-skip, enable auto-skip and skip the current stop
            auto_skip = True
            print(f"Stop {i+1}: Auto-skipped")
            stops.append(Stop())
            continue
        elif response.lower() == 's':
            # If the user chooses to skip the current stop, skip it
            stops.append(Stop())
            continue

        # Create a new stop object
        stop = Stop()

        # Print the current stop number
        print(f"Stop {i+1}:")

        # Ask the user if they want to add an address for the current stop
        if input("Do you want to add address? (y/n): ").lower() == 'y':
            stop.address = input("Enter address: ")

        # Ask the user if they want to add a weight for the current stop
        if input("Do you want to add weight? (y/n): ").lower() == 'y':
            stop.weight = float(input("Enter weight: "))

        # Ask the user if they want to add a vision number for the current stop
        if input("Do you want to add vision number? (y/n): ").lower() == 'y':
            stop.vision_number = input("Enter vision number: ")

        # Ask the user if they want to add customer notes for the current stop
        if input("Do you want to add customer notes? (y/n): ").lower() == 'y':
            stop.customer_notes = input("Enter customer notes: ")

        # Ask the user if they want to add house notes for the current stop
        if input("Do you want to add house notes? (y/n): ").lower() == 'y':
            stop.house_notes = input("Enter house notes: ")

        # Ask the user if they want to add a delivery location for the current stop
        if input("Do you want to add delivery location? (y/n): ").lower() == 'y':
            stop.delivery_location = input("Enter delivery location: ")

        # Add the current stop to the list of stops
        stops.append(stop)

    # Print a header to separate the stop info from the start day message
    print("\n-----------------------------------------------")
    print("          Are You Ready To Start Your Day?       ")
    print("-----------------------------------------------\n")

    # Ask the user if they are ready to start their day
    response = input("Would you like to start your day (y/n)? ")

    # Check the user's response
    if response.lower() == 'y':
        # If the user is ready to start their day, start the day
        start_day(stops, total_time)
    elif response.lower() == 'n':
        # If the user is not ready to start their day, do nothing
        pass
    else:
        # If the user enters an invalid response, print an error message
        print("Invalid response. Please try again.")

def start_day(stops, total_time):
    start_time = time.time()
    end_time = start_time + total_time * 60

    remaining_stops = len(stops)
    remaining_time = total_time
    speed_multiplier = 1

    def decrease_stop():
        nonlocal remaining_stops, speed_multiplier
        remaining_stops -= 1
        if remaining_stops % 5 == 0 and remaining_stops > 0:
            speed_multiplier += 0.2

    def timer():
        nonlocal remaining_time
        while time.time() < end_time:
            elapsed_time = time.time() - start_time
            remaining_time = total_time - int(elapsed_time / 60 / speed_multiplier)
            print(f"Time left: {remaining_time:02d} minutes. Stops left: {remaining_stops:02d}", end='\r')

            time.sleep(5 / speed_multiplier)  # wait 5 seconds

    thread = threading.Thread(target=timer)
    thread.daemon = True
    thread.start()

    while remaining_stops > 0 and remaining_time > 0:
        if keyboard.is_pressed('space'):
            decrease_stop()
            print(f"Time left: {remaining_time:02d} minutes. Stops left: {remaining_stops:02d}", end='\r')
            time.sleep(0.1)  # delay to prevent multiple stops being decreased at once

    print("\nYour day has ended.")

    if remaining_stops == 0:
        print("You've completed all your stops!")
    else:
        print(f"You've run out of time! You had {remaining_stops} stops left.")

if __name__ == "__main__":
    main()