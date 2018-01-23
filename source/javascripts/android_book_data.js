var androidBooks = [];
function appendAndroidBooks(name, alimamaLink, amazonLink) {
    var book = new Book(name);
    book.alimamaLink = alimamaLink;
    book.amazonLink = amazonLink;
    androidBooks.push(book);
}


function shouldDisplayAndroidBook() {
   
	return false;
}

function makeAndroidBookPrefix() {
	return '<section><h1>Android推荐书籍</h1>';
}

function makeAndroidBookSuffix() {
	return '</section>';
}

function isAndroidBookInDebug() {
	return false;
}

function makeAndroidBookData() {
    var name,alimamaLink, amazonLink;
    name = 'Android群英传';
    amazonLink = 'http://www.amazon.cn/gp/product/B01481RAA4/ref=as_li_qf_sp_asin_il_tl?ie=UTF8&camp=536&creative=3200&creativeASIN=B01481RAA4&linkCode=as2&tag=droidyue-23';
    alimamaLink = "http://union.click.jd.com/jdc?e=&p=AyIHZR5aEQISA1AYUyUCEgFRElkXByJDCkMFSjJLQhBaUAscSkIBR0ROVw1VC0dFFQIUA1wZWRAdS0IJRmtWdhB3EmJTYmBPfQxHWhQBYlcCaTllDh43Vx1TFgQSBFQaaxcAEgdcH1sUByI3NGlrR2zKsePD%2FqQexq3aztOCMhABXRhdFwEbAGUbXhELEA5XHV8XChYPZRw%3D&t=W1dCFBBFC1pXUwkEAEAdQFkJBVsVBBYOVxleCltXWwg%3D";
    appendAndroidBooks(name, alimamaLink, amazonLink);

    name = 'Android开发艺术探索';
    amazonLink = 'http://www.amazon.cn/gp/product/B014HV1X3K/ref=as_li_qf_sp_asin_il_tl?ie=UTF8&camp=536&creative=3200&creativeASIN=B014HV1X3K&linkCode=as2&tag=droidyue-23';
    alimamaLink = 'http://union.click.jd.com/jdc?e=&p=AyIHZR5aEQISA1AYUyUCEgFSGlgUCiJDCkMFSjJLQhBaUAscSkIBR0ROVw1VC0dFFQIUAFQYWh0dS0IJRmtXCmBzM0YAaWBSWwJAHFFeFwIiYAxDDh43Vx1TFgQSBFQaaxcAEgdcH1sUByI3NGlrR2zKsePD%2FqQexq3aztOCMhABXRhdFwEbAGUbXhELEA5QGl0dBhEEZRw%3D&t=W1dCFBBFC1pXUwkEAEAdQFkJBVsVBBUGVhpTCltXWwg%3D';
    appendAndroidBooks(name, alimamaLink, amazonLink);

    name =  'Android源码设计模式解析与实战';
    amazonLink = 'http://www.amazon.cn/gp/product/B0176QDPUW/ref=as_li_qf_sp_asin_il_tl?ie=UTF8&camp=536&creative=3200&creativeASIN=B0176QDPUW&linkCode=as2&tag=droidyue-23';
    alimamaLink = 'http://union.click.jd.com/jdc?e=&p=AyIHZR5aEQISA1AYUyUCEgFdGVMWCyJDCkMFSjJLQhBaUAscSkIBR0ROVw1VC0dFFQIUD1cTWBwdS0IJRmtFHGxBJnArfmB0XwFvDkpAEkMHQll1Dh43Vx1TFgQSBFQaaxcAEgdcH1sUByI3NGlrR2zKsePD%2FqQexq3aztOCMhABXRhdFwEbAGUbXhELEA5QG1scBhcFZRw%3D&t=W1dCFBBFC1pXUwkEAEAdQFkJBVsVBBoFXRhSCltXWwg%3D';
    appendAndroidBooks(name, alimamaLink, amazonLink);

    name = 'Android应用性能优化';
    amazonLink = 'http://www.amazon.cn/gp/product/B009VV6EG8/ref=as_li_qf_sp_asin_il_tl?ie=UTF8&camp=536&creative=3200&creativeASIN=B009VV6EG8&linkCode=as2&tag=droidyue-23';
    alimamaLink = 'http://union.click.jd.com/jdc?e=&p=AyIHZR5aEQISA1AYUyUCEgdUHlMTBSJDCkMFSjJLQhBaUAscSkIBR0ROVw1VC0dFFQISBlATXRIdS0IJRmteBW1GJ1sycGFxeQZzWGl8Ulw3GRl1Dh43Vx1TFgQSBFQaaxcAEgdcH1sUByI3NGlrR2zKsePD%2FqQexq3aztOCMhABXRhdFwEbAGUbXhELEA5QG1ISBBMFZRw%3D&t=W1dCFBBFC1pXUwkEAEAdQFkJBVsVAhMCXR1cCltXWwg%3D';
	appendAndroidBooks(name, alimamaLink,amazonLink);

    name = 'Android游戏开发详解';
    amazonLink = 'http://www.amazon.cn/gp/product/B011I34CHO/ref=as_li_qf_sp_asin_il_tl?ie=UTF8&camp=536&creative=3200&creativeASIN=B011I34CHO&linkCode=as2&tag=droidyue-23';
    alimamaLink = 'http://union.click.jd.com/jdc?e=&p=AyIHZR5aEQISA1AYUyUCEgFXGFgVBCJDCkMFSjJLQhBaUAscSkIBR0ROVw1VC0dFFQIUBVYYWxMdS0IJRmt8VVRUAF0uZ2J2YQIdJE5YenswGidTDh43Vx1TFgQSBFQaaxcAEgdcH1sUByI3NGlrR2zKsePD%2FqQexq3aztOCMhABXRhdFwEbAGUbXhELEA5QGFkdBhIDZRw%3D&t=W1dCFBBFC1pXUwkEAEAdQFkJBVsVBBAEVhtdCltXWwg%3D';
    appendAndroidBooks(name, alimamaLink,amazonLink);


    name = '深入理解 Android';
    amazonLink = 'http://www.amazon.cn/gp/product/B013GB9WVM/ref=as_li_qf_sp_asin_il_tl?ie=UTF8&camp=536&creative=3200&creativeASIN=B013GB9WVM&linkCode=as2&tag=droidyue-23';
    alimamaLink = 'http://union.click.jd.com/jdc?e=&p=AyIHZR5aEQISA1AYUyUCEgFRGlsXCiJDCkMFSjJLQhBaUAscSkIBR0ROVw1VC0dFFQIUA1QbWR0dS0IJRmtGXGhQXXIsRmFLfStuBl54eVowXyN1Dh43Vx1TFgQSBFQaaxcAEgdcH1sUByI3NGlrR2zKsePD%2FqQexq3aztOCMhABXRhdFwEbAGUbXhELEA5QHl8RBxUHZRw%3D&t=W1dCFBBFC1pXUwkEAEAdQFkJBVsVBBYGVRlTCltXWwg%3D';
    appendAndroidBooks(name, alimamaLink, amazonLink);


    name = 'Android 软件安全与逆向分析';
    amazonLink = 'http://www.amazon.cn/gp/product/B00BMTVUGG/ref=as_li_qf_sp_asin_il_tl?ie=UTF8&camp=536&creative=3200&creativeASIN=B00BMTVUGG&linkCode=as2&tag=droidyue-23';
    alimamaLink = 'http://union.click.jd.com/jdc?e=&p=AyIHZR5aEQISA1AYUyUCEgdcHFkXBCJDCkMFSjJLQhBaUAscSkIBR0ROVw1VC0dFFQISDlIZWRMdS0IJRmtSRlBxEXo9d2JRTyJPHG9JUW8iBQh1Dh43Vx1TFgQSBFQaaxcAEgdcH1sUByI3NGlrR2zKsePD%2FqQexq3aztOCMhABXRhdFwEbAGUbXhELEA5QHlMQBRYAZRw%3D&t=W1dCFBBFC1pXUwkEAEAdQFkJBVsVAhsAVxldCltXWwg%3D';
    appendAndroidBooks(name, alimamaLink, amazonLink);


    name = 'Android 安全架构深究';
    amazonLink = 'http://www.amazon.cn/gp/product/B01B38QVSC/ref=as_li_qf_sp_asin_il_tl?ie=UTF8&camp=536&creative=3200&creativeASIN=B01B38QVSC&linkCode=as2&tag=droidyue-23';
    alimamaLink = 'http://union.click.jd.com/jdc?e=&p=AyIHZR5aEQISA1AYUyUCEg5SE1gcACJDCkMFSjJLQhBaUAscSkIBR0ROVw1VC0dFFQIbAF0YUhcdS0IJRmtBQ1JvPH1SSGJMeRdSDk53TkA%2BeztTDh43Vx1TFgQSBFQaaxcAEgdcH1sUByI3NGlrR2zKsePD%2FqQexq3aztOCMhABXRhdFwEbAGUbXhELEA5QH1gdAhUOZRw%3D&t=W1dCFBBFC1pXUwkEAEAdQFkJBVsVCxUPVhJZCltXWwg%3D';
    appendAndroidBooks(name, alimamaLink, amazonLink);


	name = 'Android开发进阶:从小工到专家';
	amazonLink = 'http://www.amazon.cn/gp/product/B01C7I1NZS/ref=as_li_qf_sp_asin_il_tl?ie=UTF8&camp=536&creative=3200&creativeASIN=B01C7I1NZS&linkCode=as2&tag=droidyue-23';
	alimamaLink = 'http://union.click.jd.com/jdc?e=&p=AyIHZR5aEQISA1AYUyUCEg5cGlkSCyJDCkMFSjJLQhBaUAscSkIBR0ROVw1VC0dFFQIbDlQZXBwdS0IJRmtPfXlGFhgMF2BpBClfAH1JemQ1YC11Dh43Vx1TFgQSBFQaaxcAEgdcH1sUByI3NGlrR2zKsePD%2FqQexq3aztOCMhABXRhdFwEbAGUbXhELEA5QHFoTChUHZRw%3D&t=W1dCFBBFC1pXUwkEAEAdQFkJBVsVCxsGVxxSCltXWwg%3D';
	appendAndroidBooks(name, alimamaLink, amazonLink);

	name = 'Gradle For Android 中文版';
    amazonLink = 'https://www.amazon.cn/gp/product/B01M27OLDP/ref=as_li_qf_sp_asin_il_tl?ie=UTF8&camp=536&creative=3200&creativeASIN=B01M27OLDP&linkCode=as2&tag=droidyue-23';
    alimamaLink = 'http://union-click.jd.com/jdc?e=0&p=AyIHZR5aEQISA1AYUyUCEg9dH10RCiJDCkMFSjJLQhBaUAscSkIBR0ROVw1VC0dFFQIaD1EdXx0dS0IJRmt1dWdbDlwOTWJLZRN%2BW01kEHcXEl5TDh43Vx1TFgQSBFQaaxcAEgdcH1sUByI3VRprR2zKsePD%2FqQexq3aztOCMhABXRhdFwEbAGUbXh0CFwVTGl4VChQBZRxrRV1HRAtDDl1GRjdlK2s%3D&t=W1dCFBBFC1pXUwkEAEAdQFkJBVsVChoDUx9TCltXWwg%3D';
    appendAndroidBooks(name, amazonLink, alimamaLink);

    data = booksToJSON(androidBooks, LINK_TYPE_ALIMAMA);
    return data;
}

function displayAndroidBook() {
    var data = makeAndroidBookData();
    data = sortJsonObject(data);
	displaySection(shouldDisplayAndroidBook(), isAndroidBookInDebug(),   data,    makeAndroidBookPrefix(),    makeAndroidBookSuffix(), 'android_book'  );
}
