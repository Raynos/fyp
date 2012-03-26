module.exports = {
    init: function () {
        document.body.appendChild(document.createTextNode("loading posts"))
        this.util.xhr({
            uri: "/post",
            method: "GET"
        }, this.renderPosts)
    },
    renderPosts: function (err, data) {
        console.log("got posts")
        document.body.removeChild(document.body.lastChild)
        var json = JSON.parse(data)
        var node = this.view.renderNode(json[0])
    }
}