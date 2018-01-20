var commonBooks = [];
function appendCommonBooks(name, alimamaLink, amazonLink) {
	var book = new Book(name);
	book.alimamaLink = alimamaLink;
	book.amazonLink = amazonLink;
	commonBooks.push(book);
}


function shouldDisplayCommonBook() {
   
	return isDesktop() || isWeixinBrowser();
}

function makeCommonBookPrefix() {
	return '<section><h1>好书推荐</h1>';
}

function makeCommonBookSuffix() {
	return '</section>';
}

function isCommonBookInDebug() {
	return false;
}


var sDroidCommonBookClass = "droid_common_book_class";



function makeCommonBookDataSource() {
    var dataSource = {};
    var name, alimamaLink, amazonLink;
    
    name = '动物农场，不简单的政治童话寓言';
    alimamaLink = 'http://union.click.jd.com/jdc?e=&p=AyIHZR5aEQISA1AYUyUCEg5THVIcASJDCkMFSjJLQhBaUAscSkIBR0ROVw1VC0dFFQIbAVMSUhYdS0IJRmtodwhOCEJSQGFLeScZMnNcFgc3biFDDh43Vx1TFgQSBFQaaxcAEgdcH1sUByI3NGlrR2zKsePD%2FqQexq3aztOCMhABXRhdFwEbAGUbXhEKFgdSHl8XBBIPZRw%3D&t=W1dCFBBFC1pXUwkEAEAdQFkJBVsVCxQBXBJYCltXWwg%3D';
    amazonLink = 'http://www.amazon.cn/gp/product/B003TG14EI/ref=as_li_qf_sp_asin_il_tl?ie=UTF8&camp=536&creative=3200&creativeASIN=B003TG14EI&linkCode=as2&tag=droidyue-23';
    appendCommonBooks(name, alimamaLink, amazonLink);


    name = '人可以被毁灭，但不能被打败：褚时健传 ';
    alimamaLink = 'http://union.click.jd.com/jdc?e=&p=AyIHZR5aEQISA1AYUyUCEg5UGFwSBiJDCkMFSjJLQhBaUAscSkIBR0ROVw1VC0dFFQIbBlYcXBEdS0IJRmtAZBAFK2NaZ2JIBBRTMlJ0GmMVeSRTDh43Vx1TFgQSBFQaaxcAEgdcH1sUByI3NGlrR2zKsePD%2FqQexq3aztOCMhABXRhdFwEbAGUbXhEKFgdSH1oQBRsEZRw%3D&t=W1dCFBBFC1pXUwkEAEAdQFkJBVsVCxMEUhxfCltXWwg%3D';
    amazonLink = 'http://www.amazon.cn/gp/product/B017SAZAD6/ref=as_li_qf_sp_asin_il_tl?ie=UTF8&camp=536&creative=3200&creativeASIN=B017SAZAD6&linkCode=as2&tag=droidyue-23';
    appendCommonBooks(name, alimamaLink, amazonLink);

    name = '小王子';
    alimamaLink = 'http://union.click.jd.com/jdc?e=&p=AyIHZR5aEQISA1AYUyUCEgFcG1gTBiJDCkMFSjJLQhBaUAscSkIBR0ROVw1VC0dFFQIUDlUYXREdS0IJRmsXUUleFWA9EGF7ZSdbKE9UUAcFRSdTDh43Vx1TFgQSBFQaaxcAEgdcH1sUByI3NGlrR2zKsePD%2FqQexq3aztOCMhABXRhdFwEbAGUbXhEKFgdSH14WAxYFZRw%3D&t=W1dCFBBFC1pXUwkEAEAdQFkJBVsVBBsHVh1fCltXWwg%3D';
    amazonLink = 'http://www.amazon.cn/gp/product/B015IG72RO/ref=as_li_qf_sp_asin_il_tl?ie=UTF8&camp=536&creative=3200&creativeASIN=B015IG72RO&linkCode=as2&tag=droidyue-23';
    appendCommonBooks(name, alimamaLink, amazonLink);



    name = '失控:全人类的最终命运和结局';
    alimamaLink = 'http://union.click.jd.com/jdc?e=&p=AyIHZRprFwMRB1AaWRIyVlgNRQQlW1dCFBBFC1pXUwkEAEAdQFkJBVkUARICVBlcCltXWwgrD2didHcJXyJwQ0Z1CXAvcVpNBS5MDRkOIgVTE1gTAhEGVCtZFwISDlEbWhAyImYnKxB7AyIFUxNYEwARDlIrWxAGGgNVHF0VBBYBUCtc&t=W1dCFBBFC1pXUwkEAEAdQFkJBVkUARICVBlcCltXWwg%3D';
    amazonLink = 'http://www.amazon.cn/gp/product/B004FPIHG0/ref=as_li_qf_sp_asin_il_tl?ie=UTF8&camp=536&creative=3200&creativeASIN=B004FPIHG0&linkCode=as2&tag=droidyue-23';
    appendCommonBooks(name, alimamaLink, amazonLink);


     name ='三体，亚洲首部雨果奖获奖作品';
     alimamaLink = 'http://union.click.jd.com/jdc?e=&p=AyIHZR5aEQISA1AYUyUCEwBVHF8UAiJDCkMFSjJLQhBaUAscSkIBR0ROVw1VC0dFFQMVB1IfWhUdS0IJRmt9dkBmUUA%2BbWBVeVVyWmlDVFArGDNDDh43Vx1TFgQSBFQaaxcAEgdcH1sUByI3NGlrR2zKsePD%2FqQexq3aztOCMhABXRhdFwEbAGUbXhEKFgdSHV0VChYFZRw%3D&t=W1dCFBBFC1pXUwkEAEAdQFkJBVsUBRIAURpbCltXWwg%3D';
     amazonLink = 'http://www.amazon.cn/gp/product/B0012ZZ1W4/ref=as_li_qf_sp_asin_il_tl?ie=UTF8&camp=536&creative=3200&creativeASIN=B0012ZZ1W4&linkCode=as2&tag=droidyue-23';
     appendCommonBooks(name, alimamaLink, amazonLink);
    


    name = '现代“日本学”开山之源，菊与刀';
    alimamaLink = 'http://union.click.jd.com/jdc?e=&p=AyIHZR5aEQISA1AYUyUCEwBWE1oRACJDCkMFSjJLQhBaUAscSkIBR0ROVw1VC0dFFQMVBF0aXxcdS0IJRmt2CkEOHF8odGFEZQpHO3JpQlwufix1Dh43Vx1TFgQSBFQaaxcAEgdcH1sUByI3NGlrR2zKsePD%2FqQexq3aztOCMhABXRhdFwEbAGUbXhEKFgdSElwXARYEZRw%3D&t=W1dCFBBFC1pXUwkEAEAdQFkJBVsUBREPVB9ZCltXWwg%3D';
    amazonLink = 'http://www.amazon.cn/gp/product/B005HSLJWS/ref=as_li_qf_sp_asin_il_tl?ie=UTF8&camp=536&creative=3200&creativeASIN=B005HSLJWS&linkCode=as2&tag=droidyue-23';
    appendCommonBooks(name, alimamaLink, amazonLink);


    name = '启示录:打造用户喜爱的产品';
    alimamaLink = 'http://union.click.jd.com/jdc?e=&p=AyIHZR5aEQISA1AYUyUCEwBWElocASJDCkMFSjJLQhBaUAscSkIBR0ROVw1VC0dFFQMVBFwaUhYdS0IJRmtmQ3sGKUk7QmAQVxJwIXd3dw4BSy11Dh43Vx1TFgQSBFQaaxcAEgdcH1sUByI3NGlrR2zKsePD%2FqQexq3aztOCMhABXRhdFwEbAGUbXhEKFgdTG14QAxoOZRw%3D&t=W1dCFBBFC1pXUwkEAEAdQFkJBVsUBREOVBJYCltXWwg%3D';
    amazonLink = 'http://www.amazon.cn/gp/product/B004Y4QWMS/ref=as_li_qf_sp_asin_il_tl?ie=UTF8&camp=536&creative=3200&creativeASIN=B004Y4QWMS&linkCode=as2&tag=droidyue-23';
    appendCommonBooks(name, alimamaLink, amazonLink);
    

	name = '乌合之众:大众心理研究';
	amazonLink = 'http://www.amazon.cn/gp/product/B0011B03QI/ref=as_li_qf_sp_asin_il_tl?ie=UTF8&camp=536&creative=3200&creativeASIN=B0011B03QI&linkCode=as2&tag=droidyue-23';
	alimamaLink = 'http://union.click.jd.com/jdc?e=&p=AyIHZR5aEQISA1AYUyUCEwZQHlsTAyJDCkMFSjJLQhBaUAscSkIBR0ROVw1VC0dFFQMTAlAbXRQdS0IJRmtde1lkL31fXGBMcVxvAmpnEUc0QCZ1Dh43Vx1TFgQSBFQaaxcAEgdcH1sUByI3NGlrR2zKsePD%2FqQexq3aztOCMhABXRhdFwEbAGUbXhEKFgdTGFMTABUBZRw%3D&t=W1dCFBBFC1pXUwkEAEAdQFkJBVsUAxcCVR1aCltXWwg%3D';
    appendCommonBooks(name, alimamaLink, amazonLink);


    name = '浪潮之巅';
    alimamaLink = 'http://union.click.jd.com/jdc?e=&p=AyIHZR5aEQISA1AYUyUCEwFdH14dASJDCkMFSjJLQhBaUAscSkIBR0ROVw1VC0dFFQMUD1EeUxYdS0IJRmtvHGtvFkgvfWdBeRZrWlcCUnspE11DDh43Vx1TFgQSBFQaaxcAEgdcH1sUByI3NGlrR2zKsePD%2FqQexq3aztOCMhABXRhdFwEbAGUbXhEKFgdTGV0RBhEAZRw%3D&t=W1dCFBBFC1pXUwkEAEAdQFkJBVsUBBoDUBNYCltXWwg%3D';
    amazonLink= 'http://www.amazon.cn/gp/product/B00D73BJWK/ref=as_li_qf_sp_asin_il_tl?ie=UTF8&camp=536&creative=3200&creativeASIN=B00D73BJWK&linkCode=as2&tag=droidyue-23';
    appendCommonBooks(name, alimamaLink, amazonLink);

    name = '硅谷之谜';
    alimamaLink = 'https://www.amazon.cn/gp/product/B01838I4ZI/ref=as_li_qf_sp_asin_il_tl?ie=UTF8&camp=536&creative=3200&creativeASIN=B01838I4ZI&linkCode=as2&tag=droidyue-23';
    amazonLink = amazonLink;
    appendCommonBooks(name, alimamaLink, amazonLink);

    name = '硅谷百年史';
    alimamaLink = 'http://union.click.jd.com/jdc?e=&p=AyIHZR5aEQISA1AYUyUCEgJXGF8TASJDCkMFSjJLQhBaUAscSkIBR0ROVw1VC0dFFQIXBVYfXRYdS0IJRmtHYRN6Ll0nXmAXZSAeBwtDVHICQxhDDh43Vx1TFgQSBFQaaxcAEgdcH1sUByI3NGlrR2zKsePD%2FqQexq3aztOCMhABXRhdFwEbAGUbXhMEFwJWH1oSAhQPZRxrRV1HRAtDDl1GRjdl&t=W1dCFBBFC1pXUwkEAEAdQFkJBVsVBxAEUR1YCltXWwg%3D';
    amazonLink = 'https://www.amazon.cn/gp/product/B00J8Q8P4K/ref=as_li_qf_sp_asin_il_tl?ie=UTF8&camp=536&creative=3200&creativeASIN=B00J8Q8P4K&linkCode=as2&tag=droidyue-23';
    appendCommonBooks(name, alimamaLink, amazonLink);

    
    name = '数学之美';
    alimamaLink = 'http://union.click.jd.com/jdc?e=&p=AyIHZR5aEQISA1AYUyUCEgNTGFoRASJDCkMFSjJLQhBaUAscSkIBR0ROVw1VC0dFFQIWAVYaXxYdS0IJRmttX0kOKhsdfmdWRyNIGxRVTFwOb1t1Dh43Vx1TFgQSBFQaaxcAEgdcH1sUByI3NGlrR2zKsePD%2FqQexq3aztOCMhABXRhdFwEbAGUbXhEKFgdTHlsUABoEZRw%3D&t=W1dCFBBFC1pXUwkEAEAdQFkJBVsVBhQEVB9YCltXWwg%3D';
    amazonLink = 'http://www.amazon.cn/gp/product/B00P6OJ09C/ref=as_li_qf_sp_asin_il_tl?ie=UTF8&camp=536&creative=3200&creativeASIN=B00P6OJ09C&linkCode=as2&tag=droidyue-23';
    appendCommonBooks(name, alimamaLink, amazonLink);
  

    name = '坂本龙马';
    alimamaLink = 'http://union.click.jd.com/jdc?e=&p=AyIHZR5aEQISA1AYUyUCEgFcG1scBiJDCkMFSjJLQhBaUAscSkIBR0ROVw1VC0dFFQIUDlUbUhEdS0IJRmtsSVtMB2U%2FdGJtWw8FBW1Baw8rHyFTDh43Vx1TFgQSBFQaaxcAEgdcH1sUByI3NGlrR2zKsePD%2FqQexq3aztOCMhABXRhdFwEbAGUbXhEKFgdcGlsUAhEFZRw%3D&t=W1dCFBBFC1pXUwkEAEAdQFkJBVsVBBsHVRJfCltXWwg%3D';
    amazonLink = 'http://www.amazon.cn/gp/product/B0060RNIX8/ref=as_li_qf_sp_asin_il_tl?ie=UTF8&camp=536&creative=3200&creativeASIN=B0060RNIX8&linkCode=as2&tag=droidyue-23';
    appendCommonBooks(name, alimamaLink, amazonLink);
   
   

    name = '丑陋的中国人';
    alimamaLink = 'http://union.click.jd.com/jdc?e=&p=AyIHZR5aEQISA1AYUyUCEgBSGlIdBCJDCkMFSjJLQhBaUAscSkIBR0ROVw1VC0dFFQIVAFQSUxMdS0IJRmtLY0V%2BChMOc2ByeTRlHEwAbH4BASFTDh43Vx1TFgQSBFQaaxcAEgdcH1sUByI3NGlrR2zKsePD%2FqQexq3aztOCMhABXRhdFwEbAGUbXhEKFgdcGFwUBBMHZRw%3D&t=W1dCFBBFC1pXUwkEAEAdQFkJBVsVBRUGXBNdCltXWwg%3D';
    amazonLink = 'http://www.amazon.cn/gp/product/B00UBPQ0VW/ref=as_li_qf_sp_asin_il_tl?ie=UTF8&camp=536&creative=3200&creativeASIN=B00UBPQ0VW&linkCode=as2&tag=droidyue-23';
    appendCommonBooks(name, alimamaLink, amazonLink);

   name = '疯狂的程序员';
   amazonLink = 'http://www.amazon.cn/gp/product/B008QM2476/ref=as_li_qf_sp_asin_il_tl?ie=UTF8&camp=536&creative=3200&creativeASIN=B008QM2476&linkCode=as2&tag=droidyue-23';
	alimamaLink = amazonLink;
    appendCommonBooks(name, alimamaLink, amazonLink);



    name = '中国人史纲，柏杨先生狱中著作';
    alimamaLink = 'http://union.click.jd.com/jdc?e=&p=AyIHZR5aEQISA1AYUyUCEw9WGlITASJDCkMFSjJLQhBaUAscSkIBR0ROVw1VC0dFFQMaBFQSXRYdS0IJRmtmBBtXBnAgSGFAeQJIEk9wa2wSG1xDDh43Vx1TFgQSBFQaaxcAEgdcH1sUByI3NGlrR2zKsePD%2FqQexq3aztOCMhABXRhdFwEbAGUbXhEKFgdcGVkXAhMFZRw%3D&t=W1dCFBBFC1pXUwkEAEAdQFkJBVsUChEGXB1YCltXWwg%3D';
    amazonLink = 'http://www.amazon.cn/gp/product/B00BT56D7Y/ref=as_li_qf_sp_asin_il_tl?ie=UTF8&camp=536&creative=3200&creativeASIN=B00BT56D7Y&linkCode=as2&tag=droidyue-23';
    appendCommonBooks(name, alimamaLink, amazonLink);
    
    name = '帝王师:刘伯温';
    alimamaLink = 'http://union.click.jd.com/jdc?e=&p=AyIHZR5aEQISA1AYUyUCEwFdHl4dByJDCkMFSjJLQhBaUAscSkIBR0ROVw1VC0dFFQMUD1AeUxAdS0IJRmsdd0x6L2ULV2FPfQBMU1dFQmcNQillDh43Vx1TFgQSBFQaaxcAEgdcH1sUByI3NGlrR2zKsePD%2FqQexq3aztOCMhABXRhdFwEbAGUbXhEKFgdcHloTARADZRw%3D&t=W1dCFBBFC1pXUwkEAEAdQFkJBVsUBBoCUBNeCltXWwg%3D';
    amazonLink = 'http://www.amazon.cn/gp/product/B00HFOKO28/ref=as_li_qf_sp_asin_il_tl?ie=UTF8&camp=536&creative=3200&creativeASIN=B00HFOKO28&linkCode=as2&tag=droidyue-23';
    appendCommonBooks(name, alimamaLink, amazonLink);

    name = '第三帝国的兴亡';
    alimamaLink = 'http://union.click.jd.com/jdc?e=&p=AyIHZR5aEQISA1AYUyUCEw9UH1kdBiJDCkMFSjJLQhBaUAscSkIBR0ROVw1VC0dFFQMaBlEZUxEdS0IJRmtod3F4Fl87TGdLQxJBHW1Ye0YDRg1TDh43Vx1TFgQSBFQaaxcAEgdcH1sUByI3NGlrR2zKsePD%2FqQexq3aztOCMhABXRhdFwEbAGUbXhEKFgdcHlkSChQDZRw%3D&t=W1dCFBBFC1pXUwkEAEAdQFkJBVsUChMDVxNfCltXWwg%3D';
    amazonLink = 'http://www.amazon.cn/gp/product/B006U9BEGO/ref=as_li_qf_sp_asin_il_tl?ie=UTF8&camp=536&creative=3200&creativeASIN=B006U9BEGO&linkCode=as2&tag=droidyue-23';
    appendCommonBooks(name, alimamaLink, amazonLink);

    name = '如何阅读一本书';
    alimamaLink = 'http://union.click.jd.com/jdc?e=&p=AyIHZR5aEQISA1AYUyUCGgZWEl0RBCJDCkMFSjJLQhBaUAscSkIBR0ROVw1VC0dFFQoTBFwdXxMdS0IJRmtuWGFFF0EoZ2JZXzweJlVLaAEWS15DDh43Vx1TFgQSBFQaaxcAEgdcH1sUByI3NGlrR2zKsePD%2FqQexq3aztOCMhABXRhdFwEbAGUbXhEKFgdcH18UARQFZRw%3D&t=W1dCFBBFC1pXUwkEAEAdQFkJBVsdAxEOUx9dCltXWwg%3D';
    amazonLink = 'http://www.amazon.cn/gp/product/B00IX8NX5A/ref=as_li_qf_sp_asin_il_tl?ie=UTF8&camp=536&creative=3200&creativeASIN=B00IX8NX5A&linkCode=as2&tag=droidyue-23';
    appendCommonBooks(name, alimamaLink, amazonLink);

    name = '把时间当作朋友';
    alimamaLink = 'http://union.click.jd.com/jdc?e=&p=AyIHZR5aEQISA1AYUyUCEgVXElwdAiJDCkMFSjJLQhBaUAscSkIBR0ROVw1VC0dFFQIQBVwcUxUdS0IJRmtVRmhbHGMyV2BBcTFsXH1KEAY2flxlDh43Vx1TFgQSBFQaaxcAEgdcH1sUByI3NGlrR2zKsePD%2FqQexq3aztOCMhABXRhdFwEbAGUbXhEKFgdcH10dAhMGZRw%3D&t=W1dCFBBFC1pXUwkEAEAdQFkJBVsVABAOUhNbCltXWwg%3D';
    amazonLink = 'http://www.amazon.cn/gp/product/B00FU3CRZI/ref=as_li_qf_sp_asin_il_tl?ie=UTF8&camp=536&creative=3200&creativeASIN=B00FU3CRZI&linkCode=as2&tag=droidyue-23';
    appendCommonBooks(name, alimamaLink, amazonLink);


    
    name = '你一定爱读的极简欧洲史';
    alimamaLink = 'http://union.click.jd.com/jdc?e=&p=AyIHZR5aEQISA1AYUyUCEgZXElkVBiJDCkMFSjJLQhBaUAscSkIBR0ROVw1VC0dFFQITBVwZWxEdS0IJRmtNAmh%2BVxJYfGEQfQtaARYHQHknXVhlDh43Vx1TFgQSBFQaaxcAEgdcH1sUByI3NGlrR2zKsePD%2FqQexq3aztOCMhABXRhdFwEbAGUbXhEKFgdcHF4QBRYCZRw%3D&t=W1dCFBBFC1pXUwkEAEAdQFkJBVsVAxAOVxtfCltXWwg%3D';
    amazonLink = 'http://www.amazon.cn/gp/product/B00E192518/ref=as_li_qf_sp_asin_il_tl?ie=UTF8&camp=536&creative=3200&creativeASIN=B00E192518&linkCode=as2&tag=droidyue-23';
    appendCommonBooks(name, alimamaLink, amazonLink);

    
    name = '创业维艰:如何完成比难更难的事';
    alimamaLink = 'http://union.click.jd.com/jdc?e=&p=AyIHZR5aEQISA1AYUyUCEgBTGVsQAyJDCkMFSjJLQhBaUAscSkIBR0ROVw1VC0dFFQIVAVcbXhQdS0IJRmsLVFNUA0gkQWBlVxccDGJbV3kyXA9lDh43Vx1TFgQSBFQaaxcAEgdcH1sUByI3NGlrR2zKsePD%2FqQexq3aztOCMhABXRhdFwEbAGUbXhEKFgdcHVIRAhEHZRw%3D&t=W1dCFBBFC1pXUwkEAEAdQFkJBVsVBRQFVR5aCltXWwg%3D';
    amazonLink = 'http://www.amazon.cn/gp/product/B00SMB8ZVU/ref=as_li_qf_sp_asin_il_tl?ie=UTF8&camp=536&creative=3200&creativeASIN=B00SMB8ZVU&linkCode=as2&tag=droidyue-23';
    appendCommonBooks(name, alimamaLink, amazonLink);

   



    name = '戒了吧！拖延症：写给年轻人的拖延心理学';
    alimamaLink = 'http://union.click.jd.com/jdc?e=&p=AyIHZR5aEQISA1AYUyUCEgVXE1oVByJDCkMFSjJLQhBaUAscSkIBR0ROVw1VC0dFFQIQBV0aWxAdS0IJRmscX2QdPRs6Q2EMHTRLBmkEEXsyTwZDDh43Vx1TFgQSBFQaaxcAEgdcH1sUByI3NGlrR2zKsePD%2FqQexq3aztOCMhABXRhdFwEbAGUbXhEKFgdcElMVAhECZRw%3D&t=W1dCFBBFC1pXUwkEAEAdQFkJBVsVABAPVBteCltXWwg%3D';
    amazonLink = 'http://www.amazon.cn/gp/product/B00G4T0O34/ref=as_li_qf_sp_asin_il_tl?ie=UTF8&camp=536&creative=3200&creativeASIN=B00G4T0O34&linkCode=as2&tag=droidyue-23';
    appendCommonBooks(name, alimamaLink, amazonLink);

    

    name = '番茄工作法图解:简单易行的时间管理方法';
    alimamaLink = 'http://union.click.jd.com/jdc?e=&p=AyIHZR5aEQISA1AYUyUCEwJUHFsWCiJDCkMFSjJLQhBaUAscSkIBR0ROVw1VC0dFFQMXBlIbWB0dS0IJRmsTXhpCC18ZYmFhABxJD0FfcHxVTj9DDh43Vx1TFgQSBFQaaxcAEgdcH1sUByI3NGlrR2zKsePD%2FqQexq3aztOCMhABXRhdFwEbAGUbXhEKFgdcE14RBRUPZRw%3D&t=W1dCFBBFC1pXUwkEAEAdQFkJBVsUBxMAVRhTCltXWwg%3D';
    amazonLink = 'http://www.amazon.cn/gp/product/B004O9F71K/ref=as_li_qf_sp_asin_il_tl?ie=UTF8&camp=536&creative=3200&creativeASIN=B004O9F71K&linkCode=as2&tag=droidyue-23';
    appendCommonBooks(name, alimamaLink, amazonLink);
    
   

    name = '不要让未来的你,讨厌现在的自己';
    alimamaLink = 'http://union.click.jd.com/jdc?e=&p=AyIHZR5aEQISA1AYUyUCEgJdH1wRBCJDCkMFSjJLQhBaUAscSkIBR0ROVw1VC0dFFQIXD1EcXxMdS0IJRmtPemxjAEEDQmJ7W11QHVJrDGMoHSNDDh43Vx1TFgQSBFQaaxcAEgdcH1sUByI3NGlrR2zKsePD%2FqQexq3aztOCMhABXRhdFwEbAGUbXhEKFgdcE1IVARAOZRw%3D&t=W1dCFBBFC1pXUwkEAEAdQFkJBVsVBxoDUh9dCltXWwg%3D';
    amazonLink = 'http://www.amazon.cn/gp/product/B00LLVTAKS/ref=as_li_qf_sp_asin_il_tl?ie=UTF8&camp=536&creative=3200&creativeASIN=B00LLVTAKS&linkCode=as2&tag=droidyue-23';
    appendCommonBooks(name, alimamaLink, amazonLink);
   
    name = '这个历史挺靠谱:袁腾飞讲世界史';
    alimamaLink = 'http://union.click.jd.com/jdc?e=&p=AyIHZR5aEQISA1AYUyUCEgRTGlgXCiJDCkMFSjJLQhBaUAscSkIBR0ROVw1VC0dFFQIRAVQYWR0dS0IJRmtGUmt6NVkpUmAWcR5TLGxlRncoEgNTDh43Vx1TFgQSBFQaaxcAEgdcH1sUByI3NGlrR2zKsePD%2FqQexq3aztOCMhABXRhdFwEbAGUbXhEKFgddGlgVAxUAZRw%3D&t=W1dCFBBFC1pXUwkEAEAdQFkJBVsVARQGVhlTCltXWwg%3D';
    amazonLink = 'http://www.amazon.cn/gp/product/B00DNVMV7S/ref=as_li_qf_sp_asin_il_tl?ie=UTF8&camp=536&creative=3200&creativeASIN=B00DNVMV7S&linkCode=as2&tag=droidyue-23';
    appendCommonBooks(name, alimamaLink, amazonLink);
    
    
    
    name = '天朝的崩溃';
    alimamaLink = 'http://union.click.jd.com/jdc?e=&p=AyIHZR5aEQISA1AYUyUCEgNSElgUAyJDCkMFSjJLQhBaUAscSkIBR0ROVw1VC0dFFQIWAFwYWhQdS0IJRmtpakh4KWUHVGBURzRtJWplEFkhGjhDDh43Vx1TFgQSBFQaaxcAEgdcH1sUByI3NGlrR2zKsePD%2FqQexq3aztOCMhABXRhdFwEbAGUbXhEKFgddGlMTAhUPZRw%3D&t=W1dCFBBFC1pXUwkEAEAdQFkJBVsVBhUOVhpaCltXWwg%3D';
    amazonLink = 'http://www.amazon.cn/gp/product/B00OZ8C9DO/ref=as_li_qf_sp_asin_il_tl?ie=UTF8&camp=536&creative=3200&creativeASIN=B00OZ8C9DO&linkCode=as2&tag=droidyue-23';
    appendCommonBooks(name, alimamaLink, amazonLink);
    
   

    name = '看见';
    alimamaLink = 'http://union.click.jd.com/jdc?e=&p=AyIHZR5aEQISA1AYUyUCEgdQGlMVCyJDCkMFSjJLQhBaUAscSkIBR0ROVw1VC0dFFQISAlQTWxwdS0IJRmtzZlpSE0ZbZmJWfR4cL1Zke3gWRR9DDh43Vx1TFgQSBFQaaxcAEgdcH1sUByI3NGlrR2zKsePD%2FqQexq3aztOCMhABXRhdFwEbAGUbXhEKFgddGFgUCxoFZRw%3D&t=W1dCFBBFC1pXUwkEAEAdQFkJBVsVAhcGXRtSCltXWwg%3D';
    amazonLink = 'http://www.amazon.cn/gp/product/B00AH6OXP0/ref=as_li_qf_sp_asin_il_tl?ie=UTF8&camp=536&creative=3200&creativeASIN=B00AH6OXP0&linkCode=as2&tag=droidyue-23';
    appendCommonBooks(name, alimamaLink, amazonLink);

	name = '暗时间';
	alimamaLink = 'http://union.click.jd.com/jdc?e=&p=AyIHZR5aEQISA1AYUyUCEwFdH14dACJDCkMFSjJLQhBaUAscSkIBR0ROVw1VC0dFFQMUD1EeUxcdS0IJRmtMUkx9VH4FZWBQcVZ6JUhacXMTTUVTDh43Vx1TFgQSBFQaaxcAEgdcH1sUByI3NGlrR2zKsePD%2FqQexq3aztOCMhABXRhdFwEbAGUbXhICFQRdElscABMOZRw%3D&t=W1dCFBBFC1pXUwkEAEAdQFkJBVsUBBoDUBNZCltXWwg%3D';
	amazonLink = 'http://www.amazon.cn/gp/product/B005DSK4W8/ref=as_li_qf_sp_asin_il_tl?ie=UTF8&camp=536&creative=3200&creativeASIN=B005DSK4W8&linkCode=as2&tag=droidyue-23';
	appendCommonBooks(name, alimamaLink, amazonLink);
	
	
	name = '被误解的日本人';
	alimamaLink = 'http://union.click.jd.com/jdc?e=&p=AyIHZR5aEQISA1AYUyUCEg5dGFsSCiJDCkMFSjJLQhBaUAscSkIBR0ROVw1VC0dFFQIbD1YbXB0dS0IJRmtmVldkMkEyFWBlRz1AGQ9WQXEeUBhTDh43Vx1TFgQSBFQaaxcAEgdcH1sUByI3NGlrR2zKsePD%2FqQexq3aztOCMhABXRhdFwEbAGUbXhIAEg5SEl0dBBIBZRw%3D&t=W1dCFBBFC1pXUwkEAEAdQFkJBVsVCxoEVRxTCltXWwg%3D';
	amazonLink = 'http://www.amazon.cn/gp/product/B01DA9I9KA/ref=as_li_qf_sp_asin_il_tl?ie=UTF8&camp=536&creative=3200&creativeASIN=B01DA9I9KA&linkCode=as2&tag=droidyue-23';
	appendCommonBooks(name, alimamaLink, amazonLink);
	
	name = '煮酒探西游';
	alimamaLink = 'http://union.click.jd.com/jdc?e=&p=AyIHZR5aEQISA1AYUyUCEg5cG1ITASJDCkMFSjJLQhBaUAscSkIBR0ROVw1VC0dFFQIbDlUSXRYdS0IJRmtPGAgELUc7ZWJAADEcAm8cW30RfVNTDh43Vx1TFgQSBFQaaxcAEgdcH1sUByI3NGlrR2zKsePD%2FqQexq3aztOCMhABXRhdFwEbAGUbXhIFEwZUH10dBxoAZRw%3D&t=W1dCFBBFC1pXUwkEAEAdQFkJBVsVCxsHXB1YCltXWwg%3D';
	amazonLink = 'http://www.amazon.cn/gp/product/B01CHLIZDI/ref=as_li_qf_sp_asin_il_tl?ie=UTF8&camp=536&creative=3200&creativeASIN=B01CHLIZDI&linkCode=as2&tag=droidyue-23';
	appendCommonBooks(name, alimamaLink, amazonLink);
	
	name = '翻译的技巧';
	alimamaLink = 'http://union.click.jd.com/jdc?e=&p=AyIHZR5aEQISA1AYUyUCEgFWElsdCiJDCkMFSjJLQhBaUAscSkIBR0ROVw1VC0dFFQIUBFwbUx0dS0IJRmtPWRRvB0YfS2JrdTxiOWBmZnMvYRNlDh43Vx1TFgQSBFQaaxcAEgdcH1sUByI3NGlrR2zKsePD%2FqQexq3aztOCMhABXRhdFwEbAGUbXhIFEwVdGFkXBRsEZRw%3D&t=W1dCFBBFC1pXUwkEAEAdQFkJBVsVBBEOVRNTCltXWwg%3D';
	amazonLink = 'http://www.amazon.cn/gp/product/B00ZZ4DOPY/ref=as_li_qf_sp_asin_il_tl?ie=UTF8&camp=536&creative=3200&creativeASIN=B00ZZ4DOPY&linkCode=as2&tag=droidyue-23';
	appendCommonBooks(name, alimamaLink, amazonLink);

    name = '沃顿商学院最受欢迎的成功课';
    alimamaLink = 'http://www.amazon.cn/gp/product/B00RK1A1QA/ref=as_li_qf_sp_asin_il_tl?ie=UTF8&camp=536&creative=3200&creativeASIN=B00RK1A1QA&linkCode=as2&tag=droidyue-23';
    amazonLink = 'http://www.amazon.cn/gp/product/B00RK1A1QA/ref=as_li_qf_sp_asin_il_tl?ie=UTF8&camp=536&creative=3200&creativeASIN=B00RK1A1QA&linkCode=as2&tag=droidyue-23';
    appendCommonBooks(name, alimamaLink, amazonLink);


    name = '断舍离';
    alimamaLink = 'http://union.click.jd.com/jdc?e=&p=AyIHZR5aEQISA1AYUyUCEgRRElMcAiJDCkMFSjJLQhBaUAscSkIBR0ROVw1VC0dFFQIRA1wTUhUdS0IJRmt0UkVTHFIyHWcSZVdsGRMKWmI0WQtTDh43Vx1TFgQSBFQaaxcAEgdcH1sUByI3NGlrR2zKsePD%2FqQexq3aztOCMhABXRhdFwEbAGUbXhMCEw9dHVgQAxYCZRxrRV1HRAtDDl1GRjdl&t=W1dCFBBFC1pXUwkEAEAdQFkJBVsVARYOXRJbCltXWwg%3D';
    amazonLink = 'https://www.amazon.cn/gp/product/B00DDMD716/ref=as_li_qf_sp_asin_il_tl?ie=UTF8&camp=536&creative=3200&creativeASIN=B00DDMD716&linkCode=as2&tag=droidyue-23';
    appendCommonBooks(name, alimamaLink, amazonLink);

    name = '罗马人的故事';
    alimamaLink = 'http://union.click.jd.com/jdc?e=&p=AyIHZR5aEQISA1AYUyUCEw9XGFkcAiJDCkMFSjJLQhBaUAscSkIBR0ROVw1VC0dFFQMaBVYZUhUdS0IJRmtsWW5aPGsNfWBoYQtkPGVbYFRVUlJTDh43Vx1TFgQSBFQaaxcAEgdcH1sUByI3NGlrR2zKsePD%2FqQexq3aztOCMhABXRhdFwEbAGUbXhwDEAJUElkXARYGZRxrRV1HRAtDDl1GRjdl&t=W1dCFBBFC1pXUwkEAEAdQFkJBVsUChAEVxJbCltXWwg%3D';
    amazonLink = 'https://www.amazon.cn/gp/product/B00FWL9UNK/ref=as_li_qf_sp_asin_il_tl?ie=UTF8&camp=536&creative=3200&creativeASIN=B00FWL9UNK&linkCode=as2&tag=droidyue-23';
    appendCommonBooks(name, alimamaLink, amazonLink);

    name = "米";
    alimamaLink = 'http://union-click.jd.com/jdc?e=0&p=AyIHZR5aEQISA1AYUyUCEwZVGlwTCyJDCkMFSjJLQhBaUAscSkIBR0ROVw1VC0dFFQMTB1QcXRwdS0IJRmtOdEpcVGUDTGBWZQ9dWhRKQl4ofhBDDh43Vx1TFgQSBFQaaxcAEgdcH1sUByI3VRprR2zKsePD%2FqQexq3aztOCMhABXRhdFwEbAGUbXhwAFgFVGFIRABABZRxrRV1HRAtDDl1GRjdlK2s%3D&t=W1dCFBBFC1pXUwkEAEAdQFkJBVsUAxIGUh1SCltXWwg%3D';
    amazonLink = 'https://www.amazon.cn/gp/product/B0011AENE2/ref=as_li_qf_sp_asin_il_tl?ie=UTF8&camp=536&creative=3200&creativeASIN=B0011AENE2&linkCode=as2&tag=droidyue-23';
    appendCommonBooks(name, alimamaLink, amazonLink);


    name = '极客物理学 : 地球上最有趣的问题和最出人意料的答案';
    alimamaLink = 'http://union-click.jd.com/jdc?e=0&p=AyIHZR5aEQISA1AYUyUCEg9dG14XBSJDCkMFSjJLQhBaUAscSkIBR0ROVw1VC0dFFQIaD1UeWRIdS0IJRmsVVltlDngFbmJQfSdNK357UQQjZCtDDh43Vx1TFgQSBFQaaxcAEgdcH1sUByI3VRprR2zKsePD%2FqQexq3aztOCMhcEUx9eEgMWA2UbXh0DEgJUH10UBxQBZRxrRV1HRAtDDl1GRjdlK2s%3D&t=W1dCFBBFC1pXUwkEAEAdQFkJBVsVChoHUBlcCltXWwg%3D';
    amazonLink = 'https://www.amazon.cn/gp/product/B01IN0XA8M/ref=as_li_qf_sp_asin_il_tl?ie=UTF8&camp=536&creative=3200&creativeASIN=B01IN0XA8M&linkCode=as2&tag=droidyue-23';
    appendCommonBooks(name, alimamaLink, amazonLink);


    name = '人类简史:从动物到上帝';
    alimamaLink = 'http://union-click.jd.com/jdc?e=0&p=AyIHZR5aEQISA1AYUyUCEQdWH1MWByJDCkMFSjJLQhBaUAscSkIBR0ROVw1VC0dFFQESBFETWBAdS0IJRmtIQ0lbI1wbEmJzVyFjKGoDSHMCZTt1Dh43Vx1TFgQSBFQaaxcAEgdcH1sUByI3VRprR2zKsePD%2FqQexq3aztOCMhABXRhdFwEbAGUbXh0DEQRcH18RAhcPZRxrRV1HRAtDDl1GRjdlK2s%3D&t=W1dCFBBFC1pXUwkEAEAdQFkJBVsWAhEDXRheCltXWwg%3D';
    amazonLink = 'https://www.amazon.cn/gp/product/B00NSGUFCQ/ref=as_li_qf_sp_asin_il_tl?ie=UTF8&camp=536&creative=3200&creativeASIN=B00NSGUFCQ&linkCode=as2&tag=droidyue-23';
    appendCommonBooks(name, alimamaLink, amazonLink);

    dataSource = booksToJSON(commonBooks, LINK_TYPE_ALIMAMA);
    dataSource = shuffleJsonObject(dataSource);
    dataSource = splitJSONObject(dataSource, 40);
    dataSource = sortJsonObject(dataSource);

    return dataSource;
}
