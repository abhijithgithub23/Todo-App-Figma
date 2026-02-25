Web App Link : https://aj-todo-list-app.netlify.app/

# Todo App

A simple and functional Todo application built using HTML, CSS, and JavaScript.  
This application helps users manage daily tasks efficiently with persistent browser storage.

## Features

- Add new todos
- Edit existing todos
- Delete todos
- Mark todos as completed or incomplete using a checkbox
- Search todos in real-time
- Filter todos by:
  - All
  - Completed
  - Incomplete
- Undo the last actions
- Toggle between Light and Dark theme
- Data persistence using Local Storage (data remains after refresh)

## Tech Stack

- HTML
- CSS
- JavaScript 
- Browser Local Storage API

## How It Works

- Todos are stored in the browser's Local Storage.
- Every action (add, edit, delete, toggle complete) updates both the UI and Local Storage.
- Undo functionality is implemented using a history stack.
- Theme preference is saved in Local Storage to persist user settings.

## Project Structure

```
Todo-App/
│
├── index.html
├── style.css
├── script.js
├── mediaqueris.css
└── README.md
```

## Installation and Usage

1. Clone the repository:
   ```
   git clone https://github.com/your-username/your-repository-name.git
   ```

2. Navigate to the project folder.

3. Open `index.html` in your browser.

No additional dependencies or setup required.

## Learning Outcomes

This project demonstrates:

- DOM manipulation
- Event handling
- State management
- Local Storage integration
- Undo functionality using stack logic
- Basic UI state persistence
- Theme toggling implementation



## License

This project is open-source and intended for learning purposes.
