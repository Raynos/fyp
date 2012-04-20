var observable = require("observable"),
    uuid = require("node-uuid"),
    assert = require("assert")

suite("Observable", function () {
    var dummy = { foo: "bar" },
        Bag

    setup(function () {
        Bag = observable(uuid())
    })

    test("set", function (done) {
        Bag.on("change", function (key, value, observable) {
            assert.equal(key, "foo")
            assert.equal(value, "bar")
            assert.equal(observable, null)
            done()
        })
        Bag.set("foo", "bar")
    })

    test("get", function () {
        Bag.set("foo", "bar")
        assert.equal(Bag.get("foo"), "bar")
    })

    test("remove", function (done) {
        Bag.on("change", function (key, value, observable) {
            assert.equal(key, "foo")
            assert.equal(value, undefined)
            assert.equal(observable, null)
            done()
        })
        Bag.remove("foo")
    })

    test("push", function (done) {
        Bag.on("change", function (key, value, observable) {
            assert(key)
            assert.equal(value, "foo")
            assert.equal(observable, null)
            done()
        })
        Bag.push("foo")
    })

    test("nested observables", function (done) {
        Bag.on("change", function (key, value, observable) {
            assert.equal(key, "foo")
            assert.equal(value.foo, "bar")
            observable.on("change", function (key, value) {
                assert.equal(key, "foo")
                assert.equal(value, "bar")
                done()
            })
            observable.set("foo", "bar")
        })
        Bag.set("foo", dummy)
    })

    test("callbacks", function (done) {
        var flag = true
        Bag.on("change", function (key, value, observable) {
            flag = false
        })

        Bag.set("foo", "bar", function () {
            assert.equal(flag, false)
            done()
        })
    })
})