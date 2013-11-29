var StorageService = (function () {
    function StorageService() {
    }

    StorageService.prototype.setProjects = function (projects) {
        localStorage.SpockData = JSON.stringify(projects);
    };

    StorageService.prototype.getProjects = function () {
        try {
            var projects = JSON.parse(localStorage.SpockData || '[]');
        } catch (e) {
            window.alert('Error Reading Spock ! Reverting to defaults.');
        }

        return projects || [];
    };

    return StorageService;
})();