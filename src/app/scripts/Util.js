var Util = (function () {
    function Util() {

    }

    /**
     * 获取模版
     * @param templateFileName 模版的文件名
     * @param obj 模版数据对象
     * @returns {*} 渲染好的 HTML
     */
    Util.prototype.getTemplate = function (templateFileName, obj) {

        if (!window.spock["templates"][templateFileName]) {
            //如果此模版没有缓存，请求获取一次
            var template = fs.readFileSync("./app/templates/" + templateFileName + ".html", {encoding: "utf-8"});

            //缓存一份
            window.spock["templates"][templateFileName] = template;
            return _.template(template)(obj);
        } else {
            //已经有此缓存，直接从缓存中取出
            return _.template(window.spock["templates"][templateFileName])(obj);
        }
    };

    Util.prototype.uid = function (str) {
        return md5((new Date().toISOString() + str).toLowerCase().replace(/\\/gi, '/')).substr(8, 8);
    };

    return Util;

})();