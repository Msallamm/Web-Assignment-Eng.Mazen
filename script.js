const input = document.getElementById('todo-input');
const list = document.getElementById('todo-list');
const counter = document.getElementById('items-left');
const darkModeButton = document.getElementById('theme-toggle');
const percentage = document.querySelector('.progress-text');

let tasks = [];

function loadTasks() {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
        tasks = JSON.parse(savedTasks);
    }
    showTasks();
}

function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function addTask() {
    const taskText = input.value.trim();

    if (taskText) {
        const newTask = {
            id: Date.now(),
            text: taskText,
            done: false
        };

        tasks.push(newTask);

        input.value = '';

        showTasks();
        saveTasks();
    }
}

function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);

    showTasks();
    saveTasks();
}

function toggleTask(id) {
    const task = tasks.find(task => task.id === id);
    if (task) {
        task.done = !task.done;
    }

    showTasks();
    saveTasks();
}

function showTasks() {
    list.innerHTML = '';

    const currentFilter = document.querySelector('.filter-btn.active').dataset.filter;

    let tasksToShow = tasks;
    if (currentFilter === 'completed') {
        tasksToShow = tasks.filter(task => task.done);
    } else if (currentFilter === 'pending') {
        tasksToShow = tasks.filter(task => !task.done);
    }

    tasksToShow.forEach(task => {
        const item = document.createElement('li');
        item.className = 'todo-item';

        item.innerHTML = `
            <span class="todo-checkbox ${task.done ? 'checked' : ''}"></span>
            <span class="todo-text ${task.done ? 'completed' : ''}">${task.text}</span>
            <button class="delete-btn">
                <i class="fas fa-times"></i>
            </button>
        `;

        item.querySelector('.todo-checkbox').onclick = () => toggleTask(task.id);
        item.querySelector('.delete-btn').onclick = () => deleteTask(task.id);

        list.appendChild(item);
    });

    const unfinishedTasks = tasks.filter(task => !task.done).length;
    counter.textContent = `${unfinishedTasks} items left`;

    const totalTasks = tasks.length;
    const finishedTasks = tasks.filter(task => task.done).length;
    const completePercentage = totalTasks === 0 ? 0 : Math.round((finishedTasks / totalTasks) * 100);

    percentage.textContent = `${completePercentage}% Complete`;
    percentage.classList.add('updating');
    setTimeout(() => percentage.classList.remove('updating'), 400);
}

input.onkeypress = function (event) {
    if (event.key === 'Enter') {
        addTask();
    }
};

document.querySelectorAll('.filter-btn').forEach(button => {
    button.onclick = function () {
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });

        button.classList.add('active');

        showTasks();
    };
});

document.getElementById('clear-completed').onclick = function () {
    tasks = tasks.filter(task => !task.done);

    showTasks();
    saveTasks();
};

darkModeButton.onclick = function () {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('theme', document.body.classList.contains('dark-mode') ? 'dark' : 'light');
};

if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark-mode');
}

loadTasks();
