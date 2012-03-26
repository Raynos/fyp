module.exports = {
    headers: {},
    xhr: function (options, callback) {
        console.log(options.method + " " + options.uri, this.headers)
        var xhr = new XMLHttpRequest
        xhr.addEventListener("load", function () {
            callback(null, this.response || this.responseText)
        })
        xhr.addEventListener("error", function (evt) {
            callback(evt)
        })
        xhr.open(options.method, options.uri)
        if (this.headers) {
            Object.keys(this.headers).forEach(function (key) {
                xhr.setRequestHeader(key, this.headers[key])
            }, this)
        }
        if (options.headers) {
            Object.keys(options.headers).forEach(function (key) {
                xhr.setRequestHeader(key, options.headers[key])
            })
        }
        xhr.send(options.data)
    }
}