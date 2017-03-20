var FORM_INPUT_SELECT = '#ep input';

var FORM_LABEL_SELECT = function(id) {
	return '#ep label[for="' + id + '"]';
}


// Add the linkedin url to an element.
function addLinkedInUrl(el) {
	var parsedUrl = nodeUrl.parse(window.location.href, true);
	var linkedinUrl = parsedUrl.query.linkedinUrl;
	if (linkedinUrl != null && linkedinUrl.length > 0) {
		$(el).val(linkedinUrl);
		if ($(el).length > 0) {
			// jQuery trigger() can't traverse the sandboxing going on (I think); use plain browser events
			$(el)[0].dispatchEvent(new Event('input'));
		}
	}
}

// We only want to fill in one field with the linkedin url.
var addedLinkedInUrl = false;

// first check for label that matches 'linkedin url'
_.each($(FORM_INPUT_SELECT), function(el) {
	var id = el.id;
	var labelText = $(FORM_LABEL_SELECT(id)).text();

	if (addedLinkedInUrl === false && labelText.match(/linkedin\s+url/i)) {
		addedLinkedInUrl = true;
		addLinkedInUrl(el);
	}
});

// Check for label that just matches 'linkedin'
_.each($(FORM_INPUT_SELECT), function(el) {
	var id = el.id;
	var labelText = $(FORM_LABEL_SELECT(id)).text();

	if (addedLinkedInUrl === false && labelText.match(/linkedin/i)) {
		addedLinkedInUrl = true;
		addLinkedInUrl(el);
	}
});
