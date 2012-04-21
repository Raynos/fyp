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

mongo:
	sudo mongod &

update:
	git stash
	git pull origin master
	npm install
	make ncore
	grep "I AM" < out.log

.PHONY: build start ncore run mongo update