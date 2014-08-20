VERSION := $(shell python3 -c 'import json; print(json.load(open("manifest.json"))["version"])')
.DEFAULT_GOAL := help

run:
	APP_ID=ubuntu-html5-app-launcher ubuntu-html5-app-launcher ${ARGS} --www=www

dev: ARGS = --inspector
dev: run

tar:
	tar czf ../shortee-${VERSION}.tar.gz .

help:
	@$(MAKE) -pn --question no-such-target 2>/dev/null | \
		awk -F':' '/^[a-zA-Z0-9][^$$#\/\t=]*:([^=]|$$)/ \
		{split($$1,A,/ /);for(i in A)print A[i]}' | \
			tail -n+3

.PHONY: run dev tar
