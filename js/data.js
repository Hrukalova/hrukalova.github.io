// Инициализация данных
function initData() {
    if (!localStorage.getItem('users')) {
        localStorage.setItem('users', JSON.stringify([]));
    }
    if (!localStorage.getItem('projects')) {
        localStorage.setItem('projects', JSON.stringify([]));
    }
    if (!localStorage.getItem('currentUser')) {
        localStorage.setItem('currentUser', JSON.stringify(null));
    }
}

// Работа с пользователями
function getUsers() {
    return JSON.parse(localStorage.getItem('users')) || [];
}

function saveUser(user) {
    const users = getUsers();
    const existingUser = users.find(u => u.email === user.email);

    if (existingUser) {
        return existingUser;
    } else {
        user.id = Date.now();
        user.avatar = user.firstName.charAt(0).toUpperCase();
        users.push(user);
        localStorage.setItem('users', JSON.stringify(users));
        return user;
    }
}

// Работа с проектами
function getProjects() {
    return JSON.parse(localStorage.getItem('projects')) || [];
}

function saveProject(project) {
    const projects = getProjects();

    // Если проект уже существует, обновляем его
    const existingIndex = projects.findIndex(p => p.id === project.id);
    if (existingIndex >= 0) {
        projects[existingIndex] = project;
    } else {
        // Новый проект
        project.id = Date.now();
        project.createdAt = new Date().toISOString();
        project.tasks = [];
        project.progress = 0;
        projects.push(project);
    }

    localStorage.setItem('projects', JSON.stringify(projects));
    return project;
}

// Получение проектов пользователя
function getUserProjects(userEmail) {
    const projects = getProjects();
    return projects.filter(project =>
        project.members && project.members.includes(userEmail)
    );
}

// Текущий пользователь
function getCurrentUser() {
    return JSON.parse(localStorage.getItem('currentUser'));
}

function setCurrentUser(user) {
    localStorage.setItem('currentUser', JSON.stringify(user));
}

function logout() {
    localStorage.setItem('currentUser', JSON.stringify(null));
    window.location.href = 'index.html';
}

// Инициализация при загрузке
initData();
