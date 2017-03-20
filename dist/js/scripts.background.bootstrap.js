'use strict';
window.configManager = new Config('live');
window.config = window.configManager.getCurrent();
window.notifications = [];
window.notificationLinks = {};
window.notificationStatus = true;
window.readNotifications = [];
window.system = new SystemClass();
window.user = new UserClass();
window.user.promise(function (userInfo) {
				window.system.useSqs = userInfo.mentorQueueServerType == 'sqs' ? true : false;
				window.configManager.setUserConfig(userInfo['mentorCompanyId']);
				window.config = window.configManager.getCurrent();
				window.system.openWorkers();
});