
/**
 * 默认分页参数配置项
 */

var Joi = require('joi');

module.exports = {
    page_size: Joi.number().integer().min(1).default(10).description('分页大小'),
    page_number: Joi.number().integer().min(1).default(1).description('分页页号'),
    sorter: Joi.string().allow(['', null]).description('排序条件')
};