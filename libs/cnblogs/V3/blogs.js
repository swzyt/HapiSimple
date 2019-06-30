const api = require("./api");
const RabbitMQ = require("../../rabbitmq/RabbitMQ");
const PAGE_SIZE = 10;

const getBlogs = async () => {

    for (let number = 1; number <= 200; number++) {

        try {
            let cnblogs_result = await api.getBlogs(number, PAGE_SIZE)
            let record_count = cnblogs_result && cnblogs_result.entry ? cnblogs_result.entry.length : 0
            console.log(`获取到 ${record_count} 条记录`);

            if (record_count) {
                //解析博客数组
                for (let i = 0; i < cnblogs_result.entry.length; i++) {
                    let item = cnblogs_result.entry[i];

                    //博客
                    let obj_blog = {
                        blog_id: item.id,
                        title: item.title._,
                        summary: item.summary._,
                        published: item.published,
                        updated: item.updated,
                        //author: item.author,
                        author_name: item.author.name,
                        blogapp: item.blogapp,
                        link: item.link.$.href,
                        diggs: item.diggs,
                        views: item.views,
                        comments: item.comments
                    }

                    //博客作者
                    let obj_author = {
                        ...item.author,
                        blogapp: item.blogapp
                    }

                    rabbitMQ.sendDefaultMsg("task_cnblogs_blog", JSON.stringify(obj_blog))
                    rabbitMQ.sendDefaultMsg("task_cnblogs_author", JSON.stringify(obj_author))
                }
            }
        }
        catch (err) {
            console.log("本次异常：" + err)
        }
    }
}

const getBlogDetail = async (blog_id) => {
    return await api.getBlogDetail(blog_id)
}

const createBlog = (data) => {
    return db.CnBlog.destroy({ where: { blog_id: data.blog_id } })
        .then(function (delete_count) {
            return db.CnBlog.build(data).save().then(created_model => {
                return { delete_count, created_model }
            }).catch(err => {
                console.log("创建博客出错：", err)
                return null
            })
        });
}

const createAuthor = (data) => {
    return db.CnBlogAuthor.destroy({ where: { blogapp: data.blogapp } }).then(function (delete_count) {
        return db.CnBlogAuthor.build(data).save().then(created_model => {
            return { delete_count, created_model }
        }).catch(err => {
            console.log("创建博客作者出错：", err)
            return null
        })
    });
}

module.exports = function (db, settings) {
    this.db = db;
    this.rabbitMQ = new RabbitMQ(settings.rabbitmq.hosts, settings.rabbitmq.options);

    return {
        getBlogs,
        getBlogDetail,
        createBlog,
        createAuthor
    }
}