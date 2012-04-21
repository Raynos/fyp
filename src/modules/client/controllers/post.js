var store = require("../util/store"),
    Posts = require("indexedStore")("Posts")

module.exports = {
    init: function () {
        window.posts = this.domain
        var domain = this.domain
        var user = store.get("user")

        Posts.get("posts", function (err, value) {
            if (value === undefined) {
                return next()
            }
            console.log("got from indexeddb", value.length)
            domain.setPostData(value)
        })

        console.log("init getposts", this.domain)

        function next() {
            domain.getPosts(user, function (err, posts) {
                Posts.put(posts, "posts", function (err, result) {

                })
                console.log("should render")
            })   
        }
    }
}