import tkinter as tk
from tkinter import ttk, messagebox
import sqlite3

# Connect to database or create one
def create_database():
    conn = sqlite3.connect('medicine_management.db')
    c = conn.cursor()
    c.execute('''
        CREATE TABLE IF NOT EXISTS medicines (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            generic_name TEXT NOT NULL,
            information TEXT NOT NULL,
            usage TEXT NOT NULL,
            complication TEXT NOT NULL,
            warning TEXT NOT NULL
        )
    ''')
    conn.commit()
    conn.close()

create_database()

# Main application
class ManagementApp:
    def __init__(self, root):
        self.root = root
        self.root.title("Medicine Management System")
        self.root.geometry("900x600")

        # Search entry and button
        tk.Label(root, text="Search:").grid(row=0, column=0, padx=10, pady=10, sticky="w")
        self.search_entry = tk.Entry(root)
        self.search_entry.grid(row=0, column=1, padx=10, pady=10, sticky="w")
        tk.Button(root, text="Search", command=self.search).grid(row=0, column=2, padx=10, pady=10)

        # Table
        self.table = ttk.Treeview(root, columns=("ID", "Generic Name", "Information", "Usage", "Complication", "Warning"), show="headings")
        self.table.heading("ID", text="ID")
        self.table.heading("Generic Name", text="Generic Name")
        self.table.heading("Information", text="Information")
        self.table.heading("Usage", text="Usage")
        self.table.heading("Complication", text="Complication")
        self.table.heading("Warning", text="Warning")
        self.table.column("ID", width=30)
        self.table.grid(row=1, column=0, columnspan=3, padx=10, pady=10, sticky="nsew")
        self.table.bind("<<TreeviewSelect>>", self.select_row)

        # Buttons
        tk.Button(root, text="Add", command=self.add_popup).grid(row=2, column=0, pady=10)
        tk.Button(root, text="Edit", command=self.edit_popup).grid(row=2, column=1, pady=10)
        tk.Button(root, text="Delete", command=self.delete_row).grid(row=2, column=2, pady=10)

        # Load data
        self.load_data()

    def execute_db(self, query, params=()):
        conn = sqlite3.connect('medicine_management.db')
        c = conn.cursor()
        c.execute(query, params)
        conn.commit()
        conn.close()

    def load_data(self):
        for item in self.table.get_children():
            self.table.delete(item)
        conn = sqlite3.connect('medicine_management.db')
        c = conn.cursor()
        c.execute("SELECT * FROM medicines")
        rows = c.fetchall()
        for row in rows:
            self.table.insert("", "end", values=row)
        conn.close()

    def select_row(self, event):
        selected = self.table.focus()
        self.selected_row = self.table.item(selected, "values")

    def add_popup(self):
        self.show_popup("Add Medicine", self.add_row)

    def edit_popup(self):
        if hasattr(self, "selected_row") and self.selected_row:
            self.show_popup("Edit Medicine", self.update_row, self.selected_row)
        else:
            messagebox.showerror("Error", "No row selected!")

    def show_popup(self, title, action, data=None):
        popup = tk.Toplevel(self.root)
        popup.title(title)
        popup.geometry("400x400")

        entries = {}
        fields = ["Generic Name", "Information", "Usage", "Complication", "Warning"]
        for idx, field in enumerate(fields):
            tk.Label(popup, text=field).pack(pady=5)
            entry = tk.Entry(popup)
            entry.pack(pady=5)
            entries[field] = entry

        if data:
            for idx, field in enumerate(fields):
                entries[field].insert(0, data[idx + 1])

        def handle_action():
            inputs = {field: entry.get().strip() for field, entry in entries.items()}
            if all(inputs.values()):
                action(inputs, popup)
            else:
                messagebox.showerror("Error", "All fields must be filled!")

        tk.Button(popup, text="Submit", command=handle_action).pack(pady=10)

    def add_row(self, inputs, popup):
        query = '''
            INSERT INTO medicines (generic_name, information, usage, complication, warning)
            VALUES (?, ?, ?, ?, ?)
        '''
        self.execute_db(query, tuple(inputs.values()))
        self.load_data()
        popup.destroy()

    def update_row(self, inputs, popup):
        query = '''
            UPDATE medicines
            SET generic_name = ?, information = ?, usage = ?, complication = ?, warning = ?
            WHERE id = ?
        '''
        self.execute_db(query, tuple(inputs.values()) + (self.selected_row[0],))
        self.load_data()
        popup.destroy()

    def delete_row(self):
        if hasattr(self, "selected_row") and self.selected_row:
            confirm = messagebox.askyesno("Confirm", "Are you sure you want to delete this row?")
            if confirm:
                query = "DELETE FROM medicines WHERE id = ?"
                self.execute_db(query, (self.selected_row[0],))
                self.load_data()
        else:
            messagebox.showerror("Error", "No row selected!")

    def search(self):
        keyword = self.search_entry.get().strip()
        for item in self.table.get_children():
            self.table.delete(item)
        conn = sqlite3.connect('medicine_management.db')
        c = conn.cursor()
        c.execute("SELECT * FROM medicines WHERE generic_name LIKE ?", (f"%{keyword}%",))
        rows = c.fetchall()
        for row in rows:
            self.table.insert("", "end", values=row)
        conn.close()


if __name__ == "__main__":
    root = tk.Tk()
    app = ManagementApp(root)
    root.mainloop()
