(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var e,o,n,r,t,s;e=require("jquery"),s=require("../shared/utilities"),t=window.location.href,t=t.replace(".html#",".html?"),o=window.location.hash,r=null!=o?o.replace(/^#/,"?"):void 0,t.match(/\?.*access_token=.+/)?(n=e("#js-success-message"),chrome.extension.sendMessage({route:"POST /sf/register",url:t}),chrome.extension.sendMessage({route:"GET /sf/auth/callback"+r,url:t})):n=e(t.match(/\?.*error=access_denied/)?"#js-denied-message":t.match(/\?.*error=/)?"#js-error-message":"#js-error-message"),n.addClass("show"),e(".js-login-again").on("click",function(){return t=s.getSalesforceRegisterAuthUrl(),window.location.href=t}),e(".js-next").on("click",function(){return e(window).off("beforeunload"),!0}),e(".js-close-window").on("click",function(){return window.close()}),(t.match(/\?.*access_token=.+/)||t.match(/instructions/i))&&e(window).on("beforeunload",function(){chrome.extension.sendMessage({route:"GET /linkedInExample"})}),e(".js-continue").on("click",function(){return t=s.getSalesforceRegisterAuthUrl(),window.location.href=t}),e(".js-privacy").on("click",function(e){return e.preventDefault(),window.open("http://www.exporttocrm.com/privacy.html","Export To CRM - Privacy","width=600,height=400,top=50,left=25")});


},{"../shared/utilities":3,"jquery":"jquery"}],2:[function(require,module,exports){
(function (process){
var E;E={SALESFORCE_LOGIN_URL:"https://login.salesforce.com/",SALESFORCE_CLIENT_ID:"3MVG9xOCXq4ID1uGDD7IoVBu9rPYpdmYwmOPi_LbtNB7G8s7pU62Xpe2VFYlVdUN5PUXItBsgooMCrpq3t0yD",SALESFORCE_REDIRECT_URL:"chrome-extension://"+chrome.runtime.id+"/html/salesforce/callback.html",SALESFORCE_REGISTER_REDIRECT_URL:"chrome-extension://"+chrome.runtime.id+"/html/callback.html",LINKEDIN_API_KEY:"753xgzbrhorbob",LINKEDIN_CLIENT_ID:"d1c6f7c7-cf05-4975-9b0d-5e3ca281e169",LINKEDIN_REDIRECT_URL:"https://"+chrome.runtime.id+".chromiumapp.org/provider_cb",LINKEDIN_REQUEST_INTERVAL:1e3,IDS_PER_QUERY:400,MAX_CONCURRENT_PROFILES:10,PARSE_APP_ID:"JNmdaEr2QzcYAVuVnCHrZWNoA8JZKxVCoh0itawP",PARSE_JS_KEY:"up9YJRHBhLNsy6iOxGYmvRmFjwRNglr8wJw9PvPm",EXTENSION_ENV:process.env.EXTENSION_ENV||"develop",newUi:!1},module.exports=E;


}).call(this,require('_process'))
},{"_process":4}],3:[function(require,module,exports){
var e,r;r=require("./config"),e=function(e,r,t){return console.log(e+"services/oauth2/authorize?display=popup&response_type=token&client_id="+escape(r)+"&redirect_uri="+escape(t)),e+"services/oauth2/authorize?display=popup&response_type=token&client_id="+escape(r)+"&redirect_uri="+escape(t)},exports.getSalesforceAuthUrl=function(){return e(r.SALESFORCE_LOGIN_URL,r.SALESFORCE_CLIENT_ID,r.SALESFORCE_REDIRECT_URL)},exports.getSalesforceRegisterAuthUrl=function(){return e(r.SALESFORCE_LOGIN_URL,r.SALESFORCE_CLIENT_ID,r.SALESFORCE_REGISTER_REDIRECT_URL)};


},{"./config":2}],4:[function(require,module,exports){
function r(){if(!t){t=!0;for(var r,n=o.length;n;){r=o,o=[];for(var e=-1;++e<n;)r[e]();n=o.length}t=!1}}function n(){}var e=module.exports={},o=[],t=!1;e.nextTick=function(n){o.push(n),t||setTimeout(r,0)},e.title="browser",e.browser=!0,e.env={},e.argv=[],e.version="",e.versions={},e.on=n,e.addListener=n,e.once=n,e.off=n,e.removeListener=n,e.removeAllListeners=n,e.emit=n,e.binding=function(r){throw new Error("process.binding is not supported")},e.cwd=function(){return"/"},e.chdir=function(r){throw new Error("process.chdir is not supported")},e.umask=function(){return 0};


},{}]},{},[1]);