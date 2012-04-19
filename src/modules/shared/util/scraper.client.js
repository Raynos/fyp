var url = require("url")

module.exports = function (uri, callback) {
    var xhr = new XMLHttpRequest
    xhr.open("GET", "/proxy/" + 
        encodeURIComponent(uri))
    xhr.addEventListener("load", extractIntoIframe)
    xhr.send()

    function extractIntoIframe() {
        var iframe = document.createElement("iframe")
        iframe.style.display = 'none'
        document.head.appendChild(iframe)
        var doc = iframe.contentDocument
        doc.open()
        doc.write(this.responseText)
        doc.close()
        var uris = [].slice.call(doc.links).map(toString)
        document.head.removeChild(iframe)
        callback(null, uris)

        function toString(node) {
            var localHref = url.parse(window.location.href),
                uriHref = url.parse(uri),
                nodeHref = url.parse(node.href)

            if (localHref.host === nodeHref.host) {
                nodeHref.host = uriHref.host
            }

            return url.format(nodeHref)
        }
    }
}