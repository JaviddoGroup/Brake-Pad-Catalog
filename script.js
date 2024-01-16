document.addEventListener('DOMContentLoaded', function () {
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    const lightIcon = document.getElementById('light-icon');
    const darkIcon = document.getElementById('dark-icon');

    themeToggle.addEventListener('click', function () {
        // Toggle between light and dark themes
        body.classList.toggle('dark-theme');

        // Toggle between light and dark icons
        lightIcon.classList.toggle('hidden');
        darkIcon.classList.toggle('hidden');

        // Save the user's preference in local storage
        const isDarkMode = body.classList.contains('dark-theme');
        localStorage.setItem('darkMode', isDarkMode);
    });

    // Check user's preference in local storage
    const isDarkMode = localStorage.getItem('darkMode') === 'true';

    // Apply the saved theme preference
    if (isDarkMode) {
        body.classList.add('dark-theme');
        lightIcon.classList.add('hidden');
        darkIcon.classList.remove('hidden');
    } else {
        lightIcon.classList.remove('hidden');
        darkIcon.classList.add('hidden');
    }
});
