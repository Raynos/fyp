var store = require("../util/store")

module.exports = {
    init: function () {
        window.posts = this.domain
        var user = store.get("user")

        this.domain.getPosts(user, function (err, posts) {
            console.log("posts found", err, posts)
        })
    }
}