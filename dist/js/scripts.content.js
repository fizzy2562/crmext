'use strict';
function UserRoleClass(roleNames) {
    this.roleNames = roleNames;
}
UserRoleClass.prototype.isFreeSourceHubUser = function () {
    if (!this.roleNames || this.roleNames.length === 0) {
        return true;
    }
    return this.roleNames.indexOf('SourceHub') >= 0 || this.roleNames.indexOf('trial') >= 0;
};
UserRoleClass.prototype.canGiveThumbsUp = function () {
    return true;
};
UserRoleClass.prototype.hasUserRole = function () {
    return this.roleNames.indexOf('user') >= 0;
};
"use strict";
I18n.loadData();
"use strict";
function strip_tags(input) {
    if (input) {
        return input.replace(/<[^>]*>/g, "");
    }
    return input;
}
function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + "; " + expires;
}
function getCookieValue(cname) {
    var name = cname + '=';
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return '';
}
function deleteCookie(name) {
    setCookie(name, "", -1);
};
'use strict';
function LinkedInUrlFixerClass(url) {
    this.url = url;
    this.facetGRegExp = /&(f_G|facet.G)=([a-z]+)%3A\++(\d+)/;
}
LinkedInUrlFixerClass.prototype.fixLocations = function () {
    var result = this.url;
    while (result.match(this.facetGRegExp)) {
        result = this.removeSpaceFromFacetParameter(result);
    }
    return result;
};
LinkedInUrlFixerClass.prototype.removeSpaceFromFacetParameter = function (url) {
    var matchArray = url.match(this.facetGRegExp);
    if (!matchArray) {
        return url;
    }
    var index = 1;
    var parameterName = matchArray[index++];
    var countryCode = matchArray[index++];
    var cityCode = matchArray[index++];
    var fixedString = '&' + parameterName + '=' + countryCode + '%3A' + cityCode;
    return url.replace(this.facetGRegExp, fixedString);
};
'use strict';
function LinkedInStringClass(string) {
    this.string = string;
}
LinkedInStringClass.prototype.splitByQuotes = function () {
    var quoteSignPattern = /['"]/;
    if (this.string.search(quoteSignPattern) < 0) {
        return [this.string];
    }
    var result = [];
    var stringArray = this.string.split(' ');
    for (var index = 0; index < stringArray.length; index++) {
        var word = stringArray[index];
        if (word.search(quoteSignPattern) === 0) {
            var complexWord = word.slice(1);
            var quoteSign = word.indexOf('"') === 0 ? '"' : '\'';
            if (complexWord.indexOf(quoteSign) === complexWord.length - 1) {
                result.push(complexWord.slice(0, -1));
                continue;
            }
            for (index++; index < stringArray.length; index++) {
                word = stringArray[index];
                complexWord += ' ' + word;
                if (word.indexOf(quoteSign) === word.length - 1) {
                    result.push(complexWord.slice(0, -1));
                    break;
                }
            }
        } else {
            result.push(word);
        }
    }
    return result;
};
"use strict";
function LinkedInDomParserFactoryClass(path) {
  this.path = path;
}
LinkedInDomParserFactoryClass.prototype.createParser = function () {
  return this.path.isRecruiterSearchNewPage() || this.path.isRecruiterProfilePage() ? new NewRecruiterDomParser() : new EmberLinkedInDomParser();
};
"use strict";
function AlgorithmRunner() {
    this.sequenceArray = [];
}
AlgorithmRunner.prototype.register = function (object, method, args) {
    this.sequenceArray.push({
        object: object,
        method: method,
        args: args
    });
};
AlgorithmRunner.prototype.isEmpty = function () {
    return this.sequenceArray.length === 0;
};
AlgorithmRunner.prototype.execute = function () {
    for (var index = 0; index < this.sequenceArray.length; index++) {
        var step = this.sequenceArray[index];
        step.method.call(step.object, step.args[0]);
    }
};
'use strict';
function HarvesterRecruiterWorker() {
  this.connector;
  this.currentUrl = '';
  this.domParser;
  this.lastWorker = {};
}
HarvesterRecruiterWorker.prototype.setConnector = function (commonManager) {
  this.connector = commonManager;
};
HarvesterRecruiterWorker.prototype.setParser = function (parser) {
  this.domParser = parser;
};
HarvesterRecruiterWorker.prototype.intervalWorker = function () {
  if (this.currentUrl === window.location.href || !this.domParser.findContentContainer()) {
    return;
  }
  this.currentUrl = window.location.href;
  if (this.isHarvesterSentAlready()) {
    return;
  }
  var url = this.currentUrl;
  if (this.domParser.isBooleanSearch()) {
    url += '&isBooleanSearch=true';
  }
  this.connector.updateTitle(window.document);
  this.connector.sendHarvesterData(url);
  this.updateLastWorker();
};
HarvesterRecruiterWorker.prototype.isHarvesterSentAlready = function () {
  var queryArray = window.popupManager.getUrlQuery(this.currentUrl);
  var delayTime = new Date().getTime() - this.lastWorker.timestamp;
  return queryArray['searchHistoryId'] === this.lastWorker.searchHistoryId && delayTime < 3000;
};
HarvesterRecruiterWorker.prototype.updateLastWorker = function () {
  var queryArray = window.popupManager.getUrlQuery(this.currentUrl);
  this.lastWorker = {
    timestamp: new Date().getTime(),
    searchHistoryId: queryArray['searchHistoryId']
  };
};
'use strict';
function CommonManagerClass(intervalDelayMilliseconds) {
    this.intervalDelayMilliseconds = intervalDelayMilliseconds;
    this.currentURL = document.URL;
    this.updateTitle(document);
    this.algorithmRunner = new AlgorithmRunner();
}
CommonManagerClass.prototype.updateTitle = function (document) {
    this.currentTitle = this.findTitle(document);
};
CommonManagerClass.prototype.findTitle = function (document) {
    var titleElement = document.querySelector('title');
    return titleElement ? titleElement.textContent : '';
};
CommonManagerClass.prototype.getBackendData = function (requestData, callback) {
    chrome.runtime.sendMessage(requestData, callback);
};
CommonManagerClass.prototype.sendHarvesterRequest = function () {
    var linkedInPath = new LinkedInPath(this.currentURL);
    if (linkedInPath.isLinkedInPage()) {
        var parserFactory = new LinkedInDomParserFactoryClass(linkedInPath);
        var recruiterWorker = new HarvesterRecruiterWorker();
        recruiterWorker.setConnector(this);
        recruiterWorker.setParser(parserFactory.createParser());
        window.setInterval(function () {
            recruiterWorker.intervalWorker();
        }, this.intervalDelayMilliseconds);
    } else {
        this.updateTitle(document);
        this.sendHarvesterData(this.currentURL);
        this.algorithmRunner.register(this, this.updateTitle, [document]);
        this.algorithmRunner.register(this, this.sendHarvesterData, [document.URL]);
    }
};
CommonManagerClass.prototype.sendHarvesterData = function (url) {
    commonManager.getBackendData({
        command: 'send-harvester-request',
        url: url,
        title: this.currentTitle
    });
};
CommonManagerClass.prototype.sendIftttData = function () {
    commonManager.getBackendData({
        command: 'send-ifttt-request',
        url: this.currentURL
    });
};
CommonManagerClass.prototype.sendIftttRequest = function () {
    this.sendIftttData();
    this.algorithmRunner.register(this, this.sendIftttData, []);
};
CommonManagerClass.prototype.setupSpaInterval = function () {
    if (this.algorithmRunner.isEmpty()) {
        return;
    }
    var that = this;
    window.setInterval(function () {
        if (that.currentURL === document.URL) {
            return;
        }
        that.currentURL = document.URL;
        that.algorithmRunner.execute();
    }, this.intervalDelayMilliseconds);
};
'use strict';
function SearchLinkedInStrategyClass(url, storage) {
  this.url = url;
  this.storage = storage;
}
SearchLinkedInStrategyClass.prototype.getSearchId = function () {
  var idRegExp = /[[?&]?stLastSearch=(\w+)/;
  var resultArray = idRegExp.exec(this.url);
  if (resultArray && resultArray.length > 0) {
    return resultArray[1];
  }
  return this.storage.getItem('StAdvancedSearchLinkedInRecruiterSearchId');
};
'use strict';
function SearchRecruiterStrategyClass(storage) {
  this.storage = storage;
};
SearchRecruiterStrategyClass.prototype.getSearchId = function () {
  return this.storage.getItem('StAdvancedSearchLinkedInRecruiterSearchId');
};
"use strict";
function SearchClass(url) {
	var recruiterUrlPattern = /linkedin\.[a-z]{2,3}\/recruiter\/(analytics|search)\?searchHistoryId=\d+/i;
	this.solver = url.match(recruiterUrlPattern) ? new SearchRecruiterStrategyClass(sessionStorage) : new SearchLinkedInStrategyClass(url, sessionStorage);
}
SearchClass.prototype.getSearchId = function () {
	return this.solver.getSearchId();
};
'use strict';
function LinkedInAjaxParser() {
    this.publicProfileDocumentDict = [];
};
LinkedInAjaxParser.prototype = new LinkedInAjaxParser();
LinkedInAjaxParser.prototype.getPublicProfileSkills = function (publicProfileUrl, callback) {
    var that = this;
    publicProfileUrl = this.fixProtocolInUrl(publicProfileUrl, window.location);
    if (this.publicProfileDocumentDict[publicProfileUrl]) {
        if (callback) {
            callback(this.publicProfileDocumentDict[publicProfileUrl]);
        }
    }
    var xhttp = new XMLHttpRequest();
    xhttp.onload = function () {
        var mainSkillsRows = [];
        if (xhttp.responseText) {
            var doc = document.implementation.createHTMLDocument("publicProfile");
            doc.documentElement.innerHTML = xhttp.responseText;
            mainSkillsRows = doc.querySelectorAll('#profile-skills .endorse-item-name-text');
            that.publicProfileDocumentDict[publicProfileUrl] = doc;
        } else {
            mainSkillsRows = document.querySelectorAll('#profile-skills .skill');
        }
        if (callback) {
            callback(mainSkillsRows);
        }
    };
    xhttp.open('GET', publicProfileUrl, true);
    xhttp.send(null);
};
LinkedInAjaxParser.prototype.fixProtocolInUrl = function (url, location) {
    var urlProtocol = url.split('://')[0] + ':';
    if (urlProtocol === location.protocol) {
        return url;
    }
    urlProtocol += '//';
    return url.replace(urlProtocol, location.protocol + '//');
};
'use strict';
function LinkedInNotifierActionOnPopupClass() {
    'use strict';
}
LinkedInNotifierActionOnPopupClass.prototype.setPopupManager = function () {
    console.assert(popupManager instanceof PopupManagerClass);
    this.popupManager = popupManager;
};
LinkedInNotifierActionOnPopupClass.prototype.sendNotification = function (actionData) {
    'use strict';
    var manifest = chrome.runtime.getManifest();
    actionData.command = 'action-on-popup';
    actionData.version = manifest.version;
    actionData.noFeedback = true;
    switch (actionData.action) {
        case 'FindSimilarProfilesButtonClick':
        case 'SocialButtonClick':
        case 'SearchOnLinkedInButtonClick':
            this.popupManager.queuePortalLinkClick(actionData);
            break;
        default:
            this.popupManager.getBackendData(actionData);
            break;
    }
};
'use strict';
function LinkedInNotifierActionDecoratorClass(action) {
    'use strict';
}
LinkedInNotifierActionDecoratorClass.prototype = new LinkedInNotifierActionOnPopupClass();
LinkedInNotifierActionDecoratorClass.prototype.decorate = function (action) {
    this.decoratedAction = action;
    return this;
};
LinkedInNotifierActionDecoratorClass.prototype.sendNotification = function (actionData) {
    this.decoratedAction.sendNotification(actionData);
};
'use strict';
function LinkedInNotifierActionPopupMinimizedDecoratorClass() {
    'use strict';
}
LinkedInNotifierActionPopupMinimizedDecoratorClass.prototype = new LinkedInNotifierActionDecoratorClass();
LinkedInNotifierActionPopupMinimizedDecoratorClass.prototype.sendNotification = function (actionData) {
    'use strict';
    actionData.popup = 'Minimized';
    this.decoratedAction.sendNotification(actionData);
};
'use strict';
function LinkedInNotifierActionPopupPeopleLikeThisDecoratorClass() {
    'use strict';
}
LinkedInNotifierActionPopupPeopleLikeThisDecoratorClass.prototype = new LinkedInNotifierActionDecoratorClass();
LinkedInNotifierActionPopupPeopleLikeThisDecoratorClass.prototype.sendNotification = function (actionData) {
    'use strict';
    actionData.popup = 'PeopleLikeThis';
    this.decoratedAction.sendNotification(actionData);
};
'use strict';
function LinkedInNotifierActionPopupVSearchBaseDecoratorClass() {
    'use strict';
}
LinkedInNotifierActionPopupVSearchBaseDecoratorClass.prototype = new LinkedInNotifierActionDecoratorClass();
LinkedInNotifierActionPopupVSearchBaseDecoratorClass.prototype.sendNotification = function (actionData) {
    'use strict';
    var search = new SearchClass(this.popupManager.currentURL);
    actionData.searchId = search.getSearchId();
    this.decoratedAction.sendNotification(actionData);
};
'use strict';
function LinkedInNotifierActionPopupVSearchAdvancedDecoratorClass() {
    'use strict';
}
LinkedInNotifierActionPopupVSearchAdvancedDecoratorClass.prototype = new LinkedInNotifierActionDecoratorClass();
LinkedInNotifierActionPopupVSearchAdvancedDecoratorClass.prototype.sendNotification = function (actionData) {
    'use strict';
    actionData.popup = 'LinkedInVSearchAdvanced';
    this.decoratedAction.sendNotification(actionData);
};
'use strict';
function LinkedInNotifierActionPopupVSearchDefaultDecoratorClass() {
    'use strict';
}
LinkedInNotifierActionPopupVSearchDefaultDecoratorClass.prototype = new LinkedInNotifierActionDecoratorClass();
LinkedInNotifierActionPopupVSearchDefaultDecoratorClass.prototype.sendNotification = function (actionData) {
    'use strict';
    actionData.popup = 'LinkedInVSearch';
    this.decoratedAction.sendNotification(actionData);
};
'use strict';
function LinkedInNotifierFactoryClass() {
    'use strict';
}
LinkedInNotifierFactoryClass.prototype.createActionNotifierForPopup = function (popup) {
    'use strict';
    var actionOnPopup = new LinkedInNotifierActionOnPopupClass();
    actionOnPopup.setPopupManager(popup.popupManager);
    switch (popup.constructor.name) {
        case 'PopupMinimizedClass':
            {
                var decorator = new LinkedInNotifierActionPopupMinimizedDecoratorClass();
                return decorator.decorate(actionOnPopup);
            }
            break;
        case 'PopupLinkedInPeopleLikeThisClass':
            {
                var decorator = new LinkedInNotifierActionPopupPeopleLikeThisDecoratorClass();
                return decorator.decorate(actionOnPopup);
            }
            break;
        case 'PopupLinkedInVSearchAdvancedClass':
            {
                var baseDecorator = new LinkedInNotifierActionPopupVSearchBaseDecoratorClass();
                baseDecorator.setPopupManager(popup.popupManager);
                baseDecorator.decorate(actionOnPopup);
                var decorator = new LinkedInNotifierActionPopupVSearchAdvancedDecoratorClass();
                return decorator.decorate(baseDecorator);
            }
            break;
        case 'PopupLinkedInVSearchDefaultClass':
            {
                var baseDecorator = new LinkedInNotifierActionPopupVSearchBaseDecoratorClass();
                baseDecorator.setPopupManager(popup.popupManager);
                baseDecorator.decorate(actionOnPopup);
                var decorator = new LinkedInNotifierActionPopupVSearchDefaultDecoratorClass();
                return decorator.decorate(baseDecorator);
            }
            break;
        default:
            {
                return null;
            }
            break;
    }
};
'use strict';
function LinkedInFormParserImproveSearchClass(recruiterParser, currentPath) {
    this.recruiterParser = recruiterParser;
    this.currentPath = currentPath;
    this.url = baseUrl(currentPath);
    this.useSynonyms = false;
    function baseUrl(path) {
        if (path.isLinkedInPage()) {
            return path.toString();
        }
        return 'https://www.linkedin.com/vsearch/p?orig=TRNV';
    };
}
LinkedInFormParserImproveSearchClass.prototype.isUseSynonymsAllowed = function () {
    return this.useSynonyms;
};
LinkedInFormParserImproveSearchClass.prototype.getUrl = function () {
    return this.url;
};
LinkedInFormParserImproveSearchClass.prototype.parse = function (formElement) {
    var synonymsCheckbox = formElement.querySelector('#st-use-our-synonyms-checkbox');
    this.useSynonyms = synonymsCheckbox && synonymsCheckbox.checked;
    var getParamSeparator = function getParamSeparator(url) {
        if (url.indexOf('?') > 0) {
            return '&';
        }
        return '?';
    };
    var keywordsInput = formElement.querySelector('#st-keywords-input');
    var titleInput = formElement.querySelector('#st-title-input');
    if (titleInput) {
        var inputValue = new LinkedInPopupInputValue(titleInput.value);
        this.url += getParamSeparator(this.url) + 'title=' + encodeURIComponent(inputValue.getSerializableString());
    } else if (this.currentPath.isRecruiterSearchPage()) {
        var jobTitle = this.recruiterParser.findSearchJobTitleRawValue().trim();
        this.url += getParamSeparator(this.url) + 'title=' + encodeURIComponent(jobTitle);
    }
    if (keywordsInput) {
        var inputValue = new LinkedInPopupInputValue(keywordsInput.value);
        var keywordsInputText = inputValue.getSerializableString();
        if (titleInput) {
            keywordsInputText = this.removeJobTitleFromKeywords(titleInput.value, keywordsInputText);
        }
        this.url += getParamSeparator(this.url) + 'keywords=' + encodeURIComponent(keywordsInputText);
    } else if (this.currentPath.isRecruiterSearchPage()) {
        var keywordsInputText = this.recruiterParser.findSearchKeywordsRawValue().trim();
        var keywordsInputTextLength = keywordsInputText.length;
        if (titleInput) {
            keywordsInputText = this.removeJobTitleFromKeywords(titleInput.value, keywordsInputText);
        }
        var keywordsInputString = new LinkedInStringClass(keywordsInputText);
        this.url += getParamSeparator(this.url) + 'keywords=' + encodeURIComponent(keywordsInputString.splitByQuotes().join(','));
        if (keywordsInputTextLength > 0 && keywordsInputText.length === 0) {
            this.url += getParamSeparator(this.url) + 'keywordsWasClearedByExtension=true';
        }
    }
    var locationInput = formElement.querySelector('#st-location-input');
    if (locationInput) {
        var inputValue = new LinkedInPopupInputValue(locationInput.value);
        var locationText = inputValue.getSerializableString();
        this.url += getParamSeparator(this.url) + 'stLocation=' + encodeURIComponent(locationText);
        this.url += getParamSeparator(this.url) + 'stVSearchAdvancedLocation=' + encodeURIComponent(locationText.replace(' or ', ' OR '));
    } else {
        locationInput = formElement.querySelector('input[name="countrySearchData"]');
        if (locationInput) {
            var inputValue = new LinkedInPopupInputValue(locationInput.value);
            this.url += getParamSeparator(this.url) + 'countrySearchData=' + encodeURIComponent(inputValue.getSerializableString());
        }
    }
};
LinkedInFormParserImproveSearchClass.prototype.removeJobTitleFromKeywords = function (jobTitle, keywords) {
    var retval = '';
    if (keywords.indexOf(',') != -1) {
        var jobTitleSplitted = jobTitle.split(',');
        var keywordSplitted = keywords.split(',');
        for (var jobTitleIndex = 0; jobTitleIndex < jobTitleSplitted.length; jobTitleIndex++) {
            var jobTitleSynonym = jobTitleSplitted[jobTitleIndex].trim().toLowerCase();
            for (var keywordIndex = 0; keywordIndex < keywordSplitted.length; keywordIndex++) {
                if (keywordSplitted[keywordIndex].trim().toLowerCase() == jobTitleSynonym) {
                    keywordSplitted.splice(keywordIndex, 1);
                }
            }
        }
        retval = keywordSplitted.join(',');
    }
    else {
            var jobTitleSplitted = jobTitle.split(' ');
            var keywordSplitted = keywords.split(' ');
            for (var i = 0; i < jobTitleSplitted.length; i++) {
                for (var j = 0; j < keywordSplitted.length; j++) {
                    if (keywordSplitted[j].trim().toLowerCase() == jobTitleSplitted[i].trim().toLowerCase()) {
                        keywordSplitted.splice(j, 1);
                    }
                }
            }
            retval = keywordSplitted.join(' ');
        }
    return retval;
};
'use strict';
function WidgetInterface() {}
WidgetInterface.prototype.getOuterHTML = function () {
  console.log('interface call!');
  throw 'Not implemented';
};
WidgetInterface.prototype.setupEventHandlers = function () {
  console.log('interface call!');
  throw 'Not implemented';
};
'use strict';
function PopupHeaderWidget() {
    this.popup;
}
PopupHeaderWidget.prototype = new WidgetInterface();
PopupHeaderWidget.prototype.constructor = PopupHeaderWidget;
PopupHeaderWidget.prototype.setPopup = function (popup) {
    this.popup = popup;
};
PopupHeaderWidget.prototype.getOuterHTML = function () {
    return ['<div class="st-header" style="background-image: url(' + chrome.extension.getURL('images/st-logo.png') + ');">', '<h2>SourceHub</h2>', '<span class="st-brand-separator">' + __('ce-wp-header-by') + '</span>', '<img class="logo-socialtalent" src="' + chrome.extension.getURL('images/socialtalent-logo.png') + '">', '<span id="st-header-hamburger-button" class="st-icon-gear"></span>', '<span id="st-close-popup-button" class="st-close st-icon-close"></span>', '</div>'].join('');
};
PopupHeaderWidget.prototype.setupEventHandlers = function () {
    this.setupCloseButtonEventHandlers();
    this.setupHamburgerButtonEventHandlers();
};
PopupHeaderWidget.prototype.setupCloseButtonEventHandlers = function () {
    var closePopupButton = document.querySelector('#st-close-popup-button');
    if (!closePopupButton) {
        return;
    }
    var popup = this.popup;
    closePopupButton.onclick = function () {
        popup.sendActionOnPopupNotification({
            action: 'ClosePopupButtonClick'
        });
        popup.popupManager.minimizePopup(true);
    };
};
PopupHeaderWidget.prototype.setupHamburgerButtonEventHandlers = function () {
    var hamburgerButton = document.querySelector('#st-header-hamburger-button');
    if (!hamburgerButton) {
        return;
    }
    var findPopupSettingsContainer = function findPopupSettingsContainer() {
        return document.querySelector('.st-settings-box');
    };
    var findPopupContentContainer = function findPopupContentContainer() {
        return document.querySelector('.st-popup-content-box');
    };
    var getSlidDownElement = function getSlidDownElement(elementList) {
        var slidDownArray = elementList.filter(function (element) {
            return element.classList.contains('st-slid-down');
        });
        if (slidDownArray.length > 0) {
            return slidDownArray[0];
        }
        return elementList[0];
    };
    var getSubtractArray = function getSubtractArray(array, element) {
        array.splice(array.indexOf(element), 1);
        return array;
    };
    hamburgerButton.onclick = function () {
        if (this.isSliding === true) {
            return;
        }
        var popupSettingsContainer = findPopupSettingsContainer();
        var popupContentContainer = findPopupContentContainer();
        if (popupSettingsContainer && popupContentContainer) {
            this.classList.toggle('st-icon-gear-active');
            this.isSliding = true;
            var conteinerArray = [popupContentContainer, popupSettingsContainer];
            var toSlideUpElement = getSlidDownElement(conteinerArray);
            var toSlideDownElement = getSubtractArray(conteinerArray, toSlideUpElement)[0];
            var that = this;
            toSlideUpElement.classList.remove('st-slid-down');
            $(toSlideUpElement).slideUp(function () {
                setTimeout(function () {
                    $(toSlideDownElement).slideDown(function () {
                        toSlideDownElement.classList.add('st-slid-down');
                        that.isSliding = false;
                    });
                }, 200);
            });
        }
    };
};
'use strict';
function LinkedInWidgetVideoButtonClass() {
    this.id = 'st-video-button';
    this.userRole;
    this.mentorDomain;
}
LinkedInWidgetVideoButtonClass.prototype = new WidgetInterface();
LinkedInWidgetVideoButtonClass.prototype.constructor = LinkedInWidgetVideoButtonClass;
LinkedInWidgetVideoButtonClass.prototype.setUserRole = function (userRole) {
    this.userRole = userRole;
};
LinkedInWidgetVideoButtonClass.prototype.setBaseUrl = function (mentorDomain) {
    this.mentorDomain = mentorDomain;
};
LinkedInWidgetVideoButtonClass.prototype.getOuterHTML = function () {
    return ['<div class="st-btn-video-box">', '<a class="st-btn-video" id="' + this.id + '">' + __('ce-wp-sh-video-tutorial-link-label') + '<span></span></a>', '</div>'].join('');
};
LinkedInWidgetVideoButtonClass.prototype.setupEventHandlers = function () {
    var button = document.getElementById(this.id);
    if (!button) {
        return;
    }
    var that = this;
    button.onclick = function () {
        window.open(that.getVideoUrl());
    };
};
LinkedInWidgetVideoButtonClass.prototype.getVideoUrl = function () {
    if (this.userRole.isFreeSourceHubUser()) {
        return 'https://www.youtube.com/watch?v=Qn5JHtz78Xg&list=PLHsoz5Di8RNmjENo-C2F6UFM7agGc7Qc4&index=2';
    }
    var courseIdPath = '';
    if (this.mentorDomain.indexOf('local') > 0) {
        courseIdPath = '573084d19f90f43b568b48cc';
    } else if (this.mentorDomain.indexOf('sandbox') > 0) {
        courseIdPath = '573084d19f90f43b568b48cc';
    } else if (this.mentorDomain.indexOf('rc') > 0) {
        courseIdPath = '573084d19f90f43b568b48cc';
    } else {
        courseIdPath = '573084d19f90f43b568b48cc';
    }
    return this.mentorDomain + '/panel/courses/course/' + courseIdPath;
};
'use strict';
function LinkedInWidgetAdvancedSynonymClass(popup) {
    this.popup = popup;
}
LinkedInWidgetAdvancedSynonymClass.prototype.prepareAllSkillButtons = function () {
    var skills = document.getElementsByClassName('st-skill');
    for (var i = 0; i < skills.length; i++) {
        if (skills[i].className.indexOf('st-skill-add') > 0) {
            this.prepareAddSkillButton(skills[i]);
        } else if (skills[i].className.indexOf('st-skill-example') === -1) {
            this.prepareRemoveSkillButton(skills[i]);
        }
    }
};
LinkedInWidgetAdvancedSynonymClass.prototype.prepareAddSkillButton = function (button) {
    var that = this;
    if (button.getElementsByClassName('st-add-skill-text')[0]) {
        button.getElementsByClassName('st-add-skill-text')[0].onclick = function () {
            this.contentEditable = true;
            this.classList.add('active');
            document.execCommand('selectAll', false, null);
            this.focus();
        };
        button.getElementsByClassName('st-add-skill-text')[0].onkeypress = function (event) {
            if (window.strip_tags(this.innerHTML).length > 50) {
                return false;
            }
            if (event.keyCode === 13) {
                if (this.innerHTML === '' || this.innerHTML === that.popup.label.addKeyword || this.innerHTML === that.popup.label.addJobTitle || this.innerHTML === that.popup.label.addLocation) {
                    return false;
                }
                this.blur();
                return false;
            }
        };
        button.getElementsByClassName('st-add-skill-text')[0].onblur = function (event) {
            if (this.innerHTML === '') {
                this.innerHTML = this.dataset.placeholder;
                return;
            }
            that.popup.popupManager.removeClass(this, 'active');
            that.popup.popupManager.removeClass(this, 'st-add-skill-text');
            this.classList.add('st-skill-content');
            this.contentEditable = false;
            this.parentNode.childNodes[1].onclick();
            return;
        };
    }
    if (button.getElementsByClassName('st-skill-add-button').length > 0) {
        button.getElementsByClassName('st-skill-add-button')[0].onclick = function () {
            var parent = this.parentNode;
            var text = parent.getElementsByClassName('st-skill-content')[0] ? parent.getElementsByClassName('st-skill-content')[0].textContent.trim() : '';
            if (parent.getElementsByClassName('st-skill-content').length && text != that.popup.label.addKeyword && text != that.popup.label.addJobTitle && text != that.popup.label.addLocation) {
                var contentElement = parent.querySelector('.st-skill-content');
                var boxLabel = contentElement.closest('.st-form-group').querySelector('label');
                that.popup.unmuteAutomaticPopups();
                var duplicateSkill = that.popup.findSkillContentElement(text, parent.parentNode);
                if (duplicateSkill && duplicateSkill !== contentElement) {
                    duplicateSkill = duplicateSkill.parentNode;
                    duplicateSkill.classList.add('st-skill-duplicate');
                    parent.classList.add('st-skill-duplicate');
                    setTimeout(function () {
                        duplicateSkill.classList.remove('st-skill-duplicate');
                        parent.classList.remove('st-skill-duplicate');
                    }, 500);
                    contentElement.classList.remove('st-skill-content');
                    contentElement.classList.add('st-add-skill-text', 'active');
                    contentElement.click();
                    return;
                } else {
                    var actionData = {
                        action: 'SynonymAdd',
                        elementType: boxLabel.dataset.type,
                        valueAfter: contentElement.textContent
                    };
                    var synonymGroup = contentElement.closest('.st-synonyms');
                    if (synonymGroup) {
                        actionData.elementGroup = synonymGroup.getAttribute('data-keyword'); 
                    }
                    that.popup.sendActionOnPopupNotification(actionData);
                }
                this.className = 'st-skill-remove-button';
                this.innerHTML = 'x';
                parent.classList.remove('st-skill-add');
                var placeholder = parent.getElementsByClassName('st-skill-content')[0].dataset.placeholder;
                var skillsContainer = parent.parentNode;
                skillsContainer.innerHTML += ['<span class="st-skill st-skill-add">', '<span class="st-add-skill-text" data-placeholder="' + placeholder + '">' + placeholder + '</span>', '<span class="st-skill-add-button">+</span>', '</span>'].join('');
                if (skillsContainer.querySelector('.st-skill-add').offsetTop > skillsContainer.querySelector('.st-skill').offsetTop) {
                    that.showCollectionControlButtons(skillsContainer);
                }
                that.prepareAllSkillButtons();
                that.popup.updatePopup();
            } else if (text) 
                {
                    var contentElement = parent.getElementsByClassName('st-skill-content')[0];
                    contentElement.classList.remove('st-skill-content');
                    contentElement.classList.add('st-add-skill-text');
                } else {
                var contentElement = parent.getElementsByClassName('st-add-skill-text')[0];
                if (contentElement && contentElement.classList.contains('active')) {
                    contentElement.classList.remove('active');
                } else {
                    contentElement.click();
                    that.popup.selectAllText(contentElement);
                }
            }
        };
    } else if (button.getElementsByClassName('st-skill-add-link-button').length > 0) {
        button.getElementsByClassName('st-skill-add-link-button')[0].onclick = function () {
            var link = this.closest('.st-skill-add-link').querySelector('a');
            link.click();
        };
    }
};
LinkedInWidgetAdvancedSynonymClass.prototype.prepareRemoveSkillButton = function (button) {
    var that = this;
    button.getElementsByClassName('st-skill-remove-button')[0].onclick = function () {
        var elem = this.parentNode;
        var synonymGroup = elem.parentNode;
        that.popup.unmuteAutomaticPopups();
        var boxLabel = elem.closest('.st-form-group').querySelector('label');
        that.popup.sendActionOnPopupNotification({
            action: 'SynonymRemove',
            elementType: boxLabel.dataset.type,
            elementGroup: synonymGroup.getAttribute('data-keyword'), 
            valueBefore: elem.querySelector('.st-skill-content').textContent
        });
        synonymGroup.removeChild(elem);
        if (synonymGroup.getElementsByClassName('st-skill-content').length === 0 && synonymGroup.parentNode.getElementsByClassName('st-synonyms').length > 1) {
            synonymGroup.parentNode.removeChild(synonymGroup);
        }
        if (synonymGroup.querySelector('.st-skill-add').offsetTop === synonymGroup.querySelector('.st-skill').offsetTop) {
            that.hideCollectionControlButtons(synonymGroup);
        }
        that.popup.updatePopup();
    };
};
LinkedInWidgetAdvancedSynonymClass.prototype.showCollectionControlButtons = function (synonymsElement) {
    var controlElement = this.findCollectionControlButtons(synonymsElement);
    if (!controlElement) {
        return;
    }
    controlElement.classList.remove('st-hidden');
};
LinkedInWidgetAdvancedSynonymClass.prototype.hideCollectionControlButtons = function (synonymsElement) {
    var controlElement = this.findCollectionControlButtons(synonymsElement);
    if (!controlElement) {
        return;
    }
    controlElement.classList.add('st-hidden');
};
LinkedInWidgetAdvancedSynonymClass.prototype.findCollectionControlButtons = function (synonymsElement) {
    var boxElement = synonymsElement.closest('.st-box');
    if (!boxElement) {
        return;
    }
    return boxElement.querySelector('.st-back');
};
'use strict';
function LinkedInWidgetAdvancedResetButtonClass(path) {
    this.id = 'st-advanced-search-reset-button';
    this.path = path;
}
LinkedInWidgetAdvancedResetButtonClass.prototype = new WidgetInterface();
LinkedInWidgetAdvancedResetButtonClass.prototype.constructor = LinkedInWidgetAdvancedResetButtonClass;
LinkedInWidgetAdvancedResetButtonClass.prototype.getOuterHTML = function () {
    var label = __('ce-wp-button-new-search').replace(/ /g, '&nbsp;');
    return '<a class="st-btn-reset" id="' + this.id + '">' + label + '</a>';
};
LinkedInWidgetAdvancedResetButtonClass.prototype.setupEventHandlers = function () {
    var buttonElement = document.querySelector('#' + this.id);
    if (!buttonElement) {
        return;
    }
    var that = this;
    buttonElement.onclick = function () {
        window.location.href = that.getResetSearchUrl();;
    };
};
LinkedInWidgetAdvancedResetButtonClass.prototype.getResetSearchUrl = function () {
    return this.path.isRecruiterSearchPage() ? 'https://www.linkedin.com/cap/dashboard/home?stResetSearch=true' : 'https://www.linkedin.com/vsearch/p?adv=true&trk=advsrch&stResetSearch=true';
};
'use strict';
function StopPopupOptionModel(optionName, endDateTimestamp) {
    this.optionName = optionName;
    if (endDateTimestamp === undefined) {
        endDateTimestamp = this.createEndDateTimestamp(optionName);
    }
    this.setEndTimestamp(endDateTimestamp);
    this.observerList = [];
}
StopPopupOptionModel.prototype.createEndDateTimestamp = function (optionName) {
    var hourMilliSeconds = 3600 * 1000;
    var dayMilliSeconds = 24 * hourMilliSeconds;
    var now = Date.now();
    switch (optionName) {
        case '2h':
            return now + 2 * hourMilliSeconds;
            break;
        case '1day':
            return now + dayMilliSeconds;
            break;
        case '1week':
            return now + 7 * dayMilliSeconds;
            break;
        default:
            return 1;
            break;
    }
};
StopPopupOptionModel.prototype.setOption = function (optionName) {
    this.optionName = optionName;
    this.setEndTimestamp(this.createEndDateTimestamp(optionName));
    this.notifyObservers('updated');
};
StopPopupOptionModel.prototype.setEndTimestamp = function (endTimestamp) {
    this.endDateTimestamp = endTimestamp;
    var timeoutMilliSeconds = endTimestamp - Date.now();
    if (timeoutMilliSeconds < 0) {
        return;
    }
    var that = this;
    if (this.endDateTimeoutId) {
        clearTimeout(this.endDateTimeoutId);
        this.endDateTimeoutId = null;
    }
    this.endDateTimeoutId = setTimeout(function () {
        that.setOption(null);
        that.endDateTimeoutId = null;
    }, timeoutMilliSeconds);
};
StopPopupOptionModel.prototype.setOptionData = function (optionName, endTimestamp) {
    this.optionName = optionName;
    this.setEndTimestamp(endTimestamp);
    this.notifyObservers('updated');
};
StopPopupOptionModel.prototype.getOptionName = function () {
    return this.optionName;
};
StopPopupOptionModel.prototype.getEndDateTimestamp = function () {
    return this.endDateTimestamp;
};
StopPopupOptionModel.prototype.isStopPopupAllowed = function () {
    return Date.now() < this.endDateTimestamp;
};
StopPopupOptionModel.prototype.addObserver = function (observer) {
    this.observerList.push(observer);
};
StopPopupOptionModel.prototype.notifyObservers = function (eventType) {
    if (eventType === 'updated') {
        for (var index = 0; index < this.observerList.length; index++) {
            this.observerList[index].onStopPopupOptionModelUpdated();
        }
    }
};
'use strict';
function OptionPillWidget() {
    this.model = null;
    this.activeClassName = 'st-option-active';
}
OptionPillWidget.prototype = new WidgetInterface();
OptionPillWidget.prototype.constructor = OptionPillWidget;
OptionPillWidget.prototype.getOuterHTML = function () {
    var that = this;
    var getOptionActiveClass = function getOptionActiveClass(dataName) {
        if (dataName !== that.model.getOptionName()) {
            return '';
        }
        return ' ' + that.activeClassName;
    };
    return ['<div class="st-option-pill">', '<span class="st-option st-option-first' + getOptionActiveClass('2h') + '" data-name="2h">' + __('ce-time-n-hours', { ':n': 2 }) + '</span>', '<span class="st-option' + getOptionActiveClass('1day') + '" data-name="1day">' + __('ce-time-1-day') + '</span>', '<span class="st-option st-option-last' + getOptionActiveClass('1week') + '"  data-name="1week">' + __('ce-time-1-week') + '</span>', '</div>'].join('');
};
OptionPillWidget.prototype.setupEventHandlers = function () {
    var that = this;
    var onOptionClick = function onOptionClick() {
        var activeOptionElement = document.querySelector('.st-option-pill .' + that.activeClassName);
        if (activeOptionElement && activeOptionElement !== this) {
            activeOptionElement.classList.remove(that.activeClassName);
        }
        this.classList.toggle(that.activeClassName);
        var optionName = this.classList.contains(that.activeClassName) ? this.dataset.name : null;
        that.model.setOption(optionName);
    };
    var optionNodeList = document.querySelectorAll('.st-option');
    for (var index = 0; index < optionNodeList.length; index++) {
        optionNodeList[index].onclick = onOptionClick;
    }
};
OptionPillWidget.prototype.setModel = function (model) {
    this.model = model;
    this.model.addObserver(this);
    this.updateValue();
};
OptionPillWidget.prototype.updateValue = function () {
    var optionElement = document.querySelector('.st-option[data-name="' + this.model.getOptionName() + '"]');
    var activeOptionNodeList = document.querySelectorAll('.' + this.activeClassName);
    for (var index = 0; index < activeOptionNodeList.length; index++) {
        var activeOptionElement = activeOptionNodeList[index];
        if (activeOptionElement == optionElement) {
            continue;
        }
        activeOptionElement.classList.remove(this.activeClassName);
    }
    if (!optionElement) {
        return;
    }
    optionElement.classList.add('.' + this.activeClassName);
};
OptionPillWidget.prototype.onStopPopupOptionModelUpdated = function () {
    this.updateValue();
};
'use strict';
function PopupSettingsModel(permits) {
    this.permits = permits;
    this.stopPopupModel = createStopPopupOptionModel(permits);
    this.stopPopupModel.addObserver(this);
    this.observerList = [];
    function createStopPopupOptionModel(permits) {
        if (permits === undefined) {
            return new StopPopupOptionModel(null);
        }
        return new StopPopupOptionModel(permits.stopAutoPopupOptionName, permits.stopAutoPopupEndDate);
    }
}
PopupSettingsModel.prototype.setPopupForLinkedInAllowed = function (isAllowed) {
    this.permits.isPopupForLinkedInSearch = isAllowed;
    this.permits.isPopupForAllPages = !isAllowed;
    this.save();
};
PopupSettingsModel.prototype.setPopupForAllPagesAllowed = function (isAllowed) {
    this.permits.isPopupForAllPages = isAllowed;
    this.permits.isPopupForLinkedInSearch = !isAllowed;
    this.save();
};
PopupSettingsModel.prototype.setStopPopOutAllowed = function (isAllowed) {
    if (isAllowed === true) {
        this.stopPopupModel.setOption(null);
        this.setStopPopupPermits(this.stopPopupModel);
        this.save();
    }
};
PopupSettingsModel.prototype.setStopPopupPermits = function (stopPopupModel) {
    this.permits.stopAutoPopupOptionName = stopPopupModel.getOptionName();
    this.permits.stopAutoPopupEndDate = stopPopupModel.getEndDateTimestamp();
};
PopupSettingsModel.prototype.save = function () {
    var that = this;
    chrome.storage.local.set({
        permits: this.permits
    }, function () {
        if (chrome.runtime.lastError) {
            console.log(chrome.runtime.lastError);
        }
        that.notifyObservers('updated');
    });
};
PopupSettingsModel.prototype.reload = function (callback) {
    var that = this;
    chrome.storage.local.get('permits', function (items) {
        that.permits = items.permits;
        that.stopPopupModel.setOptionData(that.permits.stopAutoPopupOptionName, that.permits.stopAutoPopupEndDate);
        callback(that);
    });
};
PopupSettingsModel.prototype.isPopupForLinkedInAllowed = function () {
    return this.permits.isPopupForLinkedInSearch;
};
PopupSettingsModel.prototype.isPopupForAllPagesAllowed = function () {
    return this.permits.isPopupForAllPages;
};
PopupSettingsModel.prototype.isStopPopupAllowed = function () {
    return this.stopPopupModel.isStopPopupAllowed();
};
PopupSettingsModel.prototype.getStopPopupOptionModel = function () {
    return this.stopPopupModel;
};
PopupSettingsModel.prototype.unmuteAutomaticPopups = function () {
    this.stopPopupModel.setOption(null);
};
PopupSettingsModel.prototype.addObserver = function (observer) {
    this.observerList.push(observer);
};
PopupSettingsModel.prototype.notifyObservers = function (eventType) {
    if (eventType === 'updated') {
        for (var index = 0; index < this.observerList.length; index++) {
            this.observerList[index].onModelUpdated();
        }
    }
};
PopupSettingsModel.prototype.onStopPopupOptionModelUpdated = function () {
    this.setStopPopupPermits(this.stopPopupModel);
    this.save();
};
'use strict';
function PopupSettingsWidget(videoButton) {
    this.videoButton = videoButton;
    this.optionPill = new OptionPillWidget();
    this.model;
}
PopupSettingsWidget.prototype = new WidgetInterface();
PopupSettingsWidget.prototype.constructor = PopupSettingsWidget;
PopupSettingsWidget.prototype.setModel = function (model) {
    this.model = model;
    this.model.addObserver(this);
    this.optionPill.setModel(model.getStopPopupOptionModel());
};
PopupSettingsWidget.prototype.getModel = function () {
    return this.model;
};
PopupSettingsWidget.prototype.onModelUpdated = function () {
    var settingsContainerElement = document.querySelector('.st-popup-settings');
    if (settingsContainerElement) {
        this.updateSwitches(settingsContainerElement);
    }
};
PopupSettingsWidget.prototype.updateSwitches = function (settingsContainerElement) {
    var linkedInSwitchElement = settingsContainerElement.querySelector('#st-chrome-extension-settings-linkedin-switch-container .switch');
    if (linkedInSwitchElement) {
        linkedInSwitchElement.className = 'switch ' + this.getSwitchStateClassString(this.model ? this.model.isPopupForLinkedInAllowed() : false);
    }
    var allPagesSwitchElement = settingsContainerElement.querySelector('#st-chrome-extension-settings-all-pages-switch-container .switch');
    if (allPagesSwitchElement) {
        allPagesSwitchElement.className = 'switch ' + this.getSwitchStateClassString(this.model ? this.model.isPopupForAllPagesAllowed() : false);
    }
    this.optionPill.updateValue();
};
PopupSettingsWidget.prototype.getSwitchStateClassString = function (isSwitchEnabled) {
    var suffix = isSwitchEnabled ? 'on' : 'off';
    return 'switch-' + suffix;
};
PopupSettingsWidget.prototype.getOuterHTML = function () {
    return ['<div class="st-popup-settings">', '<h3>' + __('ce-wp-settings-header') + '</h3>', '<p>', __('ce-wp-settings-description'), '</p>', '<div class="st-settings-item" id="st-chrome-extension-settings-linkedin-switch-container" data-name="PopupForLinkedIn">', '<div class="st-setting-description">', '<label for="st-settings-item">' + __('ce-wp-settings-linkedin-pages-label'), '<span class="st-tooltip-question" style="display: inline;" title="' + __('ce-wp-settings-linkedin-pages-tooltip') + '">', '<a class="st-tip"><img src="' + chrome.extension.getURL('images/web-popups/icon-question-black.png') + '"></a>', '</span>', '</label>', '</div>', '<div class="switch ' + this.getSwitchStateClassString(this.model ? this.model.isPopupForLinkedInAllowed() : false) + '">', '<span class="on">' + __('ce-switch-on') + '</span>', '<span class="off">' + __('ce-switch-off') + '</span>', '</div>', '</div>', '<div class="st-settings-item" id="st-chrome-extension-settings-all-pages-switch-container" data-name="PopupForAllPages">', '<div class="st-setting-description">', '<label for="st-settings-item">' + __('ce-wp-settings-all-pages-label'), '<span class="st-tooltip-question" style="display: inline;" title="' + __('ce-wp-settings-all-pages-tooltip') + '">', '<a class="st-tip"><img src="' + chrome.extension.getURL('images/web-popups/icon-question-black.png') + '"></a>', '</span>', '</label>', '</div>', '<div class="switch ' + this.getSwitchStateClassString(this.model ? this.model.isPopupForAllPagesAllowed() : false) + '">', '<span class="on">' + __('ce-switch-on') + '</span>', '<span class="off">' + __('ce-switch-off') + '</span>', '</div>', '</div>', '<div class="st-settings-item" id="st-chrome-extension-settings-auto-pop-outs-switch-container" data-name="StopPopOut">', '<div class="st-setting-description">', '<label for="st-settings-item">' + __('ce-wp-settings-mute-popups-label'), '<span class="st-tooltip-question" style="display: inline;" title="' + __('ce-wp-settings-mute-popups-tooltip') + '">', '<a class="st-tip"><img src="' + chrome.extension.getURL('images/web-popups/icon-question-black.png') + '"></a>', '</span>', '</label>', '</div>', this.optionPill.getOuterHTML(), '</div>', '</div>', '<div class="st-row">', this.videoButton.getOuterHTML(), '</div>'].join('');
};
PopupSettingsWidget.prototype.setupEventHandlers = function () {
    var model = this.model;
    var createSwitchWidgetController = function createSwitchWidgetController(switchContainerElement) {
        var switchElement = findSwitchElement(switchContainerElement);
        return new SwitchWidget($(switchElement), {
            defaultValue: getSwitchDefaultValue(switchElement),
            callback: function callback(data) {
                eval('model.set' + switchContainerElement.dataset.name + 'Allowed(data.isOn)');
            }
        });
    };
    var findSwitchElement = function findSwitchElement(containerElement) {
        return containerElement.querySelector('.switch');
    };
    var getSwitchDefaultValue = function getSwitchDefaultValue(switchElement) {
        if (!switchElement) {
            return false;
        }
        return switchElement.classList.contains('switch-on');
    };
    var settingsItemNodeList = document.querySelectorAll('.st-settings-item');
    for (var index = 0; index < settingsItemNodeList.length; index++) {
        createSwitchWidgetController(settingsItemNodeList[index]);
    }
    this.optionPill.setupEventHandlers();
};
'use strict';
function SwitchWidget(switchElement, options) {
    this.switchElement = switchElement;
    this.options = options;
    this.value = false;
    this.enabled = true;
    this.name = this.switchElement.data('name');
    this.initialize(switchElement, options);
}
SwitchWidget.prototype.initialize = function (switchElement, options) {
    if (this.hasOption('defaultValue')) {
        this.value = options.defaultValue;
    }
    if (this.value) {
        $(this.switchElement).removeClass('switch-off').addClass('switch-on');
    } else {
        $(this.switchElement).removeClass('switch-on').addClass('switch-off');
    }
    var that = this;
    this.switchElement.click(function () {
        if (that.enabled == false) {
            return;
        }
        if (that.value == false) {
            $(this).removeClass('switch-off').addClass('switch-on');
            that.value = true;
        } else {
            $(this).removeClass('switch-on').addClass('switch-off');
            that.value = false;
        }
        var callbackData = {
            name: that.name,
            isOn: that.value,
            isEnabled: that.enabled
        };
        if (typeof options.callback == 'function') {
            options.callback(callbackData);
        }
    });
};
SwitchWidget.prototype.hasOption = function (name) {
    if (typeof this.options[name] !== 'undefined') {
        return true;
    }
    return false;
};
SwitchWidget.prototype.getValue = function () {
    return this.value;
};
SwitchWidget.prototype.enable = function () {
    this.enabled = true;
    this.switchElement.removeClass('disabled');
};
SwitchWidget.prototype.disable = function () {
    this.enabled = false;
    this.switchElement.addClass('disabled');
};
SwitchWidget.prototype.isEnabled = function () {
    return this.enabled;
};
'use strict';
function LinkedInWidgetTeamAwarenessAlertClass(popup) {
    this.popup = popup;
}
LinkedInWidgetTeamAwarenessAlertClass.prototype = new WidgetInterface();
LinkedInWidgetTeamAwarenessAlertClass.prototype.constructor = LinkedInWidgetTeamAwarenessAlertClass;
LinkedInWidgetTeamAwarenessAlertClass.prototype.setVisitorList = function (list) {
    this.visitorList = list;
};
LinkedInWidgetTeamAwarenessAlertClass.prototype.setCandidateFullName = function (fullName) {
    this.candidateFullName = fullName;
};
LinkedInWidgetTeamAwarenessAlertClass.prototype.setMentorUserId = function (userId) {
    this.mentorUserId = userId;
};
LinkedInWidgetTeamAwarenessAlertClass.prototype.getOuterHTML = function () {
    return ['<div id="st-colleague-views-alert" class="st-alert st-hidden">', '<a id="st-colleague-views-details-trigger">' + __(this.getAlertLabelTranslationKey(), { ':candidateFullName': this.candidateFullName }) + '</a>', '</div>'].join('');
};
LinkedInWidgetTeamAwarenessAlertClass.prototype.getAlertLabelTranslationKey = function () {
    if (this.isProfileViewedByUser() && this.isProfileViewedByColleague()) {
        return 'ce-wp-team-awareness-alert-you-and-colleagues';
    } else if (this.isProfileViewedByUser()) {
        return 'ce-wp-team-awareness-alert-you';
    } else {
        return 'ce-wp-team-awareness-alert-colleagues';
    }
};
LinkedInWidgetTeamAwarenessAlertClass.prototype.isProfileViewedByUser = function () {
    for (var index = 0; index < this.visitorList.length; index++) {
        if (this.visitorList[index].user_id === this.mentorUserId) {
            return true;
        }
    }
    return false;
};
LinkedInWidgetTeamAwarenessAlertClass.prototype.isProfileViewedByColleague = function () {
    for (var index = 0; index < this.visitorList.length; index++) {
        if (this.visitorList[index].user_id !== this.mentorUserId) {
            return true;
        }
    }
    return false;
};
LinkedInWidgetTeamAwarenessAlertClass.prototype.setupEventHandlers = function () {
    var popup = this.popup;
    var viewersShowTrigger = document.getElementById('st-colleague-views-alert');
    viewersShowTrigger.onclick = function () {
        popup.sendActionOnPopupNotification({
            action: 'ButtonClick',
            elementType: 'ShowTeamAwareness',
            elementGroup: this.querySelector('a strong').textContent
        });
        document.getElementById('st-settings-container').classList.add('st-hidden');
        document.getElementById('st-socials-container').classList.add('st-hidden');
        document.getElementById('st-people-like-this-title').classList.add('st-hidden');
        document.getElementById('st-colleague-views-alert').classList.add('st-hidden');
        document.getElementById('st-viewers-container').classList.remove('st-hidden');
    };
};
'use strict';
function LinkedInWidgetTeamAwarenessVisitorsClass(popup) {
    this.popup = popup;
}
LinkedInWidgetTeamAwarenessVisitorsClass.prototype = new WidgetInterface();
LinkedInWidgetTeamAwarenessVisitorsClass.prototype.constructor = LinkedInWidgetTeamAwarenessVisitorsClass;
LinkedInWidgetTeamAwarenessVisitorsClass.prototype.setVisitorList = function (list) {
    this.visitorList = list;
};
LinkedInWidgetTeamAwarenessVisitorsClass.prototype.setCandidateFullName = function (fullName) {
    this.candidateFullName = fullName;
};
LinkedInWidgetTeamAwarenessVisitorsClass.prototype.setMentorUserId = function (userId) {
    this.mentorUserId = userId;
};
LinkedInWidgetTeamAwarenessVisitorsClass.prototype.getOuterHTML = function () {
    var result = '';
    if (this.visitorList && this.visitorList.length > 0) {
        result = ['<div class="st-back st-btn">', '<a class="st-colleague-hide-details-trigger">' + __('ce-wp-button-smart-profile') + '</a>', '</div>', '<div class="st-alert">', __('ce-wp-team-awareness-alert'), '</div>', '<div class="st-box st-viewers">', '<table>'];
        for (var index = 0; index < this.visitorList.length; index++) {
            result.push('<tr>');
            result.push(this.visitorTableEntry(this.visitorList[index]));
            result.push('</tr>');
        }
        result.push('</table>');
        result.push('</div>');
        result.push(['<div class="st-back st-btn">', '<a class="st-colleague-hide-details-trigger">' + __('ce-wp-button-smart-profile') + '</a>', '</div>'].join(''));
        result = result.join('');
    }
    return result;
};
LinkedInWidgetTeamAwarenessVisitorsClass.prototype.visitorTableEntry = function (visitor) {
    var mailSubject = __('ce-wp-team-awareness-contact-mail-subject', { ':fullName': this.candidateFullName });
    var mailBody = __('ce-wp-team-awareness-contact-mail-body', {
        ':visitorFirstName': visitor.user_firstname,
        ':candidateFullName': this.candidateFullName,
        ':loggedUserName': this.getLinkedInMemberFullName()
    }).replace(/<br\/?>/gi, '%0A');
    var entry = [];
    if (visitor.user_id === this.mentorUserId) {
        entry = ['<td>', '<span><a class="st-mailto-link-disabled">' + __('ce-wp-team-awareness-you-label') + '</a></span>', '</td>', '<td><span>' + visitor.visited_on + '</span></td>', '<td></td>'];
    } else {
        entry = ['<td>', '<span><a class="st-mailto-link" data-href="mailto:' + visitor.username + '?subject=' + mailSubject + '&body=' + mailBody + '">', visitor.user_firstname + ' ' + visitor.user_surname, '</a></span>', '</td>', '<td><span>' + visitor.visited_on + '</span></td>', '<td>', '<a class="st-btn btn-green btn-small st-mailto-link" data-href="mailto:' + visitor.username + '?subject=' + mailSubject + '&body=' + mailBody + '">', __('ce-wp-team-awareness-contact-button-label'), '</a>', '</td>'];
    }
    return entry.join('');
};
LinkedInWidgetTeamAwarenessVisitorsClass.prototype.getLinkedInMemberFullName = function () {
    var nameElement = document.querySelector('#nav-settings__dropdown img.nav-item__profile-member-photo');
    if (nameElement) {
        return nameElement.alt;
    }
    nameElement = document.querySelector('#nav-tools-user > span') || document.querySelector('#nav-tools-user a');
    if (nameElement && nameElement !== 'Help') {
        return nameElement.textContent;
    }
    return '';
};
LinkedInWidgetTeamAwarenessVisitorsClass.prototype.setupEventHandlers = function () {
    this.setupBackToSmartProfileButtonTriggers();
    this.setupMailToLinkTriggers();
};
LinkedInWidgetTeamAwarenessVisitorsClass.prototype.setupBackToSmartProfileButtonTriggers = function () {
    var popup = this.popup;
    var teamAwarenessTriggerNodeList = document.getElementsByClassName('st-colleague-hide-details-trigger');
    if (teamAwarenessTriggerNodeList.length > 0) {
        var onTeamAwarenessCloseTriggerClick = function onTeamAwarenessCloseTriggerClick() {
            popup.sendActionOnPopupNotification({
                action: 'ButtonClick',
                elementType: 'Back to SmartProfile'
            });
            document.getElementById('st-settings-container').classList.remove('st-hidden');
            document.getElementById('st-socials-container').classList.remove('st-hidden');
            document.getElementById('st-people-like-this-title').classList.remove('st-hidden');
            document.getElementById('st-colleague-views-alert').classList.remove('st-hidden');
            document.getElementById('st-viewers-container').classList.add('st-hidden');
        };
        for (var index = 0; index < teamAwarenessTriggerNodeList.length; index++) {
            teamAwarenessTriggerNodeList[index].onclick = onTeamAwarenessCloseTriggerClick;
        }
    }
};
LinkedInWidgetTeamAwarenessVisitorsClass.prototype.setupMailToLinkTriggers = function () {
    var popup = this.popup;
    var mailToLinkNodeList = document.getElementsByClassName('st-mailto-link');
    if (mailToLinkNodeList.length > 0) {
        var onMailtoLinkClick = function onMailtoLinkClick() {
            popup.sendActionOnPopupNotification({
                action: 'TeamAwarenessMailToButtonClick',
                elementType: this.textContent,
                elementGroup: this.closest('tr').querySelector('.st-mailto-link').textContent
            });
            var mailtoWindow = window.open(this.dataset.href, '_blank');
            if (mailtoWindow) {
                setTimeout(function () {
                    try {
                        var gMailAppName = mailtoWindow.GM_APP_NAME;
                        if (!gMailAppName) {
                            mailtoWindow.close();
                        }
                    } catch (exception) {
                        if (exception.name !== 'SecurityError') {
                            mailtoWindow.close();
                        }
                    }
                }, 3000);
            }
        };
        for (var index = 0; index < mailToLinkNodeList.length; index++) {
            mailToLinkNodeList[index].onclick = onMailtoLinkClick;
        }
    }
};
'use strict';
function LinkedInPopupGeneratorButtonBuffer() {
  this.buttons = [];
}
LinkedInPopupGeneratorButtonBuffer.prototype.addButton = function (outerHtml) {
  this.buttons.push(outerHtml);
};
LinkedInPopupGeneratorButtonBuffer.prototype.count = function () {
  return this.buttons.length;
};
LinkedInPopupGeneratorButtonBuffer.prototype.getOutherHtml = function () {
  return this.buttons.join('');
};
'use strict';
function LinkedInPopupGeneratorElementSocialButtonsClass(idPrefix, popupName, popup) {
    this.idPrefix = idPrefix;
    this.popupName = popupName;
    this.popup = popup;
    this.shakeItElementCount = 0;
    this.optionalSocialNetworks = ['bullhorn'];
    this.isSocialDraggingEnabled = false;
}
LinkedInPopupGeneratorElementSocialButtonsClass.prototype.getSocialButtons = function (buttonsOrder, allowedOptionalSocialNetworks) {
    var portalDescriptionDictionary = {
        linkedinx: __('ce-wp-social-portal-description-linkedinx'),
        indeed: __('ce-wp-social-portal-description-indeed'),
        facebook: __('ce-wp-social-portal-description-facebook'),
        twitter: __('ce-wp-social-portal-description-twitter'),
        google: __('ce-wp-social-portal-description-google'),
        github: __('ce-wp-social-portal-description-github'),
        stackoverflow: __('ce-wp-social-portal-description-stackoverflow'),
        googleplus: __('ce-wp-social-portal-description-googleplus'),
        xing: __('ce-wp-social-portal-description-xing'),
        viadeo: __('ce-wp-social-portal-description-viadeo'),
        behance: __('ce-wp-social-portal-description-behance'),
        elance: __('ce-wp-social-portal-description-elance'),
        aboutme: __('ce-wp-social-portal-description-aboutme'),
        pinterest: __('ce-wp-social-portal-description-pinterest'),
        weibo: __('ce-wp-social-portal-description-weibo'),
        kaggle: __('ce-wp-social-portal-description-kaggle'),
        bullhorn: __('ce-wp-social-portal-description-bullhorn')
    };
    var buttonArray = ['<div class="st-socials-inner">', '<ul class="st-row" id="sortable">', '<li class="col6 static">', '<span class="st-vsearch-advanced-portals-text">' + __('ce-wp-header-social-buttons') + '</span>', '</li>'];
    var buttonBuffer = new LinkedInPopupGeneratorButtonBuffer();
    for (var index = 0; index < buttonsOrder.length; index++) {
        var portalName = buttonsOrder[index];
        switch (buttonBuffer.count()) {
            case 2:
                {
                    var portal = 'facebook';
                    if (buttonsOrder.indexOf(portal) < 0) {
                        buttonBuffer.addButton(this.getPortalButton(portal, portalDescriptionDictionary[portal]));
                    }
                }
                break;
            case 4:
                {
                    buttonBuffer.addButton(['<li class="col2 col-custom static">', '<div class="st-tooltip">', '<a href="#" id="st-show-social-icons" class="st-menu-bars">', '<span class="dots"></span>', '</a>', '</div>', '</li>'].join(''));
                }
                break;
            case 11:
                {
                    buttonBuffer.addButton(['<li class="col2 col-custom static">', '<div class="st-tooltip">', '<a href="#" id="edit-draggable-icons"></a>', '</div>', '</li>'].join(''));
                }
                break;
        }
        if (this.isPortalAllowed(portalName, allowedOptionalSocialNetworks)) {
            buttonBuffer.addButton(this.getPortalButton(portalName, portalDescriptionDictionary[portalName]));
        }
    }
    for (var index = 0; index < allowedOptionalSocialNetworks.length; index++) {
        var allowedPortal = allowedOptionalSocialNetworks[index];
        if (buttonsOrder.indexOf(allowedPortal) < 0) {
            buttonBuffer.addButton(this.getPortalButton(allowedPortal, portalDescriptionDictionary[allowedPortal]));
        }
    }
    buttonArray.push(buttonBuffer.getOutherHtml());
    buttonArray.push(['</ul>', '</div>'].join(''));
    return buttonArray.join('');
};
LinkedInPopupGeneratorElementSocialButtonsClass.prototype.isPortalAllowed = function (name, allowedOptionalSocialNetworks) {
    if (this.optionalSocialNetworks.indexOf(name) >= 0) {
        return allowedOptionalSocialNetworks.indexOf(name) >= 0;
    }
    return true;
};
LinkedInPopupGeneratorElementSocialButtonsClass.prototype.getPortalButton = function (name, description) {
    return ['<li class="col2 col-custom sortable">', '<div id="st-tooltip-' + name + '" class="st-tooltip ' + this.getNextShakeItClass() + '" title="' + description + '">', '<a id="' + this.idPrefix + '-' + name + '-button"><img src="' + chrome.extension.getURL('images/web-popups/' + name + '.png') + '"></a>', '</div>', '</li>'].join('');
};
LinkedInPopupGeneratorElementSocialButtonsClass.prototype.getNextShakeItClass = function () {
    var classNumber = this.shakeItElementCount % 4 + 1;
    this.shakeItElementCount++;
    return 'shake-it-' + classNumber;
};
LinkedInPopupGeneratorElementSocialButtonsClass.prototype.runTriggers = function () {
    var that = this;
    $("#sortable").sortable({
        placeholder: "col2 ui-state-highlight",
        forcePlaceholderSize: true,
        forceHelperSize: true,
        revert: true,
        scroll: false,
        cursor: 'move',
        items: 'li:not(.static)',
        start: function start() {
            $('.static', this).each(function () {
                var $this = $(this);
                $this.data('pos', $this.index());
            });
        },
        change: function change() {
            var $sortable = $(this);
            var $statics = $('.static', this).detach();
            var $helper = $('<li class="col2 col-custom"></li>').prependTo(this);
            $statics.each(function () {
                var $this = $(this);
                var target = $this.data('pos');
                $this.insertAfter($('li', $sortable).eq(target));
            });
            $helper.remove();
        }
    });
    $("#sortable").disableSelection();
    $("#sortable").sortable('disable');
    $('#edit-draggable-icons').on('click', function (e) {
        e.preventDefault();
        var value = {};
        if ($('#st-socials-container').hasClass('shake-it')) {
            $(this).removeClass('st-rotate');
            $(this).addClass('st-dont-rotate');
            disableSocialDragging();
            saveSocialButtonsOrder();
            value.before = 'st-rotate';
            value.after = 'st-dont-rotate';
        } else {
            $(this).removeClass('st-dont-rotate');
            $(this).addClass('st-rotate');
            enableSocialDragging();
            value.before = 'st-dont-rotate';
            value.after = 'st-rotate';
        }
        that.popup.sendActionOnPopupNotification({
            action: 'ButtonClick',
            elementType: 'SocialGearButton',
            valueBefore: value.before,
            valueAfter: value.after
        });
    });
    $('#edit-draggable-icons').on('mouseout', function () {
        $(this).removeClass('st-dont-rotate');
    });
    $('#st-show-social-icons').on('click', function (e) {
        e.preventDefault();
        that.popup.sendActionOnPopupNotification({
            action: 'ButtonClick',
            elementType: 'SocialHamburgerButton',
            valueBefore: $('#st-socials-container').hasClass('toggled') ? '' : 'st-hidden'
        });
        if ($('#st-socials-container').hasClass('toggled')) {
            if (that.isSocialDraggingEnabled) {
                disableSocialDragging();
                saveSocialButtonsOrder();
            }
            $(this).removeClass('st-menu-bars-active');
            $('#st-socials-container').animate({ 'height': '60px' }).removeClass('toggled');
        } else {
            $(this).addClass('st-menu-bars-active');
            var containerObject = $('#st-socials-container');
            var buttonsContainerHeight = parseInt($(this).closest('.st-socials-inner').css('height'));
            buttonsContainerHeight += parseInt(containerObject.css('padding-top')) + parseInt(containerObject.css('padding-bottom'));
            containerObject.animate({ 'height': buttonsContainerHeight + 'px' }).addClass('toggled');
        }
    });
    function saveSocialButtonsOrder() {
        var orderArray = [];
        $.each($('#st-socials-container ul li.sortable:nth-child(n+2)'), function (i, o) {
            var itemId = $(o).find('a').attr('id');
            var portalName = itemId.replace(that.idPrefix + '-', '').replace('-button', '');
            orderArray.push(portalName);
        });
        var message = {
            popup: that.popupName,
            element: 'SocialButtons',
            command: 'save-social-buttons-order',
            order: orderArray,
            noFeedback: true
        };
        chrome.runtime.sendMessage(message);
    };
    function enableSocialDragging() {
        $('#st-socials-container').addClass('shake-it');
        $("#sortable").sortable('enable');
        $(".st-tooltip").tooltip('disable');
        that.isSocialDraggingEnabled = true;
    }
    function disableSocialDragging() {
        $('#st-socials-container').removeClass('shake-it');
        $('#edit-draggable-icons').removeClass('st-rotate');
        $("#sortable").sortable('disable');
        $(".st-tooltip").tooltip('enable');
        that.isSocialDraggingEnabled = false;
    }
    $(".st-tooltip").tooltip({
        position: { my: "left-10 bottom-50", at: "left bottom", collision: "fit fit" },
        tooltipClass: "st-tooltip-window"
    });
};
LinkedInPopupGeneratorElementSocialButtonsClass.prototype.isDraggingEnabled = function () {
    return this.isSocialDraggingEnabled;
};
'use strict';
function LinkedInPopupGeneratorPeopleLikeThisClass(popup) {
  this.socialButtonsGenerator = new LinkedInPopupGeneratorElementSocialButtonsClass('st-people-like-this', 'PeopleLikeThis', popup);
}
LinkedInPopupGeneratorPeopleLikeThisClass.prototype.getSocialButtons = function (user) {
  return this.socialButtonsGenerator.getSocialButtons(user.socialButtonsOrder, user.optionalSocialNetworks);
};
LinkedInPopupGeneratorPeopleLikeThisClass.prototype.runTriggers = function () {
  this.socialButtonsGenerator.runTriggers();
};
LinkedInPopupGeneratorPeopleLikeThisClass.prototype.isDraggingEnabled = function () {
  return this.socialButtonsGenerator.isDraggingEnabled();
};
'use strict';
function LinkedInPopupGeneratorVSearchAdvancedClass(popup) {
  this.socialButtonsGenerator = new LinkedInPopupGeneratorElementSocialButtonsClass('st-vsearch-advanced', 'LinkedinVSearchAdvanced', popup);
}
LinkedInPopupGeneratorVSearchAdvancedClass.prototype.getSocialButtons = function (user) {
  return this.socialButtonsGenerator.getSocialButtons(user.socialButtonsOrder, user.optionalSocialNetworks);
};
LinkedInPopupGeneratorVSearchAdvancedClass.prototype.runTriggers = function () {
  this.socialButtonsGenerator.runTriggers();
};
LinkedInPopupGeneratorVSearchAdvancedClass.prototype.isDraggingEnabled = function () {
  return this.socialButtonsGenerator.isDraggingEnabled();
};
'use strict';
function LinkedInPopupInputValue(value) {
    this.rawValue = value;
}
LinkedInPopupInputValue.prototype.getSerializableString = function () {
    return this.rawValue.trim().replace(/['"]/g, '');
};
"use strict";
function PopupAbstractClass() {
    this.widgetCollection = this.createWidgets();
}
PopupAbstractClass.prototype.createWidgets = function () {
    var videoButton = new LinkedInWidgetVideoButtonClass();
    return {
        header: new PopupHeaderWidget(),
        popupSettings: new PopupSettingsWidget(videoButton),
        videoButton: videoButton
    };
};
PopupAbstractClass.prototype.setUserRole = function (userRole) {
    if (this.widgetCollection && this.widgetCollection.videoButton) {
        this.widgetCollection.videoButton.setUserRole(userRole);
    }
};
PopupAbstractClass.prototype.setBaseUrl = function (baseUrl) {
    if (this.widgetCollection && this.widgetCollection.videoButton) {
        this.widgetCollection.videoButton.setBaseUrl(baseUrl);
    }
};
PopupAbstractClass.prototype.setPopupSettingsModel = function (model) {
    if (this.widgetCollection && this.widgetCollection.popupSettings) {
        this.widgetCollection.popupSettings.setModel(model);
    }
};
PopupAbstractClass.prototype.getPopupSettingsModel = function () {
    if (this.widgetCollection && this.widgetCollection.popupSettings) {
        return this.widgetCollection.popupSettings.getModel();
    }
};
PopupAbstractClass.prototype.setFlash = function (name, value) {
    sessionStorage.setItem(name, value);
};
PopupAbstractClass.prototype.getFlash = function (name) {
    var value = sessionStorage.getItem(name);
    sessionStorage.removeItem(name);
    return value;
};
PopupAbstractClass.prototype.get = function (name) {
    var value = sessionStorage.getItem(name);
    return value;
};
PopupAbstractClass.prototype.tooltipsTrigger = function () {
    $(".st-tooltip-question").tooltip({
        position: { my: "left-10 bottom-20", at: "left bottom", collision: "fit fit" },
        tooltipClass: "st-tooltip-window"
    });
};
PopupAbstractClass.prototype.setupWidgetsEventHandlers = function () {
    for (var key in this.widgetCollection) {
        this.widgetCollection[key].setupEventHandlers();
    }
};
PopupAbstractClass.prototype.selectAllText = function (element) {
    var selection = window.getSelection();
    var range = document.createRange();
    range.selectNodeContents(element);
    selection.removeAllRanges();
    selection.addRange(range);
};
PopupAbstractClass.prototype.onShowPopup = function () {
    this.sendActionOnPopupNotification({
        action: 'ShowPopup'
    });
};
PopupAbstractClass.prototype.sendActionOnPopupNotification = function (actionData) {
    'use strict';
    var notifierFactory = new LinkedInNotifierFactoryClass();
    var notifier = notifierFactory.createActionNotifierForPopup(this);
    notifier.sendNotification(actionData);
};
PopupAbstractClass.prototype.findSkillContentElement = function (skillText, container) {
    var skillArray = container.getElementsByClassName('st-skill-content');
    for (var index = 0; index < skillArray.length; index++) {
        var element = skillArray[index];
        if (element.innerHTML.toLowerCase() == skillText.toLowerCase()) {
            return element;
        }
    }
    return null;
};
PopupAbstractClass.prototype.findSkillContentElement = function (skillText, container) {
    var skillArray = container.getElementsByClassName('st-skill-content');
    for (var index = 0; index < skillArray.length; index++) {
        var element = skillArray[index];
        if (element.innerHTML.toLowerCase() == skillText.toLowerCase()) {
            return element;
        }
    }
    return null;
};
PopupAbstractClass.prototype.isInitializationAllowed = function (url) {
    return true;
};
PopupAbstractClass.prototype.isInstantPopup = function () {
    return false;
};
PopupAbstractClass.prototype.getLastSearchId = function () {
    var lastSearchId = sessionStorage.getItem('StAdvancedSearchLinkedInRecruiterSearchId');
    if (!lastSearchId) {
        lastSearchId = this.lastSearchId ? this.lastSearchId : '';
    }
    return lastSearchId;
};
PopupAbstractClass.prototype.setLastSearchId = function (searchId) {
    this.lastSearchId = searchId;
    if (searchId) {
        sessionStorage.setItem('StAdvancedSearchLinkedInRecruiterSearchId', searchId);
    }
};
PopupAbstractClass.prototype.unmuteAutomaticPopups = function () {
    this.widgetCollection.popupSettings.model.unmuteAutomaticPopups();
};
'use strict';
function PopupMinimizedClass(popupManager) {
    this.popupManager = popupManager;
    var that = this;
    this.ninja = document.createElement('a');
    this.ninja.id = 'st-ninja-prompt-button';
    var ninjaImage = document.createElement('img');
    ninjaImage.src = chrome.extension.getURL('images/web-popups/side-tab.png');
    this.ninja.appendChild(ninjaImage);
    document.body.appendChild(this.ninja);
    this.ninja.onclick = function () {
        var notifierFactory = new LinkedInNotifierFactoryClass();
        var notifier = notifierFactory.createActionNotifierForPopup(that);
        notifier.sendNotification({
            action: 'NinjaPromptClick'
        });
        this.className = 'st-hidden';
        that.popupManager.minimizePopup(false);
        that.popupManager.setAutomaticPopupsAllowed(true);
        localStorage.removeItem('st_forceHidePopup');
    };
    this.hide();
}
PopupMinimizedClass.prototype.show = function () {
    this.ninja.classList.remove('st-hidden');
};
PopupMinimizedClass.prototype.hide = function () {
    this.ninja.classList.add('st-hidden');
};
'use strict';
function PopupLinkedInPeopleLikeThisClass(popupManager) {
    this.popupManager = popupManager;
    this.profileUrlPattern = /(profile\/view\?id=)|(in\/[a-z0-9-%]+)/i;
    this.ajaxParser = new LinkedInAjaxParser();
    this.socialButtonsGenerator = new LinkedInPopupGeneratorPeopleLikeThisClass(this);
    this.widgetCollection = this.createWidgets();
}
PopupLinkedInPeopleLikeThisClass.prototype = new PopupAbstractClass();
PopupLinkedInPeopleLikeThisClass.prototype.constructor = PopupLinkedInPeopleLikeThisClass;
PopupLinkedInPeopleLikeThisClass.prototype.createWidgets = function () {
    var result = this.__proto__.createWidgets();
    result.teamAwarenessAlert = new LinkedInWidgetTeamAwarenessAlertClass(this);
    result.visitorsWidget = new LinkedInWidgetTeamAwarenessVisitorsClass(this);
    return result;
};
PopupLinkedInPeopleLikeThisClass.prototype.match = function (url) {
    var path = new LinkedInPath(url);
    if (path.isRecruiterPage()) {
        return path.isRecruiterProfilePage();
    }
    if (path.isLinkedInPage()) {
        return this.profileUrlPattern.test(url);
    }
    return false;
};
PopupLinkedInPeopleLikeThisClass.prototype.sendInitialRequest = function (url) {
    var that = this;
    this.getProfileInfo(function (profileInfo) {
        localStorage.setItem('last-popup', 'linkedinPeopleLikeThis');
        that.popupManager.getBackendData({
            command: 'get-backend-stuff'
        }, function (backendData) {
            var requestData = {
                popup: "PeopleLikeThis",
                command: "analyze-url",
                url: url,
                position: profileInfo.position,
                skills: profileInfo.skills,
                location: profileInfo.location, 
                mentorUserId: backendData.mentorUserId,
                linkedinUser: {
                    id: '',
                    fullName: that.getProfileFullName(),
                    countryCode: '',
                    publicProfileUrl: that.getProfilePublicUrl()
                }
            };
            that.popupManager.getLinkedInMemberId().then(function (linkedInMemberId) {
                requestData.linkedinUser.id = linkedInMemberId;
                return that.getProfileCountryCode();
            }).then(function (countryCode) {
                requestData.linkedinUser.countryCode = countryCode;
                that.popupManager.getBackendData(requestData);
            }).catch(function (e) {
                return console.log(e);
            });
        });
    });
};
PopupLinkedInPeopleLikeThisClass.prototype.generate = function (backendData, user) {
    var _this = this;
    var that = this;
    var retval = [];
    var fullName = this.getProfileFullName();
    return this.getProfileJobTitle().then(function (jobTitle) {
        var location = _this.getProfileLocality().split(',')[0] || _this.getProfileLocation();
        var visitorList = backendData.profile_visited;
        var skillsArray = _this.getProfileSkills(2, function (updatedSkillArray) {
            var placeholderElement = document.getElementById('st-skill-future-placeholder');
            if (placeholderElement) {
                var skills = [];
                for (var i = 0; i < updatedSkillArray.length; i++) {
                    skills.push('<span class="st-skill"><span class="st-skill-content">' + updatedSkillArray[i] + '</span><span class="st-skill-remove-button">x</span></span>');
                }
                placeholderElement.outerHTML = skills.join('');
                that.prepareAllSkillButtons();
            } else {
                skillsArray = updatedSkillArray;
            }
        });
        _this.portalLinks = _this.updatePortalLinks(backendData);
        var similarProfilesDisplay = '';
        var visitorsListDisplay = 'st-hidden';
        var titleDisplay = '';
        var socialButtonsDisplay = '';
        if (visitorList && visitorList.length > 0) {
            similarProfilesDisplay = 'st-hidden';
            visitorsListDisplay = '';
            titleDisplay = 'st-hidden';
            socialButtonsDisplay = 'st-hidden';
        }
        _this.setTeamAwarenessData(visitorList, fullName, backendData.mentorUserId);
        retval += ['<div class="st-container">', _this.widgetCollection.header.getOuterHTML(), '<div class="st-settings-box">', _this.widgetCollection.popupSettings.getOuterHTML(), '</div>', '<div class="st-popup-content-box">', _this.widgetCollection.teamAwarenessAlert.getOuterHTML(), '<div class="st-body">', '<h3 id="st-people-like-this-title" class="' + titleDisplay + '">' + __('ce-wp-smart-profile-header') + '</h3>', '<div id="st-settings-container" class="' + similarProfilesDisplay + '">', '<div class="st-settings st-box">', '<div class="st-form-group">', '<label>' + __('ce-wp-smart-profile-job-title-label') + '</label>&nbsp;&nbsp;', '<span id="st-job-title-span" class="editable" contentEditable="true">' + jobTitle + '</span>', '</div>', '<div class="st-form-group">', '<label>' + __('ce-wp-smart-profile-location-label') + '</label>&nbsp;&nbsp;', '<span id="st-location-span" class="editable" contentEditable="true">' + location + '</span>', '</div>', '<div class="st-form-group st-flex" id="st-skills-container">', '--**##SKILLS##**--', '</div>', '--**##PEOPLE-LIKE-THIS-BUTTON##**--', '</div>', '</div>', '<div id="st-viewers-container" class="' + visitorsListDisplay + '">', _this.widgetCollection.visitorsWidget.getOuterHTML(), '</div>', '</div>', '<div class="st-footer">', '<div id="st-socials-container" class="st-socials ' + socialButtonsDisplay + '">', '--**##BUTTONS##**--', '</div>', '</div>', '</div>', '</div>'].join('');
        var skills = [];
        if (skillsArray.length > 0) {
            for (var i = 0; i < skillsArray.length; i++) {
                skills.push('<span class="st-skill"><span class="st-skill-content">' + skillsArray[i] + '</span><span class="st-skill-remove-button">x</span></span>');
            }
        } else {
            skills.push('<span id="st-skill-future-placeholder" class="st-hidden"></span>');
        }
        skills.push(['<span class="st-skill st-skill-add">', '<span class="st-add-skill-text">' + __('ce-wp-button-add-skill') + '</span>', '<span class="st-skill-add-button">+</span>', '</span>'].join(''));
        skills = skills.join('');
        retval = retval.replace('--**##SKILLS##**--', skills);
        var buttons = '';
        var peopleLikeThisButton = '';
        if (backendData.results) {
            buttons = _this.socialButtonsGenerator.getSocialButtons(user);
            peopleLikeThisButton = ['<div class="st-row">', '<div class="col12">', '<div class="st-linkedin">', '<img src="' + chrome.extension.getURL('images/web-popups/placeholder-person.png') + '" />', '<span>=</span>', '<img src="' + chrome.extension.getURL('images/web-popups/placeholder-person.png') + '" />', '<a id="st-people-like-this-main-button">' + __('ce-wp-find-similar-profiles-button-label') + '</a>', '</div>', '</div>', '<div class="col8" style="height: 1px;"></div>', '<div class="col4">', '<div class="st-tooltip-question">', '<a class="st-more" title="' + __('ce-wp-find-similar-profiles-button-tooltip') + '">' + __('ce-wp-find-similar-profiles-button-tip') + '</a>', '</div>', '</div>', '</div>'].join('');
        }
        retval = retval.replace('--**##BUTTONS##**--', buttons);
        retval = retval.replace('--**##PEOPLE-LIKE-THIS-BUTTON##**--', peopleLikeThisButton);
        _this.popupManager.displayPopup(retval);
        return Promise.resolve();
    }).catch(function (e) {
        return console.log(e);
    });
};
PopupLinkedInPeopleLikeThisClass.prototype.prepareAllSkillButtons = function () {
    var that = this;
    var prepareAddSkillButton = function prepareAddSkillButton(button) {
        var addSkillLabel = __('ce-wp-button-add-skill');
        button.getElementsByClassName('st-add-skill-text')[0].onclick = function () {
            this.contentEditable = true;
            this.classList.add('active');
            document.execCommand('selectAll', false, null);
            this.focus();
        };
        button.getElementsByClassName('st-add-skill-text')[0].onkeypress = function (event) {
            if (window.strip_tags(this.innerHTML).length > 50) {
                return false;
            }
            if (event.keyCode == 13) {
                if (this.textContent.trim() == '' || this.textContent.trim() == addSkillLabel) {
                    return false;
                }
                this.blur();
                return false;
            }
        };
        button.getElementsByClassName('st-add-skill-text')[0].onblur = function (event) {
            var text = this.textContent.trim();
            that.popupManager.removeClass(this, 'active');
            if (text.trim() === '' || text === addSkillLabel) {
                this.innerHTML = addSkillLabel;
                return;
            }
            that.popupManager.removeClass(this, 'st-add-skill-text');
            this.classList.add('st-skill-content');
            this.contentEditable = false;
            this.parentNode.childNodes[1].onclick();
            return;
        };
        button.getElementsByClassName('st-skill-add-button')[0].onclick = function () {
            var parent = this.parentNode;
            var text = parent.getElementsByClassName('st-skill-content')[0] ? parent.getElementsByClassName('st-skill-content')[0].textContent.trim() : '';
            if (parent.getElementsByClassName('st-skill-content').length && text != addSkillLabel) {
                that.unmuteAutomaticPopups();
                var contentElement = parent.getElementsByClassName('st-skill-content')[0];
                var duplicateSkill = that.findSkillContentElement(text, parent.parentNode);
                if (duplicateSkill && duplicateSkill !== contentElement) {
                    duplicateSkill = duplicateSkill.parentNode;
                    duplicateSkill.classList.add('st-skill-duplicate');
                    parent.classList.add('st-skill-duplicate');
                    setTimeout(function () {
                        duplicateSkill.classList.remove('st-skill-duplicate');
                        parent.classList.remove('st-skill-duplicate');
                    }, 500);
                    contentElement.classList.remove('st-skill-content');
                    contentElement.classList.add('st-add-skill-text', 'active');
                    contentElement.click();
                    return;
                } else {
                    that.sendActionOnPopupNotification({
                        action: 'SynonymAdd',
                        elementType: 'Skills',
                        valueAfter: contentElement.textContent
                    });
                }
                this.className = 'st-skill-remove-button';
                this.innerHTML = 'x';
                parent.classList.remove('st-skill-add');
                var skillsContainer = document.getElementById('st-skills-container');
                skillsContainer.innerHTML += ['<span class="st-skill st-skill-add">', '<span class="st-add-skill-text">' + addSkillLabel + '</span>', '<span class="st-skill-add-button">+</span>', '</span>'].join('');
                that.prepareAllSkillButtons();
                that.updatePopup();
            }
        };
    };
    var prepareRemoveSkillButton = function prepareRemoveSkillButton(button) {
        button.getElementsByClassName('st-skill-remove-button')[0].onclick = function () {
            that.unmuteAutomaticPopups();
            var elem = this.parentNode;
            that.sendActionOnPopupNotification({
                action: 'SynonymRemove',
                elementType: 'Skills',
                valueBefore: elem.querySelector('.st-skill-content').textContent
            });
            elem.parentNode.removeChild(elem);
            if (document.getElementsByClassName('st-skill').length == 0) {
                var skillsContainer = document.getElementById('st-skills-container');
                skillsContainer.parentNode.removeChild(skillsContainer);
            }
            that.updatePopup();
        };
    };
    var skills = document.getElementsByClassName('st-skill');
    for (var i = 0; i < skills.length; i++) {
        if (skills[i].className.indexOf('st-skill-add') > 0) {
            prepareAddSkillButton(skills[i]);
        } else {
            prepareRemoveSkillButton(skills[i]);
        }
    }
};
PopupLinkedInPeopleLikeThisClass.prototype.updatePopup = function () {
    var that = this;
    this.popupManager.updatePopup = true;
    var position = document.getElementById('st-job-title-span').textContent.trim();
    var location = document.getElementById('st-location-span').textContent.trim();
    this.popupManager.getBackendData({
        command: 'get-backend-stuff'
    }, function (backendData) {
        that.popupManager.getLinkedInMemberId().then(function (linkedInMemberId) {
            that.popupManager.getBackendData({
                popup: "PeopleLikeThis",
                command: "analyze-url",
                url: that.popupManager.currentURL,
                position: position,
                location: location, 
                skills: that.getPopupSkills().join(','),
                mentorUserId: backendData.mentorUserId,
                linkedinUser: {
                    id: linkedInMemberId,
                    fullName: that.getProfileFullName(),
                    publicProfileUrl: that.getProfilePublicUrl()
                }
            });
        });
        var loader = new LinkedInWidgetPopupLoaderClass();
        loader.createSplash();
    });
};
PopupLinkedInPeopleLikeThisClass.prototype.setTeamAwarenessData = function (visitorList, candidateFullName, mentorUserId) {
    this.widgetCollection.teamAwarenessAlert.setVisitorList(visitorList);
    this.widgetCollection.teamAwarenessAlert.setCandidateFullName(candidateFullName);
    this.widgetCollection.teamAwarenessAlert.setMentorUserId(mentorUserId);
    this.widgetCollection.visitorsWidget.setVisitorList(visitorList);
    this.widgetCollection.visitorsWidget.setCandidateFullName(candidateFullName);
    this.widgetCollection.visitorsWidget.setMentorUserId(mentorUserId);
};
PopupLinkedInPeopleLikeThisClass.prototype.onShowPopup = function () {
    var viewType = document.querySelector('#st-viewers-container').classList.contains('st-hidden') ? 'SmartProfile' : 'TeamAwareness';
    this.sendActionOnPopupNotification({
        action: 'ShowPopup',
        elementType: viewType
    });
};
PopupLinkedInPeopleLikeThisClass.prototype.runTriggers = function () {
    var that = this;
    this.updatePortalLinksTrigger();
    var jobTitle = document.getElementById('st-job-title-span');
    jobTitle.onfocus = function () {
        that.selectAllText(this);
    };
    jobTitle.oldText = jobTitle.textContent.trim();
    jobTitle.onblur = function () {
        if (this.oldText != this.textContent.trim()) {
            that.unmuteAutomaticPopups();
            that.sendActionOnPopupNotification({
                action: 'EditJobTitle',
                valueBefore: this.oldText,
                valueAfter: this.textContent.trim()
            });
            that.updatePopup();
            this.oldText = this.textContent.trim();
        }
    };
    jobTitle.onkeypress = function (event) {
        if (event.keyCode == 13) {
            this.blur();
            return false;
        }
    };
    var location = document.getElementById('st-location-span');
    location.onfocus = function () {
        that.selectAllText(this);
    };
    location.oldText = location.textContent.trim();
    location.onblur = function () {
        if (this.oldText != this.textContent.trim()) {
            that.unmuteAutomaticPopups();
            that.sendActionOnPopupNotification({
                action: 'EditLocation',
                valueBefore: this.oldText,
                valueAfter: this.textContent.trim()
            });
            that.updatePopup();
            this.oldText = this.textContent.trim();
        }
    };
    location.onkeypress = function (event) {
        if (event.keyCode == 13) {
            this.blur();
            return false;
        }
    };
    this.prepareAllSkillButtons();
    this.tooltipsTrigger();
    this.popupManager.setPopupScrollable();
    this.socialButtonsGenerator.runTriggers();
    this.widgetCollection.header.setPopup(this);
    this.setupWidgetsEventHandlers();
};
PopupLinkedInPeopleLikeThisClass.prototype.updatePortalLinks = function (request) {
    var result = {
        main: request.mainUrl,
        linkedin: request.linkedinUrl,
        linkedinx: request.linkedinxUrl,
        indeed: request.indeedUrl,
        indeedErrorMessage: request.indeedErrorMessage,
        twitter: request.twitterUrl,
        google: request.googleUrl,
        github: request.githubUrl,
        stackoverflow: request.stackoverflowUrl,
        googlePlus: request.googlePlusUrl,
        xing: request.xingUrl,
        viadeo: request.viadeoUrl,
        behance: request.behanceUrl,
        elance: request.elanceUrl,
        aboutme: request.aboutmeUrl,
        pinterest: request.pinterestUrl,
        weibo: request.weiboUrl,
        kaggle: request.kaggleUrl,
        facebook: request.facebookUrl
    };
    if (request.bullhorn) {
        result.bullhorn = {
            query: request.bullhornUrl.query,
            locations: request.bullhornUrl.locations,
            chromeExtFlag: request.bullhorn.chromeExtFlag
        };
    }
    return result;
};
PopupLinkedInPeopleLikeThisClass.prototype.updatePortalLinksTrigger = function () {
    var that = this;
    var mentorCompanyId = '';
    this.popupManager.getBackendData({
        'command': 'get-backend-stuff'
    }, function (data) {
        mentorCompanyId = data.mentorCompanyId;
    });
    var sendActionOnPopupNotification = function sendActionOnPopupNotification(socialButtonName) {
        that.sendActionOnPopupNotification({
            action: 'SocialButtonClick',
            elementType: socialButtonName
        });
    };
    var popupLink = document.getElementById('st-people-like-this-main-button');
    if (popupLink) {
        popupLink.onclick = function () {
            that.unmuteAutomaticPopups();
            that.sendActionOnPopupNotification({
                action: 'FindSimilarProfilesButtonClick',
                searchId: that.getPeopleLikeThisSearchId()
            });
            that.popupManager.getBackendData({
                'command': 'mark-popup-search-visible',
                'popup': 'peopleLikeThis',
                'openMainLink': true,
                'searchId': that.getPeopleLikeThisSearchId()
            });
        };
    }
    var markPopupSearchVisible = function markPopupSearchVisible() {
        that.popupManager.getBackendData({
            'command': 'mark-popup-search-visible',
            'popup': 'peopleLikeThis',
            'searchId': that.getPeopleLikeThisSearchId()
        });
    };
    var popupLink = document.getElementById('st-people-like-this-linkedinx-button');
    if (popupLink) {
        popupLink.onclick = function () {
            if (that.socialButtonsGenerator.isDraggingEnabled()) {
                return;
            }
            sendActionOnPopupNotification('LinkedInX');
            markPopupSearchVisible();
            window.open(that.portalLinks.linkedinx, '_blank');
        };
    }
    var popupLink = document.getElementById('st-people-like-this-indeed-button');
    if (popupLink) {
        if (this.portalLinks.indeed) {
            popupLink.classList.remove('indeed-icon-blocked');
            popupLink.removeAttribute('title');
            popupLink.onclick = function () {
                if (that.socialButtonsGenerator.isDraggingEnabled()) {
                    return;
                }
                sendActionOnPopupNotification('InDeed');
                markPopupSearchVisible();
                if (that.portalLinks.indeed) {
                    window.open(that.portalLinks.indeed, '_blank');
                }
            };
        } else {
            popupLink.classList.add('indeed-icon-blocked');
            popupLink.title = this.portalLinks.indeedErrorMessage;
        }
    }
    var popupLink = document.getElementById('st-people-like-this-facebook-button');
    if (popupLink) {
        popupLink.onclick = function () {
            if (that.socialButtonsGenerator.isDraggingEnabled()) {
                return;
            }
            sendActionOnPopupNotification('Facebook');
            markPopupSearchVisible();
            window.open(that.portalLinks.facebook, '_blank');
        };
    }
    var popupLink = document.getElementById('st-people-like-this-twitter-button');
    if (popupLink) {
        popupLink.onclick = function () {
            if (that.socialButtonsGenerator.isDraggingEnabled()) {
                return;
            }
            sendActionOnPopupNotification('Twitter');
            markPopupSearchVisible();
            window.open(that.portalLinks.twitter, '_blank');
        };
    }
    var popupLink = document.getElementById('st-people-like-this-google-button');
    if (popupLink) {
        popupLink.onclick = function () {
            if (that.socialButtonsGenerator.isDraggingEnabled()) {
                return;
            }
            sendActionOnPopupNotification('Google');
            markPopupSearchVisible();
            window.open(that.portalLinks.google, '_blank');
        };
    }
    var popupLink = document.getElementById('st-people-like-this-github-button');
    if (popupLink) {
        popupLink.onclick = function () {
            if (that.socialButtonsGenerator.isDraggingEnabled()) {
                return;
            }
            sendActionOnPopupNotification('GitHub');
            markPopupSearchVisible();
            window.open(that.portalLinks.github, '_blank');
        };
    }
    var popupLink = document.getElementById('st-people-like-this-stackoverflow-button');
    if (popupLink) {
        popupLink.onclick = function () {
            if (that.socialButtonsGenerator.isDraggingEnabled()) {
                return;
            }
            sendActionOnPopupNotification('StackOverflow');
            markPopupSearchVisible();
            window.open(that.portalLinks.stackoverflow, '_blank');
        };
    }
    var popupLink = document.getElementById('st-people-like-this-googleplus-button');
    if (popupLink) {
        popupLink.onclick = function () {
            if (that.socialButtonsGenerator.isDraggingEnabled()) {
                return;
            }
            sendActionOnPopupNotification('GooglePlus');
            markPopupSearchVisible();
            window.open(that.portalLinks.googlePlus, '_blank');
        };
    }
    var popupLink = document.getElementById('st-people-like-this-xing-button');
    if (popupLink) {
        popupLink.onclick = function () {
            if (that.socialButtonsGenerator.isDraggingEnabled()) {
                return;
            }
            sendActionOnPopupNotification('Xing');
            markPopupSearchVisible();
            window.open(that.portalLinks.xing, '_blank');
        };
    }
    var popupLink = document.getElementById('st-people-like-this-viadeo-button');
    if (popupLink) {
        popupLink.onclick = function () {
            if (that.socialButtonsGenerator.isDraggingEnabled()) {
                return;
            }
            sendActionOnPopupNotification('Viadeo');
            markPopupSearchVisible();
            window.open(that.portalLinks.viadeo, '_blank');
        };
    }
    var popupLink = document.getElementById('st-people-like-this-behance-button');
    if (popupLink) {
        popupLink.onclick = function () {
            if (that.socialButtonsGenerator.isDraggingEnabled()) {
                return;
            }
            sendActionOnPopupNotification('Behance');
            markPopupSearchVisible();
            window.open(that.portalLinks.behance, '_blank');
        };
    }
    var popupLink = document.getElementById('st-people-like-this-elance-button');
    if (popupLink) {
        popupLink.onclick = function () {
            if (that.socialButtonsGenerator.isDraggingEnabled()) {
                return;
            }
            sendActionOnPopupNotification('Elance');
            markPopupSearchVisible();
            window.open(that.portalLinks.elance, '_blank');
        };
    }
    var popupLink = document.getElementById('st-people-like-this-aboutme-button');
    if (popupLink) {
        popupLink.onclick = function () {
            if (that.socialButtonsGenerator.isDraggingEnabled()) {
                return;
            }
            sendActionOnPopupNotification('AboutMe');
            markPopupSearchVisible();
            window.open(that.portalLinks.aboutme, '_blank');
        };
    }
    var popupLink = document.getElementById('st-people-like-this-pinterest-button');
    if (popupLink) {
        popupLink.onclick = function () {
            if (that.socialButtonsGenerator.isDraggingEnabled()) {
                return;
            }
            sendActionOnPopupNotification('Pinterest');
            markPopupSearchVisible();
            window.open(that.portalLinks.pinterest, '_blank');
        };
    }
    var popupLink = document.getElementById('st-people-like-this-weibo-button');
    if (popupLink) {
        popupLink.onclick = function () {
            if (that.socialButtonsGenerator.isDraggingEnabled()) {
                return;
            }
            sendActionOnPopupNotification('Weibo');
            markPopupSearchVisible();
            window.open(that.portalLinks.weibo, '_blank');
        };
    }
    var popupLink = document.getElementById('st-people-like-this-kaggle-button');
    if (popupLink) {
        popupLink.onclick = function () {
            if (that.socialButtonsGenerator.isDraggingEnabled()) {
                return;
            }
            sendActionOnPopupNotification('Kaggle');
            markPopupSearchVisible();
            window.open(that.portalLinks.kaggle, '_blank');
        };
    }
    popupLink = document.getElementById('st-people-like-this-bullhorn-button');
    if (popupLink) {
        popupLink.onclick = function () {
            if (that.socialButtonsGenerator.isDraggingEnabled()) {
                return;
            }
            sendActionOnPopupNotification('Bullhorn');
            markPopupSearchVisible();
            that.popupManager.getBackendData({
                command: 'set-bullhorn-search',
                search: that.portalLinks.bullhorn.query,
                locations: [that.getPopupLocation()]
            });
            that.popupManager.getBackendData({
                command: 'get-bullhorn-url'
            }, function (bullhornUrl) {
                bullhornUrl += that.portalLinks.bullhorn.chromeExtFlag;
                window.open(bullhornUrl, '_blank');
            });
        };
    }
};
PopupLinkedInPeopleLikeThisClass.prototype.getPeopleLikeThisSearchId = function () {
    var lastSearchId = sessionStorage.getItem('StPeopleLikeThisLinkedInRecruiterSearchId');
    if (!lastSearchId) {
        lastSearchId = this.lastSearchId ? this.lastSearchId : '';
    }
    return lastSearchId;
};
PopupLinkedInPeopleLikeThisClass.prototype.setPeopleLikeThisSearchId = function (searchId) {
    this.lastSearchId = searchId;
    if (searchId) {
        sessionStorage.setItem('StPeopleLikeThisLinkedInRecruiterSearchId', searchId);
    }
};
PopupLinkedInPeopleLikeThisClass.prototype.update = function (request) {
    this.portalLinks = this.updatePortalLinks(request);
    this.updatePortalLinksTrigger();
};
PopupLinkedInPeopleLikeThisClass.prototype.getPopupLocation = function () {
    var locationElement = document.querySelector('#st-location-span');
    if (locationElement) {
        return locationElement.textContent.trim();
    }
    return '';
};
PopupLinkedInPeopleLikeThisClass.prototype.getPopupSkills = function () {
    var skillsArray = [];
    var skillRows = document.getElementsByClassName('st-skill-content');
    if (skillRows && skillRows.length) {
        for (var index = 0; index < skillRows.length; index++) {
            var skillContent = skillRows[index].textContent.trim();
            if (skillContent) {
                skillsArray.push(skillContent);
            }
        }
    }
    return skillsArray;
};
PopupLinkedInPeopleLikeThisClass.prototype.getProfileInfo = function (callback) {
    var that = this;
    var profileInfo = {
        position: '',
        skills: '',
        location: this.getProfileLocation()
    };
    profileInfo.skills = strip_tags(this.getProfileSkills(2, function (skillsArray) {
        that.getProfileJobTitle().then(function (jobTitle) {
            profileInfo.position = jobTitle;
            if (callback) {
                profileInfo.skills = strip_tags(skillsArray.join(','));
                callback(profileInfo);
            }
        });
    }).join(','));
    if (popupManager.locationLinkedInId) {
        profileInfo.location = profileInfo.location.replace(/\,/g, '.') + ' [' + this.popupManager.locationLinkedInId + ']';
    }
    return profileInfo;
};
PopupLinkedInPeopleLikeThisClass.prototype.getProfileJobTitle = function () {
    var parser = this.createProfileParser(new LinkedInPath(this.popupManager.currentURL));
    return parser.findJobTitle();
};
PopupLinkedInPeopleLikeThisClass.prototype.createProfileParser = function (path) {
    if (path.isRecruiterProfilePage()) {
        return new LinkedInRecruiterProfileDomParser(path);
    }
    return new LinkedInPageProfileDomParser(path);
};
PopupLinkedInPeopleLikeThisClass.prototype.getProfileLocation = function () {
    var parser = this.createProfileParser(new LinkedInPath(this.popupManager.currentURL));
    return parser.findLocation();
};
PopupLinkedInPeopleLikeThisClass.prototype.getProfileSkills = function (howMany, callback) {
    var skillsArray = [];
    var getSkillNameArray = function getSkillNameArray(mainSkillsRows) {
        var result = [];
        for (var index = 0; index < mainSkillsRows.length && index < howMany; index++) {
            result.push(mainSkillsRows[index].textContent.trim());
        }
        return result;
    };
    var callCallback = function callCallback(forceCall) {
        if (callback && (skillsArray.length > 0 || forceCall)) {
            callback(skillsArray);
        }
    };
    var path = new LinkedInPath(this.popupManager.currentURL);
    var mainSkillsContainer = document.getElementById('profile-skills');
    var sessionId = getCookieValue('JSESSIONID');
    if (mainSkillsContainer && !sessionId.match(/^"ajax:\d+"$/)) {
        if (path.isRecruiterProfilePage()) {
            var publicProfileUrl = this.getProfilePublicUrl();
            if (publicProfileUrl) {
                this.ajaxParser.getPublicProfileSkills(publicProfileUrl, function (mainSkillsRows) {
                    skillsArray = getSkillNameArray(mainSkillsRows);
                    callCallback(true);
                });
            }
        }
        else if (path.isLinkedInPage()) {
                var mainSkillsRows = mainSkillsContainer.getElementsByClassName('endorse-item-name-text');
                skillsArray = getSkillNameArray(mainSkillsRows);
            }
    } else {
        var parser;
        if (path.isRecruiterProfilePage()) {
            parser = new LinkedInRecruiterProfileDomParser(new LinkedInPath(this.getProfilePublicUrl()));
        } else {
            parser = new LinkedInPageProfileDomParser(path);
        }
        parser.findSkills(howMany).then(function (skills) {
            skillsArray = skills;
            callCallback(true);
        }).catch(function (e) {
            return console.log(e);
        });
    }
    callCallback();
    return skillsArray;
};
PopupLinkedInPeopleLikeThisClass.prototype.getProfileFullName = function () {
    var nameElement = document.querySelector('#name .full-name') || document.querySelector('#name');
    if (nameElement) {
        return nameElement.textContent;
    }
    nameElement = document.querySelector('.profile-info h1');
    if (nameElement) {
        return nameElement.textContent;
    }
    var parser = new LinkedInPageProfileDomParser(new LinkedInPath(this.popupManager.currentURL));
    return parser.findFullName();
};
PopupLinkedInPeopleLikeThisClass.prototype.getProfileLocality = function () {
    var locationElement = document.getElementById('location');
    if (locationElement) {
        return window.strip_tags(locationElement.getElementsByClassName('locality')[0].getElementsByTagName('a')[0].innerHTML);
    }
    locationElement = document.querySelector('.location-industry .location a');
    if (locationElement) {
        return locationElement.textContent;
    }
    return '';
};
PopupLinkedInPeopleLikeThisClass.prototype.getProfileCountryCode = function () {
    var getCountryCode = function getCountryCode(locationUrl) {
        var countryCodeRegExp = /[?&](f_G|countryCode)=([a-z]{2})/;
        var matchArray = locationUrl.match(countryCodeRegExp);
        if (matchArray && matchArray.length > 0) {
            return Promise.resolve(matchArray[2]);
        }
        return Promise.resolve('');
    };
    var locationElement = document.querySelector('#location .locality a');
    if (locationElement) {
        return getCountryCode(locationElement.href);
    }
    locationElement = document.querySelector('.location-industry .location a');
    if (locationElement) {
        return getCountryCode(locationElement.href);
    }
    var parser = new LinkedInPageProfileDomParser(new LinkedInPath(this.popupManager.currentURL));
    return parser.findCountryCode();
};
PopupLinkedInPeopleLikeThisClass.prototype.getProfilePublicUrl = function () {
    var topCardElement = document.getElementById('top-card');
    if (topCardElement) {
        var publicProfile = topCardElement.getElementsByClassName('public-profile')[0];
        if (publicProfile) {
            return window.strip_tags(publicProfile.getElementsByTagName('a')[0].innerHTML);
        }
    }
    var publicProfileElement = document.querySelector('#topcard .public-profile a');
    if (publicProfileElement) {
        return publicProfileElement.href;
    }
    var parser = new LinkedInPageProfileDomParser(new LinkedInPath(this.popupManager.currentURL));
    return parser.findProfileUrl();
};
'use strict';
function PopupLinkedInVSearchAbstractClass() {
    this.recruiterParser;
}
PopupLinkedInVSearchAbstractClass.prototype = new PopupAbstractClass();
PopupLinkedInVSearchAbstractClass.prototype.isRegularFullAdvancedSearchBuiltByExtension = function (query) {
    var result = typeof query.stSearchImproved !== 'undefined';
    if (result) {
        return result;
    }
    var keywordsInput = document.querySelector('#advs-keywords');
    var keywords = '';
    if (keywordsInput && keywordsInput.value) {
        keywords = keywordsInput.value;
    }
    var jobTitlesInput = document.querySelector('#advs-title');
    var jobTitles = '';
    if (jobTitlesInput && jobTitlesInput.value) {
        jobTitles = jobTitlesInput.value;
    }
    var andOrPattern = /\s+(OR|AND)\s+/;
    var matchArray = keywords.match(andOrPattern) || jobTitles.match(andOrPattern);
    if (!matchArray) {
        var noSynonymsPattern = /\(\"\w+\"\)/;
        matchArray = keywords.match(noSynonymsPattern) && jobTitles.match(noSynonymsPattern);
    }
    return matchArray ? matchArray.length > 0 : false;
};
PopupLinkedInVSearchAbstractClass.prototype.isRegularFullAdvancedSearchBuiltByPage = function (query) {
    if (typeof query.keywords === 'undefined') {
        return false;
    }
    if (typeof query.title === 'undefined') {
        return false;
    }
    var isSearchByPostalCode = typeof query.countryCode !== 'undefined' && typeof query.postalCode !== 'undefined';
    var isSearchByLocationCode = typeof query.locationType !== 'undefined' && typeof query.f_G !== 'undefined';
    var isSearchByCountry = typeof query.countryCode !== 'undefined';
    return typeof query.openAdvancedForm !== 'undefined' && (isSearchByPostalCode || isSearchByLocationCode || isSearchByCountry);
};
PopupLinkedInVSearchAbstractClass.prototype.isRecruiterFullAdvancedSearchBuiltByExtension = function () {
    if (this.recruiterParser) {
        return this.recruiterParser.isFullAdvancedSearchBuiltByExtension();
    }
    return false;
};
PopupLinkedInVSearchAbstractClass.prototype.isRecruiterFullAdvancedSearchBuiltByPage = function () {
    return this.findRecruiterSearchKeywords().length > 0 && this.findRecruiterSearchJobTitles().length > 0 && (this.findRecruiterSearchLocations().length > 0 || this.findRecruiterSearchCountry().length > 0 || this.findRecruiterSearchPostalCodes().length > 0);
};
PopupLinkedInVSearchAbstractClass.prototype.isFullAdvancedSearchBuiltByPage = function () {
    var query = this.popupManager.getUrlQuery(this.popupManager.currentURL);
    return this.isRegularFullAdvancedSearchBuiltByPage(query) || this.isRecruiterFullAdvancedSearchBuiltByPage(query);
};
PopupLinkedInVSearchAbstractClass.prototype.isFullAdvancedSearchBuiltByExtension = function () {
    var query = this.popupManager.getUrlQuery(this.popupManager.currentURL);
    return this.isRegularFullAdvancedSearchBuiltByExtension(query) || this.isRecruiterFullAdvancedSearchBuiltByExtension();
};
PopupLinkedInVSearchAbstractClass.prototype.findRecruiterSearchKeywordsRawValue = function () {
    if (this.recruiterParser) {
        return this.recruiterParser.findSearchKeywordsRawValue();
    }
    return '';
};
PopupLinkedInVSearchAbstractClass.prototype.findRecruiterSearchKeywords = function () {
    if (this.recruiterParser) {
        return this.recruiterParser.findSearchKeywords();
    }
    return [];
};
PopupLinkedInVSearchAbstractClass.prototype.splitStringByQuotes = function (string) {
    var str = new LinkedInStringClass(string);
    return str.splitByQuotes();
};
PopupLinkedInVSearchAbstractClass.prototype.findRecruiterSearchJobTitlesRawValue = function () {
    if (this.recruiterParser) {
        return this.recruiterParser.findSearchJobTitleRawValue();
    }
    return '';
};
PopupLinkedInVSearchAbstractClass.prototype.findRecruiterSearchJobTitles = function () {
    if (this.recruiterParser) {
        return this.recruiterParser.findSearchJobTitles();
    }
    return [];
};
PopupLinkedInVSearchAbstractClass.prototype.findRecruiterSearchLocations = function () {
    if (this.recruiterParser) {
        return this.recruiterParser.findSearchLocations();
    }
    return [];
};
PopupLinkedInVSearchAbstractClass.prototype.findRecruiterSearchCountry = function () {
    if (this.recruiterParser) {
        return this.recruiterParser.findSearchCountry();
    }
    return [];
};
PopupLinkedInVSearchAbstractClass.prototype.findRecruiterSearchCountryCodes = function () {
    if (this.recruiterParser) {
        return this.recruiterParser.findSearchCountryCodes();
    }
    return [];
};
PopupLinkedInVSearchAbstractClass.prototype.findRecruiterSearchPostalCodes = function () {
    if (this.recruiterParser) {
        return this.recruiterParser.findSearchPostalCodes();
    }
    return [];
};
PopupLinkedInVSearchAbstractClass.prototype.createParser = function () {
    var path = new LinkedInPath(this.popupManager.currentURL);
    var factory = new LinkedInDomParserFactoryClass(path);
    return factory.createParser();
};
'use strict';
function PopupLinkedInVSearchAdvancedClass(popupManager) {
    this.popupManager = popupManager;
    this.label = {
        addKeyword: __('ce-wp-button-add-synonym'),
        addJobTitle: __('ce-wp-button-add-synonym'),
        addLocation: __('ce-wp-button-add-location')
    };
    this.socialButtonsGenerator = new LinkedInPopupGeneratorVSearchAdvancedClass(this);
    this.widgetCollection = this.createWidgets(new LinkedInPath(popupManager.currentURL));
}
PopupLinkedInVSearchAdvancedClass.prototype = new PopupLinkedInVSearchAbstractClass();
PopupLinkedInVSearchAdvancedClass.prototype.constructor = PopupLinkedInVSearchAdvancedClass;
PopupLinkedInVSearchAdvancedClass.prototype.createWidgets = function (path) {
    var result = this.__proto__.createWidgets();
    result.resetButton = new LinkedInWidgetAdvancedResetButtonClass(path);
    return result;
};
PopupLinkedInVSearchAdvancedClass.prototype.match = function (url) {
    if (this.isRecruiterPage(url)) {
        this.recruiterParser = this.createParser();
        return this.isRecruiterFullAdvancedSearchBuiltByPage() || this.isRecruiterFullAdvancedSearchBuiltByExtension() || this.isAdvancedPopupForcedByBackend();
    }
    return false;
};
PopupLinkedInVSearchAdvancedClass.prototype.isRecruiterPage = function (url) {
    var linkedInPath = new LinkedInPath(url);
    return linkedInPath.isRecruiterSearchPage();
};
PopupLinkedInVSearchAdvancedClass.prototype.sendInitialRequest = function () {
    var that = this;
    var query = this.popupManager.getUrlQuery(this.popupManager.currentURL);
    if (this.isRegularFullAdvancedSearchBuiltByExtension(query) || this.isRecruiterFullAdvancedSearchBuiltByExtension()) {
        var getSearchId = function getSearchId(url) {};
        if (this.isRecruiterPage(this.popupManager.currentURL)) {
            getSearchId = function getSearchId(url) {
                return that.getLastSearchId();
            };
        } else {
            getSearchId = function getSearchId(url) {
                var idRegExp = /[[?&]?stLastSearch=(\w+)/;
                var resultArray = idRegExp.exec(url);
                if (!resultArray || resultArray.length <= 0) {
                    return that.getLastSearchId();
                }
                that.setLastSearchId(resultArray[1]);
                return resultArray[1];
            };
        }
        switch (localStorage.getItem('last-popup')) {
            case 'linkedinVSearchDefault':
            case 'linkedinPeopleLikeThis':
            case 'linkedinVSearchAdvanced':
                {
                    that.popupManager.getBackendData({
                        popup: 'linkedinVSearchAdvanced',
                        command: 'get-search-by-id',
                        url: that.popupManager.currentURL,
                        searchId: getSearchId(that.popupManager.currentURL)
                    });
                }
                break;
        }
    } else if (this.isRegularFullAdvancedSearchBuiltByPage(query)) {
        this.popupManager.getBackendData({
            popup: 'linkedinVSearchAdvanced',
            command: 'analyze-url',
            url: this.popupManager.currentURL
        });
    } else if (this.isRecruiterFullAdvancedSearchBuiltByPage()) {
        var locations = this.findRecruiterSearchLocations();
        if (locations.length === 0) {
            locations = this.findRecruiterSearchCountry();
        }
        this.popupManager.getBackendData({
            popup: 'linkedinVSearchAdvanced',
            command: 'create-advanced-search',
            url: this.popupManager.currentURL,
            keywords: this.findRecruiterSearchKeywords(),
            jobTitle: this.findRecruiterSearchJobTitles(),
            locations: locations
        });
    }
};
PopupLinkedInVSearchAdvancedClass.prototype.explodeSynonymsToArray = function (synonyms) {
    if (!synonyms) {
        return [];
    }
    var result = [];
    for (var index = 0; index < synonyms.length; index++) {
        result.push(synonyms[index].split(','));
    }
    return result;
};
PopupLinkedInVSearchAdvancedClass.prototype.isPopupUpdateNeeded = function (request) {
    if (this.isRecruiterPage(this.popupManager.currentURL)) {
        return !(this.isEqual(this.explodeSynonymsToArray(this.findRecruiterSearchKeywords()), this.getVSearchKeywordSynonyms(request)) && this.isEqual(this.explodeSynonymsToArray(this.findRecruiterSearchJobTitles()), this.getVSearchJobTitleSynonyms(request)) && this.isEqual(this.explodeSynonymsToArray(this.findRecruiterSearchLocations()), this.getVSearchLocations(request)));
    } else {
        return false;
    }
};
PopupLinkedInVSearchAdvancedClass.prototype.canShowPopup = function (backendData, sessionStorage) {
    var locationsStored = this.getLocationsForGenerator(backendData, sessionStorage);
    var locationsExisting = backendData.search.synonyms && backendData.search.synonyms.cities ? backendData.search.synonyms.cities : this.getPopupLocations();
    var query = this.popupManager.getUrlQuery(backendData.search.portals.linkedin);
    var keywordsInPage = this.findPageKeywordsSearchString();
    var keywordsFromBackend = query.keywords ? decodeURIComponent(query.keywords).replace(/\+(\w+)/gi, ' \$1').replace(/\)\+/g, ') ').replace(/OR\+([\"\.\w])/g, 'OR \$1').replace(/AND\+\(/g, 'AND (').replace(/^\+$/, ' ')
    .trim() : '';
    var jobTitlesInPage = this.findPageJobTitleSearchString();
    var queryJobTitle = this.isRecruiterPage(this.popupManager.currentURL) ? query.jobTitle : query.title;
    var jobTitlesFromBackend = decodeURIComponent(queryJobTitle).replace(/\+/g, ' ').trim();
    return this.isEqual(locationsStored, locationsExisting) && keywordsInPage === keywordsFromBackend && jobTitlesInPage === jobTitlesFromBackend;
};
PopupLinkedInVSearchAdvancedClass.prototype.findPageKeywordsSearchString = function () {
    if (this.isRecruiterPage(this.popupManager.currentURL)) {
        return this.findRecruiterSearchKeywordsRawValue().trim();
    }
    var keywordsElement = document.querySelector('#advs-keywords');
    return keywordsElement ? keywordsElement.value.trim() : '';
};
PopupLinkedInVSearchAdvancedClass.prototype.findPageJobTitleSearchString = function () {
    if (this.isRecruiterPage(this.popupManager.currentURL)) {
        return this.findRecruiterSearchJobTitlesRawValue().trim();
    }
    var titleElement = document.querySelector('#advs-title');
    return titleElement ? titleElement.value.trim() : '';
};
PopupLinkedInVSearchAdvancedClass.prototype.getLocationsForGenerator = function (backendData, sessionStorage) {
    var that = this;
    var decorateBySessionStorage = function decorateBySessionStorage(locationArray, sessionStorage) {
        if (!locationArray || locationArray.length === 0) {
            return [];
        }
        var query = that.popupManager.getUrlQuery(that.popupManager.currentURL);
        var key = 'locationDeletedByRecruiterPage-' + query.searchHistoryId;
        var deletedData = JSON.parse(sessionStorage.getItem(key));
        if (deletedData) {
            for (var dataIndex = 0; dataIndex < deletedData.length; dataIndex++) {
                var fullName = deletedData[dataIndex].fullName;
                var name = fullName.split(',')[0].trim().toLowerCase();
                var arrayIndex = locationArray.indexOf(name);
                if (arrayIndex >= 0) {
                    locationArray.splice(arrayIndex, 1);
                }
            }
        }
        key = 'locationAddedByRecruiterPage-' + query.searchHistoryId;
        var addedData = JSON.parse(sessionStorage.getItem(key));
        if (addedData) {
            for (var dataIndex = 0; dataIndex < addedData.length; dataIndex++) {
                var fullName = addedData[dataIndex].fullName;
                var name = fullName.split(',')[0].trim().toLowerCase();
                if (name.length > 0 && locationArray.indexOf(name) < 0) {
                    locationArray.push(name);
                }
            }
        }
        return locationArray;
    };
    var locations = this.getVSearchLocations(backendData);
    return decorateBySessionStorage(locations, sessionStorage);
};
PopupLinkedInVSearchAdvancedClass.prototype.generate = function (request, user) {
    var jobTitleSynonyms = this.getVSearchJobTitleSynonyms(request);
    var keywordSynonyms = this.getVSearchKeywordSynonyms(request);
    var locations = this.getVSearchLocations(request);
    var noResultsDisplay = this.findSearchResultCount() > 0 ? ' st-hidden' : '';
    var retval = ['<div class="st-container">', this.widgetCollection.header.getOuterHTML(), '<div class="st-settings-box">', this.widgetCollection.popupSettings.getOuterHTML(), '</div>', '<div class="st-popup-content-box">', '<div class="st-body">', '<div id="st-no-results-alert" class="' + noResultsDisplay + '">', '<h3>' + __('ce-wp-no-results-alert-header') + '</h3>', '<div class="st-box">', '<span class="st-tip">' + __('ce-wp-no-results-alert-tip') + '</span>', '<p><b>' + __('ce-wp-no-results-alert-label-for-example') + '</b></p>', '<div class="st-flex">', '<span class="st-skill st-skill-example">', '<span class="st-skill-content">' + __('ce-wp-no-results-alert-label-synonym-1') + '</span>', '<span class="st-skill-remove-button">x</span>', '</span>', '<span class="st-skill st-skill-example">', '<span class="st-skill-content">' + __('ce-wp-no-results-alert-label-synonym-2') + '</span>', '<span class="st-skill-remove-button">x</span>', '</span>', '<span class="st-skill st-skill-example st-skill-example-active">', '<span class="st-skill-content">' + __('ce-wp-no-results-alert-label-synonym-3') + '</span>', '<span class="st-skill-remove-button">&times;</span>', '</span>', '<span class="st-skill-example-pointer"></span>', '</div>', '<span class="st-heartbeat-message">' + __('ce-wp-no-results-alert-note') + '</span>', '</div>', '</div>', '<div class="st-row">', '<div class="col7">', '<h3>' + __('ce-wp-advanced-search-popup-header') + '</h3>', '</div>', '<div class="col5 text-right">', this.widgetCollection.resetButton.getOuterHTML(), '</div>', '</div>', '<div class="st-box">', '<div class="st-form-group">', '<p><label data-type="Job title">' + __('ce-wp-label-job-title') + '</label></p>', '<div id="st-job-title-synonyms-container">', '--**##JOB-TITLE-SYNONYMS##**--', '</div>', '<div class="st-back">', '<span class="st-skill st-skill-add-link">', '<span>', '<a href="' + this.popupManager.backendStuff.domainMentor + '/panel/labs/adv/?search_phrase=' + request.searchId + '" target="_blank">' + __('ce-wp-button-add-new-job-title') + '</a>', '</span>', '<span class="st-skill-add-link-button">+</span>', '</span>', '<a class="st-toggle-flex-button st-flex-show-all-button">' + __('ce-wp-button-show-all-or-add-synonym') + '</a>', '<a class="st-toggle-flex-button st-flex-show-less-button st-hidden">' + __('ce-wp-button-show-less') + '</a>', '</div>', '</div>', '</div>', '<div class="st-box">', '<div class="st-form-group">', '<p><label data-type="Skills">' + __('ce-wp-label-skills') + '</label></p>', '<div id="st-keywords-synonyms-container">', '--**##KEYWORDS-SYNONYMS##**--', '</div>', '<div class="st-back">', '<span class="st-skill st-skill-add-link">', '<span>', '<a href="' + this.popupManager.backendStuff.domainMentor + '/panel/labs/adv/?search_phrase=' + request.searchId + '" target="_blank">' + __('ce-wp-button-add-new-skills') + '</a>', '</span>', '<span class="st-skill-add-link-button">+</span>', '</span>', '<a class="st-toggle-flex-button st-flex-show-all-button">' + __('ce-wp-button-show-all-or-add-synonym') + '</a>', '<a class="st-toggle-flex-button st-flex-show-less-button st-hidden">' + __('ce-wp-button-show-less') + '</a>', '</div>', '</div>', '</div>', '<div class="st-box">', '<div class="st-form-group">', '<p><label data-type="Location">' + __('ce-wp-label-location') + '</label></p>', '<div class="st-flex st-location-synonyms st-flex-closed">', '--**##LOCATIONS-SYNONYMS##**--', '<span class="st-skill st-skill-add">', '<span class="st-add-skill-text" data-placeholder="' + this.label.addLocation + '">' + this.label.addLocation + '</span>', '<span class="st-skill-add-button">+</span>', '</span>', '</div>', '<div class="st-back">', '<a class="st-toggle-flex-button st-flex-show-all-button">' + __('ce-wp-button-show-all-or-add-location') + '</a>', '<a class="st-toggle-flex-button st-flex-show-less-button st-hidden">' + __('ce-wp-button-show-less') + '</a>', '</div>', '</div>', '</div>', '<div class="st-form-actions">', '<div class="st-linkedin" style="display: inline-block; margin-right: 10px;">', '<button id="st-vsearch-advanced-main-button">' + __('ce-wp-button-linkedin-search') + '</button>', '</div>', __('ce-wp-label-or-try') + ' <a href="' + this.popupManager.backendStuff.domainMentor + '/panel/labs/adv/?search_phrase=' + request.searchId + '" target="_blank" id="advanced_search_button">' + __('ce-wp-button-advanced-search') + '</a>', '</div>', '</div>', '<div class="st-footer">', '<div id="st-socials-container" class="st-socials">', '--**##BUTTONS##**--', '</div>', '</div>', '</div>', '</div>'];
    if (request.search && request.search.portals) {
        this.portalLinks = this.updatePortalLinks(request.search.portals);
    }
    var jobTitleSynonymsText = '';
    if (jobTitleSynonyms.length > 0) {
        for (groupKey in jobTitleSynonyms) {
            var keywordName = jobTitleSynonyms[groupKey][0];
            jobTitleSynonymsText += '<div class="st-flex st-flex-closed st-synonyms" data-keyword="' + keywordName + '">';
            var synonymGroup = jobTitleSynonyms[groupKey];
            for (key in synonymGroup) {
                jobTitleSynonymsText += ['<span class="st-skill">', '<span class="st-skill-content">', synonymGroup[key], '</span>', '<span class="st-skill-remove-button">x</span>', '</span>'].join('');
            }
            jobTitleSynonymsText += ['<span class="st-skill st-skill-add">', '<span class="st-add-skill-text" data-placeholder="' + this.label.addJobTitle + '">' + this.label.addJobTitle + '</span>', '<span class="st-skill-add-button">+</span>', '</span>'].join('');
            jobTitleSynonymsText += '</div>';
        }
    } else {
        jobTitleSynonymsText += ['<div class="st-flex st-flex-closed st-synonyms">', '<span class="st-skill st-skill-add">', '<span class="st-add-skill-text" data-placeholder="' + this.label.addJobTitle + '">' + this.label.addJobTitle + '</span>', '<span class="st-skill-add-button">+</span>', '</span>', '</div>'].join('');
    }
    var keywordSynonymsText = '';
    if (keywordSynonyms.length > 0) {
        for (var groupKey in keywordSynonyms) {
            var keywordName = keywordSynonyms[groupKey][0];
            keywordSynonymsText += '<div class="st-flex st-flex-closed st-synonyms" data-keyword="' + keywordName + '">';
            var synonymGroup = keywordSynonyms[groupKey];
            for (var key in synonymGroup) {
                keywordSynonymsText += ['<span class="st-skill">', '<span class="st-skill-content">', synonymGroup[key], '</span>', '<span class="st-skill-remove-button">x</span>', '</span>'].join('');
            }
            keywordSynonymsText += ['<span class="st-skill st-skill-add">', '<span class="st-add-skill-text" data-placeholder="' + this.label.addKeyword + '">' + this.label.addKeyword + '</span>', '<span class="st-skill-add-button">+</span>', '</span>'].join('');
            keywordSynonymsText += '</div>';
        }
    } else {
        keywordSynonymsText += ['<div class="st-flex st-flex-closed st-synonyms">', '<span class="st-skill st-skill-add">', '<span class="st-add-skill-text" data-placeholder="' + this.label.addKeyword + '">' + this.label.addKeyword + '</span>', '<span class="st-skill-add-button">+</span>', '</span>', '</div>'].join('');
    }
    var locationsSynonymsText = '';
    for (key in locations) {
        var locationNameAndCodePattern = /(\S+(\s+\S+)*)(\[(.+)\])?/;
        var locationArray = locations[key].match(locationNameAndCodePattern);
        if (locationArray && locationArray.length >= 1) {
            locationsSynonymsText += ['<span class="st-skill">', '<span class="st-skill-content" data-li-id="' + key + '">', locationArray[1], '</span>', '<span class="st-skill-remove-button">x</span>', '</span>'].join('');
        }
    }
    var buttons = '';
    if (request.search && request.search.portals) {
        buttons = this.socialButtonsGenerator.getSocialButtons(user);
    }
    retval = retval.join('');
    retval = retval.replace('--**##JOB-TITLE-SYNONYMS##**--', jobTitleSynonymsText);
    retval = retval.replace('--**##KEYWORDS-SYNONYMS##**--', keywordSynonymsText);
    retval = retval.replace('--**##LOCATIONS-SYNONYMS##**--', locationsSynonymsText);
    retval = retval.replace('--**##BUTTONS##**--', buttons);
    this.popupManager.displayPopup(retval);
};
PopupLinkedInVSearchAdvancedClass.prototype.getVSearchJobTitleSynonyms = function (request) {
    var retArr = [];
    if (request.search && request.search.synonyms && request.search.synonyms.jobs) {
        var jobTitleSynonyms = request.search.synonyms.jobs;
        for (var index = 0; index < jobTitleSynonyms.length; index++) {
            var array = jobTitleSynonyms[index].split(',');
            for (var arrayIndex = 0; arrayIndex < array.length; arrayIndex++) {
                var entry = array[arrayIndex];
                if (entry === '') {
                    array.splice(arrayIndex, 1);
                }
            }
            retArr.push(array);
        }
    }
    return retArr;
};
PopupLinkedInVSearchAdvancedClass.prototype.getVSearchKeywordSynonyms = function (request) {
    var retArr = [];
    if (request.search && request.search.synonyms && request.search.synonyms.skills) {
        var keywordSynonyms = request.search.synonyms.skills;
        for (var index = 0; index < keywordSynonyms.length; index++) {
            var array = keywordSynonyms[index].split(',');
            for (var arrayIndex = 0; arrayIndex < array.length; arrayIndex++) {
                var entry = array[arrayIndex];
                if (entry === '') {
                    array.splice(arrayIndex, 1);
                }
            }
            retArr.push(array);
        }
    }
    return retArr;
};
PopupLinkedInVSearchAdvancedClass.prototype.getVSearchLocations = function (request) {
    var retArr = [];
    if (request.search && request.search.synonyms && request.search.synonyms.cities) {
        var citySynonyms = request.search.synonyms.cities;
        for (var index = 0; index < citySynonyms.length; index++) {
            var city = citySynonyms[index].split(',')[0];
            retArr.push(city);
        }
    }
    return retArr;
};
PopupLinkedInVSearchAdvancedClass.prototype.runTriggers = function () {
    var that = this;
    var advancedSearchButton = document.getElementById('advanced_search_button');
    advancedSearchButton.onclick = function () {
        that.sendActionOnPopupNotification({
            action: 'ButtonClick',
            elementType: this.textContent
        });
    };
    this.updatePortalLinksTrigger();
    this.tooltipsTrigger();
    var onToggleFlexButtonClick = function onToggleFlexButtonClick(button) {
        var boxLabel = button.closest('.st-form-group').querySelector('p');
        that.sendActionOnPopupNotification({
            action: 'FlexBoxToggle',
            elementType: boxLabel.textContent,
            valueBefore: button.textContent,
            valueAfter: button.closest('.st-back').querySelector('.st-toggle-flex-button.st-hidden').textContent
        });
        var buttonContainer = button.parentNode;
        var buttons = buttonContainer.getElementsByClassName('st-toggle-flex-button');
        for (var index = 0; index < buttons.length; index++) {
            buttons[index].classList.toggle('st-hidden');
        }
        var flexElements = buttonContainer.parentNode.getElementsByClassName('st-flex');
        for (var index = 0; index < flexElements.length; index++) {
            var flex = flexElements[index];
            flex.classList.toggle('st-flex-closed');
        }
    };
    var onFlexShowAllButtonClick = function onFlexShowAllButtonClick() {
        onToggleFlexButtonClick(this);
    };
    var onFlexShowLessButtonClick = function onFlexShowLessButtonClick() {
        onToggleFlexButtonClick(this);
        that.popupManager.scrollPopupDown();
    };
    var flexButtons = document.getElementsByClassName('st-toggle-flex-button');
    for (var index = 0; index < flexButtons.length; index++) {
        var button = flexButtons[index];
        if (button.classList.contains('st-flex-show-less-button')) {
            button.addEventListener('click', onFlexShowLessButtonClick);
        } else if (button.classList.contains('st-flex-show-all-button')) {
            button.addEventListener('click', onFlexShowAllButtonClick);
        }
    }
    var widget = new LinkedInWidgetAdvancedSynonymClass(this);
    widget.prepareAllSkillButtons();
    this.popupManager.setPopupScrollable();
    var locationInputArray = document.querySelectorAll('input.search-facet-input[name="facet.G"]');
    var onRecruiterLocationCheckboxChange = function onRecruiterLocationCheckboxChange() {
        var label = document.querySelector('label[for="' + this.id + '"]');
        var fullName = label.childNodes[0].data.split(',')[0].trim();
        var locationCode = this.value;
        if (this.checked) {
            that.addLocationFromRecruiterPage(fullName, locationCode, sessionStorage);
        } else {
            that.deleteLocationFromRecruiterPage(fullName, locationCode, sessionStorage);
        }
    };
    for (var index = 0; index < locationInputArray.length; index++) {
        var locationCheckbox = locationInputArray[index];
        locationCheckbox.addEventListener('change', onRecruiterLocationCheckboxChange);
    }
    this.socialButtonsGenerator.runTriggers();
    this.widgetCollection.header.setPopup(this);
    this.setupWidgetsEventHandlers();
};
PopupLinkedInVSearchAdvancedClass.prototype.addLocationFromRecruiterPage = function (fullName, locationCode, sessionStorage) {
    var query = this.popupManager.getUrlQuery(this.popupManager.currentURL);
    var key = 'locationAddedByRecruiterPage-' + query.searchHistoryId;
    var data = JSON.parse(sessionStorage.getItem(key));
    if (!data) {
        data = [];
    }
    data.push({
        fullName: fullName,
        locationCode: locationCode
    });
    sessionStorage.setItem(key, JSON.stringify(data));
};
PopupLinkedInVSearchAdvancedClass.prototype.deleteLocationFromRecruiterPage = function (fullName, locationCode, sessionStorage) {
    var query = this.popupManager.getUrlQuery(this.popupManager.currentURL);
    var key = 'locationAddedByRecruiterPage-' + query.searchHistoryId;
    var addedData = JSON.parse(sessionStorage.getItem(key));
    if (addedData) {
        for (var index = 0; index < addedData.length; index++) {
            if (addedData[index].fullName === fullName) {
                addedData.splice(index, 1);
                break;
            }
        }
        if (addedData.length === 0) {
            sessionStorage.removeItem(key);
        } else {
            sessionStorage.setItem(key, JSON.stringify(addedData));
        }
    }
    key = 'locationDeletedByRecruiterPage-' + query.searchHistoryId;
    var deletedData = JSON.parse(sessionStorage.getItem(key));
    if (!deletedData) {
        deletedData = [];
    }
    var isAlreadyDeleted = false;
    for (var index = 0; index < deletedData.length; index++) {
        if (deletedData[index].fullName === fullName) {
            isAlreadyDeleted = true;
            break;
        }
    }
    if (isAlreadyDeleted === false) {
        deletedData.push({
            fullName: fullName,
            locationCode: locationCode
        });
        sessionStorage.setItem(key, JSON.stringify(deletedData));
    }
};
PopupLinkedInVSearchAdvancedClass.prototype.updatePopup = function () {
    var that = this;
    this.popupManager.updatePopup = true;
    localStorage.setItem('last-popup', 'linkedinVSearchAdvanced');
    var currUrl = this.popupManager.currentURL;
    var params = this.popupManager.getUrlQuery(currUrl);
    if (params.stVSearchAdvancedLocation) {
        currUrl = currUrl.replace(/stVSearchAdvancedLocation=.*&/, '');
    }
    currUrl += "&stVSearchAdvancedLocation=" + this.getPopupLocations().join(',');
    var positionArray = this.getPopupJobTitles();
    var locationArray = this.getPopupLocations();
    var skillArray = this.getPopupKeywords();
    var mainButton = document.getElementById('st-vsearch-advanced-main-button');
    var advancedSearchButton = document.getElementById('advanced_search_button');
    var highlightSynonymInputs = function highlightSynonymInputs() {
        var synonymInputs = document.getElementsByClassName('st-skill-add');
        for (var index = 0; index < synonymInputs.length; index++) {
            var input = synonymInputs[index];
            input.classList.add('st-skill-duplicate');
            setTimeout(function (element) {
                element.classList.remove('st-skill-duplicate');
            }, 500, input);
        }
    };
    var isPopupEmpty = skillArray[0].length === 0 && positionArray[0].length === 0 && locationArray.length === 0;
    if (isPopupEmpty) {
        mainButton.classList.add('st-disabled');
        mainButton.onclick = function () {
            highlightSynonymInputs();
        };
        advancedSearchButton.classList.add('st-disabled');
        advancedSearchButton.onclick = function () {
            highlightSynonymInputs();
            return false;
        };
        document.getElementById('st-socials-container').classList.add('st-hidden');
    } else {
        mainButton.classList.remove('st-disabled');
        mainButton.onclick = function () {
            that.openMainLink();
        };
        advancedSearchButton.classList.remove('st-disabled');
        advancedSearchButton.onclick = function () {
            that.sendActionOnPopupNotification({
                action: 'ButtonClick',
                elementType: this.textContent
            });
        };
        document.getElementById('st-socials-container').classList.remove('st-hidden');
        this.popupManager.getBackendData({
            popup: "LinkedInVSearchAdvanced",
            command: "update-user-vsearch-advanced",
            url: currUrl,
            positions: positionArray,
            locations: locationArray.join(','),
            skills: skillArray,
            is_refined: 1,
            searchId: this.getLastSearchId()
        });
        var loader = new LinkedInWidgetPopupLoaderClass();
        loader.createSplash();
    }
};
PopupLinkedInVSearchAdvancedClass.prototype.isEqual = function (array1, array2) {
    if (array1.length !== array2.length) {
        return false;
    }
    for (var index = 0; index < array1.length; index++) {
        var a1 = array1[index];
        var a2 = array2[index];
        if (a1.length !== a2.length) {
            return false;
        }
        for (var secondDimensionIndex = 0; secondDimensionIndex < a1; secondDimensionIndex++) {
            if (a1[index] !== a2[index]) {
                return false;
            }
        }
    }
    return true;
};
PopupLinkedInVSearchAdvancedClass.prototype.getPopupJobTitles = function () {
    var retArr = [];
    var synonymGroups = document.getElementById('st-job-title-synonyms-container').getElementsByClassName('st-synonyms');
    if (synonymGroups) {
        for (var groupIndex = 0; groupIndex < synonymGroups.length; groupIndex++) {
            var array = [];
            var skills = synonymGroups[groupIndex].getElementsByClassName('st-skill-content');
            if (skills) {
                for (var index = 0; index < skills.length; index++) {
                    var skillContent = skills[index].textContent.trim();
                    if (skillContent) {
                        array.push(skillContent);
                    }
                }
            }
            retArr.push(array);
        }
    }
    return retArr;
};
PopupLinkedInVSearchAdvancedClass.prototype.getPopupKeywords = function () {
    var retArr = [];
    var synonymGroups = document.getElementById('st-keywords-synonyms-container').getElementsByClassName('st-synonyms');
    if (synonymGroups) {
        for (var groupIndex = 0; groupIndex < synonymGroups.length; groupIndex++) {
            var array = [];
            var skills = synonymGroups[groupIndex].getElementsByClassName('st-skill-content');
            if (skills) {
                for (var index = 0; index < skills.length; index++) {
                    var skillContent = skills[index].textContent.trim();
                    if (skillContent) {
                        array.push(skillContent);
                    }
                }
            }
            retArr.push(array);
        }
    }
    return retArr;
};
PopupLinkedInVSearchAdvancedClass.prototype.getPopupLocations = function () {
    var retArr = [];
    var skills = document.getElementsByClassName('st-location-synonyms')[0].getElementsByClassName('st-skill-content');
    if (skills && skills.length) {
        for (var index = 0; index < skills.length; index++) {
            var content = skills[index].textContent.trim();
            if (content) {
                retArr.push(content);
            }
        }
    }
    return retArr;
};
PopupLinkedInVSearchAdvancedClass.prototype.updatePortalLinks = function (request) {
    var result = {
        main: request.main,
        linkedin: request.linkedin,
        linkedinx: request.linkedinx,
        indeed: request.indeed,
        indeedErrorMessage: request.indeedErrorMessage,
        twitter: request.twitter,
        google: request.google,
        github: request.github,
        stackoverflow: request.stackoverflow,
        googlePlus: request.googlePlus,
        xing: request.xing,
        viadeo: request.viadeo,
        behance: request.behance,
        elance: request.elance,
        aboutme: request.aboutme,
        pinterest: request.pinterest,
        weibo: request.weibo,
        kaggle: request.kaggle,
        facebook: request.facebook
    };
    if (request.bullhorn) {
        result.bullhorn = {
            query: request.bullhorn.query,
            locations: request.bullhorn.locations,
            chromeExtFlag: request.bullhorn.chromeExtFlag
        };
    }
    return result;
};
PopupLinkedInVSearchAdvancedClass.prototype.openMainLink = function () {
    window.location = this.portalLinks.main + '&stSearchImproved=1';
};
PopupLinkedInVSearchAdvancedClass.prototype.updatePortalLinksTrigger = function () {
    var that = this;
    var sendActionOnPopupNotification = function sendActionOnPopupNotification(socialButtonName) {
        that.sendActionOnPopupNotification({
            action: 'SocialButtonClick',
            elementType: socialButtonName,
            searchId: that.getLastSearchId()
        });
    };
    var popupLink = document.getElementById('st-vsearch-advanced-main-button');
    if (popupLink) {
        popupLink.onclick = function () {
            that.unmuteAutomaticPopups();
            that.sendActionOnPopupNotification({
                action: 'SearchOnLinkedInButtonClick',
                searchId: that.getLastSearchId()
            });
            that.popupManager.getBackendData({
                'command': 'mark-popup-search-visible',
                'popup': 'LinkedInVSearchAdvanced',
                'openMainLink': true,
                'searchId': that.getLastSearchId()
            });
        };
    }
    var markPopupSearchVisible = function markPopupSearchVisible() {
        that.popupManager.getBackendData({
            'command': 'mark-popup-search-visible',
            'popup': 'LinkedInVSearchAdvanced',
            'searchId': that.getLastSearchId()
        });
    };
    var popupLink = document.getElementById('st-vsearch-advanced-linkedinx-button');
    if (popupLink) {
        popupLink.onclick = function () {
            if (that.socialButtonsGenerator.isDraggingEnabled()) {
                return;
            }
            sendActionOnPopupNotification('LinkedInX');
            markPopupSearchVisible();
            window.open(that.portalLinks.linkedinx, '_blank');
        };
    }
    var popupLink = document.getElementById('st-vsearch-advanced-indeed-button');
    if (popupLink) {
        if (that.portalLinks.indeed) {
            popupLink.classList.remove('indeed-icon-blocked');
            popupLink.removeAttribute('title');
            popupLink.onclick = function () {
                if (that.socialButtonsGenerator.isDraggingEnabled()) {
                    return;
                }
                sendActionOnPopupNotification('InDeed');
                markPopupSearchVisible();
                if (that.portalLinks.indeed) {
                    window.open(that.portalLinks.indeed, '_blank');
                }
            };
        } else {
            popupLink.classList.add('indeed-icon-blocked');
            popupLink.title = that.portalLinks.indeedErrorMessage;
        }
    }
    var popupLink = document.getElementById('st-vsearch-advanced-twitter-button');
    if (popupLink) {
        popupLink.onclick = function () {
            if (that.socialButtonsGenerator.isDraggingEnabled()) {
                return;
            }
            sendActionOnPopupNotification('Twitter');
            markPopupSearchVisible();
            window.open(that.portalLinks.twitter, '_blank');
        };
    }
    var popupLink = document.getElementById('st-vsearch-advanced-google-button');
    if (popupLink) {
        popupLink.onclick = function () {
            if (that.socialButtonsGenerator.isDraggingEnabled()) {
                return;
            }
            sendActionOnPopupNotification('Google');
            markPopupSearchVisible();
            window.open(that.portalLinks.google, '_blank');
        };
    }
    var popupLink = document.getElementById('st-vsearch-advanced-github-button');
    if (popupLink) {
        popupLink.onclick = function () {
            if (that.socialButtonsGenerator.isDraggingEnabled()) {
                return;
            }
            sendActionOnPopupNotification('GitHub');
            markPopupSearchVisible();
            window.open(that.portalLinks.github, '_blank');
        };
    }
    var popupLink = document.getElementById('st-vsearch-advanced-stackoverflow-button');
    if (popupLink) {
        popupLink.onclick = function () {
            if (that.socialButtonsGenerator.isDraggingEnabled()) {
                return;
            }
            sendActionOnPopupNotification('StackOverflow');
            markPopupSearchVisible();
            window.open(that.portalLinks.stackoverflow, '_blank');
        };
    }
    var popupLink = document.getElementById('st-vsearch-advanced-googleplus-button');
    if (popupLink) {
        popupLink.onclick = function () {
            if (that.socialButtonsGenerator.isDraggingEnabled()) {
                return;
            }
            sendActionOnPopupNotification('GooglePlus');
            markPopupSearchVisible();
            window.open(that.portalLinks.googlePlus, '_blank');
        };
    }
    var popupLink = document.getElementById('st-vsearch-advanced-xing-button');
    if (popupLink) {
        popupLink.onclick = function () {
            if (that.socialButtonsGenerator.isDraggingEnabled()) {
                return;
            }
            sendActionOnPopupNotification('Xing');
            markPopupSearchVisible();
            window.open(that.portalLinks.xing, '_blank');
        };
    }
    var popupLink = document.getElementById('st-vsearch-advanced-viadeo-button');
    if (popupLink) {
        popupLink.onclick = function () {
            if (that.socialButtonsGenerator.isDraggingEnabled()) {
                return;
            }
            sendActionOnPopupNotification('Viadeo');
            markPopupSearchVisible();
            window.open(that.portalLinks.viadeo, '_blank');
        };
    }
    var popupLink = document.getElementById('st-vsearch-advanced-behance-button');
    if (popupLink) {
        popupLink.onclick = function () {
            if (that.socialButtonsGenerator.isDraggingEnabled()) {
                return;
            }
            sendActionOnPopupNotification('Behance');
            markPopupSearchVisible();
            window.open(that.portalLinks.behance, '_blank');
        };
    }
    var popupLink = document.getElementById('st-vsearch-advanced-elance-button');
    if (popupLink) {
        popupLink.onclick = function () {
            if (that.socialButtonsGenerator.isDraggingEnabled()) {
                return;
            }
            sendActionOnPopupNotification('Elance');
            markPopupSearchVisible();
            window.open(that.portalLinks.elance, '_blank');
        };
    }
    var popupLink = document.getElementById('st-vsearch-advanced-aboutme-button');
    if (popupLink) {
        popupLink.onclick = function () {
            if (that.socialButtonsGenerator.isDraggingEnabled()) {
                return;
            }
            sendActionOnPopupNotification('AboutMe');
            markPopupSearchVisible();
            window.open(that.portalLinks.aboutme, '_blank');
        };
    }
    var popupLink = document.getElementById('st-vsearch-advanced-pinterest-button');
    if (popupLink) {
        popupLink.onclick = function () {
            if (that.socialButtonsGenerator.isDraggingEnabled()) {
                return;
            }
            sendActionOnPopupNotification('Pinterest');
            markPopupSearchVisible();
            window.open(that.portalLinks.pinterest, '_blank');
        };
    }
    var popupLink = document.getElementById('st-vsearch-advanced-weibo-button');
    if (popupLink) {
        popupLink.onclick = function () {
            if (that.socialButtonsGenerator.isDraggingEnabled()) {
                return;
            }
            sendActionOnPopupNotification('Weibo');
            markPopupSearchVisible();
            window.open(that.portalLinks.weibo, '_blank');
        };
    }
    var popupLink = document.getElementById('st-vsearch-advanced-kaggle-button');
    if (popupLink) {
        popupLink.onclick = function () {
            if (that.socialButtonsGenerator.isDraggingEnabled()) {
                return;
            }
            sendActionOnPopupNotification('Kaggle');
            markPopupSearchVisible();
            window.open(that.portalLinks.kaggle, '_blank');
        };
    }
    var popupLink = document.getElementById('st-vsearch-advanced-facebook-button');
    if (popupLink) {
        popupLink.onclick = function () {
            if (that.socialButtonsGenerator.isDraggingEnabled()) {
                return;
            }
            sendActionOnPopupNotification('Facebook');
            markPopupSearchVisible();
            window.open(that.portalLinks.facebook, '_blank');
        };
    }
    var popupLink = document.getElementById('st-vsearch-advanced-bullhorn-button');
    if (popupLink) {
        popupLink.onclick = function () {
            if (that.socialButtonsGenerator.isDraggingEnabled()) {
                return;
            }
            sendActionOnPopupNotification('Bullhorn');
            markPopupSearchVisible();
            that.popupManager.getBackendData({
                command: 'set-bullhorn-search',
                search: that.portalLinks.bullhorn.query,
                locations: that.getPopupLocations()
            });
            that.popupManager.getBackendData({
                command: 'get-bullhorn-url'
            }, function (bullhornUrl) {
                bullhornUrl += that.portalLinks.bullhorn.chromeExtFlag;
                window.open(bullhornUrl, '_blank');
            });
        };
    }
};
PopupLinkedInVSearchAdvancedClass.prototype.update = function (request) {
    if (request.searchId) {
        document.getElementById('advanced_search_button').href = this.popupManager.backendStuff.domainMentor + '/panel/labs/adv/?search_phrase=' + request.searchId;
    }
    this.portalLinks = this.updatePortalLinks(request);
    this.updatePortalLinksTrigger();
};
PopupLinkedInVSearchAdvancedClass.prototype.onShowPopup = function () {
    PopupLinkedInVSearchAbstractClass.prototype.onShowPopup.call(this);
    var formGroups = document.getElementsByClassName('st-form-group');
    for (var index = 0; index < formGroups.length; index++) {
        this.setupFlexToggleButton(formGroups[index], this.popupManager);
    }
};
PopupLinkedInVSearchAdvancedClass.prototype.setupFlexToggleButton = function (group, helper) {
    var flexToggleButton = group.getElementsByClassName('st-back')[0];
    var isLineBroken = false;
    var flexElements = group.getElementsByClassName('st-flex');
    for (var flexIndex = 0; flexIndex < flexElements.length; flexIndex++) {
        isLineBroken = isLineBroken || helper.isFlexLineBroken(flexElements[flexIndex].getElementsByClassName('st-skill'));
    }
    helper.setVisible(flexToggleButton, isLineBroken);
};
PopupLinkedInVSearchAdvancedClass.prototype.isDocumentReadyToPopupGeneration = function () {
    var path = new LinkedInPath(this.popupManager.currentURL);
    if (path.isRecruiterSearchNewPage()) {
        return this.recruiterParser.findSearchInfoElement() ? true : false;
    }
    return true;
};
PopupLinkedInVSearchAdvancedClass.prototype.sendSearchResultCountToBackend = function (searchId) {
    this.popupManager.getBackendData({
        popup: "LinkedInVSearchAdvanced",
        command: "update-linkedin-search-result-count",
        searchId: searchId,
        searchResultCount: this.findSearchResultCount(),
        noFeedback: true
    });
};
PopupLinkedInVSearchAdvancedClass.prototype.findSearchResultCount = function () {
    var count = 0;
    var path = new LinkedInPath(this.popupManager.currentURL);
    if (path.isLinkedInSearchPage()) {
        var counterElement = document.querySelector('#results_count .search-info p strong');
        if (counterElement) {
            var totalResults = parseInt(counterElement.innerHTML.replace(/&nbsp;|,/g, ''));
            if (totalResults >= 0) {
                count = totalResults;
            } else {
                count = document.querySelectorAll('.result.people').length;
            }
        }
    } else if (path.isRecruiterSearchPage()) {
        count = this.recruiterParser.findSearchResultCount();
    }
    return count;
};
PopupLinkedInVSearchAdvancedClass.prototype.setAdvancedSearchForcedByBackend = function (searchId) {
    sessionStorage.setItem('StAdvancedSearchLinkedInForcedByBackendSearchId', searchId);
};
PopupLinkedInVSearchAdvancedClass.prototype.isAdvancedPopupForcedByBackend = function () {
    return sessionStorage.getItem('StAdvancedSearchLinkedInForcedByBackendSearchId') === this.getLastSearchId();
};
'use strict';
function PopupLinkedInVSearchDefaultClass(popupManager) {
    this.popupManager = popupManager;
    this.isInstant = false;
}
PopupLinkedInVSearchDefaultClass.prototype = new PopupLinkedInVSearchAbstractClass();
PopupLinkedInVSearchDefaultClass.prototype.constructor = PopupLinkedInVSearchDefaultClass;
PopupLinkedInVSearchDefaultClass.prototype.isInitializationAllowed = function (url) {
    var path = new LinkedInPath(url);
    if (path.isLinkedInPage()) {
        return !/linkedin\.[a-z]{2,3}\/vsearch/i.test(url);
    }
    return true;
};
PopupLinkedInVSearchDefaultClass.prototype.setInstantPopup = function (isInstant) {
    this.isInstant = isInstant;
};
PopupLinkedInVSearchDefaultClass.prototype.isInstantPopup = function () {
    var path = new LinkedInPath(this.popupManager.currentURL);
    return !path.isRecruiterPage();
};
PopupLinkedInVSearchDefaultClass.prototype.match = function (url) {
    var query = this.popupManager.getUrlQuery(url);
    var linkedInPath = new LinkedInPath(url);
    if (linkedInPath.isLinkedInSearchPage() && !query.stSearchImproved) {
        return !this.isRegularFullAdvancedSearchBuiltByPage(query);
    } else if (linkedInPath.isRecruiterPage()) {
        if (linkedInPath.isRecruiterMainPage()) {
            return false;
        }
        this.recruiterParser = this.createParser();
        return !this.isRecruiterFullAdvancedSearchBuiltByPage();
    }
    return false;
};
PopupLinkedInVSearchDefaultClass.prototype.sendInitialRequest = function (url) {
    localStorage.setItem('last-popup', 'linkedinVSearchDefault');
    var requestData = {
        popup: "LinkedinVSearch",
        command: "analyze-url",
        url: url
    };
    var linkedInPath = new LinkedInPath(this.popupManager.currentURL);
    if (linkedInPath.isRecruiterSearchPage()) {
        var keywords = this.recruiterParser.findSearchKeywordsRawValue();
        if (keywords) {
            requestData.keywords = keywords;
        }
        var jobTitle = this.recruiterParser.findSearchJobTitleRawValue();
        if (jobTitle) {
            requestData.jobTitle = jobTitle;
        }
        var countryNames = this.findRecruiterSearchCountry();
        var countryCodes = this.findRecruiterSearchCountryCodes();
        if (countryNames.length > 0 && countryCodes.length > 0) {
            requestData.countryName = countryNames[0];
            requestData.countryCode = countryCodes[0];
        }
        var locationNames = this.findRecruiterSearchLocations();
        if (locationNames.length > 0) {
            requestData.locations = locationNames;
        }
    }
    this.popupManager.getBackendData(requestData);
};
PopupLinkedInVSearchDefaultClass.prototype.generate = function (backendData, showAllInputs) {
    var retval = '';
    retval += ['<div class="st-container">', this.widgetCollection.header.getOuterHTML(), '<div class="st-settings-box">', this.widgetCollection.popupSettings.getOuterHTML(), '</div>', '<div class="st-popup-content-box">', '<div class="st-body">', '<h3>' + __('ce-wp-default-search-popup-header') + '</h3>', '<form class="st-form" id="st-vsearch-form">', '<div class="st-box">', '--**##FIELDS##**--', '<div class="st-checkbox">', '<label>', '<input type="checkbox" id="st-use-our-synonyms-checkbox" checked /> ' + __('ce-wp-synonyms-checkbox-label'), '</label>', '<span class="st-tooltip-question" style="display: inline;" title="' + __('ce-wp-synonyms-checkbox-tooltip') + '">', '<a class="st-tip"><img src="' + chrome.extension.getURL('images/web-popups/icon-question-black.png') + '"></a>', '</span>', '</div>', '</div>', '<div class="st-form-actions">', '<div class="st-linkedin" style="display: inline-block;">', '<button id="st-improve-search-button">' + __('ce-wp-button-linkedin-search') + '</button>', '</div>', '</div>', '</form>', '</div>', '</div>', '</div>'].join('');
    var path = new LinkedInPath(this.popupManager.currentURL);
    var inputRequired = path.isLinkedInPage() ? ' required' : '';
    var fields = '';
    var fieldsCount = 0;
    if (backendData.showTitleField == 1 || showAllInputs) {
        fieldsCount++;
        fields += ['<div class="st-form-group">', '<label class="control-label">' + __('ce-wp-label-job-title') + '</label>', '<input type="text" name="title" value="" placeholder="' + __('ce-wp-placeholder-job-title') + '" id="st-title-input" class="st-required"' + inputRequired + ' />', '</div>'].join('');
    }
    if (backendData.showKeywordsField == 1 || showAllInputs) {
        fieldsCount++;
        fields += ['<div class="st-form-group">', '<label class="control-label">' + __('ce-wp-label-keywords') + '</label>', '<input type="text" name="keywords" value="" placeholder="' + __('ce-wp-placeholder-keywords') + '" id="st-keywords-input" class="st-required"' + inputRequired + ' />', '</div>'].join('');
    }
    if (backendData.showLocationField == 1 && fieldsCount < 2 || showAllInputs) {
        fields += ['<div class="st-form-group">', '<label class="control-label">' + __('ce-wp-label-location') + '</label>', '<span class="st-location-hint">(' + __('ce-wp-tip-location') + ')</span>', '<input type="text" name="location" value="" placeholder="' + __('ce-wp-placeholder-location') + '" id="st-location-input"' + inputRequired + ' />', '</div>'].join('');
    } else if (backendData.countrySearchData && backendData.countrySearchData.length > 0) {
        fields += ['<input type="hidden" name="countrySearchData" value="' + backendData.countrySearchData + '">'].join('');
    }
    retval = retval.replace('--**##FIELDS##**--', fields);
    this.popupManager.displayPopup(retval);
};
PopupLinkedInVSearchDefaultClass.prototype.runTriggers = function () {
    var that = this;
    var improveSearchPopupForm = document.getElementById('st-vsearch-form');
    if (improveSearchPopupForm) {
        var path = new LinkedInPath(that.popupManager.currentURL);
        var submitSearchRequest = function submitSearchRequest() {
            that.unmuteAutomaticPopups();
            var formParser = new LinkedInFormParserImproveSearchClass(that.recruiterParser, path);
            formParser.parse(improveSearchPopupForm);
            that.popupManager.getBackendData({
                popup: "LinkedinVSearch",
                command: "set-url-synonymous",
                useSynonyms: formParser.isUseSynonymsAllowed(),
                url: formParser.getUrl()
            });
        };
        var improveSearchButton = improveSearchPopupForm.querySelector('#st-improve-search-button');
        if (improveSearchButton) {
            improveSearchButton.onclick = function () {
                if (path.isLinkedInPage()) {
                    return;
                }
                var inputNodeList = improveSearchPopupForm.querySelectorAll('.st-form-group input.st-required');
                var isFormFilled = false;
                for (var index = 0; index < inputNodeList.length; index++) {
                    var inputValue = inputNodeList[index].value;
                    isFormFilled = inputValue.length > 0;
                    if (isFormFilled) {
                        break;
                    }
                }
                console.log(isFormFilled);
                for (var index = 0; index < inputNodeList.length; index++) {
                    inputNodeList[index].required = !isFormFilled;
                }
                if (isFormFilled) {
                    submitSearchRequest();
                }
            };
        }
        improveSearchPopupForm.onsubmit = function () {
            if (path.isLinkedInPage()) {
                submitSearchRequest();
            }
            return false;
        };
    }
    this.tooltipsTrigger();
    this.popupManager.setPopupScrollable();
    this.widgetCollection.header.setPopup(this);
    this.setupWidgetsEventHandlers();
};
'use strict';
function PopupManagerClass(isBackendInetractionDisabled) {
    this.portalLinkClickArray = [];
    if (isBackendInetractionDisabled) {
        return;
    }
    var latoFontLink = document.createElement('link');
    latoFontLink.href = '//fonts.googleapis.com/css?family=Lato:300,400,700';
    latoFontLink.rel = 'stylesheet';
    latoFontLink.type = 'text/css';
    document.getElementsByTagName('head')[0].appendChild(latoFontLink);
    var container = document.createElement('div');
    container.id = 'st-popup-container';
    container.className = 'st-hidden';
    document.body.appendChild(container);
    this.mentorUserId = false;
    var that = this;
    this.getBackendData({
        command: 'get-backend-stuff'
    }, function (backendData) {
        that.mentorUserId = backendData.mentorUserId;
        that.backendStuff = backendData;
    });
    this.recruiterUrlPattern = /linkedin\.[a-z]{2,3}\/recruiter\/(analytics|search)/;
    this.popupSettingsModel;
    this.urlHistory = new UrlHistory();
}
PopupManagerClass.prototype.setInterval = function () {
    var that = this;
    this.currentURL = null;
    setInterval(function () {
        if (that.currentURL === document.URL) {
            return;
        }
        var isReinitializationAllowed = document.URL.match(that.recruiterUrlPattern) ?
        !!document.querySelector('div.search-results-facets-wrapper')
        : that.urlHistory.isLinkedInProfilePageChanged(document.URL);
        that.currentURL = document.URL;
        that.urlHistory.addUrl(that.currentURL);
        if (isReinitializationAllowed) {
            that.uninitialize();
            that.initialize();
        }
    }, 500);
};
PopupManagerClass.prototype.setAutomaticPopupsAllowed = function (isAllowed) {
    this.popupSettingsModel.setStopPopOutAllowed(!isAllowed);
};
PopupManagerClass.prototype.initialize = function () {
    var that = this;
    this.createPopups();
    this.popupSettingsModel = new PopupSettingsModel();
    this.popupSettingsModel.reload(function (model) {
        that.initializePopup(that.getCurrentPopup(), model);
    });
};
PopupManagerClass.prototype.createPopups = function () {
    this.popupMinimized = new PopupMinimizedClass(this);
    this.popupLinkedInVSearchDefault = new PopupLinkedInVSearchDefaultClass(this);
    this.popupLinkedInPeopleLikeThis = new PopupLinkedInPeopleLikeThisClass(this);
    this.popupLinkedInVSearchAdvanced = new PopupLinkedInVSearchAdvancedClass(this);
};
PopupManagerClass.prototype.initializePopup = function (popup, popupSettingsModel) {
    if (!popup.isInitializationAllowed(this.currentURL)) {
        return;
    }
    popup.setPopupSettingsModel(popupSettingsModel);
    if (popup.isInstantPopup()) {
        if (popupSettingsModel.isPopupForAllPagesAllowed() || popupSettingsModel.isPopupForLinkedInAllowed() && this.urlHistory.getCurrentLinkedInPath().isLinkedInPage()) {
            var query = this.getUrlQuery(this.currentURL);
            this.minimizePopup(query['stResetSearch'] != 'true');
            popup.generate({}, true);
            popup.runTriggers();
        }
    } else {
        if (popupSettingsModel.isPopupForLinkedInAllowed() || popupSettingsModel.isPopupForAllPagesAllowed()) {
            popup.sendInitialRequest(this.currentURL);
        }
    }
    popup.setBaseUrl(this.backendStuff.domainMentor);
    this.getBackendData({
        command: 'get-user-role'
    }, function (roleData) {
        popup.setUserRole(new UserRoleClass(roleData.roleNames));
    });
};
PopupManagerClass.prototype.setPopupScrollable = function () {
    document.getElementById('st-popup-container').onwheel = function (e) {
        var delta = -e.wheelDelta;
        var bottomEdge = this.offsetTop + document.getElementsByClassName('st-container')[0].offsetHeight;
        var windowHeight = window.innerHeight;
        var val = parseInt(this.style.top);
        var margin = {
            top: 33,
            bottom: 20
        };
        var minimalHeight = windowHeight - margin.top - margin.bottom;
        if (isNaN(val)) {
            val = margin.top;
        }
        var topPosition = val;
        if (this.offsetHeight > minimalHeight) {
            if (delta > 0) {
                if (bottomEdge - delta < windowHeight) {
                    topPosition = window.innerHeight - this.offsetHeight;
                } else {
                    topPosition += e.wheelDelta;
                }
            }
            else if (delta < 0) {
                    if (val - delta > margin.top) {
                        topPosition = margin.top;
                    } else {
                        topPosition += e.wheelDelta;
                    }
                }
        }
        this.style.top = topPosition + 'px';
        e.preventDefault();
    };
};
PopupManagerClass.prototype.scrollPopupDown = function () {
    var popupContainer = document.getElementById('st-popup-container');
    var bottomEdge = popupContainer.offsetTop + document.getElementsByClassName('st-container')[0].offsetHeight;
    if (bottomEdge < window.innerHeight * 0.5) {
        popupContainer.style.top = 33 + 'px';
    }
};
PopupManagerClass.prototype.minimizePopup = function (minimized) {
    var container = document.getElementById('st-popup-container');
    if (container.classList.contains('st-hidden') == minimized && document.getElementById('st-ninja-prompt-button').classList.contains('st-hidden') != minimized) {
        return;
    }
    if (minimized == true) {
        container.classList.add('st-hidden');
        this.popupMinimized.show();
    } else {
        container.classList.remove('st-hidden');
        this.popupMinimized.hide();
        var currentPopup = this.getCurrentPopup();
        if (currentPopup) {
            currentPopup.onShowPopup();
        }
    }
};
PopupManagerClass.prototype.displayPopup = function (content) {
    document.getElementById('st-popup-container').innerHTML = content;
};
PopupManagerClass.prototype.uninitialize = function () {
    var ninjaButton = document.getElementById('st-ninja-prompt-button');
    if (ninjaButton) {
        ninjaButton.parentNode.removeChild(ninjaButton);
    }
    this.closePopup();
};
PopupManagerClass.prototype.canShowPopup = function () {
    var settingsModel = this.getCurrentPopup().getPopupSettingsModel();
    if (settingsModel) {
        return !settingsModel.isStopPopupAllowed();
    }
    return true;
};
PopupManagerClass.prototype.closePopup = function () {
    var container = document.getElementById('st-popup-container');
    container.className = 'st-hidden';
};
PopupManagerClass.prototype.redirect = function (url) {
    chrome.runtime.sendMessage({
        command: 'redirect',
        url: url,
        openNewTab: false === /(\S+\.)*linkedin\.com\//i.test(this.currentURL)
    });
};
PopupManagerClass.prototype.getUrlQuery = function (queryString) {
    var vars = [],
        hash;
    var hashes = queryString.slice(queryString.indexOf('?') + 1).split('&');
    for (var i = 0; i < hashes.length; i++) {
        hash = hashes[i].split('=');
        vars[hash[0]] = hash[1];
    }
    return vars;
};
PopupManagerClass.prototype.buildUrlQuery = function (obj, encode) {
    var str = [];
    for (var p in obj) {
        if (obj.hasOwnProperty(p)) {
            if (encode) {
                str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
            } else str.push(p + "=" + obj[p]);
        }
    }
    return str.join("&");
};
PopupManagerClass.prototype.getBackendData = function (requestData, callback) {
    chrome.runtime.sendMessage(requestData, callback);
};
PopupManagerClass.prototype.getCurrentPopup = function () {
    if (this.popupLinkedInVSearchAdvanced.match(this.currentURL)) {
        return this.popupLinkedInVSearchAdvanced;
    } else if (this.popupLinkedInPeopleLikeThis.match(this.currentURL)) {
        return this.popupLinkedInPeopleLikeThis;
    } else {
        this.popupLinkedInVSearchDefault.setInstantPopup(!this.popupLinkedInVSearchDefault.match(this.currentURL));
        return this.popupLinkedInVSearchDefault;
    }
};
PopupManagerClass.prototype.isFlexLineBroken = function (elements) {
    var isLineBroken = false;
    if (!elements || elements.length <= 0) {
        return isLineBroken;
    }
    var firstRowOffsetTop = elements[0].offsetTop;
    for (var index = 0; index < elements.length; index++) {
        if (!isLineBroken && elements[index].offsetTop > firstRowOffsetTop) {
            isLineBroken = true;
        }
    }
    return isLineBroken;
};
PopupManagerClass.prototype.setVisible = function (element, isVisible) {
    if (isVisible) {
        element.classList.remove('st-hidden');
    } else {
        element.classList.add('st-hidden');
    }
};
PopupManagerClass.prototype.removeClass = function (node, cls) {
    if (node && node.className && node.className.indexOf(cls) >= 0) {
        var pattern = new RegExp('\\s*' + cls + '\\s*');
        node.className = node.className.replace(pattern, ' ');
    }
};
PopupManagerClass.prototype.getLinkedInMemberId = function () {
    var executor = function executor(resolve, reject) {
        resolve('');
    };
    var recruiterUrlRegExp = /recruiter\/profile\/(\d+)/;
    var match = recruiterUrlRegExp.exec(document.location.href);
    if (match) {
        executor = function executor(resolve, reject) {
            resolve(match[1]);
        };
        return new Promise(executor);
    }
    var memberIdRegExp = /LI\.Profile\.data\s*=\s*\{\s*.*\s*(memberId\s*:\s*\"([0-9]+)\")\s*\};/mg;
    var scripts = document.getElementsByTagName('script');
    for (var index = 0; index < scripts.length; index++) {
        if (scripts[index].childNodes.length > 0) {
            var code = scripts[index].childNodes[0].wholeText;
            var match = memberIdRegExp.exec(code);
            if (match) {
                executor = function executor(resolve, reject) {
                    resolve(match[2]);
                };
                return new Promise(executor);
            }
        }
    }
    var parser = new LinkedInPageProfileDomParser(new LinkedInPath(this.currentURL));
    return parser.findLinkedInMemberId();
};
PopupManagerClass.prototype.playSound = function () {
    var myAudio = new Audio();
    myAudio.src = this.backendStuff.domainMentor + "/sounds/blob.wav";
    myAudio.play();
};
PopupManagerClass.prototype.queuePortalLinkClick = function (actionData) {
    this.portalLinkClickArray.push(actionData);
};
PopupManagerClass.prototype.sendPortalLinkClick = function (searchId) {
    if (this.portalLinkClickArray.length === 0) {
        return;
    }
    var clickAction = this.portalLinkClickArray.shift();
    clickAction.searchId = searchId;
    this.getBackendData(clickAction);
};
'use strict';
function LinkedInWidgetPopupLoaderClass() {
    this.splashElement;
}
LinkedInWidgetPopupLoaderClass.prototype.createSplash = function () {
    this.splashElement = document.createElement('div');
    this.splashElement.id = 'st-glow';
    this.splashElement.className = 'spinkit-loader';
    var popupContainerElement = document.querySelector('#st-popup-container .st-container');
    popupContainerElement.appendChild(this.splashElement);
    this.splashElement.innerHTML = ['<div class="sk-double-bounce">', '<div class="sk-child sk-double-bounce1"></div>', '<div class="sk-child sk-double-bounce2"></div>', '</div>'].join('');
    this.splashElement.style.display = 'none';
    $(this.splashElement).fadeIn(50);
    return this.splashElement;
};
LinkedInWidgetPopupLoaderClass.prototype.removeSplash = function () {
    var element = this.splashElement || document.querySelector('#st-glow');
    if (element) {
        $(element).fadeOut(50, function () {
            element.parentNode.removeChild(element);
        });
    }
};
'use strict';
var commonManager = new CommonManagerClass(2000);
var popupManager = new PopupManagerClass();
popupManager.getBackendData({
    command: 'mentor-check-permissions'
}, function (backendData) {
    commonManager.sendHarvesterRequest();
    commonManager.sendIftttRequest();
    commonManager.setupSpaInterval();
    if (backendData.isRecruitEnabled === true) {
        popupManager.setInterval();
    }
});
chrome.runtime.onMessage.addListener(function chromeMessageListener(message, sender, sendResponse) {
    var request = message.data;
    if (request === undefined) {
        request = message;
    }
    if (request.command == 'rabbit-response') {
        switch (request.name) {
            case 'linkedinVSearch':
                {
                    switch (request.action) {
                        case 'analyze-url':
                            {
                                var showAllInputs = !request.showPopup;
                                window.popupManager.popupLinkedInVSearchDefault.generate(request, showAllInputs);
                                window.popupManager.popupLinkedInVSearchDefault.runTriggers();
                                if (showAllInputs) {
                                    if (request.keywords) {
                                        document.getElementById('st-keywords-input').value = request.keywords;
                                    }
                                    if (request.title) {
                                        document.getElementById('st-title-input').value = request.title;
                                    }
                                    if (request.location) {
                                        document.getElementById('st-location-input').value = request.location;
                                    }
                                }
                                var query = window.popupManager.getUrlQuery(window.popupManager.currentURL);
                                var isShowPopupRequested = request.showPopup == true || query['stResetSearch'] === 'true';
                                if (window.popupManager.canShowPopup() && isShowPopupRequested) {
                                    window.popupManager.minimizePopup(false);
                                } else {
                                    if (request.showMinimized == true) {
                                        window.popupManager.minimizePopup(true);
                                    } else {
                                        window.popupManager.closePopup();
                                    }
                                }
                            }
                            break;
                        case 'set-url-synonymous':
                            {
                                var fixer = new LinkedInUrlFixerClass(request.url);
                                var url = fixer.fixLocations();
                                var query = window.popupManager.getUrlQuery(url);
                                if (query.stLastSearch) {
                                    window.popupManager.popupLinkedInVSearchAdvanced.setLastSearchId(query.stLastSearch);
                                    if (query.stSearchImproved && query.keywordsWasClearedByExtension) {
                                        window.popupManager.popupLinkedInVSearchAdvanced.setAdvancedSearchForcedByBackend(query.stLastSearch);
                                    }
                                }
                                window.popupManager.redirect(url);
                            }
                            break;
                    }
                }
                break;
            case 'peopleLikeThis':
                {
                    switch (request.action) {
                        case 'analyze-url':
                            {
                                var loader = new LinkedInWidgetPopupLoaderClass();
                                var fixer = new LinkedInUrlFixerClass(request.mainUrl);
                                request.mainUrl = fixer.fixLocations();
                                window.popupManager.popupLinkedInPeopleLikeThis.setPeopleLikeThisSearchId(request.searchId);
                                if (window.popupManager.updatePopup == 1) {
                                    window.popupManager.updatePopup = 0;
                                    loader.removeSplash();
                                    window.popupManager.popupLinkedInPeopleLikeThis.update(request);
                                }
                                else {
                                        loader.removeSplash();
                                        window.popupManager.closePopup();
                                        window.popupManager.popupLinkedInPeopleLikeThis.generate(request, message.user).then(function () {
                                            window.popupManager.popupLinkedInPeopleLikeThis.runTriggers();
                                            var isShowPopupAllowed = window.popupManager.canShowPopup() && request.profile_visited.length > 0;
                                            if (isShowPopupAllowed) {
                                                window.popupManager.playSound();
                                            }
                                            window.popupManager.minimizePopup(!isShowPopupAllowed);
                                        });
                                    }
                            }
                            break;
                    }
                }
                break;
            case 'linkedinVSearchAdvanced':
                {
                    if (request.search && request.search.portals && request.search.portals.linkedin) {
                        var fixer = new LinkedInUrlFixerClass(request.search.portals.linkedin);
                        request.search.portals.linkedin = fixer.fixLocations();
                        request.search.portals.main = request.search.portals.linkedin;
                    }
                    switch (request.action) {
                        case 'get-last-user-vsearch-default':
                        case 'get-last-user-people-like-this':
                        case 'get-last-user-vsearch-advanced':
                        case 'get-search-by-id':
                        case 'analyze-url':
                        case 'create-advanced-search':
                            {
                                window.popupManager.closePopup();
                                window.popupManager.popupLinkedInVSearchAdvanced.setLastSearchId(request.searchId);
                                var generatePopupIntervalId = setInterval(function () {
                                    if (window.popupManager.popupLinkedInVSearchAdvanced.isDocumentReadyToPopupGeneration() === false) {
                                        return;
                                    }
                                    clearInterval(generatePopupIntervalId);
                                    window.popupManager.popupLinkedInVSearchAdvanced.generate(request, message.user);
                                    window.popupManager.popupLinkedInVSearchAdvanced.runTriggers();
                                    if (window.popupManager.canShowPopup() && window.popupManager.popupLinkedInVSearchAdvanced.canShowPopup(request, sessionStorage) && window.popupManager.popupLinkedInVSearchAdvanced.isFullAdvancedSearchBuiltByExtension()
                                    ) {
                                            window.popupManager.minimizePopup(false);
                                        } else {
                                        window.popupManager.minimizePopup(true);
                                    }
                                    if (window.popupManager.popupLinkedInVSearchAdvanced.getLastSearchId()) {
                                        window.popupManager.popupLinkedInVSearchAdvanced.sendSearchResultCountToBackend(window.popupManager.popupLinkedInVSearchAdvanced.getLastSearchId());
                                    }
                                }, 300);
                            }
                            break;
                        case 'update-user-vsearch-advanced':
                            {
                                var loader = new LinkedInWidgetPopupLoaderClass();
                                loader.removeSplash();
                                window.popupManager.popupLinkedInVSearchAdvanced.setLastSearchId(request.searchId);
                                window.popupManager.popupLinkedInVSearchAdvanced.update(request.search.portals);
                                if (window.popupManager.popupLinkedInVSearchAdvanced.isRecruiterPage(window.popupManager.currentURL)) {
                                    if (window.popupManager.canShowPopup() && window.popupManager.popupLinkedInVSearchAdvanced.isFullAdvancedSearchBuiltByExtension()) {
                                        window.popupManager.minimizePopup(false);
                                    } else {
                                        window.popupManager.minimizePopup(true);
                                    }
                                } else {
                                    if (window.popupManager.canShowPopup()) {
                                        window.popupManager.minimizePopup(false);
                                    } else {
                                        window.popupManager.minimizePopup(true);
                                    }
                                }
                            }
                            break;
                    }
                }
                break;
        }
    } else if (request.command == 'mark-popup-search-visible') {
        switch (request.popup) {
            case 'LinkedInVSearchAdvanced':
            case 'peopleLikeThis':
                {
                    var searchId = request.newSearchId || request.searchId;
                    if (!searchId) {
                        var popup = window.popupManager.getCurrentPopup();
                        if (popup) {
                            searchId = popup.getLastSearchId();
                        }
                    }
                    window.popupManager.sendPortalLinkClick(searchId);
                }
                break;
        }
        switch (request.popup) {
            case 'LinkedInVSearchAdvanced':
                {
                    if (request.newSearchId) {
                        window.popupManager.popupLinkedInVSearchAdvanced.setLastSearchId(request.newSearchId);
                    }
                    if (request.openMainLink) {
                        window.popupManager.popupLinkedInVSearchAdvanced.openMainLink();
                    }
                }
                break;
            case 'peopleLikeThis':
                {
                    if (request.newSearchId) {
                        window.popupManager.popupLinkedInPeopleLikeThis.setPeopleLikeThisSearchId(request.newSearchId);
                        window.popupManager.popupLinkedInPeopleLikeThis.setLastSearchId(request.newSearchId);
                    }
                    if (request.openMainLink) {
                        window.open(window.popupManager.popupLinkedInPeopleLikeThis.portalLinks.main + '&stSearchImproved=1&stVSearchAdvancedLocation=' + window.strip_tags(document.getElementById('st-location-span').innerHTML), '_blank');
                    }
                }
                break;
        }
    }
});
"use strict";
function BullhornPathClass(url) {
  this.url = url;
  this.corePathRegExp = /https:\/\/[a-z0-9]*\.bullhornstaffing\.com\//i;
  this.loginPathRegExp = /^https:\/\/[a-z0-9]*\.bullhornstaffing\.com\/BullhornStaffing\/BHLogin\.cfm|^https:\/\/[a-z0-9]*\.bullhornstaffing\.com\/?$/i;
}
BullhornPathClass.prototype.isBullhornPage = function () {
  return this.corePathRegExp.test(this.url);
};
BullhornPathClass.prototype.isLoginPage = function () {
  return this.loginPathRegExp.test(this.url);
};
BullhornPathClass.prototype.isApplicationPage = function () {
  return this.isBullhornPage() && !this.isLoginPage();
};
'use strict';
function BullhornScriptInjectorClass(code) {
  this.code = code;
};
BullhornScriptInjectorClass.prototype.injectToDocument = function (document) {
  var script = document.createElement('script');
  script.classList.add('st-script');
  script.appendChild(document.createTextNode(this.code));
  document.querySelector('body').appendChild(script);
};
'use strict';
function BullhornSearchControllerClass() {
    this.isSearchStarted = false;
    this.isSearchSet = false;
    this.view;
    this.model;
}
BullhornSearchControllerClass.prototype.isReady = function () {
    return this.isSearchStarted && this.view && this.view.isDomReady() ? true : false;
};
BullhornSearchControllerClass.prototype.isReadyToExecuteSearch = function () {
    return this.isReady() && this.isSearchSet ? true : false;
};
BullhornSearchControllerClass.prototype.search = function (query, locations) {
    if (this.isSearchStarted) {
        return;
    }
    if (sessionStorage.getItem('stBullhornSearchFinished') === 'true') {
        return;
    }
    this.isSearchStarted = true;
    this.view = new BullhornSearchViewClass();
    this.model = new BullhornSearchModelClass();
    this.model.setTargetSearch(query);
    this.model.setSearchLocations(locations);
    if (this.view.isMenuOpen()) {
        this.model.setCurrentState('MENU_OPEN');
    } else {
        this.model.setCurrentState('OPENING_MENU');
    }
    var that = this;
    var searchIntervalId = setInterval(function () {
        that.runSearchEventLoop(searchIntervalId);
    }, 600);
};
BullhornSearchControllerClass.prototype.runSearchEventLoop = function (searchIntervalId) {
    var currentPath = new BullhornPathClass(document.URL);
    if (currentPath.isLoginPage()) {
        return;
    }
    if (!currentPath.isBullhornPage()) {
        clearInterval(searchIntervalId);
        this.view.removeSplash();
        return;
    }
    if (!currentPath.isApplicationPage() || !this.view.isApplicationPage()) {
        return;
    }
    this.setLastAuthenticatedLocation(window.location);
    this.doNextStep();
    if (this.model.getCurrentState() === 'FINAL') {
        sessionStorage.setItem('stBullhornSearchFinished', 'true');
        clearInterval(searchIntervalId);
        this.view.removeSplash();
    }
};
BullhornSearchControllerClass.prototype.setLastAuthenticatedLocation = function (location) {
    chrome.runtime.sendMessage({
        command: 'set-bullhorn-url',
        url: location.origin + location.pathname
    });
};
BullhornSearchControllerClass.prototype.doNextStep = function () {
    switch (this.model.getCurrentState()) {
        case 'OPENING_MENU':
            {
                this.model.setCurrentState('MENU_OPEN');
            }
            break;
        case 'MENU_OPEN':
            {
                this.view.addSplash();
                this.model.setCurrentState('OPENING_CANDIDATE_LIST');
            }
            break;
        case 'OPENING_CANDIDATE_LIST':
            {
                if (this.view.isCandidatesListTabExists()) {
                    this.model.setCurrentState('CANDIDATE_LIST_OPEN');
                } else {
                    this.view.openCandidates();
                }
            }
            break;
        case 'CANDIDATE_LIST_OPEN':
            {
                this.model.setCurrentState('OPENING_SEARCH_MODAL');
            }
            break;
        case 'OPENING_SEARCH_MODAL':
            {
                this.view.openSearchModalWindow();
                this.model.setCurrentState('SEARCH_MODAL_OPEN');
            }
            break;
        case 'SEARCH_MODAL_OPEN':
            this.model.setCurrentState('SETTING_ADVANCED_MODE');
            break;
        case 'SETTING_ADVANCED_MODE':
            {
                if (this.view.isAdvancedModeEnabled()) {
                    this.model.setCurrentState('ADVANCED_MODE_SET');
                } else {
                    this.view.setAdvancedModeEnabled();
                }
            }
            break;
        case 'ADVANCED_MODE_SET':
            this.model.setCurrentState('SETTING_SEARCH_VALUE');
            break;
        case 'SETTING_SEARCH_VALUE':
            {
                var that = this;
                setTimeout(function () {
                    that.view.setSearch(that.model.getTargetSearch());
                    that.isSearchSet = true;
                }, 500);
                this.model.setCurrentState('SEARCH_VALUE_SET');
                if (this.isReadyToExecuteSearch()) {
                    this.model.setCurrentState('EXECUTING_SEARCH');
                }
            }
            break;
        case 'SEARCH_VALUE_SET':
            {
                this.view.setCriteriaCount(this.model.getCriteriaCount());
                var nextState = this.model.getSearchLocations().length > 0 ? 'SETTING_LOCATIONS' : 'LOCATIONS_SET';
                this.model.setCurrentState(nextState);
            }
            break;
        case 'SETTING_LOCATIONS':
            {
                this.model.setCurrentCriterionIndex(0);
                this.model.setCurrentState('SETTING_LOCATIONS_OPENING_FIELD_DROPDOWN');
            }
            break;
        case 'SETTING_LOCATIONS_OPENING_FIELD_DROPDOWN':
            {
                if (this.view.getCriterionFieldName(this.model.getCurrentCriterionIndex()) === 'Address') {
                    this.model.setCurrentState('SETTING_LOCATIONS_OPENING_OPERATOR_DROPDOWN');
                } else {
                    this.view.openCriteriaFieldPicker(this.model.getCurrentCriterionIndex());
                    this.model.setCurrentState('SETTING_LOCATIONS_SETTING_CRITERION_FIELD');
                }
            }
            break;
        case 'SETTING_LOCATIONS_SETTING_CRITERION_FIELD':
            {
                this.view.setCriterionField(this.model.getCurrentCriterionIndex(), 'Address');
                this.model.setCurrentState('SETTING_LOCATIONS_OPENING_OPERATOR_DROPDOWN');
            }
            break;
        case 'SETTING_LOCATIONS_OPENING_OPERATOR_DROPDOWN':
            {
                this.view.openOperatorPicker(this.model.getCurrentCriterionIndex());
                this.model.setCurrentState('SETTING_LOCATIONS_SETTING_CRITERION_OPERATOR');
            }
            break;
        case 'SETTING_LOCATIONS_SETTING_CRITERION_OPERATOR':
            {
                this.view.setCriterionOperator(this.model.getCurrentCriterionIndex(), 'Radius');
                this.model.setCurrentState('SETTING_LOCATIONS_OPENING_RADIUS_DROPDOWN');
            }
            break;
        case 'SETTING_LOCATIONS_OPENING_RADIUS_DROPDOWN':
            {
                this.view.openRadiusPicker();
                this.model.setCurrentState('SETTING_LOCATIONS_SETTING_CRITERION_RADIUS');
            }
            break;
        case 'SETTING_LOCATIONS_SETTING_CRITERION_RADIUS':
            {
                this.view.setCriterionRadius('50 Miles');
                this.model.setCurrentState('SETTING_LOCATIONS_OPENING_CRITERION_VALUE');
            }
            break;
        case 'SETTING_LOCATIONS_OPENING_CRITERION_VALUE':
            {
                this.view.openAvailableLocations(this.model.getSearchLocations()[0]);
                this.model.setCurrentState('SETTING_LOCATIONS_SETTING_ENTRY');
            }
            break;
        case 'SETTING_LOCATIONS_SETTING_ENTRY':
            {
                this.view.selectLocation();
                this.model.setCurrentState('LOCATIONS_SET');
            }
            break;
        case 'LOCATIONS_SET':
            {
                this.model.setCurrentState('EXECUTING_SEARCH');
            }
            break;
        case 'EXECUTING_SEARCH':
            {
                if (!this.isSearchExecuting) {
                    this.isSearchExecuting = true;
                    var that = this;
                    setTimeout(function () {
                        if (that.view.executeSearch()) {
                            that.model.setCurrentState('SEARCH_EXECUTED');
                        }
                    }, 1200);
                }
            }
            break;
        case 'SEARCH_EXECUTED':
            {
                this.model.setCurrentState('FINAL');
            }
            break;
        case 'FINAL':
        default:
            {
                console.log('unnecessary doNextStep() function call');
            }
            break;
    }
};
'use strict';
function BullhornSearchModelClass() {
  this.availableStates = ['INITIAL', 'OPENING_MENU', 'MENU_OPEN', 'OPENING_CANDIDATE_LIST', 'CANDIDATE_LIST_OPEN', 'OPENING_SEARCH_MODAL', 'SEARCH_MODAL_OPEN', 'SETTING_ADVANCED_MODE', 'ADVANCED_MODE_SET', 'SETTING_SEARCH_VALUE', 'SEARCH_VALUE_SET', 'SETTING_LOCATIONS', 'SETTING_LOCATIONS_OPENING_FIELD_DROPDOWN', 'SETTING_LOCATIONS_SETTING_CRITERION_FIELD', 'SETTING_LOCATIONS_OPENING_OPERATOR_DROPDOWN', 'SETTING_LOCATIONS_SETTING_CRITERION_OPERATOR', 'SETTING_LOCATIONS_OPENING_RADIUS_DROPDOWN', 'SETTING_LOCATIONS_SETTING_CRITERION_RADIUS', 'SETTING_LOCATIONS_OPENING_CRITERION_VALUE', 'SETTING_LOCATIONS_SETTING_ENTRY', 'LOCATIONS_SET', 'EXECUTING_SEARCH', 'SEARCH_EXECUTED', 'FINAL'];
  this.currentState = 'INITIAL';
  this.targetSearch = {
    query: '',
    locations: []
  };
  this.currentLocationIndex = 0;
  this.currentCriterionIndex = 0;
}
BullhornSearchModelClass.prototype.getCurrentState = function () {
  return this.currentState;
};
BullhornSearchModelClass.prototype.setCurrentState = function (state) {
  if (this.availableStates.indexOf(state) < 0) {
    throw 'Invalid state';
  }
  this.currentState = state;
};
BullhornSearchModelClass.prototype.getTargetSearch = function () {
  return this.targetSearch.query;
};
BullhornSearchModelClass.prototype.setTargetSearch = function (search) {
  this.targetSearch.query = search;
};
BullhornSearchModelClass.prototype.getCriteriaCount = function () {
  var addressCriteriaCount = 1;
  return addressCriteriaCount;
};
BullhornSearchModelClass.prototype.getSearchLocations = function () {
  return this.targetSearch.locations;
};
BullhornSearchModelClass.prototype.setSearchLocations = function (locations) {
  this.targetSearch.locations = locations;
};
BullhornSearchModelClass.prototype.hasNextSearchLocation = function () {
  return this.currentLocationIndex < this.targetSearch.locations.length;
};
BullhornSearchModelClass.prototype.getNextSearchLocation = function () {
  return this.targetSearch.locations[this.currentLocationIndex++];
};
BullhornSearchModelClass.prototype.getCurrentCriterionIndex = function () {
  return this.currentCriterionIndex;
};
BullhornSearchModelClass.prototype.setCurrentCriterionIndex = function (value) {
  this.currentCriterionIndex = value;
};
'use strict';
function BullhornSearchViewClass() {
    this.isCandidateListOpenRequested = false;
    this.isCandidateSearchModalWindowOpenRequested = false;
}
BullhornSearchViewClass.prototype.isDomReady = function () {
    if (!this.isMenuOpen()) {
        return false;
    }
    if (this.isCandidateListOpenRequested && !this.findCandidatesSearchButton()) {
        return false;
    } else if (this.isCandidateSearchModalWindowOpenRequested && !this.findCandidatesSearchInput()) {
        return false;
    }
    return true;
};
BullhornSearchViewClass.prototype.isMenuOpen = function () {
    if (!document.querySelector('#new-menu')) {
        return false;
    }
    if (!document.querySelector('#td2')) {
        return false;
    }
    return true;
};
BullhornSearchViewClass.prototype.findCandidatesSearchButton = function () {
    var iFrameDocument = this.findCandidatesDocument();
    if (iFrameDocument == null) {
        return null;
    }
    return iFrameDocument.querySelector('.main-content .header .search-toggle-btn');
};
BullhornSearchViewClass.prototype.findCandidatesDocument = function () {
    var iFrameElement = document.querySelector('iframe[src="/BullhornStaffing/Candidate/Candidates.cfm"]');
    if (!iFrameElement) {
        return null;
    }
    iFrameElement = iFrameElement.contentWindow.document.querySelector('iframe');
    if (!iFrameElement) {
        return null;
    }
    return iFrameElement.contentWindow.document;
};
BullhornSearchViewClass.prototype.addSplash = function () {
    var createDataTextRotate = function createDataTextRotate() {
        var bufferArray = [];
        for (var index = 2; index <= 6; index++) {
            bufferArray.push(__('ce-bh-splash-rotate-text-' + index));
        }
        return bufferArray.join('|');
    };
    var bullPopup = document.createElement('div');
    document.body.appendChild(bullPopup);
    bullPopup.id = 'chrome-extension-bull-popup';
    bullPopup.innerHTML = ['<div class="chrome-extension-bull-popup-inner">', '<h1>' + __('ce-bh-splash-header') + '</h1>', '<h2 data-text-rotate="' + createDataTextRotate() + '">',
    '<span class="text-left">' + __('ce-bh-splash-rotate-header', {
        ':rotateText': '</span><span class="rotate-here text-center">' + __('ce-bh-splash-rotate-text-1') + '</span><span class="text-right" style="margin-right:60px">'
    }) + '</span>', '</h2>', '</div>'].join('');
    setupSplash();
    function setupSplash() {
        var rotateMessages = $('#chrome-extension-bull-popup h2').attr('data-text-rotate');
        var rotateMessages = rotateMessages.split("|");
        var rotateIndex = 0;
        $.each(rotateMessages, function (key, message) {
            console.log(message);
        });
        setInterval(rotateText, 3000);
        function rotateText() {
            $('#chrome-extension-bull-popup .rotate-here').addClass('transition-all go-left').wait(500).removeClass('transition-all').wait(50).text(rotateMessages[rotateIndex]).addClass('transition-all').removeClass('go-left').wait(500).removeClass('go-right');
            rotateIndex == rotateMessages.length - 1 ? rotateIndex = 0 : rotateIndex++;
        }
    }
};
BullhornSearchViewClass.prototype.removeSplash = function () {
    var bullPopup = document.getElementById('chrome-extension-bull-popup');
    document.body.removeChild(bullPopup);
};
BullhornSearchViewClass.prototype.openCandidates = function () {
    this.isCandidateListOpenRequested = true;
    var candidatesButton = document.querySelector('#td2');
    candidatesButton.click();
};
BullhornSearchViewClass.prototype.openSearchModalWindow = function () {
    this.isCandidateSearchModalWindowOpenRequested = true;
    this.findCandidatesSearchButton().click();
};
BullhornSearchViewClass.prototype.setSearch = function (search) {
    var input = this.findCandidatesSearchInput();
    input.focus();
    input.value = search;
    input.blur();
};
BullhornSearchViewClass.prototype.findCandidatesSearchInput = function () {
    var iFrameDocument = this.findCandidatesDocument();
    if (iFrameDocument == null) {
        return null;
    }
    return iFrameDocument.querySelector('#keywords');
};
BullhornSearchViewClass.prototype.executeSearch = function () {
    console.log('view execute search');
    var searchButton = this.findCandidatesExecuteSearchButton();
    if (!searchButton) {
        return false;
    }
    searchButton.click();
    return true;
};
BullhornSearchViewClass.prototype.findCandidatesExecuteSearchButton = function () {
    var searchInput = this.findCandidatesSearchInput();
    if (!searchInput) {
        return null;
    }
    return searchInput.closest('.modal').querySelector('button.search');
};
BullhornSearchViewClass.prototype.isAdvancedModeEnabled = function () {
    var searchInput = this.findCandidatesSearchInput();
    if (!searchInput) {
        return null;
    }
    return searchInput.closest('.keywords').querySelector('.search').classList.contains('ng-hide') === false;
};
BullhornSearchViewClass.prototype.setAdvancedModeEnabled = function () {
    var searchInput = this.findCandidatesSearchInput();
    if (!searchInput) {
        return null;
    }
    return searchInput.closest('.keywords').querySelector('.visual-query a.keyword-toggle').click();
};
BullhornSearchViewClass.prototype.isCandidatesListTabExists = function () {
    return this.findCandidatesListTab() ? true : false;
};
BullhornSearchViewClass.prototype.findCandidatesListTab = function () {
    var tabElements = document.querySelectorAll('#bhsWindowList .WindowTab span');
    var expectedLabel = 'Candidate List';
    for (var index = 0; index < tabElements.length; index++) {
        var tab = tabElements[index];
        if (tab.title === expectedLabel || tab.textContent === expectedLabel) {
            return tab;
        }
    }
};
BullhornSearchViewClass.prototype.getCriterionFieldName = function (index) {
    var criterionElement = this.findAdditionalCriterionElement(index);
    return criterionElement.querySelector('.field .picker-single .text').textContent.trim();
};
BullhornSearchViewClass.prototype.findAdditionalCriterionElement = function (index) {
    return this.findAdditionalCriteriaList().querySelectorAll('.criterion')[index];
};
BullhornSearchViewClass.prototype.openCriteriaFieldPicker = function (index) {
    var criterionElement = this.findAdditionalCriterionElement(index);
    this.findCriterionFieldPicker(criterionElement).click();
};
BullhornSearchViewClass.prototype.findCriterionFieldPicker = function (criterionElement) {
    return criterionElement.querySelector('.field .picker-single');
};
BullhornSearchViewClass.prototype.setCriterionField = function (criterionIndex, criterionName) {
    var criterionElement = this.findAdditionalCriterionElement(criterionIndex);
    var pickerDropdown = this.findCriterionFieldPicker(criterionElement).closest('.field').querySelector('.picker-dropdown');
    var fieldOption = null;
    var fieldOptionElementList = pickerDropdown.querySelectorAll('.picker-option');
    for (var index = 0; index < fieldOptionElementList.length; index++) {
        var text = fieldOptionElementList[index].querySelector('.text').textContent.trim();
        if (text == criterionName) {
            fieldOption = fieldOptionElementList[index];
            break;
        }
    }
    fieldOption.click();
};
BullhornSearchViewClass.prototype.findAdditionalCriteriaList = function () {
    var modalWindow = this.findCandidatesDocument().querySelector('.modal');
    return modalWindow.querySelector('.search-criteria .search-criteria-list');
};
BullhornSearchViewClass.prototype.openOperatorPicker = function (criterionIndex) {
    var picker = this.findAdditionalCriterionElement(criterionIndex).querySelector('.operator .picker-single');
    picker.click();
};
BullhornSearchViewClass.prototype.setCriterionOperator = function (criterionIndex, operatorName) {
    var criterionElement = this.findAdditionalCriterionElement(criterionIndex);
    var pickerDropdown = criterionElement.querySelector('.operator .picker-dropdown');
    var fieldOperator = null;
    var fieldOptionElementList = pickerDropdown.querySelectorAll('.picker-option');
    for (var index = 0; index < fieldOptionElementList.length; index++) {
        var text = fieldOptionElementList[index].querySelector('.text').textContent.trim();
        if (text == operatorName) {
            fieldOperator = fieldOptionElementList[index];
            break;
        }
    }
    fieldOperator.click();
};
BullhornSearchViewClass.prototype.openRadiusPicker = function () {
    var picker = this.findAdditionalCriterionElement(0).querySelector('ng-include .picker .picker-single');
    picker.click();
};
BullhornSearchViewClass.prototype.setCriterionRadius = function (label) {
    var pickerDropdown = this.findAdditionalCriterionElement(0).querySelector('ng-include .picker .picker-dropdown');
    var optionElement = null;
    var optionElementList = pickerDropdown.querySelectorAll('.picker-option');
    for (var index = 0; index < optionElementList.length; index++) {
        var text = optionElementList[index].querySelector('.text').textContent.trim();
        if (text == label) {
            optionElement = optionElementList[index];
            break;
        }
    }
    optionElement.click();
};
BullhornSearchViewClass.prototype.openAvailableLocations = function (location) {
    var fn = function fn(location) {
        var input = $('.criterion ng-include input[name="address"]');
        input.click();
        input.focus();
        input.val(location);
        input.triggerHandler('input');
    };
    var code = '(' + fn.toString() + ')("' + location + '")';
    var scriptInjector = new BullhornScriptInjectorClass(code);
    scriptInjector.injectToDocument(this.findCandidatesDocument());
};
BullhornSearchViewClass.prototype.selectLocation = function () {
    var pickerDropdown = this.findAdditionalCriterionElement(0).querySelector('ng-include ul.address-results');
    var addressElement = pickerDropdown.querySelector('.address-result-label.active');
    if (!addressElement) {
        addressElement = pickerDropdown.querySelector('.address-result-label');
    }
    if (addressElement) {
        addressElement.click();
    }
};
BullhornSearchViewClass.prototype.setCriteriaCount = function (count) {
    var document = this.findCandidatesDocument();
    var criterionNodeList = document.querySelectorAll('.modal .criterion');
    var criterionNeededCount = count - criterionNodeList.length;
    while (criterionNeededCount > 0) {
        document.querySelector('.add-criteria').click();
        criterionNeededCount--;
    }
    while (criterionNeededCount < 0) {
        criterionNodeList = document.querySelectorAll('.modal .criterion');
        criterionNodeList[criterionNodeList.length - 1].querySelector('.remove').click();
        criterionNeededCount++;
    }
};
BullhornSearchViewClass.prototype.isApplicationPage = function () {
    return this.findApplicationContainer() ? true : false;
};
BullhornSearchViewClass.prototype.findApplicationContainer = function () {
    return document.querySelector('#bhAppContainer');
};
'use strict';
var path = new BullhornPathClass(window.location.href);
var searchController = null;
if (path.isBullhornPage()) {
    chrome.runtime.onMessage.addListener(function onMessageBullhorn(message, sender, sendResponse) {
        switch (message.command) {
            case 'run-bullhorn-search':
                {
                    if (searchController) {
                        return;
                    }
                    searchController = new BullhornSearchControllerClass();
                    searchController.search(message.search.query, message.search.locations);
                }
                break;
        }
    });
}