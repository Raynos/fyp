# NodeComposite

Allowing you to operate on nodeLists as if they are a single node.

## Status: Beta

## Example

    // $ is QSA _not_ Sizzle/jQuery
    var $ = NodeComposite.$;

    // foos is a NodeComposite instance and also an Array
    var foos = $(".foo");
    // Note you can pass any NodeList to NodeComposite as well
    // var foos = Object.create(NodeComposite).constructor(
    //     document.getElementsByClassName('foo')
    // );

    // set style on all foos
    foos.style.color = 'red';

    // set classes on all foos
    foos.classList.add('bar');

    // create a new composite consisting of the parentNodes
    var parents = foos.parentNode;

    // manipulate foos like an array
    foos.reduce(function (memo, el) {
        return memo + el.value;
    }, 0);

    // map the set of all foos to the set of .bar's in foo
    var bars = foos.getElementsByClassName('bar');

    // add an event listener to all elements of foo
    foos.addEventListener('click', function () {
        ...
    });

    // get parents
    var parents = foos.parentNode;
    // batch operate on all parents
    // All the foos have been removed from their respective parents
    parents.removeChild(foos);

## Motivation

Set operations on nodeLists are pretty cool. There is no small library that allows you to do this without adding a DOM abstraction or a lot of bloat.

## Documentation

### add(nodes, ...)

Adds nodes to the composite, nodes can either be an array-like of nodes or a node.

### classList

Returns a composite classList object. Containing methods 

 - add
 - remove
 - toggle

The above methods just invoke the methods on the underlying classlists of all the nodes in the composite.

the `.contains` method will return true if _any_ node in the composite contains the class.

### style

Returns a composite style object. You can set style's on this and the style will be set on every node in the composite

### Getters

 - parentElement
 - parentNode
 - childNodes
 - firstChild
 - lastChild
 - previousSibling
 - nextSibling
 - children
 - firstElementChild
 - lastElementChild
 - previousElementSibling
 - nextElementSibling

The above getters on NodeComposite will return a new NodeComposite made of the respective elements.

So `comp.parentElement` will return a comp of all parent elements and `comp.children` will return a comp of all the children. 

Note that the parent elements comp is the same size (given no element of the comp has `null` as it's parentElement), and the children comp is the union of all children so can be any size.

### Transformations

 - cloneNode
 - getElementsByTagName
 - getElementsByTagNameNS
 - getElementsByClassName
 - querySelector
 - querySelectorAll

The above methods will return a new composition which consists of the return value of the method applied on every node in the composition.

So cloneNode will return a new composition of clones and querySelectorAll will return a new composition consisting of union of the results of querySelectorAll applied to all nodes

### Methods

 - normalize
 - addEventListener
 - removeEventListener

The above methods will just invoke the method with the parameters on each node in the composite

### Batch operations

 - removeChild
 - replaceChild
 - appendChild
 - insertBefore

The above methods will accept composites as parameters and invoke the method on each node in the composite with the matching node in the parameter.

For example `comp.appendChild(otherComp)` would append each ith node of otherComp to the ith node of comp.

### Array methods

NodeComposite inherits from Array.

### make(nodes)

Utility for making a new NodeComposite

    // var things = Object.create(NodeComposite).add(nodes);
    var things = NodeComposite.make(nodes);

## Installation

Copy vendor/nodecomposite.js

## Build file

`make build`

## run tests

`make test`

## Contributors

 - Raynos

## MIT Licenced