var pd = require("pd"),
    xhr = require("xhr"),
    dust = require("dustjs-linkedin"),
    By = require("nodecomposite").By,
    fragment = require("fragment"),
    DelegateListener = require("DelegateListener"),
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
        var self = this

        self.post.date = (new Date(self.post.publishedTime * 1000))
            .toDateString()
            
        self.open = false

        template("/client/post.dust", this.post, function (err, frag) {
            var as = frag.firstChild.getElementsByTagName("a")
            ;[].forEach.call(as, function (a) {
                a.target = "_blank"
            })
            self.posts.appendChild(frag)
            self.postDiv = self.posts.lastElementChild
            self.postDiv.addEventListener("click", self.handleClick)
            self.postContent = self.postDiv.getElementsByClassName("content")[0]
        })
    },
    handleClick: function () {
        if (!this.postContent.classList.contains("open")) {
            this.addLinksTo(this.backlinks, this.post.backLinks)
            this.addLinksTo(this.forwardlinks, this.post.forwardLinks)
            this.addLinksTo(this.related, 
                [].concat(this.post.backLinks, this.post.forwardLinks))
            var open = By.class("open")
            this.content.textContent = ""
            this.content.appendChild(fragment(this.post.summary))
            open.classList.add("hidden")
            open.classList.remove("open")
            var selected = By.class("selected")
            selected.classList.remove("selected")
            this.postDiv.classList.add("selected")
            this.postContent.classList.add("open")
            this.postContent.classList.remove("hidden")
        } else {
            this.backlinks.textContent = ""
            this.forwardlinks.textContent = ""
            this.content.textContent = ""
            this.related.textContent = ""
            this.postDiv.classList.remove("selected")
            this.postContent.classList.remove("open")
            this.postContent.classList.add("hidden")
        }
    },
    addLinksTo: function (elem, links) {
        elem.textContent = ""
        links.map(function (uri) {
            return this.domain.posts.get(uri)
        }, this).filter(function (item) {
            return item && item.uri &&
                item.uri !== this.post.uri &&
                item.title !== this.post.title
        }, this).reduce(function (memo, item) {
            if (memo.some(function (otherItem) {
                return item.title === otherItem.title ||
                    item.uri === otherItem.uri
            })) {
                return memo
            }
            return memo.concat([item])
        }, []).forEach(function (post) {
            template("/client/post.dust", post, function (err, frag) {
                var as = frag.firstChild.getElementsByTagName("a")
                ;[].forEach.call(as, function (a) {
                    a.target = "_blank"
                })
                elem.appendChild(frag)
            })
        })
    }
}

module.exports = {
    setup: function () {
        this.domain.on("change", this.handleDomainChange)
        this.domain.posts.on("change", this.handlePostsChange)
        view1.addEventListener("click", function () {
            document.body.classList.remove("view2")
            document.body.classList.add("view1")
        })
        view2.addEventListener("click", function () {
            document.body.classList.remove("view1")
            document.body.classList.add("view2")
        })
        By.id("relatedLinks")
            .add(By.id("backlinks"))
            .add(By.id("forwardlinks"))
            .addEventListener("click", 
                new DelegateListener(".post", function (event) {
                    var items = By.qsa("#posts .post"),
                        titles = items.map(function (el) {
                            return {
                                title: el.firstElementChild.lastChild.data,
                                el: el
                            }
                        }),
                        self = event.target,
                        selfTitle = self.firstElementChild.lastChild.data

                    var node = titles.filter(function (stuff) {
                        return stuff.title === selfTitle
                    })[0].el

                    var ev = document.createEvent("Event")
                    ev.initEvent("click", true, true)
                    node.dispatchEvent(ev)
                    node.scrollIntoView()
                }))
    },
    greaderNode: document.getElementById("greader"),
    linkingNode: document.getElementById("linking"),
    backlinks: document.getElementById("backlinks"),
    posts: document.getElementById("posts"),
    view1: document.getElementById("view1"),
    view2: document.getElementById("view2"),
    content: document.getElementById("postcontent"),
    related: document.getElementById("relatedLinks"),
    forwardlinks: document.getElementById("forwardlinks"),
    outer: document.getElementById("outer"),
    blogTitle: document.getElementById("blog-title"),
    handleDomainChange: function (key, value) {
        pd.bindAll({}, ProgressRenderer, this, {
            observable: value
        }).constructor()
    },
    handlePostsChange: function (key, value) {
        this.outer.hidden = true
        this.blogTitle.textContent = "Your blog posts from Google Reader"
        pd.bindAll({}, PostRenderer, this, {
            post: value
        }).constructor()
    }
}

function template(uri, context, callback) {
    if (cache[uri]) {
        return compile(cache[uri])
    }

    loadWithXHR(uri, compileSource)

    function compileSource(err, source) {
        if (err) {
            return callback(err)
        }
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

var loadWithXHR = pd.memoize(function loadWithXHR(uri, callback) {
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
        callback(null, response)
    })
})