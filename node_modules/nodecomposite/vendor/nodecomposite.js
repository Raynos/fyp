(function (modules) {
	var getBuild = function (build) {
		return function (ignore, module) {
			module.exports = build.exports;
		};
	};
	var getModule = function (scope, tree, path) {
		var name, dir, exports = {}, module = { exports: exports }, require, build;
		path = path.split('/');
		name = path.pop();
		while ((dir = path.shift())) {
			if (dir === '..') {
				scope = tree.pop();
			} else if (dir !== '.') {
				tree.push(scope);
				scope = scope[dir];
			}
		}
		require = getRequire(scope, tree);
		build = scope[name];
		scope[name] = getBuild(module);
		build.call(exports, exports, module, require);
		return module.exports;
	};
	var require = function (scope, tree, path) {
		var name;
		if (path.charAt(0) !== '.') {
			name = path.split('/', 1)[0];
			path = path.slice(name.length + 1);
			scope = modules[name];
			tree = [];
			if (!path) {
				path = scope[':mainpath:'];
			}
		}
		return getModule(scope, tree, path);
	};
	var getRequire = function (scope, tree) {
		return function (path) {
			return require(scope, [].concat(tree),
				(path.slice(-3) === '.js') ? path.slice(0, -3) : path);
		};
	};
	return getRequire(modules['.'], []);
})
({
	".": {
		"lib": {
			"index": function (exports, module, require) {
				window.NodeComposite = require("./nodecomposite.js");			},
			"nodecomposite": function (exports, module, require) {
				var ClassList = require("./classlist.js"),
				    Style = require("./style.js");

				var toArray = [].slice.call.bind([].slice);
				/*  set {
				        classList: manipulates classes in every element in the set
				        style: manipulate the CSS style of every element in the set
				        parentNode, parentElement, previousSibling, etc: all return new sets of the collective operation
				        normalize: normalizes all elements
				        cloneNode: returns a set of clones of all elements
				        getElementsByX, querySelector, querySelectorAll: returns a new set of the result applied to all nodes
				        forEach, map, filter, reduce, etc: run the array methods on the nodes property
				    }
				*/
				var NodeComposite = Object.create(Array.prototype);

				NodeComposite.$ = $;
				NodeComposite.By = {
				    id: function byId(id) {
				        return make(document.getElementById(id));
				    },
				    tag: function byTag(tag, context) {
				        return make((context || document).getElementsByTagName(tag));
				    },
				    "class": function byClass(klass, context) {
				        return make((context || document).getElementsByClassName(klass));
				    },
				    name: function byName(name) {
				        return make(document.getElementsByName(name));
				    },
				    qsa: function byQuery(query, context) {
				        return make((context || document).querySelectorAll(query));
				    },
				    qs: function byQueryOne(query, context) {
				        return make((context || document).querySelector(query));
				    }
				};
				NodeComposite.add = add;
				NodeComposite.constructor = add;
				NodeComposite.make = make;

				Object.defineProperties(NodeComposite, {
				    classList: {
				        get: function getClassList() {
				            return Object.create(ClassList).constructor(this);
				        },
				        configurable: true
				    },
				    style: {
				        get: function getStyle() {
				            return Object.create(Style).constructor(this);
				        },
				        configurable: true
				    }
				});

				[
				    "parentElement", 
				    "parentNode",
				    "childNodes",
				    "firstChild",
				    "lastChild",
				    "previousSibling",
				    "nextSibling",
				    "children",
				    "firstElementChild",
				    "lastElementChild",
				    "previousElementSibling",
				    "nextElementSibling"
				].forEach(addGetterToNodeComposite);

				[
				    "cloneNode",
				    "getElementsByTagName",
				    "getElementsByTagNameNS",
				    "getElementsByClassName",
				    "querySelector",
				    "querySelectorAll"
				].forEach(addReturningOperationToNodeComposite);

				[
				    "addEventListener",
				    "removeEventListener",
				    "normalize"
				].forEach(addOperationToNodeComposite);

				[
				    "appendChild",
				    "replaceChild",
				    "removeChild",
				    "insertBefore"
				].forEach(addBatchOperationToNodeComposite);

				module.exports = NodeComposite;

				function make(nodes) {
				    return Object.create(NodeComposite).add(nodes);
				}

				function $(selector) {
				    return make(document.querySelectorAll(selector));
				}

				function add() {
				    for (var i = 0, len = arguments.length; i < len; i++) {
				        var val = arguments[i];
				        if (val.length !== undefined) {
				            this.add.apply(this, toArray(val));
				        } else if (val !== null) {
				            this.push(val);       
				        }
				    }
				    return this;
				}

				function addGetterToNodeComposite(name) {
				    Object.defineProperty(NodeComposite, name, {
				        get: function getName() {
				            return make(this.map(toName));

				            function toName(el) {
				                return el[name];
				            }
				        },
				        configurable: true
				    });
				}

				function addReturningOperationToNodeComposite(name) {
				    NodeComposite[name] = operateOnNodeComposite;

				    function operateOnNodeComposite() {
				        var args = arguments;
				        return make(this.map(byOperation));

				        function byOperation(el) {
				            return el[name].apply(el, args);
				        }
				    }
				}

				function addOperationToNodeComposite(name) {
				    NodeComposite[name] = operateOnNodeComposite;

				    function operateOnNodeComposite() {
				        var args = arguments;
				        this.forEach(doOperation);

				        function doOperation(el) {
				            el[name].apply(el, args);
				        }
				    }
				}

				function addBatchOperationToNodeComposite(name) {
				    NodeComposite[name] = batchOperateOnNodeComposite;

				    function batchOperateOnNodeComposite(node, child) {
				        var args = [].slice.call(arguments);
				        this.forEach(batchOperate);
				        return child || node;

				        function batchOperate(element, index) {
				            element[name].apply(element, args.map(getIndex(index)));
				        }
				    }

				    function getIndex(index) {
				        return getIndex;

				        function getIndex(element) {
				            return element[index];
				        }
				    }
				}

				function addArrayMethodToNodeComposite(name) {
				    NodeComposite[name] = arrayMethod;

				    function arrayMethod() {
				        var arr = Array.prototype[name].apply(this, arguments);
				        return Object.create(NodeComposite).constructor(arr);
				    }
				}			},
			"classlist": function (exports, module, require) {
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
				}			},
			"style": function (exports, module, require) {
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
				}			}
		}
	}
})
("./lib/index");
