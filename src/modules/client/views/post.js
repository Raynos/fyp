var pd = require("pd"),
    xhr = require("xhr"),
    dust = require("dustjs-linkedin"),
    fragment = require("fragment"),
    cache = {}

var ProgressRenderer = {
    constructor: function () {
        this.observable.on("change", this.handleProgressChange)
    },
    handleProgressChange: function (key, value) {
        if (key === "greader-progress") {
            this.greaderNode.value = value
        } else if (key === "greader-max") {
            this.greaderNode.max = value
        } else if (key === "linking-progress") {
            this.linkingNode.value = value
        } else if (key === "linking-max") {
            this.linkingNode.max = value
        }
    }
}

var PostRenderer = {
    constructor: function () {
        var self = this,
            middlePosts = this.middlePosts = 
                this.middle.getElementsByClassName("posts")[0]
            
        self.open = false

        template("/client/post.dust", this.post, function (err, frag) {
            middlePosts.appendChild(frag)
            self.postDiv = middlePosts.lastElementChild
            self.postDiv.addEventListener("click", self.handleClick)
        })
    },
    handleClick: function () {
        this.open = !this.open
        if (this.open) {
            this.addLinksTo(this.left, this.post.backLinks)
            this.addLinksTo(this.right, this.post.forwardLinks)    
        } else {
            this.left.textContent = ""
            this.right.textContent = ""
        }
    },
    addLinksTo: function (elem, links) {
        elem.textContent = ""
        links.map(function (uri) {
            return this.domain.posts.get(uri)
        }, this).forEach(function (post) {
            template("/client/post.dust", post, function (err, frag) {
                elem.appendChild(frag)
            })
        })
    }
}

module.exports = {
    setup: function () {
        this.domain.on("change", this.handleDomainChange)
        this.domain.posts.on("change", this.handlePostsChange)
    },
    greaderNode: document.getElementById("greader"),
    linkingNode: document.getElementById("linking"),
    left: document.getElementsByClassName("left")[0],
    middle: document.getElementsByClassName("middle")[0],
    right: document.getElementsByClassName("right")[0],
    outer: document.getElementById("outer"),
    handleDomainChange: function (key, value) {
        pd.bindAll({}, ProgressRenderer, this, {
            observable: value
        }).constructor()
    },
    handlePostsChange: function (key, value) {
        this.outer.hidden = true
        pd.bindAll({}, PostRenderer, this, {
            post: value
        }).constructor()
    }
}

function template(uri, context, callback) {
    if (cache[uri]) {
        return compile(cache[uri])
    }

    loadWithXHR()

    function loadWithXHR() {
        xhr({
            method: "GET",
            uri: uri
        }, function (err, response) {
            if (this.status === 404) {
                return callback(new Error("template not found"))
            }
            if (err) {
                return callback(err)
            }
            compileSource(response)
        })
    }

    function compileSource(source) {
        var fn = dust.compileFn(source)
        cache[uri] = fn

        compile(fn)
    }

    function compile(fn) {
        fn(context, function (err, out) {
            if (err) {
                return callback(err)
            }
            return callback(null, fragment(out))
        })
    }
}