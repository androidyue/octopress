if (sIsWeixinBrowser) {
	var label = document.title;
	if (label.startsWith('weixin://private/setresult')) {
		label = "weixin://private"
	}
	trackEvent('wechat', 'wechat', 'wechat_' + label);
}


var currentHost = getHost(document.URL);
if (!currentHost.contains('droidyue.com')) {
	if (!currentHost.contains("127.0.0.1")) {
		location.href = 'http://droidyue.com';
	}
}

