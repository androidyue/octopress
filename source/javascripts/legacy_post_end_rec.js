var DEADLINE_FOREVER = -1;
var recommendData = {};

function RecommendItem(imgUrl, linkUrl) {
	this.imageUrl = imgUrl;
	this.linkUrl = linkUrl;
}

function isForever(month, day) {
	return DEADLINE_FOREVER !== month && DEADLINE_FOREVER !== day; 
}

RecommendItem.prototype.setDeadline = function(month, day) {
	if (isForever(month, day)) {
		var myDate = new Date();
    	var deadTime = myDate.setFullYear(myDate.getFullYear(), month -1, day);
    	var days = (deadTime - Date.now()) / (1000 * 60 * 60 * 24);
    	if (days < 0 || days > 30) {
    		return;
    	}
    	//console.info("days" + days);
    	for (var i = 0; i < 30 - days; i++ ) {
    		recommendData[this.imageUrl + '?v=' + i] = this.linkUrl;
    	}
	} else {
		for (var i = 0; i < this.repeatTimes; i++) {
			recommendData[this.imageUrl + '?v=' + i] = this.linkUrl;
		}
	}
}

RecommendItem.prototype.setForever = function() {
	this.setDeadline(DEADLINE_FOREVER, DEADLINE_FOREVER);
}

function appendForeverItems(imageUrl, linkUrl, repeatTimes) {
	var item = new RecommendItem(imageUrl, linkUrl);
	item.repeatTimes = repeatTimes;
	item.setForever();
}

function appendShortLivedItems(imageUrl, linkUrl, month, day) {
	var item = new RecommendItem(imageUrl, linkUrl);
	item.setDeadline(month, day);
}

var kindleLink = 'http://www.amazon.cn/b/ref=as_li_ss_tl?_encoding=UTF8&camp=536&creative=3132&ie=UTF8&linkCode=ur2&node=1757275071&pf_rd_i=desktop&pf_rd_m=A1AJ19PSB66TGU&pf_rd_p=267888112&pf_rd_r=0WWZD66BD7FTZPSCD5DP&pf_rd_s=desktop-takeover&pf_rd_t=36701&tag=droidyue-23';

appendForeverItems('http://g-ec4.images-amazon.com/images/G/28/kindle/merch/2015/English_reading_minisite/15wk47_PC_GW_English-Reading_V2.1_1500_300._CB289187544_.jpg', kindleLink, 5);

appendForeverItems('http://g-ec4.images-amazon.com/images/G/28/kindle/merch/2015/Gen7_eInk/wk51_NewYear/wk51_NewYear_1500x300px_d_rrr._CB285804732_.jpg', kindleLink, 1);

appendForeverItems('http://g-ec4.images-amazon.com/images/G/28/kindle/merch/2015/Gen7_eInk/wk51_NewYear/wk51_NewYear_1500x300px_a._CB285804733_.jpg', kindleLink, 1);

appendForeverItems('http://g-ec4.images-amazon.com/images/G/28/kindle/merch/2015/Gen7_eInk/wk51_NewYear/wk51_NewYear_1500x300_g._CB285804707_.jpg', kindleLink, 5);

appendShortLivedItems('http://g-ec4.images-amazon.com/images/G/28/kindle/merch/2016/Gen7_eInk/wk4_CNY/wk4_2016_0127_1500x300_c._CB299402169_.jpg', kindleLink, 3,1);



appendShortLivedItems('http://g-ec4.images-amazon.com/images/G/28/kindle/merch/2016/Gen7_eInk/wk5_CNY_Vday/Wk5_CNY_1500x300_v5._CB298267902_.jpg', kindleLink, 3, 1);

appendShortLivedItems('http://g-ec4.images-amazon.com/images/G/28/kindle/merch/2016/Gen7_eInk/wk5_CNY_Vday/Wk5_CNY_1500x300_v4._CB298267867_.jpg', kindleLink, 3, 1);

appendShortLivedItems('http://g-ec4.images-amazon.com/images/G/28/kindle/merch/2016/Gen7_eInk/wk5_CNY_Vday/Wk5_CNY_1500x300_Bourbon_Black_v2._CB298267902_.jpg', kindleLink, 3,1);

appendForeverItems('http://g-ec4.images-amazon.com/images/G/28/img15/launchpad/gw/ln_151208_launchpad_atf_20151215134549._CB287177791_SX1500_SY300_.jpg', 'http://www.amazon.cn/b/?_encoding=UTF8&camp=536&creative=3200&ie=UTF8&linkCode=ur2&node=1543442071&tag=droidyue-23', 2);

appendShortLivedItems('http://g-ec4.images-amazon.com/images/G/28/xlhu/Fitbit_1500_300_151208_FFFFFF-new._CB297165942_SX1500_SY300_.jpg', 'http://www.amazon.cn/b/ref=as_li_ss_tl?_encoding=UTF8&camp=536&creative=3132&ie=UTF8&ie=UTF8&linkCode=ur2&node=1791295071&tag=droidyue-23', 2,29);

appendShortLivedItems('http://g-ec4.images-amazon.com/images/G/28/img13_audit/bmvd/banpeng/jingguan/FEB100-30200-80._CB296995286_SX1500_SY300_.jpg', 'http://www.amazon.cn/b/ref=as_li_ss_tl?_encoding=UTF8&camp=536&creative=3132&field-enc-merchantbin=A1AJ19PSB66TGU&ie=UTF8&linkCode=ur2&node=1784460071&tag=droidyue-23', 3,6);

var kindleUnlimitedLink = 'http://www.amazon.cn/s/ref=as_li_ss_tl?_encoding=UTF8&bbn=116169071&camp=536&creative=3132&fst=as%3Aoff&linkCode=ur2&qid=1455787533&rh=n%3A116087071%2Cn%3A!116088071%2Cn%3A116169071%2Cp_n_feature_nineteen_browse-bin%3A1338154071&rnid=1338153071&tag=droidyue-23';

appendForeverItems('http://7xqzcv.com1.z0.glb.clouddn.com/kindle_unlimited_real.png', kindleUnlimitedLink, 5);
appendForeverItems('http://7xqzcv.com1.z0.glb.clouddn.com/kindle_unlimited_2.jpg', kindleUnlimitedLink, 5);

appendShortLivedItems('http://g-ec4.images-amazon.com/images/G/28/PeterHsiao/BT/201601/Editors-pick_2016New_1500_300._CB297853533_SX1500_SY300_.jpg', 'http://www.amazon.cn/b/ref=as_li_ss_tl?_encoding=UTF8&camp=536&creative=3132&field-enc-merchantbin=A1AJ19PSB66TGU&ie=UTF8&linkCode=ur2&node=1772703071&tag=droidyue-23', 3,15);

appendShortLivedItems('http://img10.360buyimg.com/cms/jfs/t2380/298/2169802340/289530/2998f44d/56c2e892Nd489ba40.jpg', 'http://union.click.jd.com/jdc?e=&p=AyIHVCtaJQMiQwpDBUoyS0IQWlALHFBXCE9ETlcNVQtHRUVQVxktRBt2eE5MVF4NCltXWwgVCVRXQlJZGy5oYHZzZVBdbwB3ZTZZPmxkblcoeCQVdGxCDU1XGTIQAV0YXRUBEwZlGVkVAhsDVRpeJTJzdWVQNRQyEAFdGF0XARsAZRteEQYbD1AfWRIKEQRlHGtFXUdEC0MOXUZGN2Ua&t=W1dCFBBFC0BCWgEEAEAdQFkJBQtHRwx%2FCls4b15ZBhBNRExHTlpbSRpAUkcLVW4md2Zm', 2,29);


appendShortLivedItems('http://img11.360buyimg.com/cms/jfs/t2446/322/1559607924/300096/5bc1fdfe/56b3056fN2b8622e1.jpg', 'http://union.click.jd.com/jdc?e=&p=AyIHVCtaJQMiQwpDBUoyS0IQWlALHFBXCE9ETlcNVQtHRUVQVxktRBt2eE5MVF4NCltXWwgVCVRXQlJZGy5oYHZzZVBdbwB3ZTZZPmxkblcoeCQVdGxCDU1XGTIQAV0YXRUBEwZlGVkVAhsDVRpeJTJzdWVQNRQyEAFdGF0XARsAZRteEQYbD1AfWRIKEQRlHGtFXUdEC0MOXUZGN2Ua&t=W1dCFBBFC0BCWgEEAEAdQFkJBQtHRwx%2FCls4b15ZBhBNRExHTlpbSRpAUkcLVW4md2Zm', 2, 29);

appendShortLivedItems('http://img14.360buyimg.com/da/jfs/t2515/73/1045970733/93857/985b1f5/5689ef80N135e7b19.jpeg', 'http://union.click.jd.com/jdc?e=&p=AyIHVCtaJQMiQwpDBUoyS0IQWlALHFBXCE9ETlcNVQtHRUVQVxlQHAttYUpBN01bbh1LQglGa1dWTVATQCt3YFdhLFk4FV9JWDQYCHUOHjdXHVMWBBIEVBprFwASB1wfWxQHIjc0aWtebBM3Vx1TFgQQBFwcaxUHFgNcE18VBxUBUxxrEjJCWABYBU1XWkMBK2sU&t=W1dCFBBFC0BCWgEEAEAdQFkJBQtHRwwCUksjdlpUZQMbIApbV1sI', 2,29);




appendShortLivedItems('http://img14.360buyimg.com/cms/jfs/t1849/283/2164657532/269595/a4ae5cbd/56a86b08N0c0bce52.jpg', 'http://union.click.jd.com/jdc?e=&p=AyIHVCtaJQMiQwpDBUoyS0IQWlALHFBXCE9ETlcNVQtHRUVQVxk9Xi9mfnIAHngsYFRabAcfRExHTlplRQ0VfRoPImg4SQEafyoFKVRxbmA1TVcZMhABXRhdFQETBmUZWRUCGwNVGl4lMnN1ZVA1FDIQAV0YXRcBGwBlG14RBhsPUR1ZFgoRAmUca0VdR0QLQw5dRkY3ZRo%3D&t=W1dCFBBFC0BCWgEEAEAdQFkJBQtHRwxvEG8oaWIVTDZsLkNKeVVRBAJQXk8%3D', 3,15);

appendForeverItems('http://g-ec4.images-amazon.com/images/G/28/img13_audit/bmvd/banpeng/jingguan/changtangongyehua1400x300._CB285226963_SX1500_SY300_.jpg', 'http://www.amazon.cn/gp/feature.html/ref=as_li_ss_tl?ie=UTF8&camp=536&creative=3132&docId=1543178&linkCode=ur2&tag=droidyue-23', 2);

appendForeverItems('http://img30.360buyimg.com/vclist/jfs/t2179/117/2132989570/347485/c989169f/56c596f4N47370b73.jpg', 'http://union.click.jd.com/jdc?e=&p=AyIHVCtaJQMiQwpDBUoyS0IQWlALHEtXCwQAQB1AWQkFAlNKDV4QRwYlY0VdK2UQd0pwAC9nIGZLen4zHwNiVB4LZRldHQEUB1YaWiUAEAdVEl8VAxc3ZXopJUl8BmUZXR0BFAVWElwlAhcDURJTEQcRD1wSWiUFIlcKThhLWkdPEU9rJQM%3D&t=W1dCFBBFC1tCWUpADgpQTFtLQh1dHUtCCUY%3D', 1);

appendForeverItems("http://7jpolu.com1.z0.glb.clouddn.com/shumeipai.png", "http://s.click.taobao.com/t?e=m%3D2%26s%3DFSZIrH21Uz8cQipKwQzePOeEDrYVVa64LKpWJ%2Bin0XLjf2vlNIV67tWSNOYhRjrNahEP0ZrOLIrM3gYQjCL89vSdxyvKgR5IYpon8UCVSYbxWIy%2B2jA4xrIAjHujQBBirrCOu8Hz%2FTMJE9TrMSoiUMYl7w3%2FA2kb&pvid=10_121.19.197.199_351_1455255749260", 5);

appendForeverItems("http://7jpolu.com1.z0.glb.clouddn.com/hhkb.png", 'http://s.click.taobao.com/t?e=m%3D2%26s%3Duuy7b%2BeQP%2FkcQipKwQzePOeEDrYVVa64LKpWJ%2Bin0XLjf2vlNIV67mUSF0vVyx3iHGUKWrwhgPnM3gYQjCL89vSdxyvKgR5IYpon8UCVSYbqBe1QpzXTD8r9%2BaSSwCKhR%2FflDdlO723lSpVZ3fG4y8Yl7w3%2FA2kb&pvid=10_121.19.194.7_203_1455278891527', 2);

var jawboneLink = 'http://s.click.taobao.com/t?e=m%3D2%26s%3DmqOtj3667L4cQipKwQzePOeEDrYVVa64K7Vc7tFgwiHjf2vlNIV67mYWN8HtROwalg6AtVBcXjzM3gYQjCL89vSdxyvKgR5IYpon8UCVSYaKcVk5aiSzVcsE1ZqHgyIqj2aSe2Y4kltNCfRLCq0yEXEqY%2Bakgpmw&pvid=10_114.66.9.98_2506815_1455687324937';

appendForeverItems('http://7xqzcv.com1.z0.glb.clouddn.com/jawbone.png', jawboneLink, 4);
appendForeverItems('http://7xqzcv.com1.z0.glb.clouddn.com/jawbone_detailed.png', jawboneLink, 4);

appendForeverItems('http://img13.360buyimg.com/cms/jfs/t2530/251/1269908532/301264/80020734/5698c334Nec52d826.jpg', 'http://union.click.jd.com/jdc?e=&p=AyIHVCtaJQMiQwpDBUoyS0IQWlALHFBXCE9ETlcNVQtHRUVQVxkicAAUdhd4XE4FYGdvVEpCHklfIgIvRgEceXRHNnBcEGMTbDR5XElrVVFZF2sXBBoEUxtYFAMiBVcbWxwGEgZQK2t0cCJMOxprFwQaBFMZWBwFIgdQH18cChUAVhlSFAYiAGVLBEBBTF8AUx9BMiIG&t=W1dCFBBFC0BCWgEEAEAdQFkJBQtHRwxwPkBaYQdtDgBFLnB%2FQRgMXgdI', 5);

var tableLink = 'http://s.click.taobao.com/t?e=m%3D2%26s%3DPBGlUFMNdgwcQipKwQzePOeEDrYVVa64LKpWJ%2Bin0XJRAdhuF14FMQdxqFRSchTrlovu%2FCElQOtvRUYbRlHU7OsSDvD9jGaL5ryjCDjdIrF%2BHewaVupNzB%2Bom87qGIzo9lujV%2FF3s3AwdIhpqRCnR8YOae24fhW0&pvid=50_113.47.236.171_175_1455945395525';
appendForeverItems('https://gdp.alicdn.com/imgextra/i2/1659276734/TB2ziMTgXXXXXX9XXXXXXXXXXXX_!!1659276734.jpg', tableLink, 8);

appendForeverItems('https://gdp.alicdn.com/imgextra/i2/1659276734/TB2AOEJgXXXXXcoXXXXXXXXXXXX_!!1659276734.jpg', tableLink, 8);

appendForeverItems('https://gdp.alicdn.com/imgextra/i4/1659276734/TB2E27AgXXXXXaEXpXXXXXXXXXX_!!1659276734.jpg', tableLink, 15);

var tiesanjiaoLink = 'http://s.click.taobao.com/t?e=m%3D2%26s%3DVYZjFzfvW%2BUcQipKwQzePOeEDrYVVa64K7Vc7tFgwiHjf2vlNIV67txC87jsuW%2BzUQTSx8a5hQfM3gYQjCL89vSdxyvKgR5IYpon8UCVSYYbSJF1wfKz6K3oPTv3lozVx%2Fcifp%2BmB9bt9mXGUbRShSGFCzYOOqAQ&pvid=10_113.47.252.231_2704156_1455981448624';
appendForeverItems('http://7jpolu.com1.z0.glb.clouddn.com/tiesanjiao.png', tiesanjiaoLink, 10);

var beatsLink = 'http://s.click.taobao.com/t?e=m%3D2%26s%3DSO0WFY2Y0HwcQipKwQzePOeEDrYVVa64K7Vc7tFgwiHjf2vlNIV67hyQFk1PftnnxqmPbz6xcifM3gYQjCL89vSdxyvKgR5IYpon8UCVSYbhlYzFR2RegHRWGnq%2FYQTWT0q0dOInuYZi4ShLMcSUeMYOae24fhW0&pvid=10_113.47.252.231_5027833_1455983103039';
appendForeverItems('http://7xqzcv.com1.z0.glb.clouddn.com/beats_audio.png', beatsLink, 5 );
























var kouzhaoCookieName = 'kouzhao';

function makeBannerData() {
    return recommendData;
}

function makeBannerContent(imgUrl, linkUrl) {
    var content;
	content = '<br/><br/><a class="kouzhao_ref"  href="' + linkUrl + '"><img class="no_boarder_class"  style="max-Width:100%" src="' + imgUrl + '"></a>';
    return content;
}


function makeBannerContentFromData(data) {
    for (var key in data) {
    	return makeBannerContent(key, data[key]);
    }
}


function getBanner() {
    var content;
    var data = makeBannerData();
    data = shuffleJsonObject(data);
    data = splitJSONObject(data, 1);
    content = makeBannerContentFromData(data);
    return content;
}



        
function shouldShowBanner() {
    return isDesktop() ;
}
        

function showBanner() {
    if (shouldShowBanner()) {
        //console.info("should show banner");
        var bannerHtml = getBanner();
        document.write(bannerHtml);
      	increaseViewCount(kouzhaoCookieName);
        //showEasyLink();
    } else {
    	//console.info("Do not show banner");
    }
}
        
showBanner();














