# Programs
SED ?= sed
SNOWSQL ?= snowsql
GSUTIL ?= gsutil

SF_SHARE_ENABLED ?= 0
POST_INTEGRATION_CLEANUP ?= 1

# Deployment variables
PLACEKEY_SF_LIBRARY ?= ../placekey_library.js

.PHONY: ../placekey_library.js
../placekey_library.js:
	$(MAKE) -C .. all

SQL_FILES =  $(wildcard sql/*.sql)
SHARE_CREATE_FILE = sql/_SHARE_CREATE.sql
SHARE_REMOVE_FILE = sql/_SHARE_REMOVE.sql
SQL_DEPLOYABLE = $(filter-out ${SHARE_CREATE_FILE} ${SHARE_REMOVE_FILE},${SQL_FILES})

.PHONY: check_environment all check clean schema_create schema_remove schema_deploy share_create share_remove deploy check-integration integration_cleanup
check_environment:
ifndef SF_DATABASEID
	$(error SF_DATABASEID is undefined)
endif
ifndef SF_SCHEMA_PLACEKEY
	$(error SF_SCHEMA_PLACEKEY is undefined)
endif
ifndef SF_SCHEMA_H3
	$(error SF_SCHEMA_H3 is undefined)
endif

all check:

clean:
	$(MAKE) -C test/ $@

##################### SNOWFLAKE SCHEMA #####################

schema_create: check_environment
	$(SNOWSQL) -q "CREATE SCHEMA IF NOT EXISTS $(SF_DATABASEID).$(SF_SCHEMA_PLACEKEY)"

schema_remove: check_environment
	$(SNOWSQL) -q "DROP SCHEMA IF EXISTS $(SF_DATABASEID).$(SF_SCHEMA_PLACEKEY) CASCADE"

REPLACEMENTS = 	-e 's!@@SF_DATABASEID@@!$(SF_DATABASEID)!g' \
		-e 's!@@SF_SCHEMA_PLACEKEY@@!$(SF_SCHEMA_PLACEKEY)!g' \
		-e 's!@@SF_SCHEMA_H3@@!$(SF_SCHEMA_H3)!g' \
		-e 's!@@SF_SHARE_PUBLIC@@!$(SF_SHARE_PUBLIC)!g' \
		-e '/@@LIBRARY_FILE_CONTENT@@/ r $(PLACEKEY_SF_LIBRARY)' \
		-e 's!@@LIBRARY_FILE_CONTENT@@!!g'

schema_deploy: check_environment
	for n in $(sort $(SQL_DEPLOYABLE)); do \
		$(SED) $(REPLACEMENTS) $$n | $(SNOWSQL) -q "$(xargs)" || exit; \
	done

share_create: check_environment
ifeq ($(SF_SHARE_ENABLED),1)
	$(SED) $(REPLACEMENTS) $(SHARE_CREATE_FILE) | $(SNOWSQL) -q "$(xargs)" 
endif

share_remove: check_environment
ifeq ($(SF_SHARE_ENABLED),1)
	$(SED) $(REPLACEMENTS) $(SHARE_REMOVE_FILE) | $(SNOWSQL) -q "$(xargs)" 
endif

##################### DEPLOY #####################
SF_H3_PATH = ../../h3/sf
deploy: check_environment
	$(MAKE) -C $(SF_H3_PATH) $@
	$(MAKE) schema_create
	$(MAKE) schema_deploy
	$(MAKE) share_create

##################### INTEGRATION TESTS #####################
check-integration: check_environment
	$(MAKE) deploy
	$(MAKE) -C test/ $@ || ($(MAKE) integration_cleanup && exit 1)
	$(MAKE) integration_cleanup

# Note, on failure we add a explicit sleep to wait until all resources are unused before retrying
integration_cleanup: check_environment
ifeq ($(POST_INTEGRATION_CLEANUP),1)
	$(MAKE) share_remove
	$(MAKE) schema_remove || ((sleep 5 && $(MAKE) schema_remove) || exit 1)
	$(MAKE) -C $(SF_H3_PATH) $@
endif
