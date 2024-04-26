import colorama
from colorama import Fore, Style
import time

# Initialize colorama
colorama.init()

workers = {
    1: {"name": "Worker1", "status": "Green"},
    2: {"name": "Worker2", "status": "Green"},
    3: {"name": "Worker3", "status": "Green"},
    4: {"name": "Worker4", "status": "Green"},
    5: {"name": "Worker5", "status": "Green"}
}

def display_status():
    print(f"\n{'-' * 30}WORKER STATUS{'-' * 30}\n")
    for worker_id, worker in workers.items():
        name = worker["name"]
        status = worker["status"]
        color = get_color(status)
        print(f"{worker_id}: {color}{name}: {status}{Style.RESET_ALL}")

def get_color(status):
    if status == "Green":
        return Fore.GREEN
    elif status == "Yellow":
        return Fore.YELLOW
    elif status == "Red":
        return Fore.RED
    else:
        return Fore.WHITE

def update_status():
    worker_id = int(input("Enter the ID of the worker to update status: "))
    if worker_id in workers:
        new_status = input("Enter the new status (Green, Yellow, Red): ").lower()
        while new_status not in ("green", "yellow", "red"):
            print("Invalid status. Please enter again.")
            new_status = input("Enter the new status (Green, Yellow, Red): ").lower()
        workers[worker_id]["status"] = new_status
        print("Status updated successfully.")
    else:
        print("Worker ID not found.")

def main():
    continue_loop = True
    while continue_loop:
        display_status()
        command = input("\nEnter 'update' to update a worker status, 'quit' to exit: ").lower()

        if command == 'update':
            update_status()
        elif command == 'quit':
                continue_loop = False
        else:
            print("Invalid command. Please try again.")       
        time.sleep(2)  # Delay before re-displaying status (You can remove this if you want)

if __name__ == "__main__":
    main()  