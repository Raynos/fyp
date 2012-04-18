var Core = Object.create(require("ncore")).constructor(),
    moduleLoader = Core.use("moduleLoader", 
        require("ncore/modules/moduleLoader")),
    path = require("path")

moduleLoader.load({
    uri: path.join(__dirname, "./modules"),
    core: Core,
    dependencies: require("./dependency.json"),
    callback: init
})

module.exports = Core

function init(err) {
    if (err) {
        return console.log("error happened", err)
    }
    Core.init()
}