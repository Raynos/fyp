var ClassList = {
    constructor: function constructor(nodes) {
        this.classLists = nodes.map(toClassList);
        return this;
        
        function toClassList(element) {
            return element.classList;
        }
    },
    contains: function contains() {
        var args = arguments;
        return this.classLists.some(containsClass);

        function containsClass(classList) {
            return classList.contains.apply(classList, args);
        }
    }
};
    
["add", "remove", "toggle"].forEach(addToClassList);

module.exports = ClassList;
    
function addToClassList(name) {
    ClassList[name] = proxy;

    function proxy() {
        var args = arguments;
        this.classLists.forEach(applyMethod);
   
        function applyMethod(classList) {
            classList[name].apply(classList, args);
        } 
    }
}