build:
	node build.js

browserify:
	browserify ./lib/index.js --outfile ./vendor/nodecomposite.js

webmake:
	webmake lib/index.js vendor/nodecomposite.js

test:
	firefox ./test/test.html

.PHONY: build test
