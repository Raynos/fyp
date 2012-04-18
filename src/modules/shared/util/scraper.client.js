module.exports = function (uri, callback) {
    var iframe = document.createElement("iframe")
    iframe.onload = handleLoad
    iframe.src = uri
    iframe.style.display = 'none'
    document.head.appendChild(iframe)

    function handleLoad() {
        var uris = [].slice.call(iframe.contentWindow.document.links)
        uris = uris.map(toString)
        document.head.removeChild(iframe)
        cb(null, uris)

        function toString(node) {
            return node.href
        }
    }
}