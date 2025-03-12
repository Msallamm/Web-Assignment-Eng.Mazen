// Get all the elements we need
const input = document.getElementById('todo-input');
const list = document.getElementById('todo-list');
const counter = document.getElementById('items-left');
const darkModeButton = document.getElementById('theme-toggle');
const percentage = document.querySelector('.progress-text');

// Store tasks in a simple array
let tasks = [];

// Load saved tasks when page loads
function loadTasks() {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
        tasks = JSON.parse(savedTasks);
    }
    showTasks();
}

// Save tasks to storage
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Add a new task
function addTask() {
    // Get the text from input
    const taskText = input.value.trim();
    
    if (taskText) {
        // Create new task
        const newTask = {
            id: Date.now(),
            text: taskText,
            done: false
        };
        
        // Add to array
        tasks.push(newTask);
        
        // Clear input
        input.value = '';
        
        // Update everything
        showTasks();
        saveTasks();
    }
}

// Delete a task
function deleteTask(id) {
    // Remove task from array
    tasks = tasks.filter(task => task.id !== id);
    
    // Update everything
    showTasks();
    saveTasks();
}

// Toggle task status
function toggleTask(id) {
    // Find the task and change its status
    const task = tasks.find(task => task.id === id);
    if (task) {
        task.done = !task.done;
    }
    
    // Update everything
    showTasks();
    saveTasks();
}

// Show all tasks on screen
function showTasks() {
    // Clear the list first
    list.innerHTML = '';
    
    // Get current filter
    const currentFilter = document.querySelector('.filter-btn.active').dataset.filter;
    
    // Filter tasks
    let tasksToShow = tasks;
    if (currentFilter === 'completed') {
        tasksToShow = tasks.filter(task => task.done);
    } else if (currentFilter === 'pending') {
        tasksToShow = tasks.filter(task => !task.done);
    }
    
    // Add each task to the list
    tasksToShow.forEach(task => {
        // Create task item
        const item = document.createElement('li');
        item.className = 'todo-item';
        
        // Add task content
        item.innerHTML = `
            <span class="todo-checkbox ${task.done ? 'checked' : ''}"></span>
            <span class="todo-text ${task.done ? 'completed' : ''}">${task.text}</span>
            <button class="delete-btn">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        // Add click handlers
        item.querySelector('.todo-checkbox').onclick = () => toggleTask(task.id);
        item.querySelector('.delete-btn').onclick = () => deleteTask(task.id);
        
        // Add to list
        list.appendChild(item);
    });
    
    // Update task counter
    const unfinishedTasks = tasks.filter(task => !task.done).length;
    counter.textContent = `${unfinishedTasks} items left`;
    
    // Update percentage
    const totalTasks = tasks.length;
    const finishedTasks = tasks.filter(task => task.done).length;
    const completePercentage = totalTasks === 0 ? 0 : Math.round((finishedTasks / totalTasks) * 100);
    
    percentage.textContent = `${completePercentage}% Complete`;
    percentage.classList.add('updating');
    setTimeout(() => percentage.classList.remove('updating'), 400);
}

// Handle pressing Enter in input
input.onkeypress = function(event) {
    if (event.key === 'Enter') {
        addTask();
    }
};

// Handle filter buttons
document.querySelectorAll('.filter-btn').forEach(button => {
    button.onclick = function() {
        // Remove active from all buttons
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        // Make clicked button active
        button.classList.add('active');
        
        // Show filtered tasks
        showTasks();
    };
});

// Handle clear completed button
document.getElementById('clear-completed').onclick = function() {
    // Remove completed tasks
    tasks = tasks.filter(task => !task.done);
    
    // Update everything
    showTasks();
    saveTasks();
};

// Handle dark mode toggle
darkModeButton.onclick = function() {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('theme', document.body.classList.contains('dark-mode') ? 'dark' : 'light');
};

// Set initial dark mode
if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark-mode');
}

// Load tasks when page starts
loadTasks();
