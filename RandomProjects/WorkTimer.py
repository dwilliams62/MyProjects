import time
import threading
import keyboard

def main():
    while True:
        num_stops = int(input("Enter the number of stops for today: "))
        total_time = num_stops * 3
        print(f"You have {num_stops} stops today. It will take {total_time} minutes.")
        
        response = input("Would you like to start your day (y/n)? ")
        
        if response.lower() == 'y':
            start_day(num_stops, total_time)
            break  # exit the loop after starting the day
        elif response.lower() == 'n':
            continue
        else:
            print("Invalid response. Please try again.")

def start_day(num_stops, total_time):
    start_time = time.time()
    end_time = start_time + total_time * 60
    
    remaining_stops = num_stops
    remaining_time = total_time
    speed_multiplier = 1.0
    
    def decrease_stop():
        nonlocal remaining_stops, speed_multiplier
        remaining_stops -= 1
        if remaining_stops % 5 == 0 and remaining_stops > 0:
            speed_multiplier += 0.2
        
    def timer():
        nonlocal remaining_time, speed_multiplier
        while time.time() < end_time:
            elapsed_time = time.time() - start_time
            remaining_time = total_time - int(elapsed_time / 60 * speed_multiplier)
            print(f"Time left: {remaining_time:02d} minutes. Stops left: {remaining_stops:02d}", end='\r')
            
            time.sleep(5)  # wait 5 seconds
            
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