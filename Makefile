VERSION := $(shell python3 -c 'import json; print(json.load(open("manifest.json"))["version"])')
.DEFAULT_GOAL := run

run:
	APP_ID=ubuntu-html5-app-launcher ubuntu-html5-app-launcher ${ARGS} --www=www

dev: ARGS = --inspector
dev: run

tar:
	tar czf ../shortee-${VERSION}.tar.gz .

.PHONY: run dev tar
