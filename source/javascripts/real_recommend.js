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
	appendRecommend('断舍离', 'http://union.click.jd.com/jdc?e=&p=AyIHZR5aEQISA1AYUyUCEgRRElMcAiJDCkMFSjJLQhBaUAscSkIBR0ROVw1VC0dFFQIRA1wTUhUdS0IJRmtcUFB0JW4ObWJVBDZsIUwHYHIWH1h1Dh43Vx1TFgQSBFQaaxcAEgdcH1sUByI3NGlrR2zKsePD%2FqQexq3aztOCMhcEUx9eEgMWA2UbXhMCEw9dHloRAhUHZRxrRV1HRAtDDl1GRjdl&t=W1dCFBBFC1pXUwkEAEAdQFkJBVsVARYOXRJbCltXWwg%3D', 'http://7jpolu.com1.z0.glb.clouddn.com/duansheli.jpg');

	appendRecommend('褚时健传', 'http://union.click.jd.com/jdc?e=&p=AyIHZR5aEQISA1AYUyUCEg5UGFwSBiJDCkMFSjJLQhBaUAscSkIBR0ROVw1VC0dFFQIbBlYcXBEdS0IJRmtqcBUZK1xFD2FHAF1bRVQHblMNZDxTDh43Vx1TFgQSBFQaaxcAEgdcH1sUByI3NGlrR2zKsePD%2FqQexq3aztOCMhcEUx9eEgMWA2UbXhMAEgBWG1kUCxMOZRxrRV1HRAtDDl1GRjdl&t=W1dCFBBFC1pXUwkEAEAdQFkJBVsVCxMEUhxfCltXWwg%3D', 'http://7jpolu.com1.z0.glb.clouddn.com/chushijian.jpg');

	appendRecommend('罗马人的故事', 'http://union.click.jd.com/jdc?e=&p=AyIHZR5aEQISA1AYUyUCEw9XGFkcAiJDCkMFSjJLQhBaUAscSkIBR0ROVw1VC0dFFQMaBVYZUhUdS0IJRmtmA2d6KHkYHGBgUy5EJn52QlU3GV1TDh43Vx1TFgQSBFQaaxcAEgdcH1sUByI3NGlrR2zKsePD%2FqQexq3aztOCMhcEUx9eEgMWA2UbXhwDEAJVHlsQABoBZRxrRV1HRAtDDl1GRjdl&t=W1dCFBBFC1pXUwkEAEAdQFkJBVsUChAEVxJbCltXWwg%3D', 'http://7jpolu.com1.z0.glb.clouddn.com/luomarendegushi.jpg');

	appendRecommend("柴静，看见", "https://www.amazon.cn/gp/product/B00BN5O1XI/ref=as_li_qf_sp_asin_il_tl?ie=UTF8&camp=536&creative=3200&creativeASIN=B00BN5O1XI&linkCode=as2&tag=droidyue-23", "http://7jpolu.com1.z0.glb.clouddn.com/kanjian_chaijing.jpg");

	appendRecommend("人类简史:从动物到上帝", "http://union-click.jd.com/jdc?e=0&p=AyIHZR5aEQISA1AYUyUCEQdWH1MWByJDCkMFSjJLQhBaUAscSkIBR0ROVw1VC0dFFQESBFETWBAdS0IJRmtuBUdXXVs5fWdiRx1LBQtDU1cuGyNTDh43Vx1TFgQSBFQaaxcAEgdcH1sUByI3VRprR2zKsePD%2FqQexq3aztOCMhcEUx9eEgMWA2UbXh0DEQRdGl8RCxYGZRxrRV1HRAtDDl1GRjdlK2s%3D&t=W1dCFBBFC1pXUwkEAEAdQFkJBVsWAhEDXRheCltXWwg%3D", "http://7jpolu.com1.z0.glb.clouddn.com/renleijianshi.jpg");

	appendRecommend('解忧杂货店', 'http://union-click.jd.com/jdc?e=0&p=AyIHZR5aEQISA1AYUyUCEgJRGFIQAyJDCkMFSjJLQhBaUAscSkIBR0ROVw1VC0dFFQIXA1YSXhQdS0IJRmtwB2hVFmkFQmFPHQZeLX5RSVgOXT9DDh43Vx1TFgQSBFQaaxcAEgdcH1sUByI3VRprR2zKsePD%2FqQexq3aztOCMhcEUx9eEgMWA2UbXh0DEQBcGlgWABYFZRxrRV1HRAtDDl1GRjdlK2s%3D&t=W1dCFBBFC1pXUwkEAEAdQFkJBVsVBxYEXB5aCltXWwg%3D', 'http://7jpolu.com1.z0.glb.clouddn.com/jieyouzahuodian.jpg');

	appendRecommend('从0到1', 'http://union-click.jd.com/jdc?e=0&p=AyIHZR5aEQISA1AYUyUCEgBVHl4UAiJDCkMFSjJLQhBaUAscSkIBR0ROVw1VC0dFFQIVB1AeWhUdS0IJRmtBQmgGNVIcYmFbdSBvAEwCelcURSBDDh43Vx1TFgQSBFQaaxcAEgdcH1sUByI3VRprR2zKsePD%2FqQexq3aztOCMhcEUx9eEgMWA2UbXh0DEQBcG1MSAhsOZRxrRV1HRAtDDl1GRjdlK2s%3D&t=W1dCFBBFC1pXUwkEAEAdQFkJBVsVBRICUBpbCltXWwg%3D', 'http://7jpolu.com1.z0.glb.clouddn.com/cong0dao1.jpg');

	appendRecommend('浪潮之巅', 'http://union-click.jd.com/jdc?e=0&p=AyIHZR5aEQISA1AYUyUCEgVSGlwTACJDCkMFSjJLQhBaUAscSkIBR0ROVw1VC0dFFQIQAFQcXRcdS0IJRmtQVkgFV2JaYmASUygSBx1dRAA2HwFTDh43Vx1TFgQSBFQaaxcAEgdcH1sUByI3VRprR2zKsePD%2FqQexq3aztOCMhcEUx9eEgMWA2UbXh0DEQBcHlkQARcAZRxrRV1HRAtDDl1GRjdlK2s%3D&t=W1dCFBBFC1pXUwkEAEAdQFkJBVsVABUGUh1ZCltXWwg%3D', 'http://7jpolu.com1.z0.glb.clouddn.com/langchaozhidian.jpg');

	appendRecommend("Gradle For Android中文版", "http://union-click.jd.com/jdc?e=0&p=AyIHZR5aEQISA1AYUyUCEg9dH10RCiJDCkMFSjJLQhBaUAscSkIBR0ROVw1VC0dFFQIaD1EdXx0dS0IJRmtHfGxsVHgBQGBEQx5aK01BF3gASFtDDh43Vx1TFgQSBFQaaxcAEgdcH1sUByI3VRprR2zKsePD%2FqQexq3aztOCMhcEUx9eEgMWA2UbXh0CFwVTG10SBxcFZRxrRV1HRAtDDl1GRjdlK2s%3D&t=W1dCFBBFC1pXUwkEAEAdQFkJBVsVChoDUx9TCltXWwg%3D", "http://7jpolu.com1.z0.glb.clouddn.com/gradle_for_android.jpg");
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




