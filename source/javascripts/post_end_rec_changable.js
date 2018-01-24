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

appendForeverItems('http://g-ec4.images-amazon.com/images/G/28/kindle/merch/2016/Gen7_eInk/wk5_BacktoSchool/16wk5_PC_GW_vsLCD_Prodetails_1500_300._CB298025990_.jpg', kindleLink, 4);

appendForeverItems('http://g-ec4.images-amazon.com/images/G/28/kindle/merch/2016/Gen7_eInk/wk10_GW/wk11_1500x300_c._CB295350837_.jpg', kindleLink, 6);




appendForeverItems('http://g-ec4.images-amazon.com/images/G/28/kindle/merch/2016/Gen7_eInk/wk11_GW/wk12_1500x300_g._CB294032029_.jpg', kindleLink, 6);
appendForeverItems('http://g-ec4.images-amazon.com/images/G/28/kindle/merch/2016/Gen7_eInk/wk11_GW/wk12_1500x300px_b._CB294032029_.jpg', kindleLink, 6);
appendForeverItems('http://g-ec4.images-amazon.com/images/G/28/kindle/merch/2016/Gen7_eInk/wk11_GW/wk12_1500x300_h_V294032002_share._CB294084061_.jpg', kindleLink, 6);




var kindleUnlimitedLink = 'https://www.amazon.cn/gp/kindle/ku/sign-up/ref=as_li_ss_tl?ie=UTF8&camp=536&creative=3132&linkCode=ur2&tag=droidyue-23';

appendForeverItems('http://g-ec4.images-amazon.com/images/G/28/kindle/ku/entry/KU_2015_1008_1400x300px_h_TCG_Banner._CB289094251_.jpg', kindleUnlimitedLink, 10);





appendForeverItems('http://img11.360buyimg.com/cms/jfs/t1897/34/2648540495/238514/6374b8de/56e61353N0a7cb18b.jpg', 'http://union.click.jd.com/jdc?e=&p=AyIHVCtaJQMiQwpDBUoyS0IQWlALHFBXCE9ETlcNVQtHRUVQVxk0SRphA3RELXkgTWlCUTEcRExHTlpbSRpAUkcLVW4md2ZmN1JiO2NmdV1LeyNnakoHK10IcVxBQjUXVyUAFA9WHVsWAxM3VxlbFQsWB1QeayVjYDcedVolABQPVh1ZFgsVN1UeXxwHFwBSGlsUCxs3UisLSldRWQ1OE1FWIjdU&t=W1dCFBBFC0BCWgEEAEAdQFkJBQtHRwxmB1ovFGRRfzdgA35SRGNSBAJQXk8JB1oORVceByBmOXF2', 4,11);






appendForeverItems('http://img30.360buyimg.com/vclist/jfs/t2179/117/2132989570/347485/c989169f/56c596f4N47370b73.jpg', 'http://union.click.jd.com/jdc?e=&p=AyIHVCtaJQMiQwpDBUoyS0IQWlALHEtXCwQAQB1AWQkFAlNKDV4QRwYlY0VdK2UQd0pwAC9nIGZLen4zHwNiVB4LZRldHQEUB1YaWiUAEAdVEl8VAxc3ZXopJUl8BmUZXR0BFAVWElwlAhcDURJTEQcRD1wSWiUFIlcKThhLWkdPEU9rJQM%3D&t=W1dCFBBFC1tCWUpADgpQTFtLQh1dHUtCCUY%3D', 1);




var kouzhaoCookieName = 'kouzhao';

function makeBannerData() {
    return recommendData;
}

function makeBannerContent(imgUrl, linkUrl) {
    var content;
	content = '<br/><br/><a class="post_end_rec"  href="' + linkUrl + '"><img class="no_boarder_class"  style="max-Width:100%" src="' + imgUrl + '"></a>';
    return content;
}


function makeBannerContentFromData(data) {
    for (var key in data) {
    	return makeBannerContent(key, data[key]);
    }
}

function getAdBanner() {
	var content = '';
    //    addRightAnli('http://droidyue.com', 'http://7jpolu.com1.z0.glb.clouddn.com/alipay_hongbao.jpg', 'alipay');
    //content = content + '<br/><img img class="no_boarder_class" style="max-Width:100%" src="http://7jpolu.com1.z0.glb.clouddn.com/kotlin_in_action_jd.png">'
    //content = content + '<br/><a class="hencoder"  href="http://hencoder.com/?utm_source=jishuxiaoheiwu&utm_medium=banner&utm_content=juhe&utm_campaign=q3_extension"><img class="no_boarder_class"  style="max-Width:100%" src="https://ws1.sinaimg.cn/large/610dc034ly1fjlkrojt3oj20qo04740w.jpg"></a><br/>';
    //content = content + '<a href="http://union-click.jd.com/jdc?d=0yfHIc">玩客云 私人云盘 迅雷 玩客奖励计划 极速下载 隐私加密 手机扩容 多屏播放 轻NAS 科技蓝</a><br>';

    //content = content + '<a href="http://union-click.jd.com/jdc?d=xetvGb">流量总是不够用，可以试试这个超实惠套餐计划，从此肆无忌惮上网了</a><br>'

    //content = content + '<br/><a class="quanmingyunjisuan"  href="https://s.click.taobao.com/t?e=m%3D2%26s%3D%2F1TzyEhCvYAcQipKwQzePCperVdZeJviEViQ0P1Vf2kguMN8XjClAi13s8SG16rKEc82SNFneui3V2HVNDCdH05rfwqVmiO6Ze9HHTCkYP%2BA%2BwYsJaxBaudn1BbglxZYxUhy8exlzcpAFEHVckI7b93srg%2FL%2FeD3keUEnoKELDlWYetMiZZgV%2BSx6OrKqagyklzFeKMz7Cc%2FGaP4xw11%2FizZhcM3IxQF"><img class="no_boarder_class"  style="max-Width:100%" src="http://7jpolu.com1.z0.glb.clouddn.com/quanming_yunjisuan.jpg"></a><br/>';
    if (isWeixinBrowser()) {
        content = content + '<img class="no_boarder_class" width="300" src="http://7jpolu.com1.z0.glb.clouddn.com/zanshangma_yuanchunag.jpeg" style="display:block;margin:auto;">'
    } else {
        content = content + '<p align="center">微信赞赏支持原创</p><img class="no_boarder_class" width="300" src="http://7jpolu.com1.z0.glb.clouddn.com/zanshang_normal_qr.png" style="display:block;margin:auto;">'
    }    
    //content = content + '<br/><a class="shumeipai"  href="http://droidyue.com/blog/2016/08/22/before-you-buy-raspberry-pi/"><img class="no_boarder_class"  style="max-Width:100%" src="http://7jpolu.com1.z0.glb.clouddn.com/Raspberry_Pi_Banner.jpg"></a><br/>';


    //content = content + '<br/><a class="gold.xitu"  href="http://gold.xitu.io/extension/?utm_source=jishuxiaoheiwu&utm_medium=banner&utm_content=juhe&utm_campaign=q3_extension"><img class="no_boarder_class"  style="max-Width:100%" src="http://7jpolu.com1.z0.glb.clouddn.com/gold.xitu_chrome_extension.png"></a><br/>';
    //content = content + '<br/><a class="self.wechat"  href="http://droidyue.com/ninki/index.html"><img class="no_boarder_class"  style="max-Width:100%" src="http://7jpolu.com1.z0.glb.clouddn.com/wechat_xiaoheiwu_weiruanyahei.png"></a><br/>';
    //content += '<br/><a href="https://s.click.taobao.com/t?e=m%3D2%26s%3Dtwaxic1%2FnBccQipKwQzePOeEDrYVVa64K7Vc7tFgwiHjf2vlNIV67v2CpvB032Ag7km9mWjOCUbM3gYQjCL89vSdxyvKgR5IYpon8UCVSYY%2FksPsr02I3%2FBP9rtpny8ZlrfKbc84rleNqlJrbnhsaPKt7zuVF4CWxiXvDf8DaRs%3D&pvid=10_117.100.130.118_5582_1495246280237"><img src="http://7jpolu.com1.z0.glb.clouddn.com/github_t_shirt_wilder.png" class="no_boarder_class"  style="max-Width:100%" ></a>';

    return content;
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
    return  true;
}
        

function showBanner() {
    if (shouldShowBanner()) {
        //console.info("should show banner");


        var bannerHtml = getAdBanner();
        // document.write(bannerHtml);
        $("#post_rec").append(bannerHtml);
      	// increaseViewCount(kouzhaoCookieName);
        //showEasyLink();
    } else {
    	//console.info("Do not show banner");
    }
}
        
showBanner();














