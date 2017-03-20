// action functions
function searchLinkedIn(){
    chrome.tabs.create({
        'url': 'https://www.linkedin.com/vsearch/p'
    }, function(tab) {

    });
    logUserAction("Open LinkedIn People Search");
}
function searchGroups(){
    chrome.tabs.create({
        'url': 'https://www.linkedin.com/groups/my-groups'
    }, function(tab) {

    });
    logUserAction("Open LinkedIn Group Search");
}
function searchConnections(){
    chrome.tabs.create({
        'url': 'https://www.linkedin.com/contacts/'
    }, function(tab) {

    });
    logUserAction("Open LinkedIn Connections Search");
}
function searchSalesNav(){
    chrome.tabs.create({
        'url': 'https://www.linkedin.com/sales/search'
    }, function(tab) {

    });
    logUserAction("Open LinkedIn SalesNav Search");
}
function searchRecruiter(){
    chrome.tabs.create({
        'url': 'https://www.linkedin.com/recruiter/smartsearch'
    }, function(tab) {

    });
    logUserAction("Open LinkedIn SalesNav Search");
}

function searchGooglePro(){
    chrome.tabs.create({
        'url': 'customsearch_pro.html'
    }, function(tab) {

    });
    logUserAction("Open XRay Search Pro");
}
function searchGoogleFree(){
    chrome.tabs.create({
        'url': 'customsearch_free.html'
    }, function(tab) {

    });
    logUserAction("Open XRay Search Free");
}
function doGoogleSearch(){
    var titlequery = '"'+document.getElementById("titlequery").value+'"';
    var locationquery = '"'+document.getElementById("locationquery").value+'"';
    document.location.href="http://www.google.com/search?q=+"+titlequery+"+"+locationquery+"-intitle:\"profiles\" -inurl:\"dir/+\"+site:linkedin.com/in/+OR+site:linkedin.com/pub/";
    logUserAction("Execute XRay Search");
}
function typeOrSearch(event){
    if (event.keyCode == 13) {
        doGoogleSearch();
    }
}
function goPro(){
    chrome.tabs.create({
        'url': 'https://chrome.google.com/webstore/detail/dux-soup-starter-edition/'+chrome.runtime.id
    }, function(tab) {
    });
    logUserAction("Go Pro");
}
function showAbout(){
    chrome.tabs.create({
        'url': 'chrome-extension://'+chrome.runtime.id+'/postinstall.html'
    }, function(tab) {
    });
    logUserAction("Show About");
}
function showOptions(){
    chrome.tabs.create({
        'url': 'chrome-extension://'+chrome.runtime.id+'/options.html'
    }, function(tab) {
    });
    logUserAction("Show Options");
}
function checkChrome(){
    chrome.tabs.create({
        'url': 'chrome://chrome'
    }, function(tab) {
    });
}
function review(){
    chrome.tabs.create({
        'url': 'https://chrome.google.com/webstore/detail/dux-soup-starter-edition/'+chrome.runtime.id+'/reviews'
    }, function(tab) {
    });
    logUserAction("Open Chrome Webstore Reviews");
}
function reload(){
    logUserAction("Reload extension");
    chrome.runtime.reload();
}
function logUserAction(action){
    // logging in try/catch to avoid problems.
    try{
        sendMessage({command: "logUserAction", action: action});
    }catch(e){
        console.log(e);
   }
}
// event adapters
/**
 * Start the data collection by sending the collection command to the active content script
 * @param event : the event that triggered the collection
 */
function startDataCollection(event){
    console.log("starting");
    sendMessage({command: "start", target: tabs[0], mode: event.srcElement.id});
    logUserAction("Start Visiting");
    window.close();
}

function stopDataCollection(event){
    console.log("stopping");
    sendMessage({command: "stop", target: tabs[0]});
    logUserAction("Stop Visiting");
    window.close();
}
function clearData(event){
    console.log("clearing data");
    sendMessage({command: "reset" });
    logUserAction("Clear Data");
    window.close();
}
function downloadData(event){
    console.log("stopping");
    sendMessage({command: "download" });
    logUserAction("Download Data");
    window.close();
}
function uploadCSV(event){
    console.log("stopping");
    sendMessage({command: "upload" });
    logUserAction("Upload Data");
    window.close();
}
function tagSearch(event){
    console.log("stopping");
    sendMessage({command: "tagsearch" });
    logUserAction("Search by Tag");
    window.close();
}
