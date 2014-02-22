var TerminalManager = (function () {

    var TerminalManager = function () {
        this.command = (process.platform === 'win32') ? 'grunt.cmd' : 'grunt';
        this.process_list = {};
    };

    TerminalManager.prototype.killWorkers = function () {
        var self = this;
        _.forEach(self.process_list, function (project, project_id) {
            self.killProjectWorkers(project_id);
        });
    };


    TerminalManager.prototype.killProjectWorkers = function (project_id) {
        var self = this;

        var project = this.process_list[project_id];

        if (!project) {
            return;
        }

        _.forEach(project, function (task, task_name) {
            if (task.status == "running") {
                self.killTask(project_id, task_name);
            }
        });
    };


    TerminalManager.prototype.runTask = function (project_id, task_name, startCb, endCb, errorCb) {

        var project = spock.projectManager.getById(project_id);

        startCb();

        var terminal = spawn(this.command, [task_name], {cwd: project.path});

        //如果这个
        if (_.isUndefined(this.process_list[project_id])) {
            this.process_list[project_id] = {};
        }

        this.process_list[project_id][task_name] = {
            name: task_name,
            terminal: terminal,
            status: 'running'
        };

        terminal.stdout.setEncoding('utf8');
        terminal.stdout.on('data', function (data) {
            //console.log('=> ' + data);
            //控制台输出
            spock.app.putCliLog(data, project_id, task_name);
        });

        terminal.stderr.on('data', function (data) {
            //console.log('ERROR: => ' + data);
            spock.app.putCliLog(data, project_id, task_name);
            errorCb();
        });

        terminal.on('close', function (code) {
            endCb();
            //console.log('child process exited with code ', code);
            terminal.status = "stop";
        });

    };

    //停止一个任务
    TerminalManager.prototype.stopTask = function (project_id, task_name) {
        if (!_.isUndefined(this.process_list[project_id])) {
            try {
                this.killTask(project_id, task_name);
                var pid = this.process_list[project_id][task_name].status = "stop"
            } catch (e) {
                alert("process end error!")
            }
        }
    };

    //残忍地杀死一个进程，连同其子进程一起杀了
    TerminalManager.prototype.killTask = function (project_id, task_name) {
        if (process.platform === 'win32') {
            var pid = this.process_list[project_id][task_name].terminal.pid;
            exec('taskkill /pid ' + pid + ' /T /F');
        } else {
            this.process_list[project_id][task_name].terminal.kill();
        }
    };

    return TerminalManager;

})();