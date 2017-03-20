'use strict';
function SystemClass() {
    this.useSqs = true;
    this.socket = new SocketClass();
    this.workerStatus = 'closed';
    this.badge = new BadgeClass();
    this.rabbitManager = null;
    this.rabbitIFTTTManager = null;
    this.rabbitPopupManager = null;
    this.sqsManager = null;
    this.sqsIFTTTManager = null;
    this.sqsPopupManager = null;
    this.pingIntervalTime = 300;
    this.notificationQueue = new NotificationQueueClass();
    this.resetPingInterval();
}
SystemClass.prototype.resetPingInterval = function () {
    var that = this;
    if (this.pingInterval) {
        clearInterval(this.pingInterval);
    }
    this.pingInterval = setInterval(function () {
        window.user.promise(function (userInfo) {
            if (window.user.isLoggedIn()) {
                that.getSocket().send({
                    'command': 'ping'
                });
            }
        });
    }, this.pingIntervalTime * 1000);
};
SystemClass.prototype.setPingIntervalTime = function (intervalTime) {
    this.pingIntervalTime = intervalTime;
    this.resetPingInterval();
};
SystemClass.prototype.getPingIntervalTime = function () {
    return this.pingIntervalTime;
};
SystemClass.prototype.getSocket = function () {
    return this.socket;
};
SystemClass.prototype.setWorkerStatus = function (workerStatus) {
    this.workerStatus = workerStatus;
};
SystemClass.prototype.getWorkerStatus = function () {
    return this.workerStatus;
};
SystemClass.prototype.openWorkers = function (userInfo) {
    var that = this;
    if (this.workerStatus != 'opened') {
        var openWorker = function openWorker(f) {
            try {
                f();
            } catch (e) {}
        };
        openWorker(function () {
            that.socket.open();
        });
        if (this.useSqs) {
            that.sqsManager = new ClassSqs(window.config.sqs_rpc.accessKeyId, window.config.sqs_rpc.secretAccessKey, window.config.sqs_rpc.region, window.config.sqs_rpc.queueUrl);
            that.sqsIFTTTManager = new ClassSqs(window.config.sqs_ifttt.accessKeyId, window.config.sqs_ifttt.secretAccessKey, window.config.sqs_ifttt.region, window.config.sqs_ifttt.queueUrl);
            that.sqsPopupManager = new ClassSqs(window.config.sqs_popup.accessKeyId, window.config.sqs_popup.secretAccessKey, window.config.sqs_popup.region, window.config.sqs_popup.queueUrl);
        } else {
            that.rabbitManager = new ClassRabbit(window.config.rabbit.connectionString, window.config.rabbit.user, window.config.rabbit.password, window.config.rabbit.vhost, window.config.rabbit.requestQueueName);
            that.rabbitIFTTTManager = new ClassRabbit(window.config.ifttt.connectionString, window.config.ifttt.user, window.config.ifttt.password, window.config.ifttt.vhost, window.config.ifttt.requestQueueName);
            that.rabbitPopupManager = new ClassRabbit(window.config.popup.connectionString, window.config.popup.user, window.config.popup.password, window.config.popup.vhost, window.config.popup.requestQueueName);
            openWorker(function () {
                that.rabbitManager.open();
            });
            openWorker(function () {
                that.rabbitIFTTTManager.open();
            });
            openWorker(function () {
                that.rabbitPopupManager.open();
            });
        }
        this.workerStatus = 'opened';
    }
};
SystemClass.prototype.closeWorkers = function () {
    if (this.socket) {
        this.socket.close();
    }
    if (this.rabbitManager) {
        this.rabbitManager.close();
    }
    if (this.rabbitIFTTTManager) {
        this.rabbitIFTTTManager.close();
    }
    if (this.rabbitPopupManager) {
        this.rabbitPopupManager.close();
    }
    this.workerStatus = 'closed';
};
SystemClass.prototype.getRpcQueue = function () {
    if (this.useSqs) {
        return this.sqsManager;
    }
    return this.rabbitManager;
};
SystemClass.prototype.getRpcQueueStatus = function () {
    return this.sqsManager;
};
SystemClass.prototype.getRabbitManager = function () {
    return this.rabbitManager;
};
SystemClass.prototype.getIftttQueue = function () {
    if (this.useSqs) {
        return this.sqsIFTTTManager;
    }
    return this.rabbitIFTTTManager;
};
SystemClass.prototype.getRabbitIFTTTManager = function () {
    return this.rabbitIFTTTManager;
};
SystemClass.prototype.getRabbitPopupManager = function () {
    return this.rabbitPopupManager;
};
SystemClass.prototype.getPopupQueue = function () {
    if (this.useSqs) {
        return this.sqsPopupManager;
    }
    return this.rabbitPopupManager;
};
SystemClass.prototype.getBadge = function () {
    return this.badge;
};
SystemClass.prototype.playNotificationSound = function () {
    var myAudio = new Audio();
    myAudio.src = "/sounds/blob.wav";
    myAudio.play();
};
SystemClass.prototype.getNotificationQueue = function () {
    return this.notificationQueue;
};
"use strict";
function GoogleUrl(url) {
  this.url = url;
}
GoogleUrl.prototype.isChromeEventHandler = function () {
  return this.isChromeAddressBarEventHandler() || this.isChromeNewTabEventHandler();
};
GoogleUrl.prototype.isChromeAddressBarEventHandler = function () {
  var regExp = /^https?:\/\/www.google.[a-z]{2,3}\/webhp\?sourceid=chrome-instant&ion=1/;
  return regExp.test(this.url);
};
GoogleUrl.prototype.isChromeNewTabEventHandler = function () {
  var regExp = /^https?:\/\/www.google.[a-z]{2,3}\/_\/chrome\/newtab/;
  return regExp.test(this.url);
};
'use strict';
function isUrlAllowed(url, type) {
    var googleUrl = new GoogleUrl(url);
    if (googleUrl.isChromeEventHandler()) {
        return false;
    }
    var domain = url.replace(/http(s)?:\/\//i, '').split('/')[0];
    for (var i in window.config.websites) {
        var pattern = window.config.websites[i];
        if (url.search(pattern) != -1) {
            return true;
        }
        if (domain.search(pattern) != -1) {
            return true;
        }
    }
    if (type == 'harvester') {
        return isHarvesterDomainTracked(domain, url);
    }
    return isDomainTrackedIFTTT(domain);
}
function isHarvesterDomainTracked(checkDomain, url) {
    var trackDomains = window.user.getTrackDomainsHarvester();
    if (!trackDomains) {
        return false;
    }
    if (trackDomains.length == 0) {
        return false;
    }
    for (var i = 0; i < trackDomains.length; i++) {
        var domain = trackDomains[i];
        var regex = new RegExp('^(\\S+\\.)*' + domain + '$', 'i');
        if (regex.test(checkDomain)) {
            return true;
        } else {
            var regexUrl = domain.replace(/\*/g, '.*');
            regexUrl = new RegExp(regexUrl);
            if (url.match(regexUrl)) {
                return true;
            }
        }
    }
    return false;
}
function isDomainTrackedIFTTT(checkDomain) {
    var trackDomains = window.user.getTrackDomains();
    if (!trackDomains) {
        return false;
    }
    if (trackDomains.length == 0) {
        return false;
    }
    for (var i = 0; i < trackDomains.length; i++) {
        var domain = trackDomains[i];
        var regex = new RegExp('^(\\S+\\.)*' + domain + '$', 'i');
        if (regex.test(checkDomain)) {
            return true;
        }
    }
    return false;
}
function isShonlyUrlAllowed(url) {
    var cache = window.user.getIftttCache();
    if (cache.shonlyRegexes) {
        for (var key in cache.shonlyRegexes) {
            var regex = new RegExp(cache.shonlyRegexes[key]);
            if (url.match(regex)) {
                return true;
            }
        }
    }
    return false;
}
function isMentorUrlAllowed(url) {
    var googleUrl = new GoogleUrl(url);
    if (googleUrl.isChromeEventHandler()) {
        return false;
    }
    var cache = window.user.getIftttCache();
    if (cache && cache.mentorRegexes) {
        for (var key in cache.mentorRegexes) {
            var regex = cache.mentorRegexes[key];
            regex = regex.replace(/\*/g, '.*');
            regex = new RegExp(regex);
            if (url.match(regex)) {
                return true;
            }
        }
    }
    return false;
}
function focusOrCreateTab(url, url2, param_url) {
    chrome.windows.getAll({ "populate": true }, function (windows) {
        var existing_tab = null;
        for (var i in windows) {
            var tabs = windows[i].tabs;
            for (var j in tabs) {
                var tab = tabs[j];
                var str = tab.url;
                if (str.search(url) != -1 || str.search(url2) != -1) {
                    existing_tab = tab;
                    break;
                }
            }
        }
        if (existing_tab) {
            chrome.tabs.update(existing_tab.id, { "selected": true });
        } else {
            chrome.tabs.create({ "url": url + param_url, "selected": true });
        }
    });
}
function focusOrCreateTabLink(url) {
    chrome.windows.getAll({ "populate": true }, function (windows) {
        var existing_tab = null;
        for (var i in windows) {
            var tabs = windows[i].tabs;
            for (var j in tabs) {
                var tab = tabs[j];
                var str = tab.url;
                if (str.search(url) != -1) {
                    existing_tab = tab;
                    break;
                }
            }
        }
        if (existing_tab) {
            chrome.tabs.update(existing_tab.id, { "selected": true });
            return true;
        } else {
            if (url.indexOf("http://") !== 0 && url.indexOf("https://") !== 0) {
                url = "http://" + url;
            }
            chrome.tabs.create({ "url": url, "selected": true });
            return true;
        }
    });
    return false;
}
'use strict';
function ConfigDictionary() {}
ConfigDictionary.prototype.getLivePorts = function () {
	return {
		'socket': [80, 8080, 8088],
		'rabbit': [443, 15674]
	};
};
ConfigDictionary.prototype.getDictionary = function () {
	return {
		'live': {
			domainMentor: 'https://mentor.socialtalent.co',
			webSocketHost: 'ws://ws.socialtalent.co:80/websocket/run',
			webSocketHostNode: 'ws://nodejs.socialtalent.co:80/websocket/run',
			rabbit: {
				connectionString: 'ws://wsstomp.socialtalent.co:%%PORT%%/stomp/websocket',
				user: 'socialtalent',
				password: '074cd9cacb9cfc4ccc10268984dad921',
				vhost: '/master',
				requestQueueName: 'rpc_queue'
			},
			ifttt: {
				connectionString: 'ws://wsstomp.socialtalent.co:%%PORT%%/stomp/websocket',
				user: 'socialtalent',
				password: '074cd9cacb9cfc4ccc10268984dad921',
				vhost: '/master',
				requestQueueName: 'ifttt_queue'
			},
			popup: {
				connectionString: 'ws://wsstomp.socialtalent.co:%%PORT%%/stomp/websocket',
				user: 'socialtalent',
				password: '074cd9cacb9cfc4ccc10268984dad921',
				vhost: '/master',
				requestQueueName: 'linkedin_queue'
			},
			sqs_rpc: {
				accessKeyId: "AKIAIU3EEY2POUGECXEA",
				secretAccessKey: "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",
				region: "eu-west-1",
				queueUrl: 'https://sqs.eu-west-1.amazonaws.com/784663697069/harvester'
			},
			sqs_ifttt: {
				accessKeyId: "AKIAIU3EEY2POUGECXEA",
				secretAccessKey: "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",
				region: "eu-west-1",
				queueUrl: 'https://sqs.eu-west-1.amazonaws.com/784663697069/ifttt'
			},
			sqs_popup: {
				accessKeyId: "AKIAIU3EEY2POUGECXEA",
				secretAccessKey: "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",
				region: "eu-west-1",
				queueUrl: 'https://sqs.eu-west-1.amazonaws.com/784663697069/popup'
			},
			websites: this.getWebsites()
		},
		'live-m-e878bbc138efc07c2dd7ded91c019a37': {
			domainMentor: 'https://mentor.socialtalent.co',
			webSocketHost: 'ws://chrome.socialtalent.co:80/websocket/run',
			webSocketHostNode: 'ws://chrome.socialtalent.co:80/websocket/run',
			rabbit: {
				connectionString: 'ws://chrome.socialtalent.co:443/stomp/websocket',
				user: 'socialtalent',
				password: '074cd9cacb9cfc4ccc10268984dad921',
				vhost: '/master',
				requestQueueName: 'rpc_queue'
			},
			ifttt: {
				connectionString: 'ws://chrome.socialtalent.co:443/stomp/websocket',
				user: 'socialtalent',
				password: '074cd9cacb9cfc4ccc10268984dad921',
				vhost: '/master',
				requestQueueName: 'ifttt_queue'
			},
			popup: {
				connectionString: 'ws://chrome.socialtalent.co:443/stomp/websocket',
				user: 'socialtalent',
				password: '074cd9cacb9cfc4ccc10268984dad921',
				vhost: '/master',
				requestQueueName: 'linkedin_queue'
			},
			sqs_rpc: {
				accessKeyId: "AKIAIU3EEY2POUGECXEA",
				secretAccessKey: "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",
				region: "eu-west-1",
				queueUrl: 'https://sqs.eu-west-1.amazonaws.com/784663697069/harvester'
			},
			sqs_ifttt: {
				accessKeyId: "AKIAIU3EEY2POUGECXEA",
				secretAccessKey: "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",
				region: "eu-west-1",
				queueUrl: 'https://sqs.eu-west-1.amazonaws.com/784663697069/ifttt'
			},
			sqs_popup: {
				accessKeyId: "AKIAIU3EEY2POUGECXEA",
				secretAccessKey: "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",
				region: "eu-west-1",
				queueUrl: 'https://sqs.eu-west-1.amazonaws.com/784663697069/popup'
			},
			websites: this.getWebsites()
		},
		'live-b-04e17d9461aba11624c441c9921925fa': {
			domainMentor: 'https://mentor.socialtalent.co',
			webSocketHost: 'ws://chrome.socialtalent.co:8088/websocket/run',
			webSocketHostNode: 'ws://chrome.socialtalent.co:8088/websocket/run',
			rabbit: {
				connectionString: 'ws://chrome.socialtalent.co:15674/stomp/websocket',
				user: 'socialtalent',
				password: '074cd9cacb9cfc4ccc10268984dad921',
				vhost: '/master',
				requestQueueName: 'rpc_queue'
			},
			ifttt: {
				connectionString: 'ws://chrome.socialtalent.co:15674/stomp/websocket',
				user: 'socialtalent',
				password: '074cd9cacb9cfc4ccc10268984dad921',
				vhost: '/master',
				requestQueueName: 'ifttt_queue'
			},
			popup: {
				connectionString: 'ws://chrome.socialtalent.co:15674/stomp/websocket',
				user: 'socialtalent',
				password: '074cd9cacb9cfc4ccc10268984dad921',
				vhost: '/master',
				requestQueueName: 'linkedin_queue'
			},
			sqs_rpc: {
				accessKeyId: "AKIAIU3EEY2POUGECXEA",
				secretAccessKey: "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",
				region: "eu-west-1",
				queueUrl: 'https://sqs.eu-west-1.amazonaws.com/784663697069/harvester'
			},
			sqs_ifttt: {
				accessKeyId: "AKIAIU3EEY2POUGECXEA",
				secretAccessKey: "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",
				region: "eu-west-1",
				queueUrl: 'https://sqs.eu-west-1.amazonaws.com/784663697069/ifttt'
			},
			sqs_popup: {
				accessKeyId: "AKIAIU3EEY2POUGECXEA",
				secretAccessKey: "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",
				region: "eu-west-1",
				queueUrl: 'https://sqs.eu-west-1.amazonaws.com/784663697069/popup'
			},
			websites: this.getWebsites()
		},
		'live-h-59e725b7e6e0594b7310819a63c4de89': {
			domainMentor: 'https://mentor.socialtalent.co',
			webSocketHost: 'ws://chrome.socialtalent.co:8080/websocket/run',
			webSocketHostNode: 'ws://chrome.socialtalent.co:8080/websocket/run',
			rabbit: {
				connectionString: 'ws://chrome.socialtalent.co:15674/stomp/websocket',
				user: 'socialtalent',
				password: '074cd9cacb9cfc4ccc10268984dad921',
				vhost: '/master',
				requestQueueName: 'rpc_queue'
			},
			ifttt: {
				connectionString: 'ws://chrome.socialtalent.co:15674/stomp/websocket',
				user: 'socialtalent',
				password: '074cd9cacb9cfc4ccc10268984dad921',
				vhost: '/master',
				requestQueueName: 'ifttt_queue'
			},
			popup: {
				connectionString: 'ws://chrome.socialtalent.co:15674/stomp/websocket',
				user: 'socialtalent',
				password: '074cd9cacb9cfc4ccc10268984dad921',
				vhost: '/master',
				requestQueueName: 'linkedin_queue'
			},
			sqs_rpc: {
				accessKeyId: "AKIAIU3EEY2POUGECXEA",
				secretAccessKey: "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",
				region: "eu-west-1",
				queueUrl: 'https://sqs.eu-west-1.amazonaws.com/784663697069/harvester'
			},
			sqs_ifttt: {
				accessKeyId: "AKIAIU3EEY2POUGECXEA",
				secretAccessKey: "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",
				region: "eu-west-1",
				queueUrl: 'https://sqs.eu-west-1.amazonaws.com/784663697069/ifttt'
			},
			sqs_popup: {
				accessKeyId: "AKIAIU3EEY2POUGECXEA",
				secretAccessKey: "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",
				region: "eu-west-1",
				queueUrl: 'https://sqs.eu-west-1.amazonaws.com/784663697069/popup'
			},
			websites: this.getWebsites()
		}
	};
};
ConfigDictionary.prototype.getWebsites = function () {
	return ["bullhornstaffing.com", "linkedin.com", /google\.[a-z]{2,3}/i, "indeed.com", "xing.com", "viadeo.com", "github.com", "stackoverflow.com", "pinterest.com", "behance.com", "elance.com", "about.me", "weibo.com", "kaggle.com", /\.indeed\./i,
	"wx.qq.com", "instagram.com", "twitter.com", "facebook.com", "facebook.se", /^(\S+\.)*angel.co$/i];
};
'use strict';
function Config(type) {
	this.type = type;
	this.configObject = new ConfigDictionary();
	this.fullDictionary = this.configObject.getDictionary();
	this.livePorts = this.configObject.getLivePorts();
	this.current = this.fullDictionary[type];
	if (this.type != 'live') {
		return;
	}
	var socketPortIndexStored = parseInt(localStorage.getItem('socket-connection-port'));
	if (isNaN(socketPortIndexStored) == false) {
		this.socketPortIndex = socketPortIndexStored;
	} else {
		this.socketPortIndex = 0;
	}
	this.applySocketPort();
	var rabbitPortIndexStored = parseInt(localStorage.getItem('rabbit-connection-port'));
	if (isNaN(rabbitPortIndexStored) == false) {
		this.rabbitPortIndex = rabbitPortIndexStored;
	} else {
		this.rabbitPortIndex = 0;
	}
	this.applyRabbitPort();
}
Config.prototype.isStandardConfig = function () {
	return ['local', 'sandbox', 'rc', 'live'].indexOf(this.type) != -1;
};
Config.prototype.getType = function () {
	return this.type;
};
Config.prototype.applySocketPort = function () {
	localStorage.setItem('socket-connection-port', this.socketPortIndex);
	var newConfig = this.configObject.getDictionary()[this.type];
	var port = this.livePorts['socket'][this.socketPortIndex];
	this.current.webSocketHost = newConfig.webSocketHost.replace(/:[0-9]{2,8}/, ':' + port);
};
Config.prototype.changeSocketPorts = function () {
	var newIndex = this.socketPortIndex + 1;
	if (!this.livePorts['socket'][newIndex]) {
		newIndex = 0;
	}
	localStorage.setItem('socket-connection-port', newIndex);
	this.socketPortIndex = newIndex;
	var newConfig = this.configObject.getDictionary()[this.type];
	var newPort = this.livePorts['socket'][newIndex];
	this.current.webSocketHost = this.current.webSocketHost.replace(/:[0-9]{2,8}/, ':' + newPort);
};
Config.prototype.applyRabbitPort = function () {
	localStorage.setItem('rabbit-connection-port', this.rabbitPortIndex);
	var newConfig = this.configObject.getDictionary()[this.type];
	var port = this.livePorts['rabbit'][this.rabbitPortIndex];
	var newConnectionString = newConfig.rabbit.connectionString.replace('%%PORT%%', port);
	var setNewConnectionString = function setNewConnectionString(worker, newConnectionString) {
		try {
			worker.connectionString = newConnectionString;
		} catch (e) {}
	};
	setNewConnectionString(this.current.rabbit, newConnectionString);
	setNewConnectionString(this.current.ifttt, newConnectionString);
	setNewConnectionString(this.current.popup, newConnectionString);
};
Config.prototype.changeRabbitPorts = function () {
	var newIndex = this.rabbitPortIndex + 1;
	if (!this.livePorts['rabbit'][newIndex]) {
		newIndex = 0;
	}
	localStorage.setItem('rabbit-connection-port', newIndex);
	this.rabbitPortIndex = newIndex;
	var newConfig = this.configObject.getDictionary()[this.type];
	var newPort = this.livePorts['rabbit'][newIndex];
	var newConnectionString = newConfig.rabbit.connectionString.replace('%%PORT%%', newPort);
	var setNewConnectionString = function setNewConnectionString(worker, newConnectionString) {
		try {
			worker.connectionString = newConnectionString;
		} catch (e) {}
	};
	setNewConnectionString(this.current.rabbit, newConnectionString);
	setNewConnectionString(this.current.ifttt, newConnectionString);
	setNewConnectionString(this.current.popup, newConnectionString);
};
Config.prototype.getCurrent = function () {
	return this.current;
};
Config.prototype.setUserConfig = function (userCompanyId) {
	var companies = {
		'live-m-e878bbc138efc07c2dd7ded91c019a37': [
		'56a2092fbd3d867f038b8ca0', '5652e3124cb18904498b5c43', '5642175a9f90f4da4f8b45bb',
		'5645e13d9f90f4e04c8b45c1', '564d92a2bd3d868e1c8b4689'],
		'live-b-04e17d9461aba11624c441c9921925fa': [
		'54d23a939f90f4f97f8b4567'],
		'live-h-59e725b7e6e0594b7310819a63c4de89': [
		'536b433e9f90f4f75d8b4567']
	};
	for (var key in companies) {
		if (companies[key].indexOf(userCompanyId) != -1) {
			this.current = this.fullDictionary[key];
			this.type = key;
			break;
		}
	}
};
'use strict';
function TranslationUpdater(user, socket) {
    'use strict';
    this.user = user;
    this.socket = socket;
    this.timeoutDelay = 24 * 3600 * 1000;
    var i18n = new I18n();
    this.translationId = i18n.getTranslationId();
}
TranslationUpdater.prototype.setup = function (translationId, dictionary) {
    'use strict';
    if (translationId.isNull()) {
        this.setupFromI18n(new I18n());
        return;
    }
    var that = this;
    if (!this.translationId || this.translationId.isGreaterThan(translationId) === false) {
        window.clearTimeout(this.timeoutId);
        this.translationId = translationId;
        this.timeoutId = window.setTimeout(function () {
            that.forceRelogin();
        }, this.timeoutDelay);
        var i18n = new I18n();
        i18n.storeDictionary(dictionary, this.translationId);
        return;
    }
    this.translationId = translationId;
    this.timeoutId = window.setTimeout(function () {
        that.forceRelogin();
    }, this.timeoutDelay);
};
TranslationUpdater.prototype.setupFromI18n = function (i18n) {
    var translationId = i18n.getTranslationId();
    if (!translationId || !translationId.timestamp) {
        this.forceRelogin();
    }
    var that = this;
    var getDelay = function getDelay() {
        var now = new Date();
        return that.timeoutDelay - (now.getTime() - translationId.timestamp.getTime());
    };
    this.translationId = translationId;
    this.timeoutId = window.setTimeout(function () {
        that.forceRelogin();
    }, getDelay());
    console.log(getDelay());
};
TranslationUpdater.prototype.forceRelogin = function () {
    'use strict';
    var socket = this.socket;
    var that = this;
    this.user.promise(function (userInfo) {
        socket.send(that.createMentorLoginRequest(userInfo.mentorUserId));
    });
};
TranslationUpdater.prototype.createMentorLoginRequest = function (mentorUserId) {
    'use strict';
    return {
        command: 'mentor-login',
        mentorUserId: mentorUserId
    };
};
'use strict';
function TranslationFactory(backgroundPage) {
    'use strict';
    this.window = backgroundPage;
}
TranslationFactory.prototype.createTranslationId = function (data) {
    'use strict';
    if (!data.translation) {
        return new TranslationId();
    }
    var manifest = chrome.runtime.getManifest();
    return new TranslationId(new Date(), data.translation.language, manifest.version);
};
TranslationFactory.prototype.createUpdater = function (socket) {
    'use strict';
    return new TranslationUpdater(this.window.user, socket);
};
'use strict';
function ClassRabbit(connectionString, user, password, vhost, requestQueueName) {
    this.connectionString = connectionString;
    this.user = user;
    this.password = password;
    this.vhost = vhost;
    this.requestQueue = requestQueueName;
    this.messageCounter = 1;
    this.reconnectCount = 0;
    this.timeOffset = 0;
    this.status = 'closed';
    this.socketServerIp = null;
    this.socketServerPort = null;
    var that = this;
    setInterval(function () {
        if (that.getStatus() == 'opened' && that.getReadyState() == 1) {
            that.sendMessage({
                'command': 'ping'
            });
        }
    }, 300 * 1000);
}
ClassRabbit.prototype.getStatus = function () {
    return this.status;
};
ClassRabbit.prototype.isOpen = function () {
    return this.getReadyState() == 1;
};
ClassRabbit.prototype.reconnect = function (connectionString) {
    this.reconnectCount++;
    if (this.requestClient) {
        this.requestClient.ws.close();
    }
    this.requestClient = this.initRequestClient(connectionString, this.user, this.password, this.vhost);
};
ClassRabbit.prototype.getReadyState = function () {
    return this.requestClient && this.requestClient.ws ? this.requestClient.ws.readyState : 0;
};
ClassRabbit.prototype.setSocketServerInfo = function (ip, port) {
    this.socketServerIp = ip;
    this.socketServerPort = port;
};
ClassRabbit.prototype.open = function () {
    this.status = 'opened';
    this.requestClient = this.initRequestClient(this.connectionString, this.user, this.password, this.vhost);
    this.reconnectCount = 0;
};
ClassRabbit.prototype.setTimeOffset = function (timeOffset) {
    this.timeOffset = timeOffset;
};
ClassRabbit.prototype.getReconnectCount = function () {
    return this.reconnectCount;
};
ClassRabbit.prototype.setReconnectCount = function (count) {
    this.reconnectCount = count;
    return this;
};
ClassRabbit.prototype.initRequestClient = function (connectionString, user, password, vhost) {
    var that = this;
    var client = Stomp.client(connectionString);
    client.debug = function (str) {
    };
    client.heartbeat.outgoing = 0;
    client.heartbeat.incoming = 0;
    client.connect({
        login: user,
        passcode: password,
        host: vhost
    }, function (frame) {
        that.reconnectCount = 0;
    });
    return client;
};
ClassRabbit.prototype.sendMessage = function (message) {
    if (typeof message === 'string') {
        console.error('String message is deprecated!');
    }
    if (this.status == 'closed') {
        return;
    }
    var headers = {
        priority: 1,
        persistent: false
    };
    message.socketServerIp = this.socketServerIp;
    message.socketServerPort = this.socketServerPort;
    message.timestamp = parseInt(new Date().getTime() / 1000) + this.timeOffset;
    message.no = this.messageCounter;
    var no = message.no;
    message = JSON.stringify(message);
    this.messageCounter++;
    this.requestClient.send(this.requestQueue, headers, message);
    return no;
};
ClassRabbit.prototype.close = function () {
    this.status = 'closed';
    if (this.requestClient) {
        this.requestClient.ws.close();
    }
};
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
'use strict';
function UserClass() {
    this.loggedIn = false;
    this.serverOffset = 0;
    this.recruitEnabled = false;
    this.licenseValid = false;
    this.shOnly = false;
    this.iftttCache = [];
    this.trackDomains = [];
    this.trackDomainsHarvester = [];
    this.userActivityFeedFlags = [];
    this.companyActivityFeedFlags = [];
    this.roles = [];
    this.userRole;
    this.socialButtonsOrder = ['linkedinx', 'indeed', 'twitter', 'google', 'github', 'stackoverflow', 'googleplus', 'xing', 'viadeo', 'behance', 'elance', 'aboutme', 'pinterest', 'weibo', 'kaggle'];
    this.optionalSocialNetworks = [];
}
UserClass.prototype.setLoggedIn = function (loggedIn) {
    this.loggedIn = loggedIn;
};
UserClass.prototype.isLoggedIn = function () {
    return this.loggedIn;
};
UserClass.prototype.setServerOffset = function (serverOffset) {
    this.serverOffset = serverOffset;
};
UserClass.prototype.getServerOffset = function () {
    return this.serverOffset;
};
UserClass.prototype.setRecruitEnabled = function (recruitEnabled) {
    this.recruitEnabled = recruitEnabled;
};
UserClass.prototype.isRecruitEnabled = function () {
    return this.recruitEnabled;
};
UserClass.prototype.setLicenseValid = function (licenseValid) {
    this.licenseValid = licenseValid;
};
UserClass.prototype.isLicenseValid = function () {
    return this.licenseValid;
};
UserClass.prototype.setIftttCache = function (iftttCache) {
    this.iftttCache = iftttCache;
};
UserClass.prototype.getIftttCache = function () {
    return this.iftttCache;
};
UserClass.prototype.setTrackDomains = function (trackDomains) {
    this.trackDomains = trackDomains;
};
UserClass.prototype.setTrackDomainsHarvester = function (trackDomainsHarvester) {
    this.trackDomainsHarvester = trackDomainsHarvester;
};
UserClass.prototype.getTrackDomains = function () {
    return this.trackDomains;
};
UserClass.prototype.getTrackDomainsHarvester = function () {
    return this.trackDomainsHarvester;
};
UserClass.prototype.setShOnly = function (shOnly) {
    this.shOnly = shOnly;
};
UserClass.prototype.isShOnly = function () {
    return this.shOnly;
};
UserClass.prototype.setUserActivityFeedFlags = function (userActivityFeedFlags) {
    this.userActivityFeedFlags = userActivityFeedFlags;
};
UserClass.prototype.getUserActivityFeedFlags = function () {
    return this.userActivityFeedFlags;
};
UserClass.prototype.setUserActivityFeedFlag = function (name, value) {
    if (value) {
        var key = this.userActivityFeedFlags.indexOf(name);
        if (key != -1) {
            this.userActivityFeedFlags.splice(key, 1);
        }
    } else {
        this.userActivityFeedFlags.push(name);
    }
};
UserClass.prototype.hasUserActivityFeedFlag = function (name) {
    return this.userActivityFeedFlags.indexOf(name) != -1;
};
UserClass.prototype.setCompanyActivityFeedFlags = function (companyActivityFeedFlags) {
    this.companyActivityFeedFlags = companyActivityFeedFlags;
};
UserClass.prototype.getCompanyActivityFeedFlags = function () {
    return this.companyActivityFeedFlags;
};
UserClass.prototype.hasCompanyActivityFeedFlag = function (name) {
    return this.companyActivityFeedFlags.indexOf(name) != -1;
};
UserClass.prototype.setRoles = function (roles) {
    this.roles = roles;
};
UserClass.prototype.getRoles = function () {
    return this.roles;
};
UserClass.prototype.setRoleNames = function (value) {
    this.userRole = new UserRoleClass(value);
};
UserClass.prototype.isFreeSourceHubUser = function () {
    return this.userRole.isFreeSourceHubUser();
};
UserClass.prototype.setSocialButtonsOrder = function (socialButtonsOrder) {
    this.socialButtonsOrder = socialButtonsOrder;
};
UserClass.prototype.getSocialButtonsOrder = function () {
    return this.socialButtonsOrder;
};
UserClass.prototype.setOptionalSocialNetworks = function (optionalSocialNetworks) {
    this.optionalSocialNetworks = optionalSocialNetworks;
};
UserClass.prototype.getOptionalSocialNetworks = function () {
    return this.optionalSocialNetworks;
};
UserClass.prototype.hasRole = function (roleName) {
    return this.roles[roleName] ? true : false;
};
UserClass.prototype.logout = function () {
    this.roles = [];
    this.loggedIn = false;
    this.recruitEnabled = false;
    this.licenseValid = false;
    this.iftttCache = [];
    chrome.cookies.remove({ name: 'mentor-userId', url: window.config.domainMentor });
    chrome.browserAction.setIcon({ path: { '19': 'images/icon-not-logged-in-19.png', '38': 'images/icon-not-logged-in-38.png' } });
    window.notifications = [];
    window.system.getBadge().clear();
    this.shOnly = false;
    this.userActivityFeedFlags = [];
    this.companyActivityFeedFlags = [];
    window.nudgesSent = [];
    window.system.closeWorkers();
};
UserClass.prototype.promise = function (callback) {
    var that = this;
    chrome.cookies.getAll({ url: window.config.domainMentor }, function (cookies) {
        var proxy = {
            'mentor-userId': 'mentorUserId',
            'mentor-departmentId': 'mentorDepartmentId',
            'mentor-companyId': 'mentorCompanyId',
            'mentor-queueServerType': 'mentorQueueServerType'
        };
        var cookiesToGet = ['mentor-userId', 'mentor-departmentId', 'mentor-companyId', 'mentor-queueServerType'];
        var userInfo = {};
        if (cookies && cookies.length) {
            for (var index in cookies) {
                var name = cookies[index].name;
                if (cookiesToGet.indexOf(name) != -1) {
                    userInfo[proxy[name]] = cookies[index].value;
                }
            }
        }
        if (userInfo['mentorUserId']) {
            that.setLoggedIn(true);
            callback(userInfo);
        }
    });
};
'use strict';
function NotificationClass(data, user) {
    this.data = data;
    this.acceptableDelaySeconds = 30;
    this.user = user;
}
NotificationClass.prototype.canShow = function () {
    return this.isComplete();
};
NotificationClass.prototype.isDelayed = function () {
    var timeCreated = this.data.time_created;
    var serverTimeOffset = user.getServerOffset();
    var now = parseInt(new Date().getTime() / 1000);
    now += serverTimeOffset;
    var delay = Math.abs(now - timeCreated);
    if (delay > this.acceptableDelaySeconds) {
        return true;
    }
    return false;
};
NotificationClass.prototype.isComplete = function () {
    if (!this.data.message) {
        return false;
    }
    if (!this.data.icon) {
        return false;
    }
    return true;
};
NotificationClass.prototype.createEntry = function () {
    var data = this.data;
    var entry = {
        id: data.id,
        subject: data.subject,
        message: data.message,
        popupSubject: this.getPopupSubject(data),
        popupMessage: this.getPopupMessage(data),
        popupIcon: this.getPopupIcon(data),
        type: data.type,
        link: data.link,
        icon: data.icon,
        created_on: data.created_on,
        removeNinjaFromNotificationCenter: data.removeNinjaFromNotificationCenter ? 1 : 0,
        time_created: data.time_created
    };
    switch (data.type) {
        case 'activity-feed':
            entry.id = data.activity_feed_id;
            entry.user_id = data.user_id;
            entry.thumb_type = data.thumb_type;
            entry.feedback_type = data.feedback_type;
            entry.feed_message = data.feed_message;
            entry.time_created = data.time_created;
            entry.created_on = data.created_on;
            entry.created_on_sec = data.created_on_sec;
            break;
        case 'standard':
        default:
            entry.iftttId = data.iftttId;
            break;
    }
    return entry;
};
NotificationClass.prototype.getPopupSubject = function (data) {
    if (data['popupSubject'] !== undefined) {
        return data['popupSubject'];
    } else if (data['popup-subject'] !== undefined) {
        return data['popup-subject'];
    }
    throw 'Popup subject not found';
};
NotificationClass.prototype.getPopupMessage = function (data) {
    if (data['popupMessage'] !== undefined) {
        return data['popupMessage'];
    } else if (data['popup-message'] !== undefined) {
        return data['popup-message'];
    }
    throw 'Popup message not found';
};
NotificationClass.prototype.getPopupIcon = function (data) {
    if (data['popupIcon'] !== undefined) {
        return data['popupIcon'];
    } else if (data['popup-icon'] !== undefined) {
        return data['popup-icon'];
    }
    throw 'Popup icon not found';
};
'use strict';
function NotificationQueueClass() {
    this.notifications = [];
}
NotificationQueueClass.prototype.add = function (notification) {
    console.log('NotificationQueueClass.prototype.add', notification);
    this.notifications.push(notification);
    if (this.notifications.length == 1) {
        var firstNotification = this.getNext();
        if (!firstNotification) {
            return;
        }
        this.show(firstNotification);
    }
};
NotificationQueueClass.prototype.show = function (notification) {
    notifyIconExists(notification.icon, function (exists) {
        if (exists == false) {
            notification.icon = 'icon-smartsearch-social';
        }
        var notificationOptions = {
            type: "basic",
            iconUrl: "/images/notify-icons/" + notification.popupIcon + ".png",
            title: notification.popupSubject,
            message: notification.popupMessage
        };
        if (notification.type == 'activity-feed') {
            switch (notification.thumb_type) {
                case 'good':
                    {
                        notificationOptions['buttons'] = [{
                            title: __('ce-activity-feed-notification-thumb-type-good-label'),
                            iconUrl: '/images/ico-thumb-up-gray.png'
                        }];
                    }
                    break;
                case 'bad':
                    {
                        var userRole = window.user.userRole;
                        if (userRole.canGiveThumbsUp() == true) {
                            notificationOptions['buttons'] = [{
                                title: __('ce-activity-feed-notification-thumb-type-bad-label'),
                                iconUrl: '/images/ico-thumb-down-gray.png'
                            }];
                        }
                    }
                    break;
            }
        }
        chrome.notifications.create(notification.id, notificationOptions, function (notificationId) {
            if (notification.link) {
                window.notificationLinks[notificationId] = notification.link;
            }
        });
        window.system.playNotificationSound();
        window.system.getBadge().increase();
    });
};
NotificationQueueClass.prototype.getNext = function () {
    if (this.notifications.length == 0) {
        return;
    }
    var firstNotification = this.notifications[0];
    return firstNotification.createEntry();
};
NotificationQueueClass.prototype.showNext = function () {
    this.notifications.shift();
    var firstNotification = this.getNext();
    if (!firstNotification) {
        return;
    }
    this.show(firstNotification);
};
"use strict";
function NotificationRepository(notificationArray) {
    this.notificationArray = notificationArray;
}
NotificationRepository.prototype.findById = function (id) {
    for (var index = 0; index < this.notificationArray.length; index++) {
        var notification = this.notificationArray[index];
        if (notification.id === id) {
            return notification;
        }
    }
    return null;
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
"use strict";
var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };
function SocketClass() {
    this.socket = null;
    this.socketServer = 'php';
}
SocketClass.prototype.resetReconnectCount = function () {
    this.reconnectCount = 0;
};
SocketClass.prototype.increaseReconnectCount = function () {
    this.reconnectCount++;
};
SocketClass.prototype.getReconnectCount = function () {
    return this.reconnectCount;
};
SocketClass.prototype.open = function () {
    var that = this;
    this.reconnectCount = 0;
    this.load();
};
SocketClass.prototype.load = function () {
    var that = this;
    this.socket = new WebSocket(window.config.webSocketHost);
    this.socket.onopen = function (msg) {
        that.onOpen(msg);
    };
    this.socket.onmessage = function (msg) {
        that.onMessage(msg);
    };
    this.socket.onerror = function (msg) {
        that.onError(msg);
    };
    this.socket.onclose = function (msg) {
        that.onClose(msg);
    };
};
SocketClass.prototype.reload = function () {
    this.load();
};
SocketClass.prototype.isOpen = function () {
    if (!this.socket) {
        return false;
    }
    return this.socket && this.socket.readyState == 1;
};
SocketClass.prototype.send = function (data) {
    var that = this;
    window.user.promise(function (userInfo) {
        data.mentorUserId = userInfo.mentorUserId;
        data.identity = "chrome-extension";
        data.notifierAlgorithmVersion = 2;
        var manifest = chrome.runtime.getManifest();
        data.version = manifest.version;
        data = that.toJSON(data);
        if (that.isOpen()) {
            that.socket.send(data);
        }
    });
};
SocketClass.prototype.toJSON = function (data) {
    if ((typeof data === "undefined" ? "undefined" : _typeof(data)) == "object") {
        data = JSON.stringify(data);
    }
    return data;
};
SocketClass.prototype.close = function () {
    if (this.socket) {
        this.socket.close();
    }
    this.socket = null;
};
SocketClass.prototype.onOpen = function (msg) {
    var that = this;
    window.system.getSocket().resetReconnectCount();
    var translationFactory = new TranslationFactory(window);
    window.translationUpdater = translationFactory.createUpdater(this);
    window.user.promise(function (userInfo) {
        window.system.getSocket().resetReconnectCount();
        I18n.loadData(function () {
            that.send(window.translationUpdater.createMentorLoginRequest(userInfo.mentorUserId));
        });
    });
};
SocketClass.prototype.onMessage = function (msg) {
    var data = JSON.parse(msg.data);
    if (data.command) {
        switch (data.command) {
            case 'mentor-logged':
                {
                    if (this.isCorrectSocket(data.websocketServer) == false && window.configManager.isStandardConfig() == true) {
                        this.close();
                        this.changeWebsocketServerInfoTo(data.websocketServer);
                        this.open();
                        return;
                    }
                    chrome.browserAction.setIcon({ path: { '19': 'images/icon-logged-in-38.png', '38': 'images/icon-logged-in-38.png' } });
                    window.notificationStatus = data.notificationStatus;
                    if (data.notificationsBadge) {
                        if (window.notificationStatus) {
                            window.system.getBadge().setNumber(data.notificationsBadge);
                        }
                    }
                    var now = parseInt(new Date().getTime() / 1000);
                    window.user.setShOnly(data.isShonly);
                    window.user.setIftttCache(data.iftttCache);
                    window.user.setTrackDomains(data.trackDomains);
                    window.user.setTrackDomainsHarvester(data.trackDomainsHarvester);
                    window.user.setServerOffset(data.serverTimeUTC - now);
                    window.user.setUserActivityFeedFlags(data.userActivityFeedFlags);
                    window.user.setCompanyActivityFeedFlags(data.companyActivityFeedFlags);
                    window.user.setSocialButtonsOrder(data.socialButtons.order);
                    window.user.setOptionalSocialNetworks(data.socialButtons.extra);
                    if (window.system.getRabbitManager()) {
                        window.system.getRabbitManager().setTimeOffset(window.user.getServerOffset());
                        window.system.getRabbitManager().setSocketServerInfo(data.serverIp, data.serverPort);
                    }
                    if (window.system.getRabbitIFTTTManager()) {
                        window.system.getRabbitIFTTTManager().setTimeOffset(window.user.getServerOffset());
                        window.system.getRabbitIFTTTManager().setSocketServerInfo(data.serverIp, data.serverPort);
                    }
                    if (window.system.getRabbitPopupManager()) {
                        window.system.getRabbitPopupManager().setTimeOffset(window.user.getServerOffset());
                        window.system.getRabbitPopupManager().setSocketServerInfo(data.serverIp, data.serverPort);
                    }
                    window.system.setPingIntervalTime(data.pingIntervalSec);
                    window.user.setRecruitEnabled(data.isRecruitEnabled);
                    window.user.setLicenseValid(data.isLicenseValid);
                    window.user.setRoles(data.roles);
                    window.user.setRoleNames(data.roleNames);
                    var translationFactory = new TranslationFactory(window);
                    var translationDictionary = data.translation ? data.translation.dictionary : undefined;
                    window.translationUpdater.setup(translationFactory.createTranslationId(data), translationDictionary);
                    var popupSettingsModel = new PopupSettingsModel(data.popupSettings.permits);
                    popupSettingsModel.save();
                }
                break;
            case 'mentor-notify':
                {
                    if (window.notificationStatus == true) {
                        var notificationObj = new NotificationClass(data, window.user);
                        if (notificationObj.canShow() == false) {
                            return;
                        }
                        var notificationEntry = notificationObj.createEntry();
                        window.notifications.unshift(notificationEntry);
                        window.system.getNotificationQueue().show(notificationEntry);
                        var popups = chrome.extension.getViews({ type: 'popup' });
                        if (popups.length) {
                            popups[0].notificationCenter.uninitialize();
                            popups[0].notificationCenter.initialize();
                            popups[0].notificationCenter.scrollNewNotificationUp();
                        }
                    }
                }
                break;
            case 'mentor-check-permissions':
                {
                    window.user.setRecruitEnabled(data.isRecruitEnabled);
                    window.user.setLicenseValid(data.isLicenseValid);
                    window.user.setIftttCache(data.iftttCache);
                    window.user.setTrackDomains(data.trackDomains);
                    window.user.setRoles(data.roles);
                }
                break;
            case 'mentor-linkedin-profile-visited':
            case 'rabbit-response':
                {
                    var message = {
                        data: data,
                        user: {
                            socialButtonsOrder: window.user.getSocialButtonsOrder(),
                            optionalSocialNetworks: window.user.getOptionalSocialNetworks()
                        }
                    };
                    chrome.tabs.sendMessage(data.tabId, message);
                }
                break;
            case 'force-relogin':
                {
                    var that = this;
                    window.user.promise(function (userInfo) {
                        var request = {
                            command: 'mentor-login',
                            mentorUserId: userInfo.mentorUserId
                        };
                        if (data.options && data.options.length > 0) {
                            request.options = data.options;
                        }
                        that.send(request);
                    });
                }
                break;
            case 'mentor-notify-feed':
                {
                    var popups = chrome.extension.getViews({ type: 'popup' });
                    if (popups.length) {
                        popups[0].notificationCenter.getFeed().catchNewNotifications(data.notifications);
                    }
                }
                break;
            case 'mark-popup-search-visible':
                {
                    chrome.tabs.sendMessage(data.tabId, data);
                }
                break;
        }
    }
};
SocketClass.prototype.onError = function (msg) {};
SocketClass.prototype.onClose = function (msg) {
    chrome.browserAction.setIcon({ path: { '19': 'images/icon-not-logged-in-38.png', '38': 'images/icon-not-logged-in-38.png' } });
    window.system.getBadge().clear();
};
SocketClass.prototype.isCorrectSocket = function (websocketServer) {
    return websocketServer === this.socketServer;
};
SocketClass.prototype.changeWebsocketServerInfoTo = function (socketServer) {
    this.socketServer = socketServer;
    window.config.webSocketHost = window.config.webSocketHostNode;
};
"use strict";
function BadgeClass() {
    this.badgeNumber = 0;
    chrome.browserAction.setBadgeBackgroundColor({
        color: "#b91816"
    });
}
BadgeClass.prototype.clear = function () {
    var that = this;
    that.badgeNumber = 0;
    chrome.browserAction.setBadgeText({ text: "" });
};
BadgeClass.prototype.increase = function () {
    this.badgeNumber++;
    chrome.browserAction.setBadgeText({ text: this.badgeNumber.toString() });
};
BadgeClass.prototype.decrease = function (notificationId) {
    var that = this;
    window.user.promise(function (userInfo) {
        that.badgeNumber--;
        if (notificationId) {
            window.system.getSocket().send({
                "command": "mentor-read-notification",
                "notificationId": notificationId
            });
        }
        if (that.badgeNumber <= 0) {
            that.badgeNumber = 0;
            chrome.browserAction.setBadgeText({ text: "" });
        } else {
            chrome.browserAction.setBadgeText({ text: that.badgeNumber.toString() });
        }
    });
};
BadgeClass.prototype.setNumber = function (number) {
    this.badgeNumber = number;
    chrome.browserAction.setBadgeText({ text: this.badgeNumber.toString() });
};
'use strict';
function notifyIconExists(filename, callback) {
    filename = 'images/notify-icons/' + filename + '.png';
    fileExists(filename, callback);
}
function fileExists(filename, callback) {
    chrome.runtime.getPackageDirectoryEntry(function (storageRootEntry) {
        checkFileExists(storageRootEntry, filename, callback);
    });
}
function checkFileExists(storageRootEntry, fileName, callback) {
    storageRootEntry.getFile(fileName, {
        create: false
    }, function () {
        callback(true);
    }, function () {
        callback(false);
    });
}
"use strict";
chrome.history.onVisited.addListener(function (history_item) {
    var url = history_item.url;
    if (url.indexOf(window.config.domainMentor) != -1) {
        if (url.indexOf('/secure/logout') != -1) {
            window.user.promise(function (userInfo) {
                window.system.getSocket().send({
                    "command": "mentor-logout"
                });
            });
            window.user.logout();
        }
        else {
                window.user.promise(function (userInfo) {
                    window.system.useSqs = userInfo.mentorQueueServerType == 'sqs' ? true : false;
                    window.user.setLoggedIn(true);
                    window.configManager.setUserConfig(userInfo['mentorCompanyId']);
                    window.config = window.configManager.getCurrent();
                    window.system.openWorkers(userInfo);
                });
            }
    }
});
chrome.tabs.onCreated.addListener(function (tab) {
    window.system.getSocket().send({
        command: 'chromeextension-currentdevice'
    });
});
'use strict';
chrome.notifications.onClicked.addListener(function (notificationId) {
    if (window.notificationLinks[notificationId]) {
        focusOrCreateTabLink(window.notificationLinks[notificationId]);
        var repository = new NotificationRepository(window.notifications);
        var notificationObject = repository.findById(notificationId);
        var sendClickNotification = function sendClickNotification(userInfo) {
            var manifest = chrome.runtime.getManifest();
            window.system.getIftttQueue().sendMessage({
                mentorUserId: userInfo.mentorUserId,
                version: manifest.version,
                ifttt: false,
                noFeedback: true,
                command: 'store-user-action',
                action: 'NotificationPopupClicked',
                iftttId: notificationObject.iftttId,
                link: notificationObject.link
            });
        };
        if (notificationObject) {
            window.user.promise(sendClickNotification);
        }
    }
    window.readNotifications[notificationId] = 1;
});
chrome.notifications.onButtonClicked.addListener(function (notificationId, buttonId) {
    window.user.promise(function (userInfo) {
        var request = {
            message: {
                activityFeedNudge: 1,
                mentorUserId: userInfo.mentorUserId,
                feedId: notificationId
            }
        };
        switch (buttonId) {
            case 0:
                {
                    request.message.nudgeType = 'thumbsup';
                }
                break;
            case 1:
                {
                    request.message.nudgeType = 'thumbsdown';
                }
                break;
        }
        if (!window.nudgesSent) {
            window.nudgesSent = [];
        }
        window.system.getBadge().decrease(notificationId);
        window.nudgesSent[notificationId] = request.message.nudgeType;
        window.system.getRpcQueue().sendMessage(request);
        chrome.notifications.clear(notificationId, function () {});
    });
});
'use strict';
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    window.user.promise(function (userInfo) {
        request.mentorUserId = userInfo.mentorUserId;
        switch (request.command) {
            case 'analyze-url':
            case 'set-url-synonymous':
                {
                    var responser = sendResponse;
                    request.tabId = sender.tab.id;
                    var messageNo = window.system.getPopupQueue().sendMessage(request);
                }
                break;
            case 'redirect':
                {
                    if (request.openNewTab) {
                        chrome.tabs.create({
                            openerTabId: sender.tab.id,
                            index: sender.tab.index + 1,
                            url: request.url
                        });
                    } else {
                        chrome.tabs.update(sender.tab.id, { url: request.url });
                    }
                }
                break;
            case 'mentor-check-permissions':
                {
                    sendResponse({
                        isRecruitEnabled: window.user.isRecruitEnabled(),
                        isLicenseValid: window.user.isLicenseValid()
                    });
                }
                break;
            case 'get-last-user-vsearch-default':
            case 'get-last-user-people-like-this':
            case 'get-last-user-vsearch-advanced':
            case 'get-search-by-id':
                {
                    var responser = sendResponse;
                    request.tabId = sender.tab.id;
                    var messageNo = window.system.getPopupQueue().sendMessage(request);
                }
                break;
            case 'get-backend-stuff':
                {
                    window.user.promise(function (userInfo) {
                        sendResponse({
                            domainMentor: window.config.domainMentor,
                            mentorUserId: userInfo.mentorUserId,
                            mentorCompanyId: userInfo.mentorCompanyId
                        });
                    });
                }
                break;
            case 'get-user-role':
                {
                    sendResponse(window.user.userRole);
                }
                break;
            case 'save-social-buttons-order':
                {
                    var responser = sendResponse;
                    request.tabId = sender.tab.id;
                    var messageNo = window.system.getPopupQueue().sendMessage(request);
                    window.user.setSocialButtonsOrder(request.order);
                }
                break;
            case 'create-advanced-search':
            case 'update-user-vsearch-advanced':
            case 'update-linkedin-search-result-count':
            case 'action-on-popup':
                {
                    var responser = sendResponse;
                    request.tabId = sender.tab.id;
                    var messageNo = window.system.getPopupQueue().sendMessage(request);
                }
                break;
            case 'send-harvester-request':
                {
                    if (isUrlAllowed(request.url, 'harvester')) {
                        var manifest = chrome.runtime.getManifest();
                        var version = manifest.version;
                        window.system.getRpcQueue().sendMessage({
                            mentorUserId: userInfo.mentorUserId,
                            command: 'rabbit-harvester-store',
                            harvester: true,
                            tabId: sender.tab.id,
                            version: version,
                            url: request.url,
                            title: request.title,
                            noFeedback: true
                        });
                    }
                }
                break;
            case 'send-ifttt-request':
                {
                    var urlAllowed = isUrlAllowed(request.url, 'ifttt') || isMentorUrlAllowed(request.url);
                    if (urlAllowed && !window.user.isShOnly() && window.user.isLicenseValid()) {
                        window.system.getIftttQueue().sendMessage({
                            mentorUserId: userInfo.mentorUserId,
                            ifttt: true,
                            tabId: sender.tab.id,
                            url: request.url,
                            command: 'match-url',
                            noFeedback: true
                        });
                    } else if (window.user.isShOnly() && urlAllowed && isShonlyUrlAllowed(request.url)) {
                        window.system.getIftttQueue().sendMessage({
                            mentorUserId: userInfo.mentorUserId,
                            ifttt: true,
                            tabId: sender.tab.id,
                            url: request.url,
                            command: 'match-url',
                            noFeedback: true
                        });
                    }
                }
                break;
            case 'mark-popup-search-visible':
                {
                    var proxy = request;
                    proxy.tabId = sender.tab.id;
                    window.system.getSocket().send(proxy);
                }
                break;
        }
    });
    return true;
});
"use strict";
chrome.runtime.onSuspend.addListener(function callback() {
  window.system.getSocket().close();
});
window.onerror = function () {};
window.addEventListener('load', function () {
  function updateOnlineStatus(event) {
    var condition = navigator.onLine ? "online" : "offline";
    if (condition == 'offline') {
    } else {
      chrome.runtime.reload();
    }
  }
  window.addEventListener('online', updateOnlineStatus);
  window.addEventListener('offline', updateOnlineStatus);
});
'use strict';
setInterval(function () {
    window.user.promise(function (userInfo) {
        window.user.setLoggedIn(true);
        if (window.system.getSocket().isOpen() == false) {
            window.system.getSocket().close();
            window.system.getSocket().increaseReconnectCount();
            if (['live', 'sandbox', 'rc', 'local'].indexOf(window.configManager.getType()) != -1) {
                window.configManager.changeSocketPorts();
            }
            window.config = window.configManager.getCurrent();
            try {
                window.system.getSocket().reload();
            } catch (e) {}
        }
    });
}, 20 * 1000);
setInterval(function () {
    if (window.system.getWorkerStatus() != 'opened') {
        return;
    }
    if (!window.system.getRabbitManager()) {
        return;
    }
    if (window.system.getRabbitManager().getStatus() == 'opened' && window.system.getRabbitManager().getReadyState() != 1) {
        if (window.configManager.getType() == 'live') {
            window.configManager.changeRabbitPorts();
            window.config = window.configManager.getCurrent();
        }
    }
    var doWorkerReconnect = function doWorkerReconnect(worker, configSet) {
        if (worker.getStatus() == 'opened' && worker.getReadyState() != 1) {
            try {
                worker.reconnect(window.config[configSet].connectionString);
            } catch (e) {
            }
        }
    };
    doWorkerReconnect(window.system.getRabbitManager(), "rabbit");
    doWorkerReconnect(window.system.getRabbitIFTTTManager(), "ifttt");
    doWorkerReconnect(window.system.getRabbitPopupManager(), "popup");
}, 20 * 1000);
setInterval(function () {
    window.user.promise(function (userInfo) {
        window.system.getSocket().send({
            'command': 'mentor-check-permissions'
        });
    });
}, 86400 * 1000);
'use strict';
function StorageChangesModel(changeData) {
    this.data = parseChanges(changeData);
    function parseChanges(changeData) {
        var result = {};
        for (var key in changeData) {
            result[key] = changeData[key].newValue;
        }
        return result;
    }
}
StorageChangesModel.prototype.getData = function () {
    return this.data;
};
StorageChangesModel.prototype.isWritableToBackend = function () {
    return this.data && this.data.hasOwnProperty('permits');
};
'use strict';
chrome.storage.onChanged.addListener(function (changes, namespace) {
    var changesModel = new StorageChangesModel(changes);
    if (!changesModel.isWritableToBackend()) {
        return;
    }
    window.system.getSocket().send({
        command: 'savepopupsettings',
        data: changesModel.getData(),
        noFeedback: true
    });
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
var tabBullhornSearch = {};
var bullhornUrl = 'https://www.bullhornstaffing.com/';
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    switch (request.command) {
        case 'set-bullhorn-search':
            tabBullhornSearch[sender.tab.id] = {
                query: request.search,
                jobTitleQuery: request.jobTitleQuery,
                locations: request.locations
            };
            break;
        case 'set-bullhorn-url':
            bullhornUrl = request.url;
            break;
        case 'get-bullhorn-url':
            sendResponse(bullhornUrl);
            break;
    }
});
chrome.tabs.onUpdated.addListener(function onBullhornTabUpdated(tabId, changeInfo, tab) {
    var path = new BullhornPathClass(tab.url);
    if (!path.isBullhornPage()) {
        return;
    }
    if (!changeInfo.status || changeInfo.status !== 'loading') {
        return;
    }
    setTimeout(function () {
        chrome.tabs.sendMessage(tabId, {
            command: 'run-bullhorn-search',
            tabId: tab.openerTabId,
            search: tabBullhornSearch[tab.openerTabId]
        });
    }, 2200);
});
'use strict';
function ClassSqs(accessKeyId, secretAccessKey, region, queueUrl) {
    this.sqs = new AWS.SQS({
        accessKeyId: accessKeyId,
        secretAccessKey: secretAccessKey,
        region: region,
        params: { QueueUrl: queueUrl }
    });
}
ClassSqs.prototype.sendMessage = function (message) {
    if (this.websocketsAreOff() && this.canSendMessageOnSocketFailure(message) == false) {
        return;
    }
    message = JSON.stringify(message);
    this.sqs.sendMessage({ MessageBody: message }, function (error, data) {
        if (error) {
            console.log(error);
        }
    });
};
ClassSqs.prototype.websocketsAreOff = function () {
    return window.system.getSocket().isOpen() == false;
};
ClassSqs.prototype.canSendMessageOnSocketFailure = function (message) {
    if (message.command == 'rabbit-harvester-store') {
        return true;
    }
    return false;
};
ClassSqs.prototype.close = function () {};