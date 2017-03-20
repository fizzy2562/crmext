'use strict';
function SwitchClass(switchElement, options) {
    this.switchElement = switchElement;
    this.options = options;
    this.value = false;
    this.enabled = true;
    this.name = this.switchElement.data('name');
    this.initialize(switchElement, options);
}
SwitchClass.prototype.initialize = function (switchElement, options) {
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
SwitchClass.prototype.hasOption = function (name) {
    if (typeof this.options[name] !== 'undefined') {
        return true;
    }
    return false;
};
SwitchClass.prototype.getValue = function () {
    return this.value;
};
SwitchClass.prototype.enable = function () {
    this.enabled = true;
    this.switchElement.removeClass('disabled');
};
SwitchClass.prototype.disable = function () {
    this.enabled = false;
    this.switchElement.addClass('disabled');
};
SwitchClass.prototype.isEnabled = function () {
    return this.enabled;
};
'use strict';
function HtmlTranslator(containerElement) {
    this.container = containerElement;
}
HtmlTranslator.prototype.translateElements = function () {
    var translatableNodeList = this.container.querySelectorAll('.st-translatable');
    for (var index = 0; index < translatableNodeList.length; index++) {
        var element = translatableNodeList[index];
        var translation = __(element.dataset.translationKey);
        if (translation.length > 0) {
            var target = element.dataset.translationTarget || 'innerHTML';
            element[target] = translation;
        }
    }
};
'use strict';
function SettingsClass(BGPage, body, notificationCenter) {
    this.BGPage = BGPage;
    this.body = body;
    this.notificationCenter = notificationCenter;
    this.opened = false;
    this.initializeCloseButton();
    this.activityFeedSwitchers = [];
    this.initializeNotificationSwitcher();
}
SettingsClass.prototype.initializeCloseButton = function () {
    var that = this;
    this.hamburger = this.body.find('.menu-bars');
    this.closeButton = this.body.find('.close-settings-button');
    this.closeButton.click(function () {
        that.close();
        that.hamburger.removeClass('menu-bars-active');
    });
};
SettingsClass.prototype.initializeNotificationSwitcher = function () {
    var that = this;
    this.notificationSwitch = new SwitchClass($('.notification-switch .switch'), {
        defaultValue: that.BGPage.notificationStatus,
        callback: function callback(data) {
            if (data.isOn) {
                that.body.find('.activity-feed-swichers').addClass('active');
                that.enableNotification(true);
            } else {
                that.body.find('.activity-feed-swichers').removeClass('active');
                that.enableNotification(false);
            }
            that.refreshActivityFeedSwitchers();
        }
    });
    this.initializeActivityFeedSwitchers();
};
SettingsClass.prototype.open = function () {
    var that = this;
    this.body.find('.feed').slideUp(function () {
        that.hamburger.removeClass('blocked');
        setTimeout(function () {
            that.body.find('.settings').slideDown();
            that.opened = true;
        }, 200);
    });
};
SettingsClass.prototype.close = function () {
    var that = this;
    this.body.find('.settings').slideUp(function () {
        setTimeout(function () {
            that.body.find('.feed').slideDown();
            that.opened = false;
            that.hamburger.removeClass('blocked');
        }, 200);
    });
};
SettingsClass.prototype.initializeActivityFeedSwitchers = function () {
    var that = this;
    if (this.userIsManagerOrAdvisor(this.BGPage.user) == false && this.userHasUserRole(this.BGPage.user) == false) {
        this.body.find('.settings').css('padding-bottom', '0px');
        this.body.find('.wrapper h2').addClass('hidden');
        this.body.find('.activity-feed-swichers').addClass('hidden');
        return;
    }
    if (this.notificationSwitch.getValue()) {
        this.body.find('.activity-feed-swichers').addClass('active');
    }
    this.body.find('.activity-feed-swichers .switch').each(function () {
        var name = $(this).data('name');
        var defaultValue = true;
        if (that.BGPage.user.hasCompanyActivityFeedFlag(name)) {
            $(this).addClass('hidden');
        }
        if (that.BGPage.user.hasUserActivityFeedFlag(name)) {
            defaultValue = false;
        }
        var switchObj = new SwitchClass($(this), {
            defaultValue: defaultValue,
            callback: function callback(data) {
                that.sendActivityFeedFlag(data.name, data.isOn);
            }
        });
        if (that.notificationSwitch.getValue() == false) {
            switchObj.disable();
        } else {
            switchObj.enable();
        }
        that.activityFeedSwitchers.push(switchObj);
    });
    if (this.userIsManagerOrAdvisor(this.BGPage.user) == false && this.userHasUserRole(this.BGPage.user) == true) {
        var disallowedSettings = ['stats_courses', 'stats_exams_attempt', 'labs_synonym_histories_first_time_day', 'cron_healthalerts_drop100', 'labs_synonym_logs_first_time_day_wout_linkedin', 'harvester_log_first_time_day'];
        for (var key in disallowedSettings) {
            var value = disallowedSettings[key];
            this.body.find('.switch[data-name="' + value + '"]').parent().remove();
        }
    }
};
SettingsClass.prototype.userIsManagerOrAdvisor = function (user) {
    return user.hasRole('manager') || user.hasRole('advisor');
};
SettingsClass.prototype.userHasUserRole = function (user) {
    if (user.userRole) {
        return user.userRole.hasUserRole();
    }
};
SettingsClass.prototype.refreshActivityFeedSwitchers = function () {
    var that = this;
    for (var key in this.activityFeedSwitchers) {
        var switchObj = this.activityFeedSwitchers[key];
        if (this.notificationSwitch.getValue() == false) {
            switchObj.disable();
        } else {
            switchObj.enable();
        }
    };
};
SettingsClass.prototype.enableNotification = function (status) {
    var that = this;
    this.BGPage.notificationStatus = status;
    this.BGPage.user.promise(function (userInfo) {
        that.BGPage.system.getSocket().send({
            "command": "mentor-toggle-notifications",
            "status": status ? 1 : 0
        });
    });
};
SettingsClass.prototype.sendActivityFeedFlag = function (name, value) {
    var that = this;
    this.BGPage.user.setUserActivityFeedFlag(name, value);
    this.notificationCenter.getFeed().reload();
    this.BGPage.user.promise(function (userInfo) {
        that.BGPage.system.getSocket().send({
            command: 'set-activity-feed-flag',
            flagName: name,
            flagValue: value
        });
    });
};
SettingsClass.prototype.translate = function () {
    var bodyElement = this.body.get(0);
    var translator = new HtmlTranslator(bodyElement);
    translator.translateElements();
    this.translateJobSitesLinkAndDescription(bodyElement.querySelector('#job-sites-list-anchor'));
};
SettingsClass.prototype.translateJobSitesLinkAndDescription = function (jobSitesLinkElement) {
    if (!jobSitesLinkElement) {
        return;
    }
    var descriptionElement = jobSitesLinkElement.closest('.description');
    if (!descriptionElement) {
        return;
    }
    jobSitesLinkElement.href = this.BGPage.config.domainMentor + '/panel/profile/jobSites';
    var translation = __('ce-notification-settings-first-time-job-site-link-label');
    if (translation.length < 1) {
        return;
    }
    jobSitesLinkElement.innerHTML = translation;
    translation = __('ce-notification-settings-first-time-job-site-description', { ':jobSitesLink': jobSitesLinkElement.outerHTML });
    if (translation.length < 1) {
        return;
    }
    descriptionElement.innerHTML = translation;
};
'use strict';
function Notification(notificationData, feed) {
    this.feed = feed;
    this.body = this.feed.body;
    this.BGPage = this.feed.BGPage;
    this.notificationCenter = feed.notificationCenter;
    this.notification = this.create(notificationData);
    if (notificationData.type == 'standard') {
        var extendedNotification = new StandardNotificationClass(this.notification, this.feed);
        extendedNotification.setDetails(notificationData);
        this.notification = extendedNotification.get();
    } else if (notificationData.type == 'activity-feed') {
        notificationData.sentNudge = this.notificationCenter.getActivityFeedNudge(notificationData.id);
        var extendedNotification = new ActivityFeedNotificationClass(this.notification, this.feed, this.BGPage);
        extendedNotification.setDetails(notificationData);
        this.notification = extendedNotification.get();
    }
}
Notification.prototype.create = function (notificationData) {
    var notification = this.body.find('.empty-notification').clone();
    notification = $(notification);
    notification.removeClass('empty-notification');
    notification.addClass('type-' + notificationData.type);
    notification.find('h3').text(notificationData.subject);
    notification.find('.content p').html(notificationData.message);
    notification.attr('data-feedId', notificationData.id);
    notification.find('.sent i').text(notificationData.created_on);
    notification.find('.icon').addClass('icon-' + notificationData.type);
    notification.data('notification-id', notificationData.id);
    notification.find('.time-shift').text(notificationData.stringDate);
    notification = this.createHandlers(notification, notificationData);
    if (notificationData.icon !== undefined) {
        notifyIconExists(notificationData.icon, function (exists) {
            if (exists == false) {
                notificationData.icon = 'icon-smartsearch-social';
            }
            notification.find('.icon img').attr('src', '/images/notify-icons/' + notificationData.icon + '.png');
        });
    } else notification.addClass('hidden');
    return notification;
};
Notification.prototype.createHandlers = function (notification, notificationData) {
    var that = this;
    if (notificationData.is_read || this.BGPage.readNotifications[notificationData.id]) {
        notification.addClass('read');
    }
    notification.find('.close').click(function (e) {
        that.removeNotificationClickHandler(this, notificationData);
        e.stopPropagation();
        return false;
    });
    return notification;
};
Notification.prototype.readNotificationClickHandler = function (notification, notificationData) {
    var notification = $(notification);
    var notificationId = notification.data('notification-id');
    if (notificationData.link) {
        this.BGPage.focusOrCreateTabLink(notificationData.link);
    }
    this.readNotificationRequest(notificationId, notificationData.type);
    if (notification.hasClass('read') == false) {
        this.BGPage.system.getBadge().decrease();
    }
    notification.addClass('read');
    if (this.BGPage.notifications.length == 0) {
        this.body.find('.no-notifications').removeClass('hidden');
    }
    setTimeout(function () {
        chrome.notifications.clear(notificationId, function (notificationId) {});
    }, 500);
};
Notification.prototype.removeNotificationClickHandler = function (notification, notificationData) {
    var notification = $(notification);
    var notificationId = notification.parent().data('notification-id');
    setTimeout(function () {
        chrome.notifications.clear(notificationId, function (notificationId) {});
    }, 500);
    this.removeNotificationRequest(notificationId, notificationData.type);
    if (notification.parent().hasClass('read') == false) {
        this.BGPage.system.getBadge().decrease();
    }
    notification.parent().remove();
    this.removeNotificationFromMemory(notificationId);
    this.feed.decideDisplayNoNotifications(this.BGPage.notifications.length);
    this.feed.decideSendFeedRequest(this.BGPage.notifications);
};
Notification.prototype.removeNotificationFromMemory = function (notificationId) {
    for (var key in this.BGPage.notifications) {
        var notification = this.BGPage.notifications[key];
        if (notification.id == notificationId) {
            this.BGPage.notifications.splice(key, 1);
            return;
        }
    }
};
Notification.prototype.removeNotificationRequest = function (notificationId, notificationType) {
    var that = this;
    for (var key in this.BGPage.notifications) {
        if (notificationId == this.BGPage.notifications[key].id) {
            this.BGPage.notifications.splice(key, 1);
        }
    }
    this.feed.decideDisplayNoNotifications(this.BGPage.notifications.length);
    this.BGPage.user.promise(function (userInfo) {
        that.BGPage.system.getSocket().send({
            command: "mentor-remove-notification",
            notificationId: notificationId,
            notificationType: notificationType
        });
    });
};
Notification.prototype.get = function () {
    return this.notification;
};
'use strict';
function StandardNotificationClass(notification, feed) {
    this.notification = notification;
    this.feed = feed;
}
StandardNotificationClass.prototype.setDetails = function (notificationData) {
    if (notificationData.link && notificationData.link != 'http://') {
        var linkElement = this.notification.find('.link a');
        if (linkElement.length) {
            this.notification.find('.link a').text(notificationData.link);
        } else {
            var backgroundPageWindow = this.feed.BGPage;
            this.notification.click(function () {
                window.open(notificationData.link, '_blank');
                if (notificationData) {
                    backgroundPageWindow.user.promise(function (userInfo) {
                        var manifest = chrome.runtime.getManifest();
                        var request = {
                            mentorUserId: userInfo.mentorUserId,
                            version: manifest.version,
                            ifttt: false,
                            noFeedback: true,
                            command: 'store-user-action',
                            action: 'NotificationRowClicked',
                            link: notificationData.link
                        };
                        if (notificationData.iftttId) {
                            request.iftttId = notificationData.iftttId;
                        }
                        backgroundPageWindow.system.getIftttQueue().sendMessage(request);
                    });
                }
            });
        }
        this.notification.addClass('withLink');
    }
    this.notification.find('.activity-footer .menu').remove();
    if (notificationData.removeNinjaFromNotificationCenter) {
        this.notification.addClass('no-ninja');
    }
    if (notificationData.subject == '') {
        this.notification.find('h3').remove();
    }
};
StandardNotificationClass.prototype.get = function () {
    return this.notification;
};
'use strict';
function ActivityFeedNotificationClass(notification, feed, BGPage) {
    this.BGPage = BGPage;
    this.notification = notification;
    this.feed = feed;
}
ActivityFeedNotificationClass.prototype.setDetails = function (notificationData) {
    var that = this;
    var feedbackType = notificationData.feedback_type;
    if (feedbackType == "none" && notificationData.sentNudge) {
        feedbackType = notificationData.sentNudge;
    }
    if (feedbackType != 'none') {
        this.setFeedbackType(feedbackType);
    } else {
        switch (notificationData.thumb_type) {
            case 'good':
                {
                    this.notification.find('.menu a.thumbsdown').remove();
                }
                break;
            case 'bad':
                {
                    this.notification.find('.menu a.thumbsup').remove();
                }
                break;
        }
        this.notification.find('.menu a').click(function () {
            that.addFeedbackHandler($(this));
        });
    }
    var userRole = this.BGPage.user.userRole;
    if (userRole.canGiveThumbsUp() == false && userRole.hasUserRole()) {
        this.notification.find('.menu a.thumbsdown').remove();
        this.notification.find('.menu a.sadface').remove();
    }
    this.notification.find('h3').attr('data-userId', notificationData.user_id);
    if (notificationData.feed_message) {
        this.notification.find('.content p').html(notificationData.feed_message);
    } else {
        this.notification.find('.content p').html(notificationData.chrome_ext_message);
    }
    this.notification.find('.content p a').click(function () {
        chrome.tabs.create({
            url: $(this).attr('href')
        });
        return false;
    });
    if (notificationData.item_name) {
    }
    this.setFilters(notificationData);
};
ActivityFeedNotificationClass.prototype.setFeedbackType = function (feedbackType) {
    this.notification.find('.menu a.' + feedbackType).addClass('active');
    this.notification.find('.menu').addClass('menu-choosen');
    this.notification.addClass('read');
};
ActivityFeedNotificationClass.prototype.addFeedbackHandler = function (button) {
    var that = this;
    button.addClass('active');
    this.feed.BGPage.user.promise(function (userInfo) {
        var feedId = button.parent().parent().parent().attr('data-feedId');
        var nudgeType = button.attr('data-type');
        button.parent().addClass('menu-choosen').addClass('menu-complete');
        button.unbind('click');
        that.feed.notificationCenter.addActivityFeedNudge(feedId, nudgeType);
        that.feed.BGPage.system.getRpcQueue().sendMessage({ message: {
                command: 'rabbit-activityfeed-feedback',
                activityFeedNudge: 1,
                mentorUserId: userInfo.mentorUserId,
                feedId: feedId,
                nudgeType: nudgeType
            } });
    });
};
ActivityFeedNotificationClass.prototype.createPortalLink = function (itemName) {
    var itemName = this.capitalizeFirstLetter(itemName);
    var paragraph = this.notification.find('.content p');
    var content = paragraph.html();
    if (content.indexOf(itemName) != -1) {
        var spannedItemName = '<a class="portal">' + itemName + '</a>';
        paragraph.html(content.replace(itemName, spannedItemName));
        paragraph.find('a').attr('data-portalName', itemName);
    }
};
ActivityFeedNotificationClass.prototype.capitalizeFirstLetter = function (string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
};
ActivityFeedNotificationClass.prototype.setFilters = function (notificationData) {
    var that = this;
    this.notification.find('h3').click(function () {
    });
    this.notification.find('.content p .portal').click(function () {
    });
};
ActivityFeedNotificationClass.prototype.get = function () {
    return this.notification;
};
"use strict";
var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };
function FeedClass(BGPage, body) {
    this.BGPage = BGPage;
    this.body = body;
    this.notificationCenter = null;
    this.isEnd = false;
    this.isDuringRequest = false;
}
FeedClass.prototype.initialize = function (wrapper) {
    var that = this;
    this.wrapper = wrapper;
    wrapper.onscroll = function (e) {
        if (this.scrollTop + this.offsetHeight >= this.scrollHeight) {
            that.sendFeedRequest();
        }
    };
    if (this.notificationCenter.canDisplayDisconnectedInfo() == false) {
        this.sendFeedRequest();
    }
};
FeedClass.prototype.reload = function () {
    var that = this;
    this.uninitialize();
    setTimeout(function () {
        that.initialize(that.wrapper);
    }, 200);
};
FeedClass.prototype.uninitialize = function () {
    this.wrapper.onscroll = null;
    this.BGPage.notifications = [];
    this.body.find('.notification:not(.empty-notification)').remove();
};
FeedClass.prototype.setNotificationCenter = function (notificationCenter) {
    this.notificationCenter = notificationCenter;
};
FeedClass.prototype.decideSendFeedRequest = function (notifications) {
    if (((typeof notifications === "undefined" ? "undefined" : _typeof(notifications)) == "object" || typeof notifications == "array") && notifications.length < 5) {
        this.sendFeedRequest();
    }
};
FeedClass.prototype.sendFeedRequest = function () {
    if (this.isEnd == true) {
        return;
    }
    if (this.isDuringRequest == true) {
        return;
    }
    this.isDuringRequest = true;
    this.showAjaxLoader();
    var that = this;
    this.BGPage.user.promise(function (userInfo) {
        that.BGPage.activePopup = that;
        that.BGPage.system.getSocket().send({
            command: "mentor-notify-feed",
            skip: document.getElementsByClassName('notification').length - 1
        });
    });
};
FeedClass.prototype.showAjaxLoader = function () {
    if (this.BGPage.system.getSocket().isOpen() && this.BGPage.user.isLoggedIn()) {
        this.body.find('.feed-loader').removeClass('hidden');
    }
};
FeedClass.prototype.hideAjaxLoader = function () {
    this.body.find('.feed-loader').addClass('hidden');
    $('.socket-reconnect-info').addClass('hidden');
    $('.st-icon-gear').removeClass('hidden');
};
FeedClass.prototype.catchNewNotifications = function (notifications) {
    if (this.BGPage.user.isLoggedIn()) {
        this.BGPage.notifications.push.apply(this.BGPage.notifications, notifications);
        this.decideDisplayNoNotifications(this.BGPage.notifications.length);
        this.showNotifications(notifications);
        this.hideAjaxLoader();
        if (notifications.length == 0) {
            this.isEnd = true;
        }
        this.isDuringRequest = false;
    }
};
FeedClass.prototype.decideDisplayNoNotifications = function (length) {
    if (length > 0) {
        this.body.find('.no-notifications').addClass('hidden');
    } else {
        this.body.find('.no-notifications').removeClass('hidden');
    }
};
FeedClass.prototype.showNotifications = function (notifications) {
    if (notifications.length < 1) {
        return;
    }
    for (var key in notifications) {
        var currentNotification = notifications[key];
        this.createNotificationRow(currentNotification);
    }
};
FeedClass.prototype.createNotificationRow = function (notificationData) {
    var notification = new Notification(notificationData, this).get();
    this.body.find('.notification-list').append(notification);
};
'use strict';
function NotificationCenterClass(BGPage) {
  this.BGPage = BGPage;
  this.BGPage.notifications = [];
}
NotificationCenterClass.prototype.open = function (body) {
  this.BGPage.activePopup = this;
  this.body = $(body);
  if (navigator.onLine) {
    this.initialize();
  } else {
    this.translateConnectionErrorMessage(this.body[0].querySelector('#socket-reconnect-info-link-details-trigger'));
    var translator = new HtmlTranslator(this.body[0].querySelector('#header'));
    translator.translateElements();
    this.reconect();
  }
};
NotificationCenterClass.prototype.reconect = function () {
  var that = this;
  that.BGPage.system.closeWorkers();
  that.BGPage.system.openWorkers();
  $('.close-popup-button .st-icon-close').click(function () {
    window.close();
  });
  $('.st-icon-gear').addClass('hidden');
  var onSocialTalentLogoClick = function onSocialTalentLogoClick() {
    var mentor_url = that.BGPage.config.domainMentor + "/panel";
    var mentor_url2 = that.BGPage.config.domainMentor + "/admin";
    var param_url = "/secure/login?extension=1";
    that.BGPage.focusOrCreateTab(mentor_url, mentor_url2, param_url);
  };
  $('#logo-sourcehub').click(onSocialTalentLogoClick);
  $('.logo-socialtalent').click(onSocialTalentLogoClick);
  $('.socket-reconnect-info').removeClass('hidden');
  document.getElementById('error-code').innerHTML = '#606';
  $('#socket-reconnect-info-link-details-trigger').click(function () {
    $('.feed-loader').removeClass('hidden');
    that.BGPage.system.getSocket().resetReconnectCount();
    if (that.BGPage.system.getRabbitManager()) {
      that.BGPage.system.getRabbitManager().setReconnectCount(0);
    }
    if (that.BGPage.system.getRabbitIFTTTManager()) {
      that.BGPage.system.getRabbitIFTTTManager().setReconnectCount(0);
    }
    if (that.BGPage.system.getRabbitPopupManager()) {
      that.BGPage.system.getRabbitPopupManager().setReconnectCount(0);
    }
    if (navigator.onLine) {
      that.initialize();
      $('.feed-loader').addClass('hidden');
      $('.socket-reconnect-info').addClass('hidden');
      $('.st-icon-gear').removeClass('hidden');
      that.feed.reload();
    }
  });
};
NotificationCenterClass.prototype.initialize = function () {
  if (this.BGPage.user.isLoggedIn() == true) {
    this.initializeLoggedIn();
  } else {
    this.initializeLoggedOut();
  }
  this.initializeCommon();
};
NotificationCenterClass.prototype.initializeLoggedIn = function () {
  var that = this;
  this.body.find('.login-text').addClass('hidden');
  this.BGPage.system.getBadge().clear();
  this.body.find('.notification-switch img').css('cursor', 'pointer');
  if (this.BGPage.notificationStatus) {
    this.body.find('.notification-switch img').attr('src', '/images/notifications-on.png');
  } else {
    this.body.find('.notification-switch img').attr('src', '/images/notifications-off.png');
  }
  this.settings = new SettingsClass(this.BGPage, this.body, this);
  this.settings.translate();
  this.feed = new FeedClass(this.BGPage, this.body);
  this.feed.setNotificationCenter(this);
  this.feed.initialize(document.getElementsByClassName('feed')[0]);
};
NotificationCenterClass.prototype.initializeLoggedOut = function () {
  this.body.find('.login-text').removeClass('hidden');
  this.body.find('.notification-switch').addClass('hidden');
  var translator = new HtmlTranslator(this.body[0]);
  translator.translateElements();
};
NotificationCenterClass.prototype.initializeCommon = function () {
  var that = this;
  $('.close-popup-button .st-icon-close').click(function () {
    window.close();
  });
  var onSocialTalentLogoClick = function onSocialTalentLogoClick() {
    var mentor_url = that.BGPage.config.domainMentor + "/panel";
    var mentor_url2 = that.BGPage.config.domainMentor + "/admin";
    var param_url = "/secure/login?extension=1";
    that.BGPage.focusOrCreateTab(mentor_url, mentor_url2, param_url);
  };
  $('#logo-sourcehub').click(onSocialTalentLogoClick);
  $('.logo-socialtalent').click(onSocialTalentLogoClick);
  if (this.canDisplayDisconnectedInfo()) {
    $('.socket-reconnect-info').removeClass('hidden');
    that.BGPage.system.closeWorkers();
    that.BGPage.system.openWorkers();
    document.getElementById('error-code').innerHTML = this.checkErrorCode();
  } else {
    $('.socket-reconnect-info').addClass('hidden');
  }
  $('.socket-reconnect-info .close').click(function () {
    that.BGPage.system.getSocket().resetReconnectCount();
    if (that.BGPage.system.getRabbitManager()) {
      that.BGPage.system.getRabbitManager().setReconnectCount(0);
    }
    if (that.BGPage.system.getRabbitIFTTTManager()) {
      that.BGPage.system.getRabbitIFTTTManager().setReconnectCount(0);
    }
    if (that.BGPage.system.getRabbitPopupManager()) {
      that.BGPage.system.getRabbitPopupManager().setReconnectCount(0);
    }
    $(this).parent().parent().addClass('hidden');
  });
  this.translateConnectionErrorMessage(this.body[0].querySelector('#socket-reconnect-info-link-details-trigger'));
  var clicks = 0;
  $('#socket-reconnect-info-link-details-trigger').click(function () {
    clicks += 1;
    if (clicks < 2) {
      chrome.runtime.reload();
    }
  });
  $('#job-sites-list-anchor').attr('href', this.BGPage.config.domainMentor + '/panel/profile/jobSites');
  this.initializeHeader();
};
NotificationCenterClass.prototype.initializeHeader = function () {
  this.initializeHamburger();
  var userRole = this.BGPage.user.userRole;
  if (userRole && userRole.canGiveThumbsUp()) {
    this.body.find('#st-activity-feed-question-icon').removeClass('hidden');
    this.initializeTooltips();
  }
};
NotificationCenterClass.prototype.initializeHamburger = function () {
  var that = this;
  this.hamburger = this.body.find('.menu-bars');
  if (this.isSocketOpen() == false || this.isUserLoggedIn() == false) {
    this.hamburger.addClass('hidden');
  }
  this.hamburger.click(function () {
    var activeClassName = 'st-icon-gear-active';
    if (that.settings.opened == false) {
      this.classList.add(activeClassName);
      that.settings.open();
      that.body.find('#st-activity-feed-question-icon').prop('title', __('ce-activity-feed-settings-tooltip'));
    } else {
      this.classList.remove(activeClassName);
      that.settings.close();
      that.body.find('#st-activity-feed-question-icon').prop('title', __('ce-activity-feed-notifications-tooltip'));
    }
  });
};
NotificationCenterClass.prototype.isSocketOpen = function () {
  return this.BGPage.system.getSocket().isOpen();
};
NotificationCenterClass.prototype.isUserLoggedIn = function () {
  return this.BGPage.user.isLoggedIn();
};
NotificationCenterClass.prototype.initializeTooltips = function () {
  $('.st-tooltip').tooltip({
    position: { my: 'center top', at: 'left bottom', collision: 'fit fit' },
    tooltipClass: 'st-tooltip-window'
  });
};
NotificationCenterClass.prototype.translateConnectionErrorMessage = function (clickHereLinkElement) {
  'use strict';
  if (!clickHereLinkElement) {
    return;
  }
  var spanElement = clickHereLinkElement.closest('span');
  if (!spanElement) {
    return;
  }
  var translation = __(clickHereLinkElement.dataset.translationKey);
  if (translation.length < 1) {
    return;
  }
  clickHereLinkElement.innerHTML = translation;
  translation = __(spanElement.dataset.translationKey, { ':clickHereLink': clickHereLinkElement.outerHTML });
  if (translation.length < 1) {
    return;
  }
  spanElement.innerHTML = translation;
};
NotificationCenterClass.prototype.canDisplayDisconnectedInfo = function () {
  var userLoggedIn = this.isUserLoggedIn();
  if (userLoggedIn == false) {
    return false;
  }
  if (this.BGPage.system.getSocket()) {
    if (this.BGPage.system.getSocket().isOpen() == false) {
      return true;
    }
  }
  if (this.BGPage.system.getRabbitManager()) {
    if (this.BGPage.system.getRabbitManager().isOpen() == false) {
      return true;
    }
  }
  if (this.BGPage.system.getRabbitIFTTTManager()) {
    if (this.BGPage.system.getRabbitIFTTTManager().isOpen() == false) {
      return true;
    }
  }
  if (this.BGPage.system.getRabbitPopupManager()) {
    if (this.BGPage.system.getRabbitPopupManager().isOpen() == false) {
      return true;
    }
  }
  if (this.BGPage.system.getRpcQueueStatus()) {
    if (this.BGPage.system.getRpcQueueStatus().websocketsAreOff() == true) {
      return true;
    }
  }
  return false;
};
NotificationCenterClass.prototype.checkErrorCode = function () {
  var userLoggedIn = this.isUserLoggedIn();
  if (userLoggedIn == false) {
    return '#101';
  }
  if (this.BGPage.system.getSocket()) {
    if (this.BGPage.system.getSocket().isOpen() == false) {
      if (this.BGPage.system.getSocket().socketServer == 'node') {
        return '#203';
      } else {
        return '#202';
      }
    }
  }
  if (this.BGPage.system.getRabbitManager()) {
    if (this.BGPage.system.getRabbitManager().isOpen() == false) {
      return '#303';
    }
  }
  if (this.BGPage.system.getRabbitIFTTTManager()) {
    if (this.BGPage.system.getRabbitIFTTTManager().isOpen() == false) {
      return '#404';
    }
  }
  if (this.BGPage.system.getRabbitPopupManager()) {
    if (this.BGPage.system.getRabbitPopupManager().isOpen() == false) {
      return '#505';
    }
  }
  if (this.BGPage.system.getRpcQueueStatus()) {
    if (this.BGPage.system.getRpcQueueStatus().websocketsAreOff() == true) {
      return '#304';
    }
  }
  return '';
};
NotificationCenterClass.prototype.isUserLoggedIn = function () {
  return this.BGPage.user.isLoggedIn();
};
NotificationCenterClass.prototype.getFeed = function () {
  return this.feed;
};
NotificationCenterClass.prototype.addActivityFeedNudge = function (feedId, nudgeType) {
  if (!this.BGPage.nudgesSent) {
    this.BGPage.nudgesSent = [];
  }
  this.BGPage.nudgesSent[feedId] = nudgeType;
};
NotificationCenterClass.prototype.getActivityFeedNudge = function (feedId) {
  if (this.BGPage.nudgesSent) {
    return this.BGPage.nudgesSent[feedId];
  }
  return false;
};
NotificationCenterClass.prototype.uninitialize = function () {
  $(this.body).find('.notification').not('.empty-notification').remove();
};
NotificationCenterClass.prototype.scrollNewNotificationUp = function () {
  var firstNotificationHeight = $(this.body).find('.notification').not('.empty-notification').first().height();
  $(this.body).find('.feed').get(0).scrollTop += parseInt(firstNotificationHeight) + 20;
};
$(document).ready(function () {
  var onTranslationsLoaded = function onTranslationsLoaded() {
    var BGPage = chrome.extension.getBackgroundPage();
    window.notificationCenter = new NotificationCenterClass(BGPage);
    notificationCenter.open($('body'));
    var background = chrome.extension.getBackgroundPage();
    background.system.getSocket().send({
      command: 'chromeextension-currentdevice'
    });
    addEventListener("unload", function (event) {
      background.system.getSocket().send({
        command: 'mentor-read-notifications'
      });
    }, true);
  };
  I18n.loadData(onTranslationsLoaded);
});
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