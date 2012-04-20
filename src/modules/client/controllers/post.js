var store = require("../util/store")

module.exports = {
    init: function () {
        window.posts = this.domain
        var user = store.get("user")

        console.log("init getposts", this.domain)

        this.domain.getPosts(user, function (err, posts) {
            console.log("posts found", err, posts)
            window.winnar = posts
        })
    }
}