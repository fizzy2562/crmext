/**
 * Sends a message to the content script of the active tab as specified in #chrome.tabs.sendMessage
 * If a result is returned this is logged into the console
*/
function sendMessage(cmd, callback){
    var cb = callback
    if (cb == null){
        cb = console.log;
    };
    chrome.runtime.sendMessage(cmd, cb);
}
function setElementProperty(elementid, property, value){
    var elements =  document.querySelectorAll('#'+elementid);
    for (var idx=0;idx<elements.length;idx++){
        if (property!=null){
            try{
                elements[idx][property]=value;
            }catch(e){
                //alert("failed to set property on ("+elementid+"."+property+":"+e);
            };
        }
    }
}
function prependElementProperty(elementid, property, value){
    var elements =  document.querySelectorAll('#'+elementid);
    for (var idx=0;idx<elements.length;idx++){
        if (property!=null){
            try{
                elements[idx][property]=value + elements[idx][property];
            }catch(e){
                //alert("failed to set property on ("+elementid+"."+property+":"+e);
            };
        }
    }
}
