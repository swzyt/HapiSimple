var Joi = require('joi');
module.exports = function (server, models) {

    server.bind(models.system.menu.controller);

    server.route([
        {
            method: 'GET',
            path: '/system/menus',
            config: {
                auth: 'jwt',
                tags: ['api', 'system-menu'],
                description: '分页方式获取菜单列表信息',
                validate: models.system.menu.validator.list.request,
                notes: '分页方式获取菜单列表信息',
                response: models.system.menu.validator.list.response,
                handler: models.system.menu.controller.list
            }
        },
        {
            method: 'GET',
            path: '/system/menus/menu_treelist_full',
            config: {
                auth: 'jwt',
                tags: ['api', 'system-menu'],
                description: '获取菜单树列表',
                validate: models.system.menu.validator.menu_treelist_full.request,
                notes: '获取菜单树列表',
                response: models.system.menu.validator.menu_treelist_full.response,
                handler: models.system.menu.controller.menu_treelist_full
            }
        },
        {
            method: 'GET',
            path: '/system/menus/menu_treelist_simple_button',
            config: {
                auth: 'jwt',
                tags: ['api', 'system-menu'],
                description: '获取菜单树列表',
                validate: models.system.menu.validator.menu_treelist_simple_button.request,
                notes: '获取菜单树列表',
                response: models.system.menu.validator.menu_treelist_simple_button.response,
                handler: models.system.menu.controller.menu_treelist_simple_button
            }
        },
        {
            method: 'GET',
            path: '/system/menus/menu_treelist_simple_no_button',
            config: {
                auth: 'jwt',
                tags: ['api', 'system-menu'],
                description: '获取菜单树列表',
                validate: models.system.menu.validator.menu_treelist_simple_no_button.request,
                notes: '获取菜单树列表',
                response: models.system.menu.validator.menu_treelist_simple_no_button.response,
                handler: models.system.menu.controller.menu_treelist_simple_no_button
            }
        },
        {
            method: 'POST',
            path: '/system/menus',
            config: {
                auth: 'jwt',
                tags: ['api', 'system-menu'],
                description: '创建新的菜单信息',
                validate: models.system.menu.validator.create.request,
                notes: 'My route notes',
                response: models.system.menu.validator.create.response,
                handler: models.system.menu.controller.create
            }
        },
        {
            method: 'GET',
            path: '/system/menus/{menu_id}',
            config: {
                auth: 'jwt',
                tags: ['api', 'system-menu'],
                description: '获取指定标识的菜单信息',
                validate: models.system.menu.validator.get.request,
                notes: 'My route notes',
                response: models.system.menu.validator.get.response,
                handler: models.system.menu.controller.get
            }
        },
        {
            method: 'PUT',
            path: '/system/menus/{menu_id}',
            config: {
                auth: 'jwt',
                tags: ['api', 'system-menu'],
                description: '更新指定标识的菜单信息',
                validate: models.system.menu.validator.put.request,
                notes: 'My route notes',
                response: models.system.menu.validator.put.response,
                handler: models.system.menu.controller.update
            }
        },
        {
            method: 'PUT',
            path: '/system/menus/update_batch',
            config: {
                auth: 'jwt',
                tags: ['api', 'system-menu'],
                description: '更新批量',
                validate: models.system.menu.validator.update_batch.request,
                notes: 'My route notes',
                response: models.system.menu.validator.update_batch.response,
                handler: models.system.menu.controller.update_batch
            }
        },
        {
            method: 'DELETE',
            path: '/system/menus/{menu_id}',
            config: {
                auth: 'jwt',
                tags: ['api', 'system-menu'],
                description: '删除指定标识的菜单信息',
                validate: models.system.menu.validator.delete.request,
                notes: 'My route notes',
                response: models.system.menu.validator.delete.response,
                handler: models.system.menu.controller.delete
            }
        },
        {
            method: 'DELETE',
            path: '/system/menus/delete_batch',
            config: {
                auth: 'jwt',
                tags: ['api', 'system-menu'],
                description: '删除批量',
                validate: models.system.menu.validator.delete_batch.request,
                notes: 'My route notes',
                response: models.system.menu.validator.delete_batch.response,
                handler: models.system.menu.controller.delete_batch
            }
        }
    ])
};