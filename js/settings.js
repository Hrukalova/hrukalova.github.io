// Управление настройками приложения
const SettingsManager = {
    // Загрузить настройки
    loadSettings() {
        const settings = JSON.parse(localStorage.getItem('settings') || '{}');

        // Устанавливаем значения по умолчанию для отсутствующих настроек
        const defaultSettings = {
            notifications: true,
            darkTheme: false,
            soundEffects: true,
            reminders: true,
            language: 'ru'
        };

        return { ...defaultSettings, ...settings };
    },

    // Сохранить настройки
    saveSettings(settings) {
        localStorage.setItem('settings', JSON.stringify(settings));
        this.applyTheme(settings.darkTheme);
        return settings;
    },

    // Применить тему на всех страницах
    applyTheme(isDark) {
        if (isDark) {
            document.body.classList.add('dark-theme');
            // Сохраняем в sessionStorage для других страниц
            sessionStorage.setItem('darkTheme', 'true');
        } else {
            document.body.classList.remove('dark-theme');
            sessionStorage.removeItem('darkTheme');
        }
    },

    // Проверить и применить тему при загрузке страницы
    initTheme() {
        const settings = this.loadSettings();
        this.applyTheme(settings.darkTheme);
    },

    // Сбросить настройки
    resetSettings() {
        const defaultSettings = {
            notifications: true,
            darkTheme: false,
            soundEffects: true,
            reminders: true,
            language: 'ru'
        };

        return this.saveSettings(defaultSettings);
    },

    // Получить настройку
    getSetting(key) {
        const settings = this.loadSettings();
        return settings[key];
    },

    // Изменить настройку
    setSetting(key, value) {
        const settings = this.loadSettings();
        settings[key] = value;
        return this.saveSettings(settings);
    }
};

// Автоматическая инициализация темы при загрузке
document.addEventListener('DOMContentLoaded', function() {
    SettingsManager.initTheme();
});

// Функция для использования в других файлах
function initThemeFromSettings() {
    const settings = JSON.parse(localStorage.getItem('settings') || '{}');
    if (settings.darkTheme) {
        document.body.classList.add('dark-theme');
    }
}

// Экспорт для использования в других файлах
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SettingsManager;
}
