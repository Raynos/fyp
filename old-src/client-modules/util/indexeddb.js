(function () {

var indexedDB = window.webkitIndexedDB || window.mozIndexedDB || 
        window.msIndexedDB || window.indexedDB,
    objectStore = (window.webkitIDBObjectStore || window.mozIDBObjectStore ||
        window.msIDBObjectStore || window.IDBObjectStore).prototype,
    transaction = (window.webkitIDBTransaction || window.mozIDBTransaction ||
        window.msIDBTransaction || window.IDBTransaction).prototype,
    cachedResults,
    callbackQueue

function createDB(name, callback) {
    if (cachedResults) {
        return callback.apply(cachedResults[1], cachedResults)
    } else if (callbackQueue) {
        return callbackQueue.push(callback)
    }

    callbackQueue = [callback]

    var req = indexedDB.open(name || "DEFAULT")
    req.onupgradeneeded = function () {
        db.createObjectStore(storeName)
    }
    req.onsuccess = invokeCallbacks
    req.onerror = invokeCallbacks

    function invokeCallbacks(evt) {
        var callbackList = callbackQueue
        cachedResults = [evt.target.error, evt.target.result]
        callbackQueue = null
        for (var i = 0, len = callbackList.length; i < len; i++) {
            callbackList[i].apply(cachedResults[1], cachedResults)
        }
    }
}

function indexeddb(storeName, databaseName) {
    return getStore

    function getStore(callback) {
        createDB(databaseName, function (err, db) {
            if (!db.objectStoreNames.contains(storeName) &&
                db.setVersion
            ) {
                var req = db.setVersion("1.0")
                req.onerror = function () {
                    callback(this.error)
                }
                req.onsuccess = function () {
                    if (!db.objectStoreNames.contains(storeName)) {
                        db.createObjectStore(storeName)    
                    }
                    openStore()
                }
            } else {
                openStore()
            }

            function openStore() {
                var trans = db.transaction([storeName], 
                    transaction.READ_WRITE)
                callback(null, trans.objectStore(storeName))
            }
        })
    }
}

function store(storeName, databaseName) {
    return Object.create(Store).constructor(
        indexeddb(storeName, databaseName)
    )
}

var Store = {
    constructor: function (store) {
        store((function (err, store) {
            this._store = store
        }).bind(this))
        this.store = store
        return this
    }
}

function addToStore(methodName) {
    try {
        if (typeof objectStore[methodName] === "function" &&
            methodName !== "constructor"
        ) {
            Store[methodName] = tunnel(methodName)
        }    
    } catch (err) {
        // FIREFOX fails on objectStore.name because it's a getter/setter
    }
    
}

function tunnel(methodName) {
    return proxy

    function proxy() {
        var args = [].slice.call(arguments),
            callback = args.pop()

        this.store(invokeMethod)

        function invokeMethod(err, store) {
            if (err) {
                return (callback && callback(err))
            }
            var req = store[methodName].apply(store, args)
            req.onerror = function () {
                callback && callback(this.error)
            }
            req.onsuccess = function () {
                callback && callback(null, this.result)
            }
        }
    }
}

Object.keys(objectStore).forEach(addToStore)

store.indexeddb = indexeddb
store.Store = Store

if (typeof module !== "undefined" && module.exports) {
    module.exports = store    
} else if (typeof window !== "undefined") {
    window.indexeddbStore = store
}


}())