REPORTER = spec

test-builder:
	browserify ./test/observable.js \
		--o ./test/test.js

test-build:
	node ./test/build.js

test-server:
	node ./test/server.js

test-run:
	/opt/google/chrome/google-chrome --enable-plugins localhost:3000

test: 
	@NODE_ENV=test ./node_modules/.bin/mocha \
		--ui tdd \
		--bail \
		--reporter $(REPORTER) \
		./test/observable.js

web:
	node ./examples/web/server.js

.PHONY: web test-server test-run test test-builder
