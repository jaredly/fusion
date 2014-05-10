build:
	browserify -t reactify web/run.js -o example/fusion.js -d

css:
	lessterfy web/index.js example/fusion.css

.PHONY: build css
