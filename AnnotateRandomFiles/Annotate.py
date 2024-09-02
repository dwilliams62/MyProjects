import tkinter as tk
import random

def roll_dice():
    """Rolls the selected number of dice and displays the results."""
    selected_die = die_var.get()
    num_dice = int(num_dice_entry.get())
    results = []
    for _ in range(num_dice):
        if selected_die == "D2":
            result = random.randint(1, 2)
        elif selected_die == "D4":
            result = random.randint(1, 4)
        # ... (similar logic for other dice types)
        results.append(result)
    total = sum(results)
    results_text.set(f"Results: {results}\nTotal: {total}")  # Update results_text

def clear_results():  # New function to clear results
  results_text.set("")  # Set results_text to empty string

root = tk.Tk()
root.title("Dice Roller")

die_var = tk.StringVar()
die_var.set("D6")  # Default die type

die_menu = tk.OptionMenu(
    root, die_var, "D2", "D4", "D6", "D8", "D10", "D12", "D20"
)
die_menu.pack()

num_dice_entry = tk.Entry(root)
num_dice_entry.pack()

# Call clear_results before rolling dice on button click
roll_button = tk.Button(root, text="Roll", command=lambda: [clear_results(), roll_dice()])
roll_button.pack()

results_text = tk.StringVar()
results_label = tk.Label(root, textvariable=results_text)
results_label.pack()

root.mainloop()