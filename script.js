let todos = JSON.parse(localStorage.getItem("todos")) || [];
let editId = null;

let historyStack = [];

const todoList = document.getElementById("todoList");
const emptyState = document.getElementById("emptyState");
const searchInput = document.getElementById("searchInput");
const filterSelect = document.getElementById("filterSelect");
const themeToggle = document.getElementById("themeToggle");

const modalOverlay = document.getElementById("modalOverlay");
const fab = document.getElementById("fab");
const cancelBtn = document.getElementById("cancelBtn");
const applyBtn = document.getElementById("applyBtn");
const noteInput = document.getElementById("noteInput");
const undoBtn = document.getElementById("undoBtn"); 

const pencilIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>`;
const trashIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>`;

function saveToLocal() {
  localStorage.setItem("todos", JSON.stringify(todos));
}

// Render fnction
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

  if (filtered.length === 0) {
    emptyState.style.display = "flex";
  } else {
    emptyState.style.display = "none";

    filtered.forEach(todo => {
      const div = document.createElement("div");
      div.className = `todo-item ${todo.completed ? "completed" : ""}`;

      div.innerHTML = `
        <input type="checkbox" class="custom-checkbox" ${
          todo.completed ? "checked" : ""
        } onchange="toggleDone(${todo.id})">
        <span class="todo-text">${todo.text}</span>
        <div class="actions">
          <button class="action-btn" onclick="openEdit(${todo.id})">${pencilIcon}</button>
          <button class="action-btn" onclick="deleteTodo(${todo.id})">${trashIcon}</button>
        </div>
      `;
      todoList.appendChild(div);
    });
  }
  console.clear();
  // console.log(JSON.stringify(historyStack, null, 2));

  console.table(
  historyStack.map((item, index) => ({
    index: index,
    action: item.action,
    id: item.todo.id,
    text: item.todo.text
  }))
);
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

// Add or update todo
function handleApply() {
  const text = noteInput.value.trim();
  if (!text) return;

  if (editId !== null) { // For editing todo
    const oldTodo = todos.find(t => t.id === editId);
    historyStack.push({ action: "edit", todo: { ...oldTodo } });

    todos = todos.map(t => (t.id === editId ? { ...t, text } : t));
  } else {  // For adding new todo
    const newTodo = { id: Date.now(), text, completed: false };
    todos.push(newTodo);
    historyStack.push({ action: "add", todo: { ...newTodo } });
  }

  saveToLocal();
  closeModal();
  renderTodos();
}

// chekc box done
window.toggleDone = function (id) {
  const oldTodo = todos.find(t => t.id === id);
  historyStack.push({ action: "toggle", todo: { ...oldTodo } });

  todos = todos.map(t => (t.id === id ? { ...t, completed: !t.completed } : t));
  saveToLocal();
  renderTodos();
};

// Delete todo
window.deleteTodo = function (id) {
  const index = todos.findIndex(t => t.id === id);
  if (index !== -1) {
    historyStack.push({ action: "delete", todo: { ...todos[index] } });
    todos.splice(index, 1);
    saveToLocal();
    renderTodos();
  }
};

// Open edit box
window.openEdit = function (id) {
  const todo = todos.find(t => t.id === id);
  if (todo) {
    editId = todo.id;
    noteInput.value = todo.text;
    openModal();
  }
};

// Undo last action
function undo() {
  if (historyStack.length === 0) return;

  const lastAction = historyStack.pop();

  switch (lastAction.action) {
    case "edit":
    case "toggle":
      todos = todos.map(t =>
        t.id === lastAction.todo.id ? { ...lastAction.todo } : t
      );
      break;
    case "delete":
      todos.push(lastAction.todo);
      break;
    case "add":
      todos = todos.filter(t => t.id !== lastAction.todo.id);
      break;
  }

  saveToLocal();
  renderTodos();
}

// Theme 
themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  const isDark = document.body.classList.contains("dark");
  localStorage.setItem("theme", isDark ? "dark" : "light");
});

// Loads th theme from localstorage
if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark");
}


fab.addEventListener("click", () => {
  editId = null;
  noteInput.value = "";
  openModal();
});

cancelBtn.addEventListener("click", closeModal);
applyBtn.addEventListener("click", handleApply);

undoBtn.addEventListener("click", undo); // undo button

noteInput.addEventListener("keydown", e => {
  if (e.key === "Enter") handleApply();
});

searchInput.addEventListener("input", renderTodos);
filterSelect.addEventListener("change", renderTodos);


renderTodos(); 