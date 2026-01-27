// Менеджер задач
const TaskManager = {
    // Создать новую задачу
    createTask(taskData) {
        const tasks = this.getAllTasks();

        const newTask = {
            id: Date.now(),
            ...taskData,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            completed: false,
            priority: taskData.priority || 'medium'
        };

        tasks.push(newTask);
        this.saveTasks(tasks);

        // Обновить прогресс проекта
        this.updateProjectProgress(taskData.projectId);

        return newTask;
    },

    // Получить все задачи
    getAllTasks() {
        return JSON.parse(localStorage.getItem('tasks') || '[]');
    },

    // Сохранить задачи
    saveTasks(tasks) {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    },

    // Получить задачи пользователя
    getUserTasks(userEmail) {
        const allTasks = this.getAllTasks();
        return allTasks.filter(task =>
            task.assignees && task.assignees.includes(userEmail)
        );
    },

    // Получить задачи по проекту
    getProjectTasks(projectId) {
        const allTasks = this.getAllTasks();
        return allTasks.filter(task => task.projectId === projectId);
    },

    // Обновить задачу
    updateTask(taskId, updates) {
        const tasks = this.getAllTasks();
        const taskIndex = tasks.findIndex(t => t.id === taskId);

        if (taskIndex !== -1) {
            tasks[taskIndex] = {
                ...tasks[taskIndex],
                ...updates,
                updatedAt: new Date().toISOString()
            };

            this.saveTasks(tasks);

            // Обновить прогресс проекта
            if (updates.status) {
                this.updateProjectProgress(tasks[taskIndex].projectId);
            }

            return tasks[taskIndex];
        }

        return null;
    },

    // Удалить задачу
    deleteTask(taskId) {
        const tasks = this.getAllTasks();
        const taskToDelete = tasks.find(t => t.id === taskId);

        if (taskToDelete) {
            const filteredTasks = tasks.filter(t => t.id !== taskId);
            this.saveTasks(filteredTasks);

            // Обновить прогресс проекта
            this.updateProjectProgress(taskToDelete.projectId);

            return true;
        }

        return false;
    },

    // Обновить прогресс проекта
    updateProjectProgress(projectId) {
        const projectTasks = this.getProjectTasks(projectId);

        if (projectTasks.length === 0) return;

        const completedTasks = projectTasks.filter(task => task.status === 'done' || task.completed);
        const progress = Math.round((completedTasks.length / projectTasks.length) * 100);

        // Обновить прогресс в проекте
        const projects = JSON.parse(localStorage.getItem('projects') || '[]');
        const projectIndex = projects.findIndex(p => p.id === projectId);

        if (projectIndex !== -1) {
            projects[projectIndex].progress = progress;
            localStorage.setItem('projects', JSON.stringify(projects));
        }
    },

    // Рассчитать дни до дедлайна
    calculateDaysUntilDeadline(deadline) {
        const deadlineDate = new Date(deadline);
        const today = new Date();

        // Сбросить время для сравнения только дат
        today.setHours(0, 0, 0, 0);
        deadlineDate.setHours(0, 0, 0, 0);

        const diffTime = deadlineDate - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        return diffDays;
    },

    // Получить задачи с близким дедлайном (менее 7 дней)
    getUpcomingTasks(userEmail) {
        const userTasks = this.getUserTasks(userEmail);
        return userTasks.filter(task => {
            const daysLeft = this.calculateDaysUntilDeadline(task.deadline);
            return daysLeft >= 0 && daysLeft <= 7;
        });
    },

    // Изменить статус задачи
    changeTaskStatus(taskId, newStatus) {
        return this.updateTask(taskId, { status: newStatus });
    },

    // Добавить комментарий к задаче
    addComment(taskId, comment, author) {
        const task = this.getAllTasks().find(t => t.id === taskId);

        if (task) {
            const comments = task.comments || [];
            comments.push({
                id: Date.now(),
                text: comment,
                author: author,
                timestamp: new Date().toISOString()
            });

            return this.updateTask(taskId, { comments });
        }

        return null;
    }
};

// Инициализация тестовых данных
function initSampleTasks() {
    const tasks = TaskManager.getAllTasks();

    if (tasks.length === 0) {
        // Создаем тестовые задачи
        const sampleTasks = [
            {
                title: "написание кода интервью",
                projectId: 1,
                projectName: "майнор",
                section: "разработка",
                assignees: ["Дарья Левина"],
                deadline: "2025-12-15 20:25",
                description: "Написать код для обработки интервью",
                status: "in_progress",
                priority: "high"
            },
            {
                title: "исследование",
                projectId: 1,
                projectName: "майнор",
                section: "анализ",
                assignees: ["Вика Курага"],
                deadline: "2025-12-18",
                description: "Провести исследование пользователей",
                status: "todo",
                priority: "medium"
            },
            {
                title: "создание дизайна",
                projectId: 1,
                projectName: "майнор",
                section: "разработка",
                assignees: ["Маша Лапенко"],
                deadline: "2025-12-20",
                description: "Создать дизайн интерфейса",
                status: "todo",
                priority: "medium"
            }
        ];

        sampleTasks.forEach(task => TaskManager.createTask(task));
    }
}

// Автоматическая инициализация при загрузке
document.addEventListener('DOMContentLoaded', function() {
    initSampleTasks();
});

if (typeof module !== 'undefined' && module.exports) {
    module.exports = TaskManager;
}
