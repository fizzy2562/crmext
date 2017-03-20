'use strict';
function StorageDriver() {}
StorageDriver.prototype.write = function (item) {
  throw new Error('interface');
};
StorageDriver.prototype.read = function (key, callback) {
  throw new Error('interface');
};
'use strict';
function AreaStorageDriver(storageArea) {
  'use strict';
  this.storageArea = storageArea;
}
AreaStorageDriver.prototype = StorageDriver.prototype;
AreaStorageDriver.prototype.constructor = AreaStorageDriver;
AreaStorageDriver.prototype.write = function (item) {
  'use strict';
  this.storageArea.set(item);
};
AreaStorageDriver.prototype.read = function (key, callback) {
  this.storageArea.get(key, callback);
};
'use strict';
function TranslationId(timestamp, languageCode, version) {
    'use strict';
    this.language = languageCode;
    this.timestamp = timestamp;
    this.version = version;
}
TranslationId.prototype.isNull = function () {
    'use strict';
    return !this.language || !this.timestamp;
};
TranslationId.prototype.isGreaterThan = function (other) {
    'use strict';
    if (this.isUpToDateVersion(other.version) === false) {
        return false;
    }
    if (!this.timestamp || !other.timestamp) {
        return false;
    }
    return this.timestamp.getTime() > other.timestamp.getTime();
};
TranslationId.prototype.isUpToDateVersion = function (version) {
    'use strict';
    return this.version === version;
};
TranslationId.prototype.serialize = function () {
    'use strict';
    return {
        language: this.language,
        timestamp: this.timestamp.getTime(),
        version: this.version
    };
};
TranslationId.prototype.deserialize = function (data) {
    'use strict';
    this.language = data.language;
    this.timestamp = new Date();
    this.timestamp.setTime(data.timestamp);
    this.version = data.version;
};
'use strict';
function I18n() {}
(function () {
    I18n.storageDriver = chrome && chrome.storage ? new AreaStorageDriver(chrome.storage.local) : new DummyStorageDriver();
})();
I18n.prototype.storeDictionary = function (dict, translationId) {
    I18n.data.translation.dictionary = dict;
    var storageItem = {
        translation: {
            id: translationId.serialize(),
            dictionary: dict
        }
    };
    I18n.storageDriver.write(storageItem);
};
I18n.prototype.getString = function (key, parameters) {
    var dictionary = key in I18n.data.translation.dictionary ? I18n.data.translation.dictionary : I18n.data.builtIn.dictionary;
    if (key in dictionary) {
        var decorateString = function decorateString(input) {
            for (var key in parameters) {
                input = input.replace(key, parameters[key]);
            }
            return input;
        };
        return decorateString(dictionary[key]);
    }
    return '';
};
I18n.prototype.getTranslationId = function () {
    return I18n.data.translation.id;
};
I18n.data = {
    translation: {
        id: new TranslationId(),
        dictionary: {}
    },
    builtIn: {
        dictionary: {}
    }
};
I18n.loadData = function (callback) {
    I18n.loadBuiltInTranslation();
    I18n.loadLocalStoredTranslation(callback);
};
I18n.loadLocalStoredTranslation = function (callback) {
    I18n.storageDriver.read('translation', function (items) {
        if (!items.translation || !items.translation.dictionary) {
            if (callback) {
                callback();
            }
            return;
        }
        I18n.data.translation.dictionary = items.translation.dictionary;
        I18n.data.translation.id.deserialize(items.translation.id);
        if (callback) {
            callback();
        }
    });
};
I18n.loadBuiltInTranslation = function () {
    var request = new XMLHttpRequest();
    request.onload = function () {
        I18n.data.builtIn.dictionary = JSON.parse(this.response);
    };
    request.onerror = function (e) {
        console.log('onerror', e);
    };
    request.open('GET', chrome.extension.getURL('/dist/i18n/en.json'), true);
    request.send(null);
};
"use strict";
function __(key, parameters) {
  var i18n = new I18n();
  return i18n.getString(key, parameters);
}