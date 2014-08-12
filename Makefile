.DEFAULT_GOAL := run

run:
	ubuntu-html5-app-launcher ${ARGS} --www=www

.PHONY: run
