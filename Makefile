REPORTER=spec
TEST_COMMAND = @NODE_ENV=test \
	./node_modules/.bin/mocha \
	--ui bdd \
	--require should \
	--reporter $(REPORTER) \

http:
	$(TEST_COMMAND) $(shell find ./test/http -name \*.js)

build:
	node ./src/build.js

start:
	supervisor ./index.js

ncore:
	./node_modules/.bin/ncore -o ./src/public/bundle.js ./src/client-modules

.PHONY: http