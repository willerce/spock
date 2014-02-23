var ProjectManager = (function () {
    function ProjectManager() {
        this.projects = spock.storageService.getProjects();
    }

    ProjectManager.prototype.add = function (dir, cb) {

        //判断是否已经存在该项目
        var exist = false;
        _.each(this.projects, function (project) {
            if (!path.relative(project.path, dir)) {
                exist = true;
            }
        });

        if (!exist) {

            var project_name = path.basename(dir);
            var project_id = spock.util.uid(project_name);

            var GruntPath = dir + '/node_modules/grunt/';

            if (!fs.existsSync(GruntPath)) {
                window.alert('Unable to find local grunt.');
                return
            }

            var grunt = require(dir + "/node_modules/grunt/");

            var GruntinitConfigFnPath = grunt.file.findup('Gruntfile.{js,coffee}', {cwd: dir, nocase: true});

            if (GruntinitConfigFnPath === null) {
                window.alert('Unable to find Gruntfile.');
                return
            }

            require(GruntinitConfigFnPath)(grunt);

            var tasks = [];
            _.each(grunt.task._tasks, function (task) {
                tasks.push(task.name);
            });

            var project = {
                id: project_id,
                name: project_name,
                path: dir,
                tasks: tasks,
                config: {
                }
            };

            this.projects.push(project);
            spock.storageService.setProjects(this.projects);

            cb(project);
        }
    };


    ProjectManager.prototype.remove = function (id) {

        this.projects = _.reject(this.projects, function (project) {
            return project.id === id;
        });

        //更新 projects
        spock.storageService.setProjects(this.projects);

        //杀死项目的进程
        spock.terminalManager.killProjectWorkers(id);

    };

    ProjectManager.prototype.getById = function (id) {
        return _.find(spock.projectManager.projects, function (project) {
            return project.id == id;
        });
    };

    return ProjectManager;
})();