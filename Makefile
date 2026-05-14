# Studio Syntax — Craft CMS 5 starter
# Run `make` or `make help` to list available targets.

.DEFAULT_GOAL := help
.PHONY: help install setup start dev prod stop restart \
        composer-install npm-install update up keys \
        clean clean-logs import-db share launch mailpit

# vite-plugin-restart still declares a Vite <=7 peer range, so a clean install
# warns on Vite 8. --legacy-peer-deps keeps installs quiet and deterministic.
NPM_INSTALL_FLAGS ?= --legacy-peer-deps

help: ## List available targets
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) \
		| awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-18s\033[0m %s\n", $$1, $$2}'

install: ## First-time setup of a freshly created project
	ddev start
	@if [ ! -f .env ]; then cp .env.example .env && echo ".env created from .env.example"; fi
	ddev composer install
	ddev npm install $(NPM_INSTALL_FLAGS)
	ddev craft setup/keys
	ddev craft install
	ddev craft up
	ddev launch
	@echo "Install complete."

setup: ## Onboard an existing checkout (deps + migrations + dev server)
	ddev start
	ddev composer install
	ddev npm install $(NPM_INSTALL_FLAGS)
	ddev craft up
	ddev npm run dev

start: ## Start DDEV and the Vite dev server
	ddev start
	ddev npm run dev

dev: ## Run the Vite dev server
	ddev npm run dev

prod: ## Build front-end assets for production
	ddev npm run build

stop: ## Stop the DDEV project
	ddev stop

restart: ## Restart the DDEV project
	ddev restart

composer-install: ## Install PHP dependencies
	ddev composer install

npm-install: ## Install Node dependencies
	ddev npm install $(NPM_INSTALL_FLAGS)

update: ## Update Craft and plugins
	ddev craft update all

up: ## Apply pending migrations and project config
	ddev craft up

keys: ## Generate the application ID and security key
	ddev craft setup/keys

clean: ## Remove vendor/ and node_modules/ and reinstall
	rm -rf vendor node_modules
	ddev composer clear-cache
	ddev composer install
	ddev npm install $(NPM_INSTALL_FLAGS)

clean-logs: ## Delete Craft log files
	rm -rf storage/logs/*.log

import-db: ## Import a database dump — make import-db file=path/to/dump.sql.gz
ifndef file
	$(error file is not set. Usage: make import-db file=path/to/dump.sql.gz)
endif
	ddev import-db --file=$(file)

share: ## Expose the local site via a temporary public URL
	ddev share

launch: ## Open the site in a browser
	ddev launch

mailpit: ## Open Mailpit to inspect outgoing email
	ddev mailpit
