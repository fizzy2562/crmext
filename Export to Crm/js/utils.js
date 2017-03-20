var LOGIN_URL = 'https://login.salesforce.com/';
var CLIENT_ID = '3MVG9xOCXq4ID1uGDD7IoVBu9rPYpdmYwmOPi_LbtNB7G8s7pU62Xpe2VFYlVdUN5PUXItBsgooMCrpq3t0yD';
var REDIRECT_URL = "chrome-extension://" + chrome.runtime.id + "/html/callback.html";

/*
	Build the salesforce authententication url.
 */
function buildAuthorizeUrl(loginUrl, clientId, redirectUri) {
	console.log(loginUrl + "services/oauth2/authorize?display=popup&response_type=token&client_id=" + escape(clientId) + "&redirect_uri=" + escape(redirectUri));
	return loginUrl + "services/oauth2/authorize?display=popup&response_type=token&client_id=" + escape(clientId) + "&redirect_uri=" + escape(redirectUri);
};