var jsdom = require("jsdom")

module.exports = main

function main(uri, callback) {
    jsdom.env(uri, extractLinks)

    function extractLinks(errors, window) {
        if (errors) {
            return callback(errors)
        }
        var links = [].slice.call(window.document.links).map(toString)
        return (null, links)

        function toString(node) {
            return node.href
        }
    }
}