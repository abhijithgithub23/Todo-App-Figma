// Load todos from local storage or start with an empty array
let todos = JSON.parse(localStorage.getItem("todos")) || [];
let editId = null;

const todoList = document.getElementById("todoList");
const emptyState = document.getElementById("emptyState");
const searchInput = document.getElementById("searchInput");
const filterSelect = document.getElementById("filterSelect");
const themeToggle = document.getElementById("themeToggle");

// Modal Elements
const modalOverlay = document.getElementById("modalOverlay");
const fab = document.getElementById("fab");
const cancelBtn = document.getElementById("cancelBtn");
const applyBtn = document.getElementById("applyBtn");
const noteInput = document.getElementById("noteInput");

// Icon SVGs
const pencilIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>`;
const trashIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>`;

// Save to Local Storage
function saveToLocal() {
  localStorage.setItem("todos", JSON.stringify(todos));
}

function renderTodos() {
  const searchTerm = searchInput.value.toLowerCase();
  const filterVal = filterSelect.value;
  
  todoList.innerHTML = "";

  const filtered = todos.filter(todo => {
    const matchesSearch = todo.text.toLowerCase().includes(searchTerm);
    const matchesFilter = 
      filterVal === "ALL" || 
      (filterVal === "INCOMPLETE" && !todo.completed) || 
      (filterVal === "COMPLETE" && todo.completed);
    
    return matchesSearch && matchesFilter;
  });

  if (todos.length === 0 || (searchTerm && filtered.length === 0)) {
    emptyState.style.display = "flex";
  } else {
    emptyState.style.display = "none";
    
    filtered.forEach(todo => {
      const div = document.createElement("div");
      div.className = `todo-item ${todo.completed ? 'completed' : ''}`;

      div.innerHTML = `
        <input type="checkbox" class="custom-checkbox" ${todo.completed ? 'checked' : ''} onchange="toggleDone(${todo.id})">
        <span class="todo-text">${todo.text}</span>
        <div class="actions">
          <button class="action-btn" onclick="openEdit(${todo.id})">${pencilIcon}</button>
          <button class="action-btn" onclick="deleteTodo(${todo.id})">${trashIcon}</button>
        </div>
      `;
      todoList.appendChild(div);
    });
  }
}



// Modal Logic
function openModal() {
  modalOverlay.classList.add("active");
  noteInput.focus();
}

function closeModal() {
  modalOverlay.classList.remove("active");
  noteInput.value = "";
  editId = null;
}

// function to add or update a todo
function handleApply() {
  const text = noteInput.value.trim();
  if (!text) return;

  if (editId !== null) {
    todos = todos.map(t => t.id === editId ? { ...t, text } : t);
  } else {
    todos.push({
      id: Date.now(),
      text,
      completed: false
    });
  }

  saveToLocal(); // Save changes
  closeModal();
  renderTodos();
}

window.toggleDone = function(id) {
  todos = todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
  saveToLocal(); // Save changes
  renderTodos();
}

window.deleteTodo = function(id) {
  todos = todos.filter(t => t.id !== id);
  saveToLocal(); // Save changes
  renderTodos();
}

window.openEdit = function(id) {
  const todo = todos.find(t => t.id === id);
  if (todo) {
    editId = todo.id;
    noteInput.value = todo.text;
    openModal();
  }
}

// Theme Toggle Logic
themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  const isDark = document.body.classList.contains("dark");
  localStorage.setItem("theme", isDark ? "dark" : "light");
});

// Load saved theme on startup
if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark");
}

// Event Listeners
fab.addEventListener("click", () => {
  editId = null;
  noteInput.value = "";
  openModal();
});

cancelBtn.addEventListener("click", closeModal);
applyBtn.addEventListener("click", handleApply);

noteInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") handleApply();
});

searchInput.addEventListener("input", renderTodos);
filterSelect.addEventListener("change", renderTodos);

renderTodos();