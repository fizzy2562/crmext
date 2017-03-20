function sendMessage(cmd, callback){
    var cb = callback
    if (cb == null){
        cb = console.log;
    };
    chrome.runtime.sendMessage(cmd, cb);
}
function save_options() {
    var options = {};
    captureElementPropertyValue('throttletime', 'value', options);
    captureElementPropertyValue('maxvisits', 'value', options);
    captureElementPropertyValue('warningnotifications', 'checked', options);
    captureElementPropertyValue('actionnotifications', 'checked', options);
    captureElementPropertyValue('infonotifications', 'checked', options);
    captureElementPropertyValue('expand', 'checked', options);
    captureElementPropertyValue('skipnoimage', 'checked', options);
    captureElementPropertyValue('snooze', 'checked', options);
    captureElementPropertyValue('buymail', 'checked', options);
    captureElementPropertyValue('autoendorse', 'checked', options);
    captureElementPropertyValue('autoendorsetarget', 'value', options);
    captureElementPropertyValue('csvhint', 'checked', options);
    captureElementPropertyValue('csvencoding', 'value', options);
    captureElementPropertyValue('badgedisplay', 'value', options);
    captureElementPropertyValue('autotagflag', 'checked', options);
    captureElementPropertyValue('autotagvalue', 'value', options);
    captureElementPropertyValue('skipdays', 'value', options);
    captureElementPropertyValue('pageinitdelay', 'value', options);
    captureElementPropertyValue('waitminutes', 'value', options, parseInt);
    captureElementPropertyValue('waitvisits', 'value', options, parseInt);
    captureElementPropertyValue('maxpageloadtime', 'value', options);
    captureElementPropertyValue('debugmode', 'checked', options);
    captureElementPropertyValue('debuglog', 'checked', options);
    captureElementPropertyValue('logstack', 'checked', options);
    captureElementPropertyValue('logstackfilter', 'value', options);

    // due to the nested property this isn't handled generically
    if (!!document.getElementById('xlicensekey') && !!document.getElementById('xlicenseproductid')){
        options.affiliatelicense = {
            key       : document.getElementById('xlicensekey').value, 
            productid : document.getElementById('xlicenseproductid').value
        };
    }

    sendMessage({command:"setoptions", options:options});
    successmessage('Options saved.');
}

function restore_options() {
    sendMessage({command:"getOptionscreenValues"}, function(res){
        if (res != null){
            setElementPropertyValue('userid', "innerText", res.userid);
            setElementPropertyValue('clientid', "innerText", res.clientid);
            setElementPropertyValue('throttletime', "value", res.throttletime);
            setElementPropertyValue('maxvisits', "value", res.maxvisits);
            setElementPropertyValue('xlicensekey', "value", res.affiliatelicense.key);
            setElementPropertyValue('xlicenseexpiry', "innerText", res.affiliatelicense.expiry);
            setElementPropertyValue('xlicenseproductid', "value", res.affiliatelicense.productid);
            setElementPropertyValue('warningnotifications', "checked", res.warningnotifications==true);
            setElementPropertyValue('actionnotifications', "checked", res.actionnotifications==true);
            setElementPropertyValue('infonotifications', "checked", res.infonotifications==true);
            setElementPropertyValue('expand', "checked", res.expand==true);
            setElementPropertyValue('skipnoimage', "checked", res.skipnoimage==true);
            setElementPropertyValue('snooze', "checked", res.snooze==true);
            setElementPropertyValue('buymail', "checked", res.buymail==true);
            setElementPropertyValue('autoendorse', "checked", res.autoendorse==true);
            setElementPropertyValue('autoendorsetarget', "value", res.autoendorsetarget);
            setElementPropertyValue('csvhint', "checked", res.csvhint==true);
            setElementPropertyValue('csvencoding', "value", res.csvencoding);
            setElementPropertyValue('badgedisplay', "value", res.badgedisplay);
            setElementPropertyValue('autotagflag', "checked", res.autotagflag==true);
            setElementPropertyValue('autotagvalue', "value", res.autotagvalue);
            setElementPropertyValue('skipdays', "value", res.skipdays);
            setElementPropertyValue('pageinitdelay', "value", res.pageinitdelay);
            setElementPropertyValue('waitminutes', "value", res.waitminutes);
            setElementPropertyValue('waitvisits', "value", res.waitvisits);
            setElementPropertyValue('maxpageloadtime', "value", res.maxpageloadtime);
            setElementPropertyValue('debugmode', "checked", res.debugmode==true);
            setElementPropertyValue('debuglog', "checked", res.debuglog==true);
            setElementPropertyValue('logstack', "checked", res.logstack==true);
            setElementPropertyValue('logstackfilter', "value", res.logstackfilter);

            // due to the nested property this isn't handled generically
            if (!!document.getElementById('xlicensemessage') && res.affiliatelicense.key!= "" && res.affiliatelicense.productid!=""){
                document.getElementById('xlicensemessage').style.color = (res.affiliatelicense.status=="valid"?"green":"red");
                document.getElementById('xlicensemessage').innerText = (res.affiliatelicense.status=="valid"?"License is active.":res.affiliatelicense.message);
            }
           
        }
    });
}
function toggle_maxvisits(){
    var dd = document.getElementById("maxvisits");
    if ( dd.disabled) {
        // enable
        dd.disabled = false;
        dd.style.color = "#000000";
    }else{
        // disable
        dd.disabled = true;
        dd.style.color = "#999999";
    }
}
function successmessage(text){
    toastr["success"](text, "Dux-Soup");
}
function filter_days(){
    var v = parseInt(document.getElementById('skipdays').value);
    if ( v>=0 && v<=31){
        //ok, we can't invert this condition to support NaN values
        document.getElementById('skipdays').value=v;
    }else{
        //reset to 7 if anything is wrong with the input
        document.getElementById('skipdays').value="7";
    }
}
function reload(){
    chrome.runtime.reload();
}
function captureElementPropertyValue(elementid, propertyname, map, preprocessor){
    var element = document.getElementById(elementid);
    if (!!element){
        map[elementid] = element[propertyname];
        if (preprocessor){
            map[elementid] = preprocessor(map[elementid]);
        }
    }
}
function setElementPropertyValue(elementid, propertyname, value){
    var element = document.getElementById(elementid);
    if (!!element){
        element[propertyname] = value;
    }
}
function addChangeListener(elementid, eventtype, listener){
    var element = document.getElementById(elementid);
    if (!!element){
        element.addEventListener(eventtype, listener);
    }
}
document.addEventListener('DOMContentLoaded', restore_options);

addChangeListener('throttletime', 'change', save_options);
addChangeListener('maxvisits', 'change', save_options);
addChangeListener('warning', 'change', toggle_maxvisits);
addChangeListener('xlicensekey', 'change', save_options);
addChangeListener('xlicenseproductid', 'change', save_options);
addChangeListener('actionnotifications', 'change', save_options);
addChangeListener('infonotifications', 'change', save_options);
addChangeListener('warningnotifications', 'change', save_options);
addChangeListener('expand', 'change', save_options);
addChangeListener('skipnoimage', 'change', save_options);
addChangeListener('snooze', 'change', save_options);
addChangeListener('buymail', 'change', save_options);
addChangeListener('autoendorse', 'change', save_options);
addChangeListener('autoendorsetarget', 'change', save_options);
addChangeListener('csvhint', 'change', save_options);
addChangeListener('csvencoding', 'change', save_options);
addChangeListener('badgedisplay', 'change', save_options);
addChangeListener('autotagflag', 'change', save_options);
addChangeListener('autotagvalue', 'change', save_options);
addChangeListener('skipdays', 'change', save_options);
addChangeListener('skipdays', 'input', filter_days);
addChangeListener('reload', 'click', reload);
addChangeListener('pageinitdelay', 'change', save_options);
addChangeListener('waitminutes', 'change', save_options);
addChangeListener('waitvisits', 'change', save_options);
addChangeListener('maxpageloadtime', 'change', save_options);
addChangeListener('debugmode', 'change', save_options);
addChangeListener('debuglog', 'change', save_options);
addChangeListener('logstack', 'change', save_options);
addChangeListener('logstackfilter', 'change', save_options);

toastr.options = {
  "closeButton": false,
  "debug": false,
  "newestOnTop": false,
  "progressBar": false,
  "positionClass": "toast-top-right",
  "preventDuplicates": true,
  "onclick": null,
  "showDuration": "300",
  "hideDuration": "1000",
  "timeOut": "6500",
  "extendedTimeOut": "1000",
  "showEasing": "swing",
  "hideEasing": "linear",
  "showMethod": "fadeIn",
  "hideMethod": "fadeOut"
}

