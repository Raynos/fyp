var connect = require("connect"),
    http = require("http"),
    browserify = require("browserify"),
    path = require("path")

var app = connect(),
    server = http.createServer(app),
    observable = require("observable")(server),
    Bag = observable("Bag"),
    bundle = browserify()

bundle.require("observable")

bundle.addEntry(path.join(__dirname, "client.js"))

app.use(connect.static(__dirname))

app.use(bundle)

Bag.set("foo", "bar", function () {
    server.listen(3000)
    console.log('http://localhost:3000/')
})