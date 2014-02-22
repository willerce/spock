var TmTSpock = (function () {

    function TmTSpock() {

        var self = this;

        if (spock.projectManager.projects.length > 0) {
            _.each(spock.projectManager.projects, function (project) {

                self.addProjectHTML(project);
                self.switchProject(project.id);

            });
        }

    }

    TmTSpock.prototype.addProject = function (dir) {

        var self = this;

        spock.projectManager.add(dir, function (project) {
            self.addProjectHTML(project);
            self.switchProject(project.id);
        });

    };

    TmTSpock.prototype.addProjectHTML = function (project) {

        //加入HTML
        var project_html = spock.util.getTemplate('sidebar_item', project);
        $(project_html).appendTo($('.sidebar__list'));

        var tasks_html = spock.util.getTemplate('tasks', project);
        $(tasks_html).appendTo($('.task-tab'));

    };


    TmTSpock.prototype.switchProject = function (id) {
        $('.sidebar__item_current').removeClass('sidebar__item_current');
        $('#project_' + id).addClass('sidebar__item_current');

        $('.task-list').hide();
        $('#tasks_' + id).show();
    };

    TmTSpock.prototype.removeProject = function (id) {

        spock.projectManager.remove(id);

        $('#project_' + id).remove();
        $('#tasks_' + id).remove();

        if ($('.sidebar__item_current').length == 0 && spock.projectManager.projects.length > 0) {
            this.switchProject(spock.projectManager.projects[0].id);
        }

    };

    TmTSpock.prototype.putCliLog = function (data, project_id, task_name) {

        var output = ansi2html(data);
        $('<p>' + output + '</p>').appendTo($('#console_' + project_id + "_" + task_name));
        this.terminalScrollToBottom(project_id, task_name);
    };

    TmTSpock.prototype.terminalScrollToBottom = function (project_id, task_name) {
        _.throttle(function () {
            $('#console_' + project_id + "_" + task_name).scrollTop(999999999);
        }, 100)();
    };

    TmTSpock.prototype.runTask = function (project_id, task_name) {
        spock.terminalManager.runTask(project_id, task_name, function () {
            //start event
            $('#task_item_' + project_id + "_" + task_name).addClass('task-list__item_running');
            $('#task_item_' + project_id + "_" + task_name).removeClass('task-list__item_error');

            $('#task_item_' + project_id + "_" + task_name + " .task-list__action-item_terminal").show();
            $('#task_item_' + project_id + "_" + task_name + " .task-list__action-item_stop").show();
            $('#task_item_' + project_id + "_" + task_name + " .task-list__action-item_run").hide();
        }, function () {
            //end event

            $('#task_item_' + project_id + "_" + task_name).removeClass('task-list__item_running');
            $('#task_item_' + project_id + "_" + task_name + " .task-list__action-item_terminal").hide();
            $('#task_item_' + project_id + "_" + task_name + " .task-list__action-item_stop").hide();
            $('#task_item_' + project_id + "_" + task_name + " .task-list__action-item_run").show();

            //$(___).appendTo($('#console_' + project_id + "_" + task_name));
        }, function () {
            //error event
            $('#task_item_' + project_id + "_" + task_name).addClass('task-list__item_error');

            $('#task_item_' + project_id + "_" + task_name).removeClass('task-list__item_running');
            $('#task_item_' + project_id + "_" + task_name + " .task-list__action-item_terminal").hide();
            $('#task_item_' + project_id + "_" + task_name + " .task-list__action-item_stop").hide();
            $('#task_item_' + project_id + "_" + task_name + " .task-list__action-item_run").show();

        });
    };


    /**
     * 停止任务
     * @param project_id
     * @param task_name
     */
    TmTSpock.prototype.stopTask = function (project_id, task_name) {
        spock.terminalManager.stopTask(project_id, task_name);

        $('#task_item_' + project_id + "_" + task_name).removeClass('task-list__item_running');
        $('#task_item_' + project_id + "_" + task_name).removeClass('task-list__item_error');

        $('#task_item_' + project_id + "_" + task_name + " .task-list__action-item_terminal").hide();
        $('#task_item_' + project_id + "_" + task_name + " .task-list__action-item_stop").hide();
        $('#task_item_' + project_id + "_" + task_name + " .task-list__action-item_run").show();

    };

    return TmTSpock;
})();
