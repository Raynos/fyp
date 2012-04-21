build:
	node ./src/build.js

start:
	supervisor ./index.js

run:
	node ./index.js > out.log &

ncore:
	./node_modules/.bin/ncore \
		-o ./src/static/js/bundle.js \
		./src/modules

.PHONY: build start ncore