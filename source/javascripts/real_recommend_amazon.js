var realRecommends = [];

function Item(description, linkUrl, imageUrl) {
	this.description = description + '_real';
	this.linkUrl = linkUrl;
	this.imageUrl = imageUrl;
}


function appendRecommend(description, linkUrl, imageUrl, count) {
	var item = new Item(description, linkUrl, imageUrl);
	if (count == undefined) {
		count = 1;
	}
	for (var i=0; i < count; i++) {
		realRecommends.push(item);
	}
	
}

function makeRealRecommendData() {
    appendRecommend("代码整洁之道",
    'http://www.amazon.cn/gp/product/B0031M9GHC/ref=as_li_qf_sp_asin_il_tl?ie=UTF8&camp=536&creative=3200&creativeASIN=B0031M9GHC&linkCode=as2&tag=droidyue-23',
     'http://7jpolu.com1.z0.glb.clouddn.com/daima_zhengjie_zhidao_treated.jpg', 2);


     appendRecommend('重构_改善既有代码的设计',
      'http://www.amazon.cn/gp/product/B011LPUB42/ref=as_li_qf_sp_asin_il_tl?ie=UTF8&camp=536&creative=3200&creativeASIN=B011LPUB42&linkCode=as2&tag=droidyue-23',
      'http://7jpolu.com1.z0.glb.clouddn.com/refactor(%E5%B7%B2%E5%8E%BB%E5%BA%95).jpg', 3);

    appendRecommend('HeadFirst设计模式',
    'http://www.amazon.cn/gp/product/B0011FBU34/ref=as_li_qf_sp_asin_il_tl?ie=UTF8&camp=536&creative=3200&creativeASIN=B0011FBU34&linkCode=as2&tag=droidyue-23',
    'http://7xqzcv.com1.z0.glb.clouddn.com/head_first_design_pattern(%E5%B7%B2%E5%8E%BB%E5%BA%95).jpg', 2);

	appendRecommend(
		'Java编程思想', 'http://www.amazon.cn/gp/product/B0011F7WU4/ref=as_li_qf_sp_asin_il_tl?ie=UTF8&camp=536&creative=3200&creativeASIN=B0011F7WU4&linkCode=as2&tag=droidyue-23',
		'http://7xqzcv.com1.z0.glb.clouddn.com/thinking_in_java(%E5%B7%B2%E5%8E%BB%E5%BA%95).jpg',2);
	
	appendRecommend('Effective_java', 'http://www.amazon.cn/gp/product/B001PTGR52/ref=as_li_qf_sp_asin_il_tl?ie=UTF8&camp=536&creative=3200&creativeASIN=B001PTGR52&linkCode=as2&tag=droidyue-23', 'http://7xqzcv.com1.z0.glb.clouddn.com/effective_java(%E5%B7%B2%E5%8E%BB%E5%BA%95).jpg', 2);
	
	
	appendRecommend('Java虚拟机规范','http://www.amazon.cn/gp/product/B00YS4BPG2/ref=as_li_qf_sp_asin_il_tl?ie=UTF8&camp=536&creative=3200&creativeASIN=B00YS4BPG2&linkCode=as2&tag=droidyue-23','http://img11.360buyimg.com/n1/g15/M00/19/13/rBEhWVKcKTUIAAAAAAbn4n5wJ9kAAGNgwHLPA4ABuf6933.jpg', 1);
	
	appendRecommend('Java核心技术（卷2）', 'http://www.amazon.cn/gp/product/B00IK7SM6O/ref=as_li_qf_sp_asin_il_tl?ie=UTF8&camp=536&creative=3200&creativeASIN=B00IK7SM6O&linkCode=as2&tag=droidyue-23', 'http://7xqzcv.com1.z0.glb.clouddn.com/java_hexin_jishujuan.jpg', 2);
	
	appendRecommend('深入理解Java虚拟机：JVM高级特性与最佳实践（第2版）', 'http://www.amazon.cn/gp/product/B00D2ID4PK/ref=as_li_qf_sp_asin_il_tl?ie=UTF8&camp=536&creative=3200&creativeASIN=B00D2ID4PK&linkCode=as2&tag=droidyue-23', 'http://img13.360buyimg.com/n1/g12/M00/0D/11/rBEQYFGsb1UIAAAAAAOWsjOfTaEAACpKQBilzYAA5bK952.jpg', 1);
	
	appendRecommend('Head first Java', 'http://www.amazon.cn/gp/product/B0011ESWGI/ref=as_li_qf_sp_asin_il_tl?ie=UTF8&camp=536&creative=3200&creativeASIN=B0011ESWGI&linkCode=as2&tag=droidyue-23', 'http://img3x9.ddimg.cn/56/36/9265169-1_w.jpg', 1);
	
	appendRecommend('鸟哥的Linux私房菜', 'http://www.amazon.cn/gp/product/B003TJNO98/ref=as_li_qf_sp_asin_il_tl?ie=UTF8&camp=536&creative=3200&creativeASIN=B003TJNO98&linkCode=as2&tag=droidyue-23', 'http://img3x6.ddimg.cn/93/24/20866026-1_w_2.jpg');
	
	appendRecommend('数据结构与算法分析：Java语言描述', 'http://www.amazon.cn/gp/product/B01CNP0CG6/ref=as_li_qf_sp_asin_il_tl?ie=UTF8&camp=536&creative=3200&creativeASIN=B01CNP0CG6&linkCode=as2&tag=droidyue-23', 'http://7xqzcv.com1.z0.glb.clouddn.com/shujujiegou_yusuanfa(%E5%B7%B2%E5%8E%BB%E5%BA%95).jpg');
	
	appendRecommend('数学之美', 'http://www.amazon.cn/gp/product/B00P6OJ09C/ref=as_li_qf_sp_asin_il_tl?ie=UTF8&camp=536&creative=3200&creativeASIN=B00P6OJ09C&linkCode=as2&tag=droidyue-23', 'http://7xqzcv.com1.z0.glb.clouddn.com/shuxuezhimei(%E5%B7%B2%E5%8E%BB%E5%BA%95).jpg');

	appendRecommend("Java并发编程实战", "http://www.amazon.cn/gp/product/B0077K9XHW/ref=as_li_qf_sp_asin_il_tl?ie=UTF8&camp=536&creative=3200&creativeASIN=B0077K9XHW&linkCode=as2&tag=droidyue-23", "http://img3x5.ddimg.cn/86/20/22606835-1_w_1.jpg");

	appendRecommend("解忧杂货店", "http://www.amazon.cn/gp/product/B00JZ96ZI8/ref=as_li_qf_sp_asin_il_tl?ie=UTF8&camp=536&creative=3200&creativeASIN=B00JZ96ZI8&linkCode=as2&tag=droidyue-23", "http://7xqzcv.com1.z0.glb.clouddn.com/jieyouzahuodian.jpg");
	
	
	appendRecommend('煮酒探西游', 'http://www.amazon.cn/gp/product/B01CHLIZDI/ref=as_li_qf_sp_asin_il_tl?ie=UTF8&camp=536&creative=3200&creativeASIN=B01CHLIZDI&linkCode=as2&tag=droidyue-23', 'http://7jpolu.com1.z0.glb.clouddn.com/zhujiutanxiyou.jpg', 2);
}

function shouldDisplayRealRecommend() {
    return true;
}

function display() {
    if (shouldDisplayRealRecommend()) {
        realRecommends = shuffleArray(realRecommends);

    }
}


if (shouldDisplayRealRecommend()) {
    makeRealRecommendData();
    realRecommends = shuffleArray(realRecommends);
    var item = realRecommends[0];
    var outputHtml = "<a  href='%href%' title='%text%' width='285' class='real_recommend'><img class='no_boarder_class' src='%imgLink%' style='border: 0;'></a>";
    outputHtml = replaceAll(outputHtml, "%href%", item.linkUrl);
    outputHtml = replaceAll(outputHtml, "%text%", item.description);
    outputHtml = replaceAll(outputHtml, "%imgLink%", item.imageUrl);
    document.write(outputHtml);
}




