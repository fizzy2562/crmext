/**
 * javascript file used only by the popup html page for the DuxSoup plugin.
 */
// initialize the "record cound" field in the popup according to the active value
var tabs=[];
chrome.tabs.getSelected(null, function(tab) {
    tabs=[tab];
});
var attempts = 3;
function updateGUIState(){
    sendMessage({command:"guistate"}, function(result){
        // result can be null when initialisation is ongoing, or has failed.
        if (result!=null){
            setElementProperty("basic", "disabled", !result.startbasic);
            setElementProperty("advanced", "disabled", !result.startadvanced);
            setElementProperty("stop", "disabled", !result.stop);
            setElementProperty("download", "disabled", !result.download);
            setElementProperty("reset", "disabled", !result.reset);
            setElementProperty("download", "disabled", !result.download);
            setElementProperty("upload", "disabled", !result.upload);
            setElementProperty("tagsearch", "disabled", false);
            setElementProperty("reset", "disabled", !result.reset);
            setElementProperty("todayrecords", "textContent", result.counttoday.toString()+(result.counttoday==1?" visit today":" visits today"));            
            if (result.snoozetime){
                setElementProperty("recentrecords", "textContent", "Snoozing for "+result.snoozetime.hours+"h"+(result.snoozetime.minutes<10?"0":"")+result.snoozetime.minutes);
            }else{
                setElementProperty("recentrecords", "textContent", result.countrecent.toString()+(result.countrecent==1?" captured profile":" captured profiles"));
            }
        }else{
            // try again in a second. Avoid the user having to 'click to refresh'
            setElementProperty("recentrecords", "textContent", "Loading"+"...".substring(0,(attempts++)%3));
            setTimeout(updateGUIState, 1000);
        }
    });
}

// initialize the event handlers
setElementProperty("basic", "onclick", startDataCollection);
setElementProperty("advanced", "onclick", startDataCollection);
setElementProperty("stop", "onclick", stopDataCollection);
setElementProperty("download", "onclick", downloadData);
setElementProperty("reset", "onclick", clearData);
setElementProperty("linkedin", "onclick", searchLinkedIn);
setElementProperty("groups", "onclick", searchGroups);
setElementProperty("connections", "onclick", searchConnections);
setElementProperty("salesnav", "onclick", searchSalesNav);
setElementProperty("googlefree", "onclick", searchGoogleFree);
setElementProperty("googlepro", "onclick", searchGooglePro);
setElementProperty("titlequery", "onkeydown", typeOrSearch);
setElementProperty("locationquery", "onkeydown", typeOrSearch);
setElementProperty("search", "onclick", doGoogleSearch);
setElementProperty("buy", "onclick", goPro);
setElementProperty("about", "onclick", showAbout);
setElementProperty("options", "onclick", showOptions);
setElementProperty("review", "onclick", review);
setElementProperty("reload", "onclick", reload);
setElementProperty("version", "innerText", "v"+chrome.runtime.getManifest().version);
setElementProperty("upload", "onclick", uploadCSV);
setElementProperty("tagsearch", "onclick", tagSearch);


// query the plugin for the view-state
updateGUIState();
