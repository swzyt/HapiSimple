var Boom = require('boom');

var Controller = function (service) {
    this.service = service;
};
//普通列表
Controller.prototype.list = function (request, h) {
    var where = {};
    var order = [];

    //模糊查询
    if (request.query.name) {
        where.name = { $like: `%${request.query.name}%` }
    }
    if (request.query.description) {
        where.description = { $like: `%${request.query.description}%` }
    }
    if (request.query.keyword) {
        where.name = { $like: '%' + request.query.keyword + '%' };
    }
    //数组in查询
    if (request.query.valid) {
        where.valid = {
            $in: request.query.valid.split(",").map(item => {
                return (/^true$/i).test(item);
            })
        }
    }
    //数组between and 查询
    if (request.query.created_at) {
        where.created_at = { $between: request.query.created_at.split(",") }
    }
    if (request.query.updated_at) {
        where.updated_at = { $between: request.query.updated_at.split(",") }
    }

    //排序条件
    if (request.query.sorter) {
        order.push(request.query.sorter.split("|"))
    }
    else {
        order.push([['valid', 'desc'], ['status', 'desc'], ['updated_at', 'desc']])
    }

    return this.service.list(where, request.query.page_size, request.query.page_number, order).then(function (list) {
        return h.success({ total: list.count, items: list.rows });
    }).catch(function (err) {
        return h.error(Boom.badRequest(err.message, err));
    })
};
//普通列表
Controller.prototype.loglist = function (request, h) {
    var where = {};
    var order = [['updated_at', 'desc']];

    if (request.query.keyword) {
        where['$task.name$'] = { $like: '%' + request.query.keyword + '%' };
    }

    return this.service.loglist(where, request.query.page_size, request.query.page_number, order).then(function (list) {
        return h.success({ total: list.count, items: list.rows });
    }).catch(function (err) {
        return h.error(Boom.badRequest(err.message, err));
    })
};
//获取单项
Controller.prototype.get = function (request, h) {

    var where = { task_id: request.params.task_id };

    return this.service.get(where).then(function (row) {

        if (!row) return h.error(Boom.badRequest("找不到指定标识的数据"));

        var item = row.get();
        return h.success(item);

    }).catch(function (err) {
        return h.error(Boom.badRequest(err.message, err));
    })
};
//创建
Controller.prototype.create = function (request, h) {

    if (request.payload && JSON.stringify(request.payload) != "{}") {
        return this.service.create(request.payload).then(function (result) {
            return h.success(result);
        }).catch(function (err) {
            return h.error(Boom.badRequest(err.message, err));
        })
    }
    else {
        return h.error(Boom.badRequest("消息体不能为空"));
    }
};
//删除单个
Controller.prototype.delete = function (request, h) {

    var where = { task_id: request.params.task_id };

    return this.service.delete(where).then(function (row) {
        return h.success();
    }).catch(function (err) {
        return h.error(Boom.badRequest(err.message, err));
    })
};
//更新单个
Controller.prototype.update = function (request, h) {

    var where = { task_id: request.params.task_id };

    return this.service.update(where, request.payload).then(function (result) {
        return h.success();
    }).catch(function (err) {
        return h.error(Boom.badRequest(err.message, err));
    })
};

Controller.prototype.initRedisAll = function (request, h) {
    return this.service.initRedisAll().then(function (result) {
        return h.success(result);

    }).catch(function (err) {
        return h.error(Boom.badRequest(err.message, err));
    })
};

Controller.prototype.clearRedisAll = function (request, h) {
    return this.service.clearRedisAll().then(function (result) {
        return h.success(result);

    }).catch(function (err) {
        return h.error(Boom.badRequest(err.message, err));
    })
};

Controller.prototype.startAll = function (request, h) {
    return this.service.startAll().then(function (result) {
        return h.success(result);

    }).catch(function (err) {
        return h.error(Boom.badRequest(err.message, err));
    })
};

Controller.prototype.stopAll = function (request, h) {
    return this.service.stopAll().then(function (result) {
        return h.success(result);

    }).catch(function (err) {
        return h.error(Boom.badRequest(err.message, err));
    })
};

module.exports = Controller;