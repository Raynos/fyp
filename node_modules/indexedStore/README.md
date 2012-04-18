# indexedStore

Small indexedDB wrapper that fixes the API

## <a href="#example" name="example">Example</a>

// jsfiddle: http://jsfiddle.net/Pj7G4/1/
var store = indexeddbStore("user")

store.put({ name: "bob" }, "bob", function (err, result) {
    store.get("bob", function (err, user) {
        console.log(user.name === "bob")
    })
})

## Documentation

The same as [ObjectStore][1] except the API now takes a callback as an extra parameter rather then returning this request object

Note that the opening of the database is handled for you

## Installation

`npm install indexedStore` or drop the file into your project

## Tests

I'll write them one day

## Contributors

 - Raynos

## MIT Licenced


  [1]: http://www.w3.org/TR/IndexedDB/#object-store