module.exports = Fragment

function Fragment(html) {
    var div = document.createElement("div"),
        args = arguments,
        i = 1,
        fragment = document.createDocumentFragment()

    div.innerHTML = html.replace(/%s/g, function(){
        return String(args[i++])
    })

    while (div.hasChildNodes()) {
        fragment.appendChild(div.firstChild)
    }

    return fragment
}