var trumpet = require("trumpet"),
    request = require("request"),
    url = require("url"),
    count = 0

module.exports = main

function main(uri, callback) {
    var results = []

    pipeRequest()

    function pipeRequest() {
        var tr = trumpet(),
            error,
            r = request({
                uri: uri
            })

        tr.select("a", extractLink)
        tr.on("end", function () {
            if (error) {
                return
            }
            count++
            if (count % 10 === 0 || count > 980) {
                console.log("got some", count)
                console.log(results[0], results.length)
            }
            callback(null, results)
        })
        tr.on("error", function (err) {
            error = err
            r.end()
            tr.end()
            callback(null, null)
        })

        r.pipe(tr)
        r.on("error", function (err) {
            error = err
            r.destroy()
            tr.end()
            callback(null, null)
        })
    }

    function extractLink(node) {
        if (node.attributes.href) {
            var str = toString(node)
            if (results.indexOf(str) === -1) {
                results.push(str)
            }
        }

        function toString(node) {
            //console.log("nodes :3", node)
            var localHref = url.parse("http://localhost:8080"),
                uriHref = url.parse(uri),
                nodeHref = url.parse(node.attributes.href)

            if (nodeHref.host == null && nodeHref.protocol !== "javascript:") {
                nodeHref.host = uriHref.host
            }

            if (localHref.host === nodeHref.host) {
                nodeHref.host = uriHref.host
            }

            return url.format(nodeHref)
        }
    }
}