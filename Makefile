
node_modules/@financial-times/n-gage/index.mk:
	npm install --no-save @financial-times/n-gage
	touch $@

-include node_modules/@financial-times/n-gage/index.mk

build:
	@echo "Building…"
	@rm -rf dist
	@babel src --ignore='**/__test__' --out-dir=dist

unit-test: build
	@echo "Unit Testing…"
	npm run test

test: verify unit-test
