let todos = JSON.parse(localStorage.getItem("todos")) || [];
let editId = null;

const todoList = document.getElementById("todoList");
const searchInput = document.getElementById("search");
const filterSelect = document.getElementById("filter");
const themeToggle = document.getElementById("themeToggle");

const modal = document.getElementById("modal");
const openModal = document.getElementById("openModal");
const cancelBtn = document.getElementById("cancelBtn");
const addTaskBtn = document.getElementById("addTaskBtn");
const newTaskInput = document.getElementById("newTaskInput");

function saveToLocal() {
  localStorage.setItem("todos", JSON.stringify(todos));
}

function renderTodos() {
  const searchValue = searchInput.value.toLowerCase();
  const filterValue = filterSelect.value;

  todoList.innerHTML = "";

  todos
    .filter(todo => {
      if (filterValue === "pending") return !todo.completed;
      if (filterValue === "completed") return todo.completed;
      return true;
    })
    .filter(todo => todo.text.toLowerCase().includes(searchValue))
    .forEach(todo => {
      const div = document.createElement("div");
      div.className = "todo-item";
      if (todo.completed) div.classList.add("completed");

      div.innerHTML = `
        <span>${todo.text}</span>
        <div class="todo-actions">
          <button onclick="toggleDone(${todo.id})">✔</button>
          <button onclick="editTodo(${todo.id})">✏</button>
          <button onclick="deleteTodo(${todo.id})">🗑</button>
        </div>
      `;

      todoList.appendChild(div);
    });
}

function addTodo() {
  const text = newTaskInput.value.trim();
  if (!text) return;

  if (editId) {
    todos = todos.map(todo =>
      todo.id === editId ? { ...todo, text } : todo
    );
    editId = null;
  } else {
    todos.push({
      id: Date.now(),
      text,
      completed: false
    });
  }

  newTaskInput.value = "";
  modal.style.display = "none";
  saveToLocal();
  renderTodos();
}

function toggleDone(id) {
  todos = todos.map(todo =>
    todo.id === id ? { ...todo, completed: !todo.completed } : todo
  );
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
}

searchInput.addEventListener("input", renderTodos);
filterSelect.addEventListener("change", renderTodos);

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
});

openModal.addEventListener("click", () => {
  modal.style.display = "flex";
});

cancelBtn.addEventListener("click", () => {
  modal.style.display = "none";
  editId = null;
});

addTaskBtn.addEventListener("click", addTodo);

renderTodos();