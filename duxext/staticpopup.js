/**
 * javascript file used only by the popup html page for the DuxSoup plugin.
 */

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
setElementProperty("recruiter", "onclick", searchRecruiter);
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
setElementProperty("check", "onclick", checkChrome);
prependElementProperty("version", "innerText", "v"+chrome.runtime.getManifest().version);
