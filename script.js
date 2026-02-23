let todos = JSON.parse(localStorage.getItem("todos")) || [];
let editId = null;

const todoList = document.getElementById("todoList");
const statusMessage = document.getElementById("statusMessage");
const searchInput = document.getElementById("search");
const filterSelect = document.getElementById("filter");
const themeToggle = document.getElementById("themeToggle");
const themeIcon = document.getElementById("themeIcon");

const modal = document.getElementById("modal");
const openModal = document.getElementById("openModal");
const cancelBtn = document.getElementById("cancelBtn");
const addTaskBtn = document.getElementById("addTaskBtn");
const newTaskInput = document.getElementById("newTaskInput");

// SVGs and Images
const pencilIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>`;
const trashIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>`;

// High-quality placeholder images for states
const emptyImg = "https://cdn-icons-png.flaticon.com/512/5089/5089737.png";
const notFoundImg = "https://cdn-icons-png.flaticon.com/512/6134/6134065.png";

function saveToLocal() {
  localStorage.setItem("todos", JSON.stringify(todos));
}

function renderTodos() {
  const searchValue = searchInput.value.toLowerCase();
  const filterValue = filterSelect.value;

  todoList.innerHTML = "";
  statusMessage.innerHTML = "";

  // 1. Check if total list is empty
  if (todos.length === 0) {
    statusMessage.innerHTML = `
      <img src="${emptyImg}" alt="Empty">
      <p>Your list is empty. Add a task!</p>
    `;
    return;
  }

  const filteredTodos = todos
    .filter(todo => {
      if (filterValue === "pending") return !todo.completed;
      if (filterValue === "completed") return todo.completed;
      return true;
    })
    .filter(todo => todo.text.toLowerCase().includes(searchValue));

  // 2. Check if search/filter results are empty
  if (filteredTodos.length === 0) {
    statusMessage.innerHTML = `
      <img src="${notFoundImg}" alt="Not Found">
      <p>No matching tasks found.</p>
    `;
    return;
  }

  filteredTodos.forEach(todo => {
    const div = document.createElement("div");
    div.className = `todo-item ${todo.completed ? 'completed' : ''}`;

    div.innerHTML = `
      <input type="checkbox" ${todo.completed ? 'checked' : ''} onchange="toggleDone(${todo.id})">
      <span class="todo-text">${todo.text}</span>
      <div class="todo-actions">
        <button class="action-icon edit-icon" onclick="editTodo(${todo.id})">${pencilIcon}</button>
        <button class="action-icon delete-icon" onclick="deleteTodo(${todo.id})">${trashIcon}</button>
      </div>
    `;
    todoList.appendChild(div);
  });
}

function addTodo() {
  const text = newTaskInput.value.trim();
  if (!text) return;

  if (editId) {
    todos = todos.map(todo => todo.id === editId ? { ...todo, text } : todo);
    editId = null;
  } else {
    todos.push({ id: Date.now(), text, completed: false });
  }

  newTaskInput.value = "";
  modal.style.display = "none";
  saveToLocal();
  renderTodos();
}

function toggleDone(id) {
  todos = todos.map(todo => todo.id === id ? { ...todo, completed: !todo.completed } : todo);
  saveToLocal();
  renderTodos();
}

function deleteTodo(id) {
  todos = todos.filter(todo => todo.id !== id);
  saveToLocal();
  renderTodos();
}

function editTodo(id) {
  const todo = todos.find(t => t.id === id);
  newTaskInput.value = todo.text;
  editId = id;
  modal.style.display = "flex";
  setTimeout(() => newTaskInput.focus(), 50);
}

// Add Task on Enter Key
newTaskInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    addTodo();
  }
});

searchInput.addEventListener("input", renderTodos);
filterSelect.addEventListener("change", renderTodos);

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  const isDark = document.body.classList.contains("dark");
  themeIcon.textContent = isDark ? "☀️" : "🌙";
});

openModal.addEventListener("click", () => {
  newTaskInput.value = "";
  editId = null;
  modal.style.display = "flex";
  setTimeout(() => newTaskInput.focus(), 50);
});

cancelBtn.addEventListener("click", () => {
  modal.style.display = "none";
  editId = null;
});

addTaskBtn.addEventListener("click", addTodo);

window.onclick = (event) => {
  if (event.target == modal) modal.style.display = "none";
};

renderTodos();