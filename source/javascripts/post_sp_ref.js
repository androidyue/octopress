var kouzhaoCookieName = 'kouzhao';

function makeBannerData() {
    var data = {}; 
    
    //kindle start
    var kindleLink = 'http://www.amazon.cn/b/ref=as_li_ss_tl?_encoding=UTF8&camp=536&creative=3132&ie=UTF8&linkCode=ur2&node=1757275071&pf_rd_i=desktop&pf_rd_m=A1AJ19PSB66TGU&pf_rd_p=267888112&pf_rd_r=0WWZD66BD7FTZPSCD5DP&pf_rd_s=desktop-takeover&pf_rd_t=36701&tag=droidyue-23';
    
    data['http://g-ec4.images-amazon.com/images/G/28/kindle/merch/2015/English_reading_minisite/15wk47_PC_GW_English-Reading_V2.1_1500_300._CB289187544_.jpg'] = kindleLink;
    
    data['http://g-ec4.images-amazon.com/images/G/28/kindle/merch/2015/Gen7_eInk/wk51_NewYear/wk51_NewYear_1500x300px_d_rrr._CB285804732_.jpg'] = kindleLink;
    
    data['http://g-ec4.images-amazon.com/images/G/28/kindle/merch/2015/Gen7_eInk/wk51_NewYear/wk51_NewYear_1500x300px_a._CB285804733_.jpg'] = kindleLink;
    
    
    
    data['http://g-ec4.images-amazon.com/images/G/28/kindle/merch/2015/Gen7_eInk/wk51_NewYear/wk51_NewYear_1500x300_g._CB285804707_.jpg'] = kindleLink;
    
    
    
    data['http://g-ec4.images-amazon.com/images/G/28/kindle/merch/2016/Gen7_eInk/wk4_CNY/wk4_2016_0127_1500x300_c._CB299402169_.jpg'] = kindleLink;

    data['http://g-ec4.images-amazon.com/images/G/28/kindle/merch/2016/Gen7_eInk/wk5_CNY_Vday/Wk5_CNY_1500x300_v5._CB298267902_.jpg'] = kindleLink;

    data['http://g-ec4.images-amazon.com/images/G/28/kindle/merch/2016/Gen7_eInk/wk5_CNY_Vday/Wk5_CNY_1500x300_v4._CB298267867_.jpg'] = kindleLink;

    data['http://g-ec4.images-amazon.com/images/G/28/kindle/merch/2016/Gen7_eInk/wk5_CNY_Vday/Wk5_CNY_1500x300_Bourbon_Black_v2._CB298267902_.jpg'] = kindleLink;

    //kindle end
    
    //amazon inventor forever
    data['http://g-ec4.images-amazon.com/images/G/28/img15/launchpad/gw/ln_151208_launchpad_atf_20151215134549._CB287177791_SX1500_SY300_.jpg'] = 'http://www.amazon.cn/b/?_encoding=UTF8&camp=536&creative=3200&ie=UTF8&linkCode=ur2&node=1543442071&tag=droidyue-23';
    
    
    //fitbit deadline 2.29
    data['http://g-ec4.images-amazon.com/images/G/28/xlhu/Fitbit_1500_300_151208_FFFFFF-new._CB297165942_SX1500_SY300_.jpg'] = 'http://www.amazon.cn/b/ref=as_li_ss_tl?_encoding=UTF8&camp=536&creative=3132&ie=UTF8&ie=UTF8&linkCode=ur2&node=1791295071&tag=droidyue-23';
    
    //books 3.6
    data['http://g-ec4.images-amazon.com/images/G/28/img13_audit/bmvd/banpeng/jingguan/FEB100-30200-80._CB296995286_SX1500_SY300_.jpg'] = 'http://www.amazon.cn/b/ref=as_li_ss_tl?_encoding=UTF8&camp=536&creative=3132&field-enc-merchantbin=A1AJ19PSB66TGU&ie=UTF8&linkCode=ur2&node=1784460071&tag=droidyue-23';


    //kindle unlimited
    var kindleUnlimitedLink = 'http://www.amazon.cn/s/ref=as_li_ss_tl?_encoding=UTF8&bbn=116169071&camp=536&creative=3132&fst=as%3Aoff&linkCode=ur2&qid=1455787533&rh=n%3A116087071%2Cn%3A!116088071%2Cn%3A116169071%2Cp_n_feature_nineteen_browse-bin%3A1338154071&rnid=1338153071&tag=droidyue-23';

    var kindleUnlimitedImage = 'http://7xqzcv.com1.z0.glb.clouddn.com/kindle_unlimited_real.png';

    data[kindleUnlimitedImage + '?v=1'] = kindleUnlimitedLink;
    data[kindleUnlimitedImage + '?v=2'] = kindleUnlimitedLink;
    data['http://7xqzcv.com1.z0.glb.clouddn.com/kindle_unlimited_2.jpg'] = kindleUnlimitedLink;




   
    //editors' choices forever
    data['http://g-ec4.images-amazon.com/images/G/28/PeterHsiao/BT/201601/Editors-pick_2016New_1500_300._CB297853533_SX1500_SY300_.jpg'] = 'http://www.amazon.cn/b/ref=as_li_ss_tl?_encoding=UTF8&camp=536&creative=3132&field-enc-merchantbin=A1AJ19PSB66TGU&ie=UTF8&linkCode=ur2&node=1772703071&tag=droidyue-23';

    //germany books forever
    data['http://g-ec4.images-amazon.com/images/G/28/img13_audit/bmvd/banpeng/jingguan/changtangongyehua1400x300._CB285226963_SX1500_SY300_.jpg'] = 'http://www.amazon.cn/gp/feature.html/ref=as_li_ss_tl?ie=UTF8&camp=536&creative=3132&docId=1543178&linkCode=ur2&tag=droidyue-23';

   

    //not Amazon

    data['http://7jpolu.com1.z0.glb.clouddn.com/shumeipai.png'] = 'http://s.click.taobao.com/t?e=m%3D2%26s%3DFSZIrH21Uz8cQipKwQzePOeEDrYVVa64LKpWJ%2Bin0XLjf2vlNIV67tWSNOYhRjrNahEP0ZrOLIrM3gYQjCL89vSdxyvKgR5IYpon8UCVSYbxWIy%2B2jA4xrIAjHujQBBirrCOu8Hz%2FTMJE9TrMSoiUMYl7w3%2FA2kb&pvid=10_121.19.197.199_351_1455255749260';

    


    data['http://7jpolu.com1.z0.glb.clouddn.com/hhkb.png'] = 'http://s.click.taobao.com/t?e=m%3D2%26s%3Duuy7b%2BeQP%2FkcQipKwQzePOeEDrYVVa64LKpWJ%2Bin0XLjf2vlNIV67mUSF0vVyx3iHGUKWrwhgPnM3gYQjCL89vSdxyvKgR5IYpon8UCVSYbqBe1QpzXTD8r9%2BaSSwCKhR%2FflDdlO723lSpVZ3fG4y8Yl7w3%2FA2kb&pvid=10_121.19.194.7_203_1455278891527';

    


    var jawboneLink = 'http://s.click.taobao.com/t?e=m%3D2%26s%3DmqOtj3667L4cQipKwQzePOeEDrYVVa64K7Vc7tFgwiHjf2vlNIV67mYWN8HtROwalg6AtVBcXjzM3gYQjCL89vSdxyvKgR5IYpon8UCVSYaKcVk5aiSzVcsE1ZqHgyIqj2aSe2Y4kltNCfRLCq0yEXEqY%2Bakgpmw&pvid=10_114.66.9.98_2506815_1455687324937';
    data['http://7xqzcv.com1.z0.glb.clouddn.com/jawbone.png'] = jawboneLink;

    data['http://7xqzcv.com1.z0.glb.clouddn.com/jawbone_detailed.png'] = jawboneLink;

    return data;
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
        

function showLuckyMoney() {
    if (isSelfRefer()) {
        var luckyMoneyImageUrl = 'http://7jpolu.com1.z0.glb.clouddn.com/koulinghongbao.png';
        var outputHtml = "<br/><p>博主发红包了，如果想赞助红包金额，点击<a href='http://droidyue.com/donate/'>这里</a></p><img src='" + luckyMoneyImageUrl + "' style='max-Width:100%'>";
        document.writeln(outputHtml);
    }
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
