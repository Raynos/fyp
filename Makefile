REPORTER=spec
TEST_COMMAND = @NODE_ENV=test \
	./node_modules/.bin/mocha \
	--ui bdd \
	--require should \
	--reporter $(REPORTER) \

http:
	$(TEST_COMMAND) $(shell find ./test/http -name \*.js)

.PHONY: http