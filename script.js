// ================= TASK MANAGEMENT + AUTHENTICATION SYSTEM =================

const API_URL = "http://localhost:5000/api/tasks";
const USER_API_URL = "http://localhost:5000/api/users";

// ================= FETCH ALL TASKS =================
async function fetchTasks() {
    try {
        const response = await fetch(API_URL);
        const data = await response.json();

        console.log("Fetched Tasks:", data.tasks);

        displayTasks(data.tasks);

    } catch (error) {
        console.error("Error fetching tasks:", error);
    }
}

// ================= DISPLAY TASKS =================
function displayTasks(tasks) {
    const taskContainer = document.getElementById("taskList");

    if (!taskContainer) return;

    taskContainer.innerHTML = "";

    let completed = 0;
    let pending = 0;

    tasks.forEach(task => {

        if (task.status === "Completed") {
            completed++;
        } else {
            pending++;
        }

        const div = document.createElement("div");
        div.classList.add("task-card");

        div.innerHTML = `
            <h3>${task.taskName}</h3>
            <p>Status: ${task.status}</p>
            <button onclick="markCompleted('${task._id}')">Complete</button>
            <button onclick="deleteTask('${task._id}')">Delete</button>
        `;

        taskContainer.appendChild(div);
    });

    // ================= DASHBOARD ANALYTICS =================
    const totalTasks = document.getElementById("totalTasks");
    const completedTasks = document.getElementById("completedTasks");
    const pendingTasks = document.getElementById("pendingTasks");
    const efficiencyRate = document.getElementById("efficiencyRate");

    if (totalTasks) totalTasks.innerText = tasks.length;
    if (completedTasks) completedTasks.innerText = completed;
    if (pendingTasks) pendingTasks.innerText = pending;

    let efficiency = tasks.length > 0
        ? Math.round((completed / tasks.length) * 100)
        : 0;

    if (efficiencyRate) efficiencyRate.innerText = `${efficiency}%`;
}

// ================= ADD TASK =================
async function addTask(taskName, status = "Pending") {
    try {
        const response = await fetch(`${API_URL}/add`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                taskName,
                status
            })
        });

        const data = await response.json();

        console.log("Task Added:", data);

        fetchTasks();

    } catch (error) {
        console.error("Error adding task:", error);
    }
}

// ================= UPDATE TASK =================
async function markCompleted(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                status: "Completed"
            })
        });

        const data = await response.json();

        console.log("Task Updated:", data);

        fetchTasks();

    } catch (error) {
        console.error("Error updating task:", error);
    }
}

// ================= DELETE TASK =================
async function deleteTask(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: "DELETE"
        });

        const data = await response.json();

        console.log("Task Deleted:", data);

        fetchTasks();

    } catch (error) {
        console.error("Error deleting task:", error);
    }
}

// ================= SIGNUP USER =================
async function signupUser() {
    const name = document.getElementById("signupName").value.trim();
    const email = document.getElementById("signupEmail").value.trim();
    const password = document.getElementById("signupPassword").value.trim();

    if (!name || !email || !password) {
        alert("All fields are required.");
        return;
    }

    try {
        const response = await fetch(`${USER_API_URL}/signup`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name,
                email,
                password
            })
        });

        const data = await response.json();

        alert(data.message);

        if (data.success) {
            window.location.href = "login.html";
        }

    } catch (error) {
        console.error("Signup Error:", error);
        alert("Signup failed");
    }
}

// ================= LOGIN USER =================
async function loginUser() {
    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value.trim();

    if (!email || !password) {
        alert("Email and password are required.");
        return;
    }

    try {
        const response = await fetch(`${USER_API_URL}/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email,
                password
            })
        });

        const data = await response.json();

        alert(data.message);

        if (data.success) {
            localStorage.setItem("user", JSON.stringify(data.user));
            window.location.href = "dashboard.html";
        }

    } catch (error) {
        console.error("Login Error:", error);
        alert("Login failed");
    }
}

// ================= LOGOUT USER =================
function logoutUser() {
    localStorage.removeItem("user");
    alert("Logged out successfully");
    window.location.href = "login.html";
}

// ================= AUTH CHECK =================
function checkAuth() {
    const currentPage = window.location.pathname;

    // Skip auth check for login/signup
    if (
        currentPage.includes("login.html") ||
        currentPage.includes("signup.html") ||
        currentPage.includes("welcome.html")
    ) {
        return;
    }

    const user = localStorage.getItem("user");

    if (!user) {
        window.location.href = "login.html";
    }
}

// ================= DISPLAY USER INFO =================
function displayLoggedInUser() {
    const userData = localStorage.getItem("user");

    if (!userData) return;

    const user = JSON.parse(userData);

    const welcomeText = document.getElementById("userWelcome");

    if (welcomeText) {
        welcomeText.innerText = `Welcome Back, ${user.name} 🚀`;
    }
}

// ================= DOM CONTENT LOADED =================
document.addEventListener("DOMContentLoaded", () => {

    // Auth Protection
    checkAuth();

    // Display user
    displayLoggedInUser();

    // Task Dashboard
    fetchTasks();

    // Task Form Submission
    const taskForm = document.getElementById("taskForm");

    if (taskForm) {
        taskForm.addEventListener("submit", (e) => {
            e.preventDefault();

            const taskInput = document.getElementById("taskInput");

            if (taskInput.value.trim() !== "") {
                addTask(taskInput.value);
                taskInput.value = "";
            }
        });
    }

});