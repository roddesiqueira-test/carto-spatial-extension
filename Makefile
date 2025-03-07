MODULES = \
	h3 \
	placekey \
	quadkey \
  	s2 \
	skel \
	transformation

.PHONY: all build check check-integration check-linter clean deploy linter

all build check check-integration check-linter clean deploy linter:
	for module in $(MODULES); do \
		$(MAKE) -C $${module} $@ || exit 1; \
	done;
