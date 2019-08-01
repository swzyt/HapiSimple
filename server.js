const Hapi = require('hapi');
const _ = require('lodash');
const { moment, getNow, getDiff } = require("./utils/moment");
const api_log_server = require("./libs/api_logs");

module.exports = function (settings, bootstrap) {

    var Server = new Hapi.Server({
        //host: settings.server.host,
        port: settings.server.port,
        routes: {
            cors: {
                origin: ['*'],//跨域
                //additionalHeaders: ["Accept-Language", "Corporation-Id", "U", "T", "Sign"]
            }
        }
    });

    const reply_send = function (data) {
        if (data instanceof Object) {

            data = JSON.parse(JSON.stringify(data))

            if (data.hasOwnProperty('total') && data.hasOwnProperty('items')) {
                return this.response({ code: 200, message: "OK", total: data.total, data: data.items });
            } else {
                if (data.toJSON) {
                    return this.response({ code: 200, message: "OK", data: data.toJSON() });
                } else {
                    return this.response({ code: 200, message: "OK", data: data });
                }
            }
        }
        return this.response({ code: 200, message: "OK" });
    };

    const reply_error = function (boom) {
        return this.response({ code: boom.output.statusCode || 500, message: boom.message || boom.output.payload.message }).code(boom.output.statusCode || 500);
    };

    //增加扩展方法
    Server.decorate('toolkit', 'success', reply_send);
    Server.decorate('toolkit', 'error', reply_error);

    //插件注册
    let pluginsArray = [
        require('hapi-auth-jwt2'),//json web token 验证插件
        require('inert'),
        require('vision'),
        {
            plugin: require('hapi-swagger'),//api文档插件
            options: {
                info: {
                    title: 'HapiSimple 接口文档',
                    version: "1.0.0",
                    description: 'HapiSimple 接口文档',
                    'contact': {
                        'name': 'Suwei',
                        'email': 'suwei.me@qq.com'
                    }
                },
                lang: "zh-cn",//中文显示
                // 定义接口以tags属性为分类【定义分类的大标题】,给./routes路由的配置config:tags使用
                grouping: "tags",
                // 标签，用于对应路由config定义的tags进行归类
                tags: [
                    // { "name": "jwt", "description": "json web token" },//此处配置各模块描述内容
                    // { "name": "system", "description": "系统设置" },
                    // { "name": "storage", "description": "文件服务" }

                    { "name": "auth", "description": "身份验证" },
                    { "name": "storage", "description": "文件服务" },
                    { "name": "system-app", "description": "系统-app" },
                    { "name": "system-menu", "description": "系统-菜单" },
                    { "name": "system-button", "description": "系统-按钮" },
                    { "name": "system-role", "description": "系统-角色" },
                    { "name": "system-user", "description": "系统-用户" },
                    { "name": "system-task", "description": "系统-定时任务" },
                ],
                // basePath: '/v1/api',
                //pathPrefixSize: 20,
                securityDefinitions: {//api文档头部输入token，以便测试
                    'jwt': {
                        'type': 'apiKey',
                        'name': 'Authorization',
                        'in': 'header'
                    }
                },
                security: [{ 'jwt': [] }],
                auth: false
            }
        }
    ]
    Server.register(pluginsArray);

    //jwt认证自定义方法
    var validate = function (decoded, request, h) {
        // var validate = function () {
        // console.log(arguments);
        // return true;

        //此处可验证当前接口请求人与token拥有着是否一致，且token是否在有效期内
        //目前只验证了token有效期

        //可根据来源域名判断是否需要检测接口请求人，例如，api文档内的请求只判断有效期

        return { isValid: decoded.expiresAt > new Date().getTime() };
    };
    Server.auth.strategy('jwt', 'jwt',
        {
            key: settings.jwt.secret,          // Never Share your secret key
            validate: validate,            // validate function defined above
            verifyOptions: { algorithms: ['HS256'] } // pick a strong algorithm
        });
    Server.auth.default('jwt');

    //生命周期事件

    /**
     * 检测是否记录请求日志，需开启记录日志配置，且排除部分路径
     * @param {*} request 请求对象
     */
    function common_check(request) {
        let no_url = settings.api_log.no_url || [];

        return settings.api_log.on_off &&
            no_url.filter(item => {
                return request.path.startsWith(item)
            }).length == 0
    }
    Server.ext('onRequest', function (request, h) {
        request.headers['req-start'] = getNow();//设置请求开始时间

        if (common_check(request)) {
            console.log('----------------------------------------onRequest----------------------------------------')
        }

        return h.continue;
    });

    Server.ext('onPostAuth', function (request, h) {
        if (common_check(request)) {
            console.log('----------------------------------------onPostAuth---------------------------------------')
        }
        return h.continue;
    });

    Server.ext('onPreHandler', function (request, h) {
        if (common_check(request)) {
            console.log('---------------------------------------onPreHandler--------------------------------------')
        }
        return h.continue;
    });

    Server.ext('onPreResponse', function (request, h) {
        let startTime = request.headers['req-start'];
        var endTime = getNow();//设置请求结束时间

        if (!request.response.headers)
            request.response.headers = {}
        //if (request.response.headers) {
        request.response.headers['req-id'] = request.info.id;
        request.response.headers['req-start'] = startTime;
        request.response.headers['res-end'] = endTime;
        request.response.headers['req-res-span-time'] = getDiff(startTime, endTime);
        //}

        if (common_check(request)) {
            console.log('--------------------------------------onPreResponse--------------------------------------')

            //此处记录日志
            api_log_server(request, bootstrap.db, settings);
        }

        return h.continue;
    });

    return Server;
};