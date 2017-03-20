////////////////////////////////////////////////////////////////////////////////
// Google Analytics
(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

ga('create', 'UA-47987713-3', 'auto');
ga('set', 'checkProtocolTask', function(){});
ga('require', 'displayfeatures');

function setAnalyticsUserId(userId) {
	console.log("Analytics userid", userId);
	ga('set', '&uid', userId);
	ga('set', 'dimension1', userId);
}
function sendAnalyticsEvent(category, action, label, value) {
	console.log("Analytics event", category, action, label, value);
	ga('send', 'event', category, action, label, value);
}
////////////////////////////////////////////////////////////////////////////////

var PARSE_APP_ID = 'JNmdaEr2QzcYAVuVnCHrZWNoA8JZKxVCoh0itawP';
var PARSE_JS_KEY = 'up9YJRHBhLNsy6iOxGYmvRmFjwRNglr8wJw9PvPm';
Parse.initialize(PARSE_APP_ID, PARSE_JS_KEY);

var activationPromise;

// Listen to extension installation
chrome.runtime.onInstalled.addListener(function(details){
	if(details.reason == "install"){
		handleInstall();
	}else if(details.reason == "update"){
		handleUpdate(details);
		
	}
});

function handleInstall() {
	console.log("This is a first install!");
	activationProcess();
}
function handleUpdate(details) {
	var thisVersion = chrome.runtime.getManifest().version;
	console.log("Updated from " + details.previousVersion + " to " + thisVersion + "!");

	extensionIsActivated(function(err, active) {
		if (!active) {
			activationProcess();
		}
	});
}

function activationProcess(cb) {
	activationPromise = $.Deferred();
	var windowUrl = "chrome-extension://" + chrome.runtime.id + "/html/login.html";
	var windowName = 'Export To CRM - First Time Login';
	var windowFeatures = "toolbar=yes,location=yes,scrollbars=no,resizable=no,centerscreen=yes,width=675,height=524";
	window.open(windowUrl, windowName, windowFeatures);

	activationPromise.then(function() {
		if(cb != null) {
			cb();
		}
	});
}

/*
	Activate the extension forever.
*/
function activateExtension(info, cb) {
	console.log("Activate extension");
	var UserInfo = Parse.Object.extend("UserInfo");
	var UserRecord = Parse.Object.extend("UserRecord");

	var userRecord = new UserRecord();
	userRecord.set('userId', info.userId);
	var userInfo = new UserInfo();
	userInfo.set('userId', info.userId);
	userInfo.set('email', info.email);
	userInfo.set('firstName', info.firstName);
	userInfo.set('lastName', info.lastName);

	Parse.Object.saveAll([userRecord, userInfo], {
		success: function() {
			if (activationPromise != null) {
				activationPromise.resolve();
			}
			if(cb != null) {
				cb();
			}
		}
	,
		error: function(err) {
			if (activationPromise != null) {
				activationPromise.resolve();
			}
			if(cb != null) {
				cb(err);
			}
		}
	});

	chrome.storage.sync.set({userId: info.userId}, cb);
}
/*
	Check if extension is active.
*/
function extensionIsActivated(cb) {
	console.log("Is extension active?");

	chrome.storage.sync.get('userId', function(items) {
		if (items.userId == null) return cb(null, false);
		console.log("Check for userId", items.userId);
		
		var UserRecord = Parse.Object.extend("UserRecord");
		var query = new Parse.Query(UserRecord);
		query.equalTo("userId", items.userId);
		query.find({
			success: function(results) {
				console.log("Found", results.length, "matching records");
				if (results.length > 0) {
					cb(null, true);
				} else {
					cb(null, false);
				}
			}
		,
			error: function(err) {
				console.log("Error querying records");
				cb(err);
			}
		});
	});
}

// Set up message routing
var routes = {};
chrome.extension.onMessage.addListener(messageHandler);
function messageHandler(req, sender, res) {
	if(routes[req.route]) {
		console.log("Route:", req.route);
		return routes[req.route](req, sender, res);
	}
}

// Handle date received from callback page
routes['POST /sf/register'] = function(req, sender, res) {
	// parse the callback url's data
	var url = req.url;
	var parsedUrl = nodeUrl.parse(url, true);
	var idUrl = parsedUrl.query.id;
	var accessToken = parsedUrl.query.access_token;

	// request the user's information
	var jqxhr = $.get(idUrl, {access_token: accessToken, format: 'json'});
	jqxhr.done(function(response) {
		console.log("Got info", response);
		var userInfo = {
			userId: response.user_id,
			email: response.email,
			firstName: response.first_name,
			lastName: response.last_name
		};
		// activate the extension
		activateExtension(userInfo);
	});
	jqxhr.fail(function() {
		alert( "second success" );
	});

	res();
};

// Handle checking if activated
routes['GET activate'] = function(req, sender, res) {
	activationProcess(function(err) {
		res({err: err});
	});
	return true;
};

// Handle checking if activated
routes['GET isActivated'] = function(req, sender, res) {
	extensionIsActivated(function(err, active) {
		if(err != null) return res({err: err});
		res({ active: active });
	});
	return true;
};

routes['GET recordType'] = function(req, sender, res) {
	console.log("Get record type");
	chrome.storage.sync.get('defaultRecordType', function(items) {
		if ( items.defaultRecordType == undefined || items.defaultRecordType == null ) {
			items.defaultRecordType = 'contact';
		}
		res({ recordType: items.defaultRecordType });
	});
	return true;
};
routes['POST recordType'] = function(req, sender, res) {
	console.log("Set record type");
	chrome.storage.sync.set({ defaultRecordType: req.recordType }, function() {
		res();
	});
	return true;
};



routes['EVENT exportClicked'] = function(req, sender, res) {
	console.log("Export clicked");
	var linkedinUrl = req.linkedinUrl;

	chrome.storage.sync.get(['userId', 'defaultRecordType'], function(items) {
		var userId = items.userId;
		var type = items.defaultRecordType || 'contact';

		setAnalyticsUserId(userId);
		sendAnalyticsEvent('linkedin', 'clicked', 'export - url - ' + linkedinUrl + ' - type - ' + type + ' - userId - ' + userId);

		res();
	});
	return true;
};


routes['EVENT exportContactClicked'] = function(req, sender, res) {
	console.log("Contact export clicked");
	var linkedinUrl = req.linkedinUrl;

	chrome.storage.sync.get('userId', function(items) {
		var userId = items.userId;

		setAnalyticsUserId(userId);
		sendAnalyticsEvent('linkedin', 'clicked', 'export contact - url - ' + linkedinUrl + ' - userId - ' + userId);

		res();
	});
	return true;
};

routes['EVENT exportLeadClicked'] = function(req, sender, res) {
	console.log("Lead export clicked");
	var linkedinUrl = req.linkedinUrl;

	chrome.storage.sync.get('userId', function(items) {
		var userId = items.userId;

		setAnalyticsUserId(userId);
		sendAnalyticsEvent('linkedin', 'clicked', 'export lead - url - ' + linkedinUrl + ' - userId - ' + userId);

		res();
	});
	return true;
};

routes['EVENT exportOptionsOpened'] = function(req, sender, res) {
	console.log("Export options opened");
	var linkedinUrl = req.linkedinUrl;

	chrome.storage.sync.get('userId', function(items) {
		var userId = items.userId;

		setAnalyticsUserId(userId);
		sendAnalyticsEvent('linkedin', 'opened', 'export options - url - ' + linkedinUrl + ' - userId - ' + userId);

		res();
	});
	return true;
};

routes['EVENT accountExportClicked'] = function(req, sender, res) {
	console.log("Account export clicked");
	var linkedinUrl = req.linkedinUrl;

	chrome.storage.sync.get('userId', function(items) {
		var userId = items.userId;

		setAnalyticsUserId(userId);
		sendAnalyticsEvent('linkedin', 'clicked', 'export account - url - ' + linkedinUrl + ' - userId - ' + userId);

		res();
	});
	return true;
};