const bootstrap = require("../../../bootstrap")()
const db = bootstrap.db;
const settings = bootstrap.settings;

const RabbitMQ = require("../../rabbitmq/RabbitMQ");

const { getBlogDetail, createBlog, createAuthor } = require("./blogs")(db, settings)
const { getComments } = require("./comments")(db)

let rabbitMQ_blog = new RabbitMQ(settings.rabbitmq.hosts, settings.rabbitmq.options);

rabbitMQ_blog.reveiveDefaultMsg("task_cnblogs_blog", async (source_msg, content) => {
    //console.log(` 博客消费者 接收到消息: ${content}`)

    let blog = JSON.parse(content);
    let blog_detail = await getBlogDetail(blog.blog_id)
    blog.blog_detail = blog_detail;
    await createBlog(blog)
    if (blog.comments > 0)
        await getComments(blog.blog_id, blog.comments)

    //通知rabbit，本条消息已处理完毕，可接收下一条
    if (!rabbitMQ_blog.options.noAck) {
        rabbitMQ_blog.CHANNEL.ack(source_msg)
    }
})

let rabbitMQ_author = new RabbitMQ(settings.rabbitmq.hosts, settings.rabbitmq.options);

rabbitMQ_author.reveiveDefaultMsg("task_cnblogs_author", async (source_msg, content) => {
    //console.log(` 博客作者消费者 接收到消息: ${content}`)

    let author = JSON.parse(content);
    await createAuthor(author)

    //通知rabbit，本条消息已处理完毕，可接收下一条
    if (!rabbitMQ_author.options.noAck) {
        rabbitMQ_author.CHANNEL.ack(source_msg)
    }
})