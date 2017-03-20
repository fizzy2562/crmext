'use strict';
var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};
var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};
var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }
  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();
var inherits = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }
  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
};
var possibleConstructorReturn = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }
  return call && (typeof call === "object" || typeof call === "function") ? call : self;
};
var LinkedInDomParserInterface = function () {
  function LinkedInDomParserInterface() {
    classCallCheck(this, LinkedInDomParserInterface);
  }
  createClass(LinkedInDomParserInterface, [{
    key: 'isBooleanSearch',
    value: function isBooleanSearch() {
      throw 'Not implemented';
    }
  }, {
    key: 'findContentContainer',
    value: function findContentContainer() {
      throw 'Not implemented';
    }
  }]);
  return LinkedInDomParserInterface;
}();
var EmberLinkedInDomParser = function (_LinkedInDomParserInt) {
    inherits(EmberLinkedInDomParser, _LinkedInDomParserInt);
    function EmberLinkedInDomParser() {
        classCallCheck(this, EmberLinkedInDomParser);
        return possibleConstructorReturn(this, (EmberLinkedInDomParser.__proto__ || Object.getPrototypeOf(EmberLinkedInDomParser)).call(this));
    }
    createClass(EmberLinkedInDomParser, [{
        key: 'isBooleanSearch',
        value: function isBooleanSearch() {
            return false;
        }
    }, {
        key: 'findContentContainer',
        value: function findContentContainer() {
            return document.querySelector('.ember-view div[role="main"]');
        }
    }]);
    return EmberLinkedInDomParser;
}(LinkedInDomParserInterface);
var LinkedInRecruiterDomParserInterface = function (_LinkedInDomParserInt) {
    inherits(LinkedInRecruiterDomParserInterface, _LinkedInDomParserInt);
    function LinkedInRecruiterDomParserInterface() {
        classCallCheck(this, LinkedInRecruiterDomParserInterface);
        return possibleConstructorReturn(this, (LinkedInRecruiterDomParserInterface.__proto__ || Object.getPrototypeOf(LinkedInRecruiterDomParserInterface)).call(this));
    }
    createClass(LinkedInRecruiterDomParserInterface, [{
        key: 'findSearchJobTitles',
        value: function findSearchJobTitles() {
            throw 'Not implemented';
        }
    }, {
        key: 'findSearchJobTitleRawValue',
        value: function findSearchJobTitleRawValue() {
            throw 'Not implemented';
        }
    }, {
        key: 'findSearchLocations',
        value: function findSearchLocations() {
            throw 'Not implemented';
        }
    }, {
        key: 'findSearchCountry',
        value: function findSearchCountry() {
            throw 'Not implemented';
        }
    }, {
        key: 'findSearchCountryCodes',
        value: function findSearchCountryCodes() {
            throw 'Not implemented';
        }
    }, {
        key: 'findSearchPostalCodes',
        value: function findSearchPostalCodes() {
            throw 'Not implemented';
        }
    }, {
        key: 'findSearchResultCount',
        value: function findSearchResultCount() {
            throw 'Not implemented';
        }
    }, {
        key: 'findSearchInfoElement',
        value: function findSearchInfoElement() {
            throw 'Not implemented';
        }
    }, {
        key: 'isFullAdvancedSearchBuiltByExtension',
        value: function isFullAdvancedSearchBuiltByExtension() {
            throw 'Not implemented';
        }
    }]);
    return LinkedInRecruiterDomParserInterface;
}(LinkedInDomParserInterface);
var NewRecruiterDomParser = function (_LinkedInRecruiterDom) {
    inherits(NewRecruiterDomParser, _LinkedInRecruiterDom);
    function NewRecruiterDomParser() {
        classCallCheck(this, NewRecruiterDomParser);
        return possibleConstructorReturn(this, (NewRecruiterDomParser.__proto__ || Object.getPrototypeOf(NewRecruiterDomParser)).call(this));
    }
    createClass(NewRecruiterDomParser, [{
        key: 'isBooleanSearch',
        value: function isBooleanSearch() {
            var keywordsString = this.findSearchKeywordsRawValue().trim();
            var jobTitleString = this.findSearchJobTitleRawValue().trim();
            var generatedBooleanSearchRegExp = /(\s+(OR|AND)\s+)|(^NOT\s+)/gi;
            var isKeywordsMatched = keywordsString.match(generatedBooleanSearchRegExp) ? true : false;
            var isJobTitleMatched = jobTitleString.match(generatedBooleanSearchRegExp) ? true : false;
            return isKeywordsMatched || isJobTitleMatched;
        }
    }, {
        key: 'findContentContainer',
        value: function findContentContainer() {
            return document.querySelector('#stream-container');
        }
    }, {
        key: 'findSearchKeywords',
        value: function findSearchKeywords() {
            var result = [];
            var keywordsInputValue = this.findSearchKeywordsRawValue().trim();
            if (!keywordsInputValue) {
                return [];
            }
            var string = new LinkedInStringClass(keywordsInputValue);
            var splitedByQuotesKeywords = string.splitByQuotes();
            var desirableAndPattern = /\"\w+\sAND\s\w+\"/i;
            var desirableAndMatch = keywordsInputValue.match(desirableAndPattern);
            var desiredAndPhrases = [];
            if (desirableAndMatch) {
                for (var matchIndex = 0; matchIndex < desirableAndMatch.length; matchIndex++) {
                    var phrase = desirableAndMatch[matchIndex].replace(/\sAND\s/gi, ' and ');
                    desiredAndPhrases.push(phrase);
                }
            }
            var inputValue = '';
            if (desiredAndPhrases.length > 0) {
                var inputValueArray = keywordsInputValue.split(desirableAndPattern);
                for (var inputValueArrayIndex = 0; inputValueArrayIndex < inputValueArray.length - 1; inputValueArrayIndex++) {
                    inputValue += inputValueArray[inputValueArrayIndex] + desiredAndPhrases[inputValueArrayIndex] + inputValueArray[inputValueArrayIndex + 1];
                }
            } else {
                inputValue = keywordsInputValue.replace(/\sAND\s/gi, ' AND ');
            }
            var isSplitedByOr = false;
            var keywordGroups = inputValue.split(/\sAND\s/);
            for (var groupIndex = 0; groupIndex < keywordGroups.length; groupIndex++) {
                var array = [];
                var group = keywordGroups[groupIndex].trim().replace(/\(|\)/g, '');
                var keywordArray = group.split(/\sOR\s/i);
                isSplitedByOr = keywordArray.length > 1;
                for (var arrayIndex = 0; arrayIndex < keywordArray.length; arrayIndex++) {
                    var keyword = keywordArray[arrayIndex].trim().replace(/\"/g, '');
                    array.push(keyword);
                }
                result.push(array.join(','));
            }
            if (keywordGroups.length === 1 && !isSplitedByOr && splitedByQuotesKeywords.length > 1) {
                return splitedByQuotesKeywords;
            }
            if (result.length === 1 && !isSplitedByOr) {
                var separator = result[0].indexOf(',') > 0 ? ',' : ' ';
                result = result[0].split(separator);
            }
            return result;
        }
    }, {
        key: 'findSearchKeywordsRawValue',
        value: function findSearchKeywordsRawValue() {
            var keywordPillElement = document.querySelector('#facet-keywords .pills .pill');
            if (keywordPillElement === null) {
                return '';
            }
            return keywordPillElement.title;
        }
    }, {
        key: 'findSearchJobTitles',
        value: function findSearchJobTitles() {
            var result = [];
            var jobTitlesInputValue = this.findSearchJobTitleRawValue();
            if (jobTitlesInputValue) {
                var jobTitleGroups = jobTitlesInputValue.split(/\s+AND\s+/i);
                for (var groupIndex = 0; groupIndex < jobTitleGroups.length; groupIndex++) {
                    var array = [];
                    var group = jobTitleGroups[groupIndex].trim().replace(/\(|\)/g, '');
                    var jobTitleArray = group.split(/\s+OR\s+/i);
                    for (var arrayIndex = 0; arrayIndex < jobTitleArray.length; arrayIndex++) {
                        var jobTitle = jobTitleArray[arrayIndex].trim().replace(/\"/g, '');
                        array.push(jobTitle);
                    }
                    result.push(array.join(','));
                }
            }
            return result;
        }
    }, {
        key: 'findSearchJobTitleRawValue',
        value: function findSearchJobTitleRawValue() {
            var jobTitleInput = document.querySelector('#facet-jobTitle .pills .pill');
            if (jobTitleInput === null) {
                return '';
            }
            return jobTitleInput.title;
        }
    }, {
        key: 'findSearchLocations',
        value: function findSearchLocations() {
            var result = [];
            var pillNodeList = document.querySelectorAll('#facet-location .pills .pill');
            for (var index = 0; index < pillNodeList.length; index++) {
                var locationName = pillNodeList[index].title.split(',')[0].trim();
                result.push(locationName);
            }
            return result;
        }
    }, {
        key: 'findSearchCountry',
        value: function findSearchCountry() {
            var result = [];
            var pillTextNodeList = document.querySelectorAll('#facet-locationAlt .pills .pill .pill-text');
            for (var index = 0; index < pillTextNodeList.length; index++) {
                var text = pillTextNodeList[index].textContent;
                text = text.split(':')[0];
                result.push(text);
            }
            return result;
        }
    }, {
        key: 'findSearchCountryCodes',
        value: function findSearchCountryCodes() {
            var result = [];
            var pillTextNodeList = document.querySelectorAll('#facet-locationAlt .pills .pill');
            for (var index = 0; index < pillTextNodeList.length; index++) {
                result.push(pillTextNodeList[index].dataset.id);
            }
            return result;
        }
    }, {
        key: 'findSearchPostalCodes',
        value: function findSearchPostalCodes() {
            var result = [];
            var pillTextNodeList = document.querySelectorAll('#facet-locationAlt .pills .pill .pill-text');
            for (var index = 0; index < pillTextNodeList.length; index++) {
                var text = pillTextNodeList[index].textContent;
                var textArray = text.split(':');
                if (textArray.length > 1) {
                    result.push(textArray[1].trim());
                }
            }
            return result;
        }
    }, {
        key: 'findSearchResultCount',
        value: function findSearchResultCount() {
            var counterElement = this.findSearchInfoElement();
            if (!counterElement) {
                return findVisibleResultElementCount();
            }
            var totalResults = parseInt(counterElement.textContent.split(' ')[0].replace(/&nbsp;|,/g, ''));
            return totalResults >= 0 ? totalResults : findVisibleResultElementCount();
            function findVisibleResultElementCount() {
                return document.querySelectorAll('#results .result').length;
            }
        }
    }, {
        key: 'findSearchInfoElement',
        value: function findSearchInfoElement() {
            return document.querySelector('#search-info') 
            || document.querySelector('#top-bar .search-info'); 
        }
    }, {
        key: 'isFullAdvancedSearchBuiltByExtension',
        value: function isFullAdvancedSearchBuiltByExtension() {
            var keywords = this.findSearchKeywordsRawValue();
            var jobTitles = this.findSearchJobTitleRawValue();
            var pattern = /\s+(OR|AND)\s+/;
            var isMatched = pattern.test(keywords) || pattern.test(jobTitles);
            if (!isMatched) {
                pattern = /\((\"\w+\"|\w+)\)/;
                isMatched = pattern.test(keywords) && pattern.test(jobTitles);
            }
            return isMatched;
        }
    }]);
    return NewRecruiterDomParser;
}(LinkedInRecruiterDomParserInterface);
var LinkedInProfileDomParser = function () {
    function LinkedInProfileDomParser(path) {
        classCallCheck(this, LinkedInProfileDomParser);
        this.path = path;
    }
    createClass(LinkedInProfileDomParser, [{
        key: 'findJobTitle',
        value: function findJobTitle() {
            throw 'Not implemented';
        }
    }, {
        key: 'findSkills',
        value: function findSkills(maxCount) {
            var _this = this;
            var skillNameNodeList = document.querySelectorAll('.pv-skill-entity .pv-skill-entity__skill-name');
            if (skillNameNodeList.length > 0) {
                return new Promise(function (resolve, reject) {
                    resolve(_this.getSkillNameArray(skillNameNodeList, maxCount));
                });
            }
            var executor = function executor(resolve, reject) {
                resolve([]);
            };
            var token = this.getVoyagerApiCsrfToken();
            var publicIdentifier = this.path.getPublicIdentifier();
            if (token.length > 0 && publicIdentifier.length > 0) {
                executor = function executor(resolve, reject) {
                    var request = new XMLHttpRequest();
                    request.addEventListener('load', function () {
                        var skillNameArray = [];
                        if (request.status !== 200) {
                            resolve(skillNameArray);
                        }
                        var response = JSON.parse(request.responseText);
                        for (var index = 0; index < response.elements.length; index++) {
                            skillNameArray.push(response.elements[index].skill.name);
                        }
                        resolve(skillNameArray);
                    });
                    request.open('GET', 'https://www.linkedin.com/voyager/api/identity/profiles/' + publicIdentifier + '/endorsedSkills?includeHiddenEndorsers=true&count=' + maxCount, true);
                    request.setRequestHeader('Csrf-Token', token);
                    request.timeout = 3000;
                    request.send(null);
                };
            }
            return new Promise(executor);
        }
    }, {
        key: 'getVoyagerApiCsrfToken',
        value: function getVoyagerApiCsrfToken() {
            var sessionId = getCookieValue('JSESSIONID');
            return sessionId.split('"').join('');
        }
    }, {
        key: 'findLocation',
        value: function findLocation() {
            throw 'Not implemented';
        }
    }, {
        key: 'getLinkedInCityId',
        value: function getLinkedInCityId(url) {
            var idRegExp = /[[?&]?f_G=(\w+:\d+)/;
            var resultArray = idRegExp.exec(url);
            if (!resultArray || resultArray.length <= 0) {
                return '';
            }
            return resultArray[1];
        }
    }]);
    return LinkedInProfileDomParser;
}();
var LinkedInPath = function () {
    function LinkedInPath(url) {
        classCallCheck(this, LinkedInPath);
        this.url = url;
        this.linkedInUrlPattern = {
            main: /linkedin\.[a-z]{2,3}\//i,
            search: /linkedin\.[a-z]{2,3}\/search\/results\//i
        };
        this.recruiterSearchUrlOldPattern = /linkedin\.[a-z]{2,3}\/recruiter\/(analytics|search)\?searchHistoryId=\d+/i;
        this.recruiterSearchUrlNewPattern = /linkedin\.[a-z]{2,3}\/recruiter\/smartsearch\?(searchHistoryId=\d+|updateSearchHistory=\w+)/i;
        this.recruiterMainPageUrlPattern = /linkedin\.[a-z]{2,3}\/cap\/dashboard\/home/i;
        this.recruiterProfileUrlPattern = /linkedin\.[a-z]{2,3}\/recruiter\/profile\/\d+/i;
    }
    createClass(LinkedInPath, [{
        key: 'toString',
        value: function toString() {
            return this.url;
        }
    }, {
        key: 'isLinkedInPage',
        value: function isLinkedInPage() {
            return this.linkedInUrlPattern.main.test(this.url) || this.isLinkedInSearchPage();
        }
    }, {
        key: 'isLinkedInSearchPage',
        value: function isLinkedInSearchPage() {
            return this.linkedInUrlPattern.search.test(this.url);
        }
    }, {
        key: 'isRecruiterPage',
        value: function isRecruiterPage() {
            return this.isRecruiterSearchPage() || this.isRecruiterMainPage() || this.isRecruiterProfilePage();
        }
    }, {
        key: 'isRecruiterSearchPage',
        value: function isRecruiterSearchPage() {
            return this.isRecruiterSearchOldPage() || this.isRecruiterSearchNewPage();
        }
    }, {
        key: 'isRecruiterSearchOldPage',
        value: function isRecruiterSearchOldPage() {
            return !!this.url.match(this.recruiterSearchUrlOldPattern);
        }
    }, {
        key: 'isRecruiterSearchNewPage',
        value: function isRecruiterSearchNewPage() {
            return !!this.url.match(this.recruiterSearchUrlNewPattern);
        }
    }, {
        key: 'isRecruiterMainPage',
        value: function isRecruiterMainPage() {
            return !!this.url.match(this.recruiterMainPageUrlPattern);
        }
    }, {
        key: 'isRecruiterProfilePage',
        value: function isRecruiterProfilePage() {
            return !!this.url.match(this.recruiterProfileUrlPattern);
        }
    }, {
        key: 'getPublicIdentifier',
        value: function getPublicIdentifier() {
            var slugRegExp = /linkedin\.com\/in\/([a-z0-9%-]+)\/?/i;
            var matchArray = this.url.match(slugRegExp);
            if (!matchArray || matchArray.length < 2) {
                return '';
            }
            return matchArray[1];
        }
    }]);
    return LinkedInPath;
}();
var LinkedInPageProfileDomParser = function (_LinkedInProfileDomPa) {
    inherits(LinkedInPageProfileDomParser, _LinkedInProfileDomPa);
    function LinkedInPageProfileDomParser(path) {
        classCallCheck(this, LinkedInPageProfileDomParser);
        return possibleConstructorReturn(this, (LinkedInPageProfileDomParser.__proto__ || Object.getPrototypeOf(LinkedInPageProfileDomParser)).call(this, path));
    }
    createClass(LinkedInPageProfileDomParser, [{
        key: 'findJobTitle',
        value: function findJobTitle() {
            var _this2 = this;
            var jobTitle = '';
            var titleElement = document.querySelector('#background-experience header h4 a');
            if (titleElement) {
                jobTitle = this.getPositionArray(titleElement.textContent.trim(), 3).join(' ');
            }
            if (jobTitle === '') {
                titleElement = document.querySelector('#headline-container .title');
                if (titleElement) {
                    jobTitle = this.getPositionArray(titleElement.textContent.trim(), 3).join(' ');
                }
            }
            if (jobTitle.length > 0) {
                return Promise.resolve(jobTitle);
            }
            titleElement = document.querySelector('.background-details .experience-section h3');
            if (titleElement) {
                jobTitle = this.getPositionArray(titleElement.textContent.trim(), 3).join(' ');
            }
            if (jobTitle.length > 0) {
                return Promise.resolve(jobTitle);
            }
            return this.findProfileViewJsonObject(this.path.getPublicIdentifier()).then(function (json) {
                if (json.included && json.included.length > 0) {
                    var experienceObject = _this2.getObjectsByType(json.included, 'com.linkedin.voyager.identity.profile.PositionView');
                    if (experienceObject.length === 0) {
                        return Promise.resolve('');
                    }
                    experienceObject = experienceObject[0];
                    if (!experienceObject.elements || experienceObject.elements.length === 0) {
                        return Promise.resolve('');
                    }
                    var positionId = experienceObject.elements[0];
                    var positionArray = _this2.getObjectsByType(json.included, 'com.linkedin.voyager.identity.profile.Position');
                    for (var key in positionArray) {
                        var object = positionArray[key];
                        if (!object) {
                            continue;
                        }
                        if (object.entityUrn !== positionId) {
                            continue;
                        }
                        if (!object.title || object.title.length === 0) {
                            continue;
                        }
                        return Promise.resolve(_this2.getPositionArray(object.title, 3).join(' '));
                    }
                } else if (json.positionView && json.positionView.elements) {
                    var _positionArray = json.positionView.elements;
                    if (_positionArray.length > 0) {
                        return Promise.resolve(_this2.getPositionArray(_positionArray[0].title, 3).join(' '));
                    }
                }
                return Promise.resolve(jobTitle);
            }).catch(function (e) {
                console.log(e);
                return Promise.resolve(jobTitle);
            });
        }
    }, {
        key: 'getPositionArray',
        value: function getPositionArray(position, count) {
            var positionWords = position.match(/([^\s-]+)/g);
            return positionWords.slice(0, count);
        }
    }, {
        key: 'getSkillNameArray',
        value: function getSkillNameArray(skillNameNodeList, maxCount) {
            var result = [];
            for (var index = 0; index < skillNameNodeList.length && index < maxCount; index++) {
                result.push(skillNameNodeList[index].textContent.trim());
            }
            return result;
        }
    }, {
        key: 'findLocation',
        value: function findLocation() {
            var locationElement = document.querySelector('#location .locality a') || document.querySelector('#demographics .locality');
            if (locationElement) {
                return locationElement.textContent.trim().split(',')[0];
            }
            locationElement = document.querySelector('.pv-profile-section .pv-top-card-section__location');
            if (locationElement) {
                return locationElement.textContent.trim().split(',')[0];
            }
            return '';
        }
    }, {
        key: 'findLinkedInMemberId',
        value: function findLinkedInMemberId() {
            var _this3 = this;
            var publicIdentifier = this.path.getPublicIdentifier();
            var executor = function executor(resolve, reject) {
                resolve('');
            };
            return this.findProfileViewJsonObject(publicIdentifier).then(function (json) {
                var memberIdRegExp = /^urn:li:member:(\d+)$/;
                if (json.included && json.included.length > 0) {
                    publicIdentifier = decodeURIComponent(publicIdentifier);
                    var miniProfileObjectArray = _this3.getObjectsByType(json.included, 'com.linkedin.voyager.identity.shared.MiniProfile');
                    var _loop = function _loop(key) {
                        var object = miniProfileObjectArray[key];
                        if (!object) {
                            return 'continue';
                        }
                        if (object.publicIdentifier !== publicIdentifier) {
                            return 'continue';
                        }
                        if (!object.objectUrn) {
                            return 'continue';
                        }
                        var matchArray = object.objectUrn.match(memberIdRegExp);
                        if (matchArray && matchArray.length > 0) {
                            executor = function executor(resolve, reject) {
                                resolve(matchArray[1]);
                            };
                            return {
                                v: new Promise(executor)
                            };
                        }
                    };
                    for (var key in miniProfileObjectArray) {
                        var _ret = _loop(key);
                        switch (_ret) {
                            case 'continue':
                                continue;
                            default:
                                if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
                        }
                    }
                } else if (json.profile && json.profile.miniProfile) {
                    var objectUrn = json.profile.miniProfile.objectUrn;
                    if (objectUrn && objectUrn.length > 0) {
                        var _matchArray = objectUrn.match(memberIdRegExp);
                        if (_matchArray && _matchArray.length > 0) {
                            executor = function executor(resolve, reject) {
                                resolve(_matchArray[1]);
                            };
                            return new Promise(executor);
                        }
                    }
                }
                return new Promise(executor);
            }).catch(function (e) {
                console.log(e);
                return new Promise(executor);
            });
        }
    }, {
        key: 'findProfileViewJsonObject',
        value: function findProfileViewJsonObject(publicIdentifier) {
            var executor = function executor(resolve, reject) {
                resolve({});
            };
            var codeElementId = this.findProfileViewCodeElementId(document.querySelectorAll('code'), publicIdentifier);
            if (codeElementId.length === 0) {
                var token = this.getVoyagerApiCsrfToken();
                if (token.length > 0 && publicIdentifier.length > 0) {
                    executor = function executor(resolve, reject) {
                        var request = new XMLHttpRequest();
                        request.addEventListener('load', function () {
                            if (request.status !== 200) {
                                reject(request);
                            }
                            resolve(JSON.parse(request.responseText));
                        });
                        request.open('GET', 'https://www.linkedin.com/voyager/api/identity/profiles/' + publicIdentifier + '/profileView', true);
                        request.setRequestHeader('Csrf-Token', token);
                        request.timeout = 3000;
                        request.send(null);
                    };
                }
                return new Promise(executor);
            }
            var codeElement = document.querySelector('#' + codeElementId);
            if (!codeElement) {
                return new Promise(executor);
            }
            var json = void 0;
            try {
                json = JSON.parse(codeElement.textContent.trim());
            } catch (syntaxError) {
                executor = function executor(resolve, reject) {
                    reject(syntaxError);
                };
                return new Promise(executor);
            }
            executor = function executor(resolve, reject) {
                resolve(json);
            };
            return new Promise(executor);
        }
    }, {
        key: 'findProfileViewCodeElementId',
        value: function findProfileViewCodeElementId(codeNodeList, publicIdentifier) {
            var dataletPrefix = 'datalet-';
            var apiUrl = '/voyager/api/identity/profiles/' + publicIdentifier + '/profileView';
            for (var key in codeNodeList) {
                var codeElement = codeNodeList[key];
                var elementId = codeElement.id;
                if (!elementId || !elementId.startsWith(dataletPrefix)) {
                    continue;
                }
                var json = void 0;
                try {
                    json = JSON.parse(codeElement.textContent.trim());
                } catch (syntaxError) {
                    continue;
                }
                if (!json.request || !json.request.startsWith(apiUrl)) {
                    continue;
                }
                if (json.status != 200) {
                    continue;
                }
                return json.body;
            }
            return '';
        }
    }, {
        key: 'getObjectsByType',
        value: function getObjectsByType(includedArray, type) {
            return includedArray.filter(function (object) {
                return object.$type === type;
            });
        }
    }, {
        key: 'findFullName',
        value: function findFullName() {
            var nameElement = document.querySelector('.pv-profile-section .pv-top-card-section__name');
            if (nameElement) {
                return nameElement.textContent.trim();
            }
            return '';
        }
    }, {
        key: 'findCountryCode',
        value: function findCountryCode() {
            var _this4 = this;
            return this.findProfileViewJsonObject(this.path.getPublicIdentifier()).then(function (json) {
                if (json.included && json.included.length > 0) {
                    var locationObjectArray = _this4.getObjectsByType(json.included, 'com.linkedin.voyager.common.NormBasicLocation');
                    for (var key in locationObjectArray) {
                        var object = locationObjectArray[key];
                        if (!object) {
                            continue;
                        }
                        if (!object.countryCode) {
                            continue;
                        }
                        return Promise.resolve(object.countryCode);
                    }
                } else if (json.profile && json.profile.location) {
                    var location = json.profile.location;
                    if (location.basicLocation && location.basicLocation.countryCode) {
                        return Promise.resolve(location.basicLocation.countryCode);
                    }
                }
                return Promise.resolve('');
            });
        }
    }, {
        key: 'findProfileUrl',
        value: function findProfileUrl() {
            var publicIdentifier = this.path.getPublicIdentifier();
            if (publicIdentifier.length > 0) {
                return 'https://www.linkedin.com/in/' + publicIdentifier + '/';
            }
            return '';
        }
    }]);
    return LinkedInPageProfileDomParser;
}(LinkedInProfileDomParser);
var LinkedInRecruiterProfileDomParser = function (_LinkedInProfileDomPa) {
    inherits(LinkedInRecruiterProfileDomParser, _LinkedInProfileDomPa);
    function LinkedInRecruiterProfileDomParser(path) {
        classCallCheck(this, LinkedInRecruiterProfileDomParser);
        return possibleConstructorReturn(this, (LinkedInRecruiterProfileDomParser.__proto__ || Object.getPrototypeOf(LinkedInRecruiterProfileDomParser)).call(this, path));
    }
    createClass(LinkedInRecruiterProfileDomParser, [{
        key: 'findJobTitle',
        value: function findJobTitle() {
            var jobTitle = this.findJobTitleTextFromExperienceSection();
            if (jobTitle === '') {
                jobTitle = this.findJobTitleTextFromInfoSection();
                jobTitle = jobTitle.replace(/\s+(at|\/)\s+/gi, ' ');
            }
            return Promise.resolve(jobTitle);
        }
    }, {
        key: 'findJobTitleTextFromExperienceSection',
        value: function findJobTitleTextFromExperienceSection() {
            var text = '';
            var anchorElement = document.querySelector('#profile-experience .position-header h4 a');
            if (anchorElement) {
                text = anchorElement.textContent;
            }
            return text;
        }
    }, {
        key: 'findJobTitleTextFromInfoSection',
        value: function findJobTitleTextFromInfoSection() {
            var text = '';
            var titleElement = document.querySelector('.profile-info .title');
            if (titleElement) {
                text = titleElement.textContent;
            }
            return text;
        }
    }, {
        key: 'findLocation',
        value: function findLocation() {
            var locationElement = document.querySelector('.location-industry .location a');
            if (locationElement) {
                return locationElement.textContent.trim();
            }
            return '';
        }
    }]);
    return LinkedInRecruiterProfileDomParser;
}(LinkedInProfileDomParser);
var UrlHistory = function () {
    function UrlHistory() {
        classCallCheck(this, UrlHistory);
        this.urlArray = [];
    }
    createClass(UrlHistory, [{
        key: 'addUrl',
        value: function addUrl(url) {
            this.urlArray.push(url);
        }
    }, {
        key: 'isLinkedInProfilePageChanged',
        value: function isLinkedInProfilePageChanged(url) {
            if (this.urlArray.length === 0) {
                return true;
            }
            var lastPath = this.getCurrentLinkedInPath();
            if (!lastPath.isLinkedInPage()) {
                return true;
            }
            var lastProfileIdentifier = lastPath.getPublicIdentifier();
            if (lastProfileIdentifier.length === 0) {
                return true;
            }
            var path = new LinkedInPath(url);
            if (!path.isLinkedInPage()) {
                return true;
            }
            return lastProfileIdentifier !== path.getPublicIdentifier();
        }
    }, {
        key: 'getCurrentLinkedInPath',
        value: function getCurrentLinkedInPath() {
            var lastUrl = this.urlArray.length > 0 ? this.urlArray[this.urlArray.length - 1] : '';
            return new LinkedInPath(lastUrl);
        }
    }]);
    return UrlHistory;
}();
