var Style = {
    constructor: function constructor(nodes) {
        this.nodes = nodes;
        return this;
    }
};

[].slice.call(window.getComputedStyle(document.head)).forEach(addToStyle);

module.exports = Style;
    
function addToStyle(name) {
    Object.defineProperty(Style, name, {
        configurable: true,
        set: function set(value) {
            this.nodes.forEach(setValue);
     
            function setValue(node) {
                node.style[name] = value;   
            }
        }
    });
}