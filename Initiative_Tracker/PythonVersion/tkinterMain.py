import tkinter as tk
from tkinter import messagebox
from initiative_tracker import InitiativeTracker

class Application(tk.Frame):
    def __init__(self, master=None):
        super().__init__(master)
        self.master = master
        self.pack()
        self.create_widgets()

        self.initiative_tracker = InitiativeTracker()
        self.adding_characters = True

    def create_widgets(self):
        # Create frames to organize widgets
        self.top_frame = tk.Frame(self)
        self.top_frame.pack(side="top")
        
        self.middle_frame = tk.Frame(self)
        self.middle_frame.pack(side="top")
        
        self.bottom_frame = tk.Frame(self)
        self.bottom_frame.pack(side="bottom")

        # Create initiative list
        self.initiative_list = tk.Text(self.top_frame, width=40, height=10)
        self.initiative_list.pack(side="top")

        # Create entry fields and labels
        self.name_label = tk.Label(self.middle_frame, text="Name:")
        self.name_label.pack(side="left")
        self.name_entry = tk.Entry(self.middle_frame)
        self.name_entry.pack(side="left")
        
        self.initiative_label = tk.Label(self.middle_frame, text="Initiative:")
        self.initiative_label.pack(side="left")
        self.initiative_entry = tk.Entry(self.middle_frame)
        self.initiative_entry.pack(side="left")

        # Create buttons
        self.add_button = tk.Button(self.middle_frame)
        self.add_button["text"] = "Add Character"
        self.add_button["command"] = self.add_character
        self.add_button.pack(side="left")

        self.remove_button = tk.Button(self.middle_frame)
        self.remove_button["text"] = "Remove Character"
        self.remove_button["command"] = self.remove_character
        self.remove_button.pack(side="left")

        self.next_turn_button = tk.Button(self.bottom_frame)
        self.next_turn_button["text"] = "Next Turn"
        self.next_turn_button["command"] = self.next_turn
        self.next_turn_button.pack(side="left")
        self.next_turn_button.config(state='disabled')  # Disable the next turn button

        self.continue_button = tk.Button(self.bottom_frame)
        self.continue_button["text"] = "Continue to Combat"
        self.continue_button["command"] = self.continue_to_combat
        self.continue_button.pack(side="left")

        self.quit = tk.Button(self.bottom_frame, text="QUIT", fg="red",
                              command=self.master.destroy)
        self.quit.pack(side="right")

    def on_closing(self):
        if messagebox.askokcancel("Quit", "Do you want to quit?"):
            self.master.destroy()

    def remove_character(self):
        def get_character_number():
            try:
                character_number = int(entry.get())
                self.initiative_tracker.remove_character(character_number)
                self.update_initiative_list()
                if len(self.initiative_tracker.characters) == 0:
                    messagebox.showinfo("Combat Status", "Combat is Over!")
                    self.master.protocol("WM_DELETE_WINDOW", self.on_closing)
                    self.master.destroy()  # Close the program
                popup.destroy()
            except ValueError:
                pass

        popup = tk.Toplevel(self)
        popup.title("Remove Character")

        label = tk.Label(popup, text="Enter the number of the character to remove:")
        label.pack()

        entry = tk.Entry(popup)
        entry.pack()

        button = tk.Button(popup, text="Remove", command=get_character_number)
        button.pack()

    def add_character(self):
        if not self.adding_characters:
            return
        name = self.name_entry.get()
        initiative = int(self.initiative_entry.get())
        self.initiative_tracker.add_character(name, initiative)
        self.initiative_tracker.sort_initiative()
        self.update_initiative_list()

    def next_turn(self):
        if self.adding_characters:
            self.adding_characters = False
            self.add_button.config(state='disabled')
        self.initiative_tracker.next_turn()
        self.update_initiative_list()
        if self.initiative_tracker.current_turn == 0:
            self.continue_button.pack_forget()  # Remove the continue button
            self.continue_button.pack(side="left")  # Pack the continue button again
            self.next_turn_button.config(state='disabled')  # Disable the next turn button
            self.add_button.config(state='normal')  # Enable the add character button
            self.continue_button.config(state='normal')  # Enable the continue to combat button

    def continue_to_combat(self):
        self.add_button.config(state='disabled')
        self.continue_button.config(state='disabled')
        self.next_turn_button.config(state='normal')  # Enable the next turn button
        self.adding_characters = False

    def update_initiative_list(self):
        self.initiative_list.delete(1.0, tk.END)
        for i, character in enumerate(self.initiative_tracker.characters, 1):
            if i == self.initiative_tracker.current_turn + 1:
                self.initiative_list.insert(tk.END, f"==> {i}. {character.name}: {character.initiative} <==\n")
            else:
                self.initiative_list.insert(tk.END, f"{i}. {character.name}: {character.initiative}\n")

root = tk.Tk()
app = Application(master=root)
app.mainloop()