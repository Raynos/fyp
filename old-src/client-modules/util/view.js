module.exports = {
    Fragment: function (html) {
        var div = document.createElement("div"),
            frag = document.createDocumentFragment()

        div.innerHTML = html
        while (div.firstChild) {
            frag.appendChild(div.firstChild)
        }
        return frag
    }
}