module.exports = {
    find: tunnel("find"),
    insert: tunnel("insert")
}

function tunnel(name) {
    return proxy

    function proxy() {
        var args = arguments, 
            cb = arguments[arguments.length - 1]

        this.collection(doName)

        function doName(err, collection) {
            if (err) {
                return cb(err)
            }
            collection[name].apply(collection, args)
        }
    }
}