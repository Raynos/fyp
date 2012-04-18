suite("NodeComposite", function () {
    var nodes = "<div class='foo'></div> \
                 <div class='foo'></div> \
                 <div class='foo'></div>";

    var testBody = document.getElementById("testbody"),
        $ = NodeComposite.$;

    setup(function () {
        var fragment = Fragment(nodes);
        testBody.appendChild(fragment);
    });

    teardown(function () {
        testBody.textContent = "";
    });

    suite("classList", function () {
        test("classList add works", function () {
            $(".foo").classList.add("bar");
            assert($(".bar").length === 3, 
               "not enough bar nodes");
        });

        test("classList remove works", function () {
            $(".foo").classList.add("bar");
            $(".foo").classList.remove("bar");
            assert($(".bar").length === 0,
                "too many bar nodes");
        });

        test("classList toggle works", function () {
            $(".foo").classList.toggle("bar");
            assert($(".bar").length === 3, 
               "not enough bar nodes"); 
            $(".foo").classList.toggle("bar");
            assert($(".bar").length === 0,
                "too many bar nodes"); 
        });

        test("classList contains works", function () {
            var foos = $(".foo");

            foos[1].classList.add("bar");
            console.dir(foos.classList.contains("bar"));
            assert(foos.classList.contains("bar") === true,
                "foos does not contain bar");
        });
    });

    suite("style", function () {
        test("style works", function () {
            $(".foo").style.color = 'red';
            $(".foo").forEach(function (el) {
                assert(el.style.color === 'red',
                    "style was not set properly");
            });
        });
    });

    suite("Array", function () {
        test("NodeComposite can be an array", function () {
            var foos = $(".foo");
            assert(foos.length, "does not have length");
            assert(foos.forEach, "does not have forEach");
            assert(foos.map, "does not have map");
        });

        test("reduce works", function () {
            var foos = $(".foo");
            foos.forEach(function (el, i) {
                el.value = i;
            });
            var sum = foos.reduce(function (memo, el) {
                return memo + el.value;
            }, 0);
            assert(sum === 3, "sum is incorrect");
        })
    });

    suite("parentElement", function () {
        test("parentNode is as expected", function () {
            var foos = $(".foo");
            var parents = foos.parentNode;
            parents.forEach(checkIfTestbody);

            function checkIfTestbody(el) {
                assert(el === testBody, "is not testBody");
            }

            var children = parents.children;
            assert(children.length ===  9,
                "children length not correct");
        });
    });

    suite("getElementsByClassName", function () {
        test("test can get elements", function () {
            var foos = $(".foo");
            foos.forEach(function (el) {
                el.appendChild(Fragment("<div class='baz'></div>"));
            });
            var bazs = foos.getElementsByClassName("baz");
            assert(bazs.length === 3, "not enough bazs");
        });
    });

    suite("addEventListener", function () {
        test("test events fire", function () {
            var foos = $(".foo"),
                count = 0;
            foos.addEventListener("click", function () {
                count++;
            });
            foos.forEach(function (el) {
                var ev = document.createEvent("Event");
                ev.initEvent("click", true, true);
                el.dispatchEvent(ev);
            });
            assert(count === 3, "event handlers do not work");
        });
    });

    suite("composite", function () {
        test("test removeChild", function () {
            var foos = $(".foo"),
                parents = foos.parentNode;

            parents.removeChild(foos);
            assert($(".foo").length === 0,
                "foos are still in document");
            parents.appendChild(foos);
            assert($(".foo").length === 3,
                "foos are not in document");
        });
    });

    function Fragment(html) {
        var div = document.createElement("div"),
            fragment = document.createDocumentFragment();

        div.innerHTML = html;
        while (div.hasChildNodes()) fragment.appendChild(div.firstChild);
        return fragment;
    }
});