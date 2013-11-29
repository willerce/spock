//node modules
var fs = require('fs');
var spawn = require("child_process").spawn;
var exec = require("child_process").exec;
var path = require("path");
var md5 = require("MD5");
var ansi2html = require('ansi2html');
var clc = require('cli-color');
var gui = require('nw.gui');
var winMain = gui.Window.get();

$(document).ready(function () {

    //spock app
    window.spock = {};
    window.spock.templates = {};
    window.spock.temp = {};
    window.spock.util = new Util();
    window.spock.storageService = new StorageService();
    window.spock.projectManager = new ProjectManager();
    window.spock.terminalManager = new TerminalManager();
    window.spock.app = new TmTSpock();

    var $body = $('body');

    //标题栏
    $('.JS-TitleBar').click(function (event) {

        var aciton = $(this).attr('data-action');
        switch (aciton) {
            case 'close':
                winMain.close();
                break;
            case 'minimizi':
                winMain.minimize();
                break;
        }

        return false;
    });

    //项目切换
    $body.on('click', '.JS-Sidebar-Item', function () {
        spock.app.switchProject($(this).attr('data-id'));
        return false;
    });

    //移除项目
    $body.on('click', '.JS-Project-Remove', function () {
        spock.app.removeProject($(this).attr('data-id'));
        return false;
    });

    //任务运行
    $body.on('click', '.JS-Task-Run', function () {
        var project_id = $(this).attr('data-project-id');
        var task_name = $(this).attr('data-task-name');
        spock.app.runTask(project_id, task_name);
        return false;
    });

    $body.on('click', '.JS-Task-Terminal', function () {
        var project_id = $(this).attr('data-project-id');
        var task_name = $(this).attr('data-task-name');
        $('#console_' + project_id + "_" + task_name).fadeIn();

        //scroll to bottom
        spock.app.terminalScrollToBottom(project_id, task_name);

        spock.temp.showConsoleId = '#console_' + project_id + "_" + task_name;

        return false;
    });


    $body.on('click', '.JS-Task-Stop', function () {
        var project_id = $(this).attr('data-project-id');
        var task_name = $(this).attr('data-task-name');
        spock.app.stopTask(project_id, task_name);
        return false;
    });

    //监听文件、文件夹拖入事件
    document.body.addEventListener('dragenter', handleDragEnter, false);
    document.body.addEventListener('dragover', handleDragOver, false);
    document.body.addEventListener('drop', handleDrop, false);
    document.body.addEventListener('dragleave', handleDragLeave, false);

    // node-webkit 开发者工具
    window.addEventListener('keydown', function (e) {
        if (e.keyIdentifier === 'F12') {
            winMain.showDevTools();
        } else if (e.keyIdentifier === 'F5') {
            location.reload();
        } else if (e.keyIdentifier === 'U+001B') {
            if (spock.temp.showConsoleId) {
                $(spock.temp.showConsoleId).fadeOut();
                spock.temp.showConsoleId = "";
            }
        }
    });

    function handleDragEnter(event) {
        console.log("handleDragEnter");
    }

    function handleDragOver(event) {
        event.stopPropagation();
        event.preventDefault();
        console.log("handleDragOver");
    }

    function handleDrop(event) {
        event.stopPropagation();
        event.preventDefault();
        console.log("handleDrop");

        //获取拖入的文件
        var files = event.dataTransfer.files;

        //遍历文件、文件夹
        _.each(files, function (file) {

            var stats = fs.statSync(file.path);

            if (stats.isDirectory() && path.dirname(file.path) !== file.path) {
                //文件夹
                spock.app.addProject(file.path);
            } else if (stats.isFile() && path.dirname(path.dirname(file.path)) !== path.dirname(file.path)) {
                //文件
                spock.app.addProject(path.dirname(file.path));
            }
        });
        return false;
    }

    function handleDragLeave() {
        console.log("handleDragLeave");
    }

    //node-webkit 的相关事件监听

    winMain.on('close', function () {
        spock.terminalManager.killWorkers();
        gui.App.closeAllWindows();
        gui.App.quit();
    });

});
