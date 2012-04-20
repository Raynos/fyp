var EventEmitter = require("eventemitter-light"),
    extend = require("pd").extend,
    uuid = require("node-uuid")

var Observable = extend({}, EventEmitter, {
    constructor: function (name, state, synchronizer) {
        EventEmitter.constructor.call(this)
        this._state = state || {}
        this.synchronizer = synchronizer
        this._id = name || uuid()
        return this
    },
    push: function (value, callback) {
        this.set(uuid(), value, callback)
    },
    set: function (key, value, callback) {
        this._state[key] = value
        var observ
        if (typeof value === "object") {
            observ = observable(this.synchronizer, uuid(), value)
        } else {
            observ = null
        }
        this.emit("change", key, value, observ)
        this.synchronizer && this.synchronizer(this, callback)
    },
    get: function (key) {
        return this._state[key]
    },
    remove: function (key, callback) {
        this.set(key, undefined, callback)
    }
})

module.exports = observable

function observable(synchronizer, name, state) {
    return extend({}, Observable).constructor(name, state, synchronizer)
}