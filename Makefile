build:
	browserify -t reactify web/run.js -o example/fusion.js -d

.PHONY: build

