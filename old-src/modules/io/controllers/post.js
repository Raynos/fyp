var pd = require("pd")

var List = {
    start: function () {
        this.domain.getAll(this.req.user, this.renderPosts)
    },
    renderPosts: function (err, posts) {
        if (err) {
            return this.renderError(err)
        }
        this.res.json(posts)
    },
    renderError: function (err) {
        this.res.statusCode = 500
        this.res.end("sorry")
    }
}

module.exports = {
    setup: function () {
        this.express.on("creation", this.attachRoute)
    },
    attachRoute: function (app) {
        app.get("/post", this.list)
    },
    list: function (req, res) {
        pd.bindAll({}, List, {
            req: req,
            res: res
        }, this).start()
    }
}