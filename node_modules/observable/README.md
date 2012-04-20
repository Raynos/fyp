# observable

Observable objects shared between server and client

## <a href="#Example" name="Example">Example</a>

    // client.js
    var observable = require("observable"),
        Things = observable("Things")

    Things.on("change", function (key, value, observable) {
        assert(key === someUuid)
        assert(value.thing === true)
        observable.on("change", function (key, value) {
            assert(key === "foo")
            assert(value === "bar")
        })
        observable.set("foo", "bar", function optionalCallback() {
            // the property has been set everywhere now
        })
    })

    Things.push({ thing: true })

    // server.js
    var http = require("http"),
        server = http.createServer(),
        observable = require("observable")(server),
        Things = observable("Things")

    ...

The same code can be shared server and client.

The observable set (Things in the example) is shared across server and all browser clients. This means any changes to the set will fire change handlers on all browsers.

This makes for a great way to share realtime state between servers and clients

## <a href="#Tests" name="Tests">Tests</a>

Soon

## <a href="#Documentation" name="Documentation">Documentation</a>

Soon

## MIT Licenced