var jsdom = require("jsdom"),
    url = require("url")

module.exports = main

function main(uri, callback) {
    console.log("proxying links")
    jsdom.env(uri, extractLinks)

    function extractLinks(errors, window) {
        if (errors) {
            return callback(errors)
        }
        var links = [].slice.call(window.document.links).map(toString)
        console.log("extracting links", links)
        return callback(null, links)

        function toString(node) {
            var localHref = url.parse("http://localhost:8080"),
                uriHref = url.parse(uri),
                nodeHref = url.parse(node.href)

            if (nodeHref.host == null) {
                console.log(nodeHref)
            }

            if (localHref.host === nodeHref.host) {
                nodeHref.host = uriHref.host
            }

            return url.format(nodeHref)
        }
    }
}