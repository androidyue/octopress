	var outputHtml = '<section id="photos">';
	
	
	function addFriend(link, imgLink, title) {
		var aLink = '<a href="' + link +  '"><img class="no_boarder_class" src="' + imgLink + '" title="' + title + ' text="' + title +  '"></a>';
		outputHtml = outputHtml + aLink;
	}
	
	
	function displayFriends() {
		outputHtml = outputHtml + '</section>';
		document.write(outputHtml);
	}
	
	
	addFriend('http://androiddevtools.cn/', 'http://7jpolu.com1.z0.glb.clouddn.com/androiddevtools_cn.png', '收集整理Android开发所需的Android SDK、开发中用到的工具、Android开发教程、Android设计规范，免费的设计素材等。欢迎大家推荐自己在Android开发过程中用的好用的工具、学习开发教程、用到设计素材。');
	
	addFriend('http://androidweekly.cn/', 'http://7jpolu.com1.z0.glb.clouddn.com/androidweekly_cn.png', 'Android 开发技术周报,汇集互联网上每周Android开发的技术文章、开源项目、开发工具、视频教程、Android设计教程、设计资源等。');
	
	addFriend('http://www.codekk.com/', 'http://7jpolu.com1.z0.glb.clouddn.com/codekk-com-130-64.png', 'codeKK，专注于开源项目源码解析及优秀开源项目的分享');
	
	addFriend('http://diycode.cc/', 'http://7jpolu.com1.z0.glb.clouddn.com/diycode.jpg', 'diycode.cc');
	
	addFriend('http://drakeet.me/', 'http://7jpolu.com1.z0.glb.clouddn.com/drakeet.jpg', 'Drakeet');
	
	addFriend('http://droidyue.com/', 'http://7jpolu.com1.z0.glb.clouddn.com/droidyue_com.png', '我自己，技术小黑屋');
	
	addFriend('http://gank.io/', 'http://7jpolu.com1.z0.glb.clouddn.com/gank.jpg', '干货集中营，每日分享妹子图 和 技术干货，还有供大家中午休息的休闲视频');
	
	addFriend('http://gityuan.com/','http://7jpolu.com1.z0.glb.clouddn.com/gityuan-130-64.png','gityuan.com');

	addFriend('http://hukai.me/', 'http://7jpolu.com1.z0.glb.clouddn.com/hukai.jpg', 'Hi，我是胡凯，就职于腾讯从事Android开发的工作。');
	
	addFriend('http://www.liaohuqiu.net/', 'http://7jpolu.com1.z0.glb.clouddn.com/liaohuaqiu_latest.png', '秋百万，Make it better.');
	
	addFriend('http://blog.piasy.com/', 'http://7jpolu.com1.z0.glb.clouddn.com/piasy-com.png', '关注安卓开发，必备开源库源码导读，Advanced RxJava 系列翻译，APP 架构/TDD 的思考与实践');

	addFriend('http://stormzhang.com/', 'http://7jpolu.com1.z0.glb.clouddn.com/stromzhang.png', 'Android开发者 + Ruby语言爱好者 + Google脑残粉，爱技术，爱尝鲜，爱开源，爱设计，也爱赚钱！ 热爱并沉溺于移动互联网，Want to make a good app!');
	
	addFriend('http://www.trinea.cn/', 'http://7jpolu.com1.z0.glb.clouddn.com/trinea.png', 'Trinea，目前在滴滴出行担任技术专家，主攻 Java 和 Android，专于性能调优和框架设计。');
	
	displayFriends();
