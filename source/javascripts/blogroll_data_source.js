function shouldDisplayBlogRoll() {

    return true ;
}

function makeBlogRollPrefix() {
    return '<section><h1>Blogrolls</h1>';
}

function makeBlogRollSuffix() {
    return '</section>';
}

function isBlogRollInDebug() {
    return false;
}

function appendHongxin(data) {
    if (isDesktop()) {
        if (isChrome()){
            data['红杏，为程序员专门打造的上网加速利器，你懂得！'] = 'http://honx.in/_VaJXxWf4PSiXm2ck';
        }
    }
	return data;
}


var sDroidBlogRollClass = "droid_blogroll_class";


function makeBlogRollDataSource() {
    var data = {};
        
    data['技术小黑屋血拼'] = 'http://droidyue.com/buy/';
    //data['友情链接'] = 'http://droidyue.com/links/';
    
    data['Github程序员,极客IT男女秋冬装连帽卫衣外套'] = 'https://s.click.taobao.com/t?e=m%3D2%26s%3DwoSIkDYPqJEcQipKwQzePOeEDrYVVa64K7Vc7tFgwiHjf2vlNIV67tbnx6I9k9jJ7km9mWjOCUbM3gYQjCL89vSdxyvKgR5IYpon8UCVSYbLpyU0ndK1k5QOL1xF%2Fxg18v5XPGCNToGRwDcbfzfTz6Gv2iXKUYvOomfkDJRs%2BhU%3D&pvid=10_117.100.136.71_899_1482670043778';

    /*data['极客学院全套视频下载'] = 'http://s.click.taobao.com/t?e=m%3D2%26s%3Dw1gM%2F0jziq8cQipKwQzePOeEDrYVVa64LKpWJ%2Bin0XLjf2vlNIV67vBvn1DNBijIP9LlJoUu0c7M3gYQjCL89vSdxyvKgR5IYpon8UCVSYYlgUYtDAYC5tdn%2FynGeduACFIsh0pu9ZHWc2yMe80FKMYOae24fhW0&pvid=10_114.66.9.98_4328_1456224291183';   */
        
    //data['极客开源T恤'] = 'http://s.click.taobao.com/t?e=m%3D2%26s%3DVl2ocTpH0WwcQipKwQzePOeEDrYVVa64Qih%2F7PxfOKS5VBFTL4hn2dQBlzdZ0rk2P5bxJy%2F%2Fu7jM3gYQjCL89qULerPwKfMIwRKDNIG1Ob78gzOkuNPsG%2B%2BfxGyA7kO2HcXyKGoE7hfBA6L871fwHMYl7w3%2FA2kb';

    //data['新品程序员短袖T恤'] = 'http://s.click.taobao.com/t?e=m%3D2%26s%3D7TBNtx1gDXwcQipKwQzePOeEDrYVVa64LKpWJ%2Bin0XLjf2vlNIV67iRcR7GgZCx7LzyWwQxzkU%2FM3gYQjCL89vSdxyvKgR5IYpon8UCVSYbE2WWX5zTGD%2B%2BfxGyA7kO2HcXyKGoE7hfBA6L871fwHMYl7w3%2FA2kb&pvid=10_113.45.89.223_345_1461628449968';
    
    //data['说走就走的Airbnb旅行基金'] = 'http://zh.airbnb.com/c/awallace36?s=8';
   
    data['XBrowser-极简快速的浏览器'] = 'http://www.xbext.com';

    //data['网络加速器，用来做啥你懂得'] = 'http://www.pgfastss.org/in/aqjkzq9mw3';
    
 
	
    //data['零散时间写个应用，够付房租了'] = 'https://www.youmi.net/account/register?r=OTU2Ng==';
    
    //data['新网虚拟云主机，6折优惠'] = 'http://www.xinnet.com/virtualhost/virtualhost2.html?rebatecode=RPYPO4B28A4U';
    
    
    //data['我的第一本计算机启蒙书籍：《疯狂的程序员》'] = 'http://www.amazon.cn/gp/product/B008QM2476/ref=as_li_qf_sp_asin_il_tl?ie=UTF8&camp=536&creative=3200&creativeASIN=B008QM2476&linkCode=as2&tag=droidyue-23';

    //data = appendHongxin(data);
    
    data['Vultr VPS, 注册赠送20刀，节点丰富'] = 'http://www.vultr.com/?ref=6985952-3B';
    data['Digital Ocean VPS：注册赠送10刀'] = 'https://m.do.co/c/3c4ff5a7ed39';
    data['超强路由器 网件NETGEAR WIFI双频千兆无线路由器 中继 OPENWRT多拨'] = 'https://s.click.taobao.com/t?e=m%3D2%26s%3DvCkZ5LnV6jEcQipKwQzePOeEDrYVVa64LKpWJ%2Bin0XLjf2vlNIV67qNt1tv4PQ%2FZ2yqscP0DbOLM3gYQjCL89vSdxyvKgR5IYpon8UCVSYYxlixgehhYB0Tt1%2FHfNXx2BMGh5JTLAt%2FtF%2FQ8iK%2FmlXSWvTmLw6qt&pvid=10_45.76.81.169_13674_1479774191207';
    data['通勤读书神器Kindle'] = 'https://www.amazon.cn/gp/product/B0186FESGW/ref=as_li_qf_sp_asin_il_tl?ie=UTF8&camp=536&creative=3200&creativeASIN=B0186FESGW&linkCode=as2&tag=droidyue-23';

    data = sortJsonObject(data);
    
    return data;












}


