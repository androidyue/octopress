var rightAnli = '<h4 align="center">特别推荐</h4>';
	function addRightAnli(targetLink, imageLink, title) {
		rightAnli = rightAnli + '<a href="' + targetLink + '" class="bnr_img" title="' +  title + '"><img class="no_boarder_class" style="border: 0;" src="' + imageLink + '" width="280"></a>';
	}

	/*addRightAnli('http://union-click.jd.com/jdc?e=0&p=AyIHZR1SEwEbA1YSUiUAEwBcGVkUMlZYDUUEJVtXQhQQRQtaV1MJBABAHUBZCQVZFAUbBVcaRExHTlplHDNTQRJRCng%2BUWB2fR5cL0ZJU10Da1cZbBEGVR1HFAUOBl0KWBYJEQReG14lABQPVh1bFgMTN1cZWxULFgdUHmslAhM3A3VbFAMTBlMfXB0BIg5SGl0XBBMBVCtbEAoUBlUSWxcHEQFRK1wlUk1SFkUDQEpWU2UrayU%3D&t=W1dCFBBFC1pXUwkEAEAdQFkJBVkUBRsFVxpETEdOWg%3D%3D', 'http://7jpolu.com1.z0.glb.clouddn.com/574d1327Ne8e9f4b1.jpg', 'cup');*/
	
	addRightAnli("http://union-click.jd.com/jdc?d=0adINA","http://7jpolu.com1.z0.glb.clouddn.com/shukoushui.jpg", "shukoushui");

	addRightAnli("http://union-click.jd.com/jdc?d=pKL4Bt", "http://7jpolu.com1.z0.glb.clouddn.com/diandongyashua.jpg", "diandongyashua")

	addRightAnli("http://union-click.jd.com/jdc?d=fCCe9R", "http://7jpolu.com1.z0.glb.clouddn.com/bailing_diandongyashua.jpg", "bailing_diandongyashua")
	document.write(rightAnli);
