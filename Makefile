.DEFAULT_GOAL := run

run:
	APP_ID=ubuntu-html5-app-launcher ubuntu-html5-app-launcher ${ARGS} --www=www

dev: ARGS = --inspector
dev: run

.PHONY: run dev
