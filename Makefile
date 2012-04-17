TESTS = $(shell find test -name "*.test.coffee")

tests:
	NODE_ENV=testing ./node_modules/.bin/mocha --require should --reporter spec --compilers coffee:coffee-script $(TESTS)
