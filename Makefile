.DEFAULT_GOAL := run

run:
	APP_ID=ubuntu-html5-app-launcher ubuntu-html5-app-launcher ${ARGS} --www=www

.PHONY: run
