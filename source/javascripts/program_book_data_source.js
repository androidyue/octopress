
var programBooks = [];

function appendProgramBooks(name, alimamaLink, amazonLink) {
    var book = new Book(name);
    book.alimamaLink = alimamaLink;
    book.amazonLink = amazonLink;
    programBooks.push(book);
}


function shouldDisplayProgramBook() {
    return isDesktop() || isWeixinBrowser(); 
}

function makeProgramBookPrefix() {
	return '<section><h1>编程好书</h1>';
}

function makeProgramBookSuffix() {
    return '</section>'
}

function isPrgoramBookInDebug() {
    return false;
}


var sDroidProgramBookClass = "droid_program_book_class";


function makeProgramBookDataSource() {
    var data = {};

    var name, alimamaLink, amazonLink;
    
    name = '算法';
    alimamaLink = 'http://union.click.jd.com/jdc?e=&p=AyIHZR5aEQISA1AYUyUCEgZdEl0cCiJDCkMFSjJLQhBaUAscSkIBR0ROVw1VC0dFFQITD1wdUh0dS0IJRmtPexZiFVgiEWBqXwpkAk8KcHg2SzN1Dh43Vx1TFgQSBFQaaxcAEgdcH1sUByI3NGlrR2zKsePD%2FqQexq3aztOCMhABXRhdFwEbAGUbXhEKFQNWG1wSARMFZRw%3D&t=W1dCFBBFC1pXUwkEAEAdQFkJBVsVAxoOUxJTCltXWwg%3D';
    amazonLink = 'http://www.amazon.cn/gp/product/B009OCFQ0O/ref=as_li_qf_sp_asin_il_tl?ie=UTF8&camp=536&creative=3200&creativeASIN=B009OCFQ0O&linkCode=as2&tag=droidyue-23';   
    appendProgramBooks(name, alimamaLink, amazonLink);

    name = '代码大全';
    alimamaLink = undefined;
    amazonLink = 'http://www.amazon.cn/gp/product/B0061XKRXA/ref=as_li_qf_sp_asin_il_tl?ie=UTF8&camp=536&creative=3200&creativeASIN=B0061XKRXA&linkCode=as2&tag=droidyue-23';
    appendProgramBooks(name, alimamaLink, amazonLink);

    name = '人月神话';
    alimamaLink = 'http://union.click.jd.com/jdc?e=&p=AyIHZR5aEQISA1AYUyUCEgBTG1MRCiJDCkMFSjJLQhBaUAscSkIBR0ROVw1VC0dFFQIVAVUTXx0dS0IJRmtIdGJhKU8EaWFxHRdaHnJSVnIeUy5DDh43Vx1TFgQSBFQaaxcAEgdcH1sUByI3NGlrR2zKsePD%2FqQexq3aztOCMhABXRhdFwEbAGUbXhEKFQNWGVkcAxQFZRw%3D&t=W1dCFBBFC1pXUwkEAEAdQFkJBVsVBRQHXR9TCltXWwg%3D';
    amazonLink = 'http://www.amazon.cn/gp/product/B00VR8ZO28/ref=as_li_qf_sp_asin_il_tl?ie=UTF8&camp=536&creative=3200&creativeASIN=B00VR8ZO28&linkCode=as2&tag=droidyue-23';
    appendProgramBooks(name, alimamaLink, amazonLink);


	name = 'HTTP权威指南';
	alimamaLink = 'http://union.click.jd.com/jdc?e=&p=AyIHZR5aEQISA1AYUyUCEgZRHF8RBSJDCkMFSjJLQhBaUAscSkIBR0ROVw1VC0dFFQITA1IfXxIdS0IJRmteWWEFEFxFVmdmQzRDH0ocSQYGXEFlDh43Vx1TFgQSBFQaaxcAEgdcH1sUByI3NGlrR2zKsePD%2FqQexq3aztOCMhABXRhdFwEbAGUbXhICFg9XE10RBRIEZRw%3D&t=W1dCFBBFC1pXUwkEAEAdQFkJBVsVAxYAUR9cCltXWwg%3D';
	amazonLink = 'http://www.amazon.cn/gp/product/B008XFDQ14/ref=as_li_qf_sp_asin_il_tl?ie=UTF8&camp=536&creative=3200&creativeASIN=B008XFDQ14&linkCode=as2&tag=droidyue-23';
	appendProgramBooks(name, alimamaLink ,amazonLink);


    name = '编程珠玑';
    alimamaLink = undefined;
    amazonLink = 'http://www.amazon.cn/gp/product/B00SFZH0DC/ref=as_li_qf_sp_asin_il_tl?ie=UTF8&camp=536&creative=3200&creativeASIN=B00SFZH0DC&linkCode=as2&tag=droidyue-23';
    appendProgramBooks(name, alimamaLink, amazonLink);

    name = '编程之美';
    alimamaLink = 'http://union.click.jd.com/jdc?e=&p=AyIHZR5aEQISA1AYUyUCEwZSHF0XBSJDCkMFSjJLQhBaUAscSkIBR0ROVw1VC0dFFQMTAFIdWRIdS0IJRmtPdkFBU0YpD2ERUyBzM1dKd08haSJlDh43Vx1TFgQSBFQaaxcAEgdcH1sUByI3NGlrR2zKsePD%2FqQexq3aztOCMhABXRhdFwEbAGUbXhEKFQNWHlMQBxcDZRw%3D&t=W1dCFBBFC1pXUwkEAEAdQFkJBVsUAxUAUxlcCltXWwg%3D';
    amazonLink = 'http://www.amazon.cn/gp/product/B0016K8XGQ/ref=as_li_qf_sp_asin_il_tl?ie=UTF8&camp=536&creative=3200&creativeASIN=B0016K8XGQ&linkCode=as2&tag=droidyue-23';
    appendProgramBooks(name, alimamaLink, amazonLink);

    name = '黑客与画家';
    alimamaLink = 'http://union.click.jd.com/jdc?e=&p=AyIHZR5aEQISA1AYUyUCEwNcGF4dBiJDCkMFSjJLQhBaUAscSkIBR0ROVw1VC0dFFQMWDlYeUxEdS0IJRmtLYGR%2FKVg4T2dTfSxCIxRxeg9WUglTDh43Vx1TFgQSBFQaaxcAEgdcH1sUByI3NGlrR2zKsePD%2FqQexq3aztOCMhABXRhdFwEbAGUbXhEKFQNWH14SBxIEZRw%3D&t=W1dCFBBFC1pXUwkEAEAdQFkJBVsUBhsEUBNfCltXWwg%3D';
    amazonLink = 'http://www.amazon.cn/gp/product/B00G1ZT2C0/ref=as_li_qf_sp_asin_il_tl?ie=UTF8&camp=536&creative=3200&creativeASIN=B00G1ZT2C0&linkCode=as2&tag=droidyue-23';
    appendProgramBooks(name, alimamaLink, amazonLink);


    name = '代码整洁之道';
    alimamaLink = 'http://union.click.jd.com/jdc?e=&p=AyIHZR5aEQISA1AYUyUCEwZSHloUBSJDCkMFSjJLQhBaUAscSkIBR0ROVw1VC0dFFQMTAFAaWhIdS0IJRmsQRhp1T0UCd2dMdQxTO3BhQGQncDpDDh43Vx1TFgQSBFQaaxcAEgdcH1sUByI3NGlrR2zKsePD%2FqQexq3aztOCMhABXRhdFwEbAGUbXhEKFQNWHV4WCxMCZRw%3D&t=W1dCFBBFC1pXUwkEAEAdQFkJBVsUAxUCVBpcCltXWwg%3D';
    amazonLink  = 'http://www.amazon.cn/gp/product/B0031M9GHC/ref=as_li_qf_sp_asin_il_tl?ie=UTF8&camp=536&creative=3200&creativeASIN=B0031M9GHC&linkCode=as2&tag=droidyue-23';
    appendProgramBooks(name, alimamaLink, amazonLink);

    name = 'Unix编程艺术';
    alimamaLink = 'http://union.click.jd.com/jdc?e=&p=AyIHZR5aEQISA1AYUyUCEgZTH14QBiJDCkMFSjJLQhBaUAscSkIBR0ROVw1VC0dFFQITAVEeXhEdS0IJRmtNcEF3EnoLT2dtQyt6BlxAZUUPfid1Dh43Vx1TFgQSBFQaaxcAEgdcH1sUByI3NGlrR2zKsePD%2FqQexq3aztOCMhABXRhdFwEbAGUbXhEKFQNWElsRAhsDZRw%3D&t=W1dCFBBFC1pXUwkEAEAdQFkJBVsVAxQDUB5fCltXWwg%3D';
    amazonLink = 'http://www.amazon.cn/gp/product/B008Z1IEQ8/ref=as_li_qf_sp_asin_il_tl?ie=UTF8&camp=536&creative=3200&creativeASIN=B008Z1IEQ8&linkCode=as2&tag=droidyue-23';
    appendProgramBooks(name, alimamaLink, amazonLink);

    name = '程序员修炼之道';
    alimamaLink = 'http://union.click.jd.com/jdc?e=&p=AyIHZR5aEQISA1AYUyUCEwVdGVgTCyJDCkMFSjJLQhBaUAscSkIBR0ROVw1VC0dFFQMQD1cYXRwdS0IJRmtOaWAdC2I8fGFIZSphIWlWWwYNSV5DDh43Vx1TFgQSBFQaaxcAEgdcH1sUByI3NGlrR2zKsePD%2FqQexq3aztOCMhABXRhdFwEbAGUbXhEKFQNWE1IVBBsHZRw%3D&t=W1dCFBBFC1pXUwkEAEAdQFkJBVsUABoFVh1SCltXWwg%3D';
    amazonLink = 'http://www.amazon.cn/gp/product/B004GV08CY/ref=as_li_qf_sp_asin_il_tl?ie=UTF8&camp=536&creative=3200&creativeASIN=B004GV08CY&linkCode=as2&tag=droidyue-23';
    appendProgramBooks(name, alimamaLink, amazonLink); 

    

    name = '数据结构与算法分析';
    alimamaLink = 'http://union.click.jd.com/jdc?e=&p=AyIHZR5aEQISA1AYUyUCEwZREl4UBiJDCkMFSjJLQhBaUAscSkIBR0ROVw1VC0dFFQMTA1weWhEdS0IJRmtsSnYZLFMoYWFIRxYFEmMBEwYWGDNDDh43Vx1TFgQSBFQaaxcAEgdcH1sUByI3NGlrR2zKsePD%2FqQexq3aztOCMhABXRhdFwEbAGUbXhEKFQNXGlMSARYFZRw%3D&t=W1dCFBBFC1pXUwkEAEAdQFkJBVsUAxYOUBpfCltXWwg%3D';
    amazonLink  = 'http://www.amazon.cn/gp/product/B001N6R9JK/ref=as_li_qf_sp_asin_il_tl?ie=UTF8&camp=536&creative=3200&creativeASIN=B001N6R9JK&linkCode=as2&tag=droidyue-23';
    appendProgramBooks(name, alimamaLink, amazonLink);

   
    name = '松本行弘的程序世界';
    alimamaLink = 'http://union.click.jd.com/jdc?e=&p=AyIHZR5aEQISA1AYUyUCEw5WElMWCyJDCkMFSjJLQhBaUAscSkIBR0ROVw1VC0dFFQMbBFwTWBwdS0IJRmtMZhBzT1kPZ2cbHSxPC29xaHADclp1Dh43Vx1TFgQSBFQaaxcAEgdcH1sUByI3NGlrR2zKsePD%2FqQexq3aztOCMhABXRhdFwEbAGUbXhEKFQNXG1MWBxMBZRw%3D&t=W1dCFBBFC1pXUwkEAEAdQFkJBVsUCxEOXRhSCltXWwg%3D';
    amazonLink  = 'http://www.amazon.cn/gp/product/B005KGBTQ8/ref=as_li_qf_sp_asin_il_tl?ie=UTF8&camp=536&creative=3200&creativeASIN=B005KGBTQ8&linkCode=as2&tag=droidyue-23';
    appendProgramBooks(name, alimamaLink, amazonLink);
   
    name = '高效程序员的45个习惯';
    alimamaLink = 'http://union.click.jd.com/jdc?e=&p=AyIHZR5aEQISA1AYUyUCEgNRHFIWBCJDCkMFSjJLQhBaUAscSkIBR0ROVw1VC0dFFQIWA1ISWBMdS0IJRmt9RUBbMFkMbWdJfVJBBn5HRwAoYhNDDh43Vx1TFgQSBFQaaxcAEgdcH1sUByI3NGlrR2zKsePD%2FqQexq3aztOCMhABXRhdFwEbAGUbXhEKFQNXGFwWBBMHZRw%3D&t=W1dCFBBFC1pXUwkEAEAdQFkJBVsVBhYAXBhdCltXWwg%3D';
    amazonLink  = 'http://www.amazon.cn/gp/product/B00OA9L3NU/ref=as_li_qf_sp_asin_il_tl?ie=UTF8&camp=536&creative=3200&creativeASIN=B00OA9L3NU&linkCode=as2&tag=droidyue-23';
    appendProgramBooks(name, alimamaLink, amazonLink);
    
    name = '计算机是怎样跑起来的';
    alimamaLink = 'http://union.click.jd.com/jdc?e=&p=AyIHZR5aEQISA1AYUyUCEgBdE1kcBiJDCkMFSjJLQhBaUAscSkIBR0ROVw1VC0dFFQIVD10ZUhEdS0IJRmtVV1kEDFMkUGBwTxVgCG1ZCFoMRSBTDh43Vx1TFgQSBFQaaxcAEgdcH1sUByI3NGlrR2zKsePD%2FqQexq3aztOCMhABXRhdFwEbAGUbXhEKFQNXGFMTBRoHZRw%3D&t=W1dCFBBFC1pXUwkEAEAdQFkJBVsVBRoPVxJfCltXWwg%3D';
    amazonLink  = 'http://www.amazon.cn/gp/product/B00YCSV1QI/ref=as_li_qf_sp_asin_il_tl?ie=UTF8&camp=536&creative=3200&creativeASIN=B00YCSV1QI&linkCode=as2&tag=droidyue-23';
    appendProgramBooks(name, alimamaLink, amazonLink);
   
    name =  '计算机程序的构造和解释';
    alimamaLink = 'http://union.click.jd.com/jdc?e=&p=AyIHZR5aEQISA1AYUyUCEwZRHV4TCyJDCkMFSjJLQhBaUAscSkIBR0ROVw1VC0dFFQMTA1MeXRwdS0IJRmtyX1RBS1IFXWFbTz1wDhUAb1MHAQllDh43Vx1TFgQSBFQaaxcAEgdcH1sUByI3NGlrR2zKsePD%2FqQexq3aztOCMhABXRhdFwEbAGUbXhEKFQNXGVkQBBsHZRw%3D&t=W1dCFBBFC1pXUwkEAEAdQFkJBVsUAxYBUB1SCltXWwg%3D';
    amazonLink  = 'http://www.amazon.cn/gp/product/B0011AP7RY/ref=as_li_qf_sp_asin_il_tl?ie=UTF8&camp=536&creative=3200&creativeASIN=B0011AP7RY&linkCode=as2&tag=droidyue-23';
    appendProgramBooks(name, alimamaLink, amazonLink);
   

    name =  '重构：改善既有代码的设计';
    alimamaLink = 'http://union.click.jd.com/jdc?e=&p=AyIHZR5aEQISA1AYUyUCEgFWEl0QAyJDCkMFSjJLQhBaUAscSkIBR0ROVw1VC0dFFQIUBFwdXhQdS0IJRmtoa3sFLFABF2EQQ1ZIU2BpEXchXDp1Dh43Vx1TFgQSBFQaaxcAEgdcH1sUByI3NGlrR2zKsePD%2FqQexq3aztOCMhABXRhdFwEbAGUbXhEKFQNXGV0QBBMCZRw%3D&t=W1dCFBBFC1pXUwkEAEAdQFkJBVsVBBEOUx5aCltXWwg%3D';
    amazonLink  = 'http://www.amazon.cn/gp/product/B011LPUB42/ref=as_li_qf_sp_asin_il_tl?ie=UTF8&camp=536&creative=3200&creativeASIN=B011LPUB42&linkCode=as2&tag=droidyue-23';
    appendProgramBooks(name, alimamaLink, amazonLink);
    
    name = '敏捷软件开发(原则模式与实践)';
    alimamaLink = 'http://union.click.jd.com/jdc?e=&p=AyIHZR5aEQISA1AYUyUCEwZTEl4cACJDCkMFSjJLQhBaUAscSkIBR0ROVw1VC0dFFQMTAVweUhcdS0IJRmtmQhIDNkM4XWIXQxMdHGxDCBkzXj11Dh43Vx1TFgQSBFQaaxcAEgdcH1sUByI3NGlrR2zKsePD%2FqQexq3aztOCMhABXRhdFwEbAGUbXhEKFQNXHlgVBRoAZRw%3D&t=W1dCFBBFC1pXUwkEAEAdQFkJBVsUAxQOUBJZCltXWwg%3D';
    amazonLink  = 'http://www.amazon.cn/gp/product/B00116MMA8/ref=as_li_qf_sp_asin_il_tl?ie=UTF8&camp=536&creative=3200&creativeASIN=B00116MMA8&linkCode=as2&tag=droidyue-23';
    appendProgramBooks(name, alimamaLink, amazonLink);
   
    name =  '设计模式 可复用面向对象软件的基础';
    alimamaLink = 'http://union.click.jd.com/jdc?e=&p=AyIHZR5aEQISA1AYUyUCEwZRHVkVCiJDCkMFSjJLQhBaUAscSkIBR0ROVw1VC0dFFQMTA1MZWx0dS0IJRmsPdG1GJUZaSWJKZT1nG0MGcQMHEl1TDh43Vx1TFgQSBFQaaxcAEgdcH1sUByI3NGlrR2zKsePD%2FqQexq3aztOCMhABXRhdFwEbAGUbXhEKFQNXHl8RBBsDZRw%3D&t=W1dCFBBFC1pXUwkEAEAdQFkJBVsUAxYBVxtTCltXWwg%3D';
    amazonLink = 'http://www.amazon.cn/gp/product/B001130JN8/ref=as_li_qf_sp_asin_il_tl?ie=UTF8&camp=536&creative=3200&creativeASIN=B001130JN8&linkCode=as2&tag=droidyue-23';
    appendProgramBooks(name, alimamaLink, amazonLink);
    
    name = '程序员的思维修炼:开发认知潜能的九堂课';
    alimamaLink = undefined;
    amazonLink  = 'http://www.amazon.cn/gp/product/B007VARUIM/ref=as_li_qf_sp_asin_il_tl?ie=UTF8&camp=536&creative=3200&creativeASIN=B007VARUIM&linkCode=as2&tag=droidyue-23';
    appendProgramBooks(name, alimamaLink, amazonLink);
    
    name = '代码之髓';
    alimamaLink = 'http://union.click.jd.com/jdc?e=&p=AyIHZR5aEQISA1AYUyUCEgNVGl0VACJDCkMFSjJLQhBaUAscSkIBR0ROVw1VC0dFFQIWB1QdWxcdS0IJRmtUamlgD2EEbGFbdS5QXBZYaQRVEgZDDh43Vx1TFgQSBFQaaxcAEgdcH1sUByI3NGlrR2zKsePD%2FqQexq3aztOCMhABXRhdFwEbAGUbXhEKFQNXH10WBRMEZRw%3D&t=W1dCFBBFC1pXUwkEAEAdQFkJBVsVBhIGUxtZCltXWwg%3D';
    amazonLink = 'http://www.amazon.cn/gp/product/B00M6KMQJU/ref=as_li_qf_sp_asin_il_tl?ie=UTF8&camp=536&creative=3200&creativeASIN=B00M6KMQJU&linkCode=as2&tag=droidyue-23';
    appendProgramBooks(name, alimamaLink, amazonLink);


    name = "有趣的二进制";
    alimamaLink = 'http://union.click.jd.com/jdc?e=&p=AyIHZR5aEQISA1AYUyUCEgFcE1wSCiJDCkMFSjJLQhBaUAscSkIBR0ROVw1VC0dFFQIUDl0cXB0dS0IJRmsXWVV0N0MEC2JqfQJtX0N%2BSn0CUAl1Dh43Vx1TFgQSBFQaaxcAEgdcH1sUByI3NGlrR2zKsePD%2FqQexq3aztOCMhABXRhdFwEbAGUbXhEKFQNXHFgQBxEAZRw%3D&t=W1dCFBBFC1pXUwkEAEAdQFkJBVsVBBsPUhxTCltXWwg%3D';
    amazonLink = 'http://www.amazon.cn/gp/product/B016V2TEXO/ref=as_li_qf_sp_asin_il_tl?ie=UTF8&camp=536&creative=3200&creativeASIN=B016V2TEXO&linkCode=as2&tag=droidyue-23';
    appendProgramBooks(name, alimamaLink, amazonLink);

    name = '鸟哥的linux私房菜';
    alimamaLink = 'http://union.click.jd.com/jdc?e=&p=AyIHZR5aEQISA1AYUyUCEwZSHl4WCiJDCkMFSjJLQhBaUAscSkIBR0ROVw1VC0dFFQMTAFAeWB0dS0IJRmt3cmxSCWJBSGBEQ10dWFBaGgMlZBJTDh43Vx1TFgQSBFQaaxcAEgdcH1sUByI3NGlrR2zKsePD%2FqQexq3aztOCMhABXRhdFwEbAGUbXhEKFQNXHF8XChoFZRw%3D&t=W1dCFBBFC1pXUwkEAEAdQFkJBVsUAxUCUBhTCltXWwg%3D';
    amazonLink = 'http://www.amazon.cn/gp/product/B003TJNO98/ref=as_li_qf_sp_asin_il_tl?ie=UTF8&camp=536&creative=3200&creativeASIN=B003TJNO98&linkCode=as2&tag=droidyue-23';
    appendProgramBooks(name, alimamaLink, amazonLink);

    name = '啊哈！算法';
    alimamaLink = 'http://union.click.jd.com/jdc?e=&p=AyIHZR5aEQISA1AYUyUCEgJTHVkUASJDCkMFSjJLQhBaUAscSkIBR0ROVw1VC0dFFQIXAVMZWhYdS0IJRmtDVlBOIk0YfGBIZQNhIml8Qh0MBQNDDh43Vx1TFgQSBFQaaxcAEgdcH1sUByI3NGlrR2zKsePD%2FqQexq3aztOCMhABXRhdFwEbAGUbXhEKFQNXHVoXChMOZRw%3D&t=W1dCFBBFC1pXUwkEAEAdQFkJBVsVBxQBVxpYCltXWwg%3D';
    amazonLink = 'http://www.amazon.cn/gp/product/B00KSWT268/ref=as_li_qf_sp_asin_il_tl?ie=UTF8&camp=536&creative=3200&creativeASIN=B00KSWT268&linkCode=as2&tag=droidyue-23';
    appendProgramBooks(name, alimamaLink, amazonLink);

    
    name = '编码：隐匿在计算机软硬件背后的语言(永不退色的计算机科学经典著作)';
    alimamaLink = 'http://www.amazon.cn/s/ref=as_li_ss_tl?_encoding=UTF8&camp=536&creative=3132&field-keywords=%E9%9A%90%E5%8C%BF%E5%9C%A8%E8%AE%A1%E7%AE%97%E6%9C%BA%E8%BD%AF%E7%A1%AC%E4%BB%B6%E8%83%8C%E5%90%8E%E7%9A%84%E8%AF%AD%E8%A8%80&linkCode=ur2&tag=droidyue-23&url=search-alias%3Daps';
    
    amazonLink = "http://www.amazon.cn/s/ref=as_li_ss_tl?_encoding=UTF8&camp=536&creative=3132&field-keywords=%E9%9A%90%E5%8C%BF%E5%9C%A8%E8%AE%A1%E7%AE%97%E6%9C%BA%E8%BD%AF%E7%A1%AC%E4%BB%B6%E8%83%8C%E5%90%8E%E7%9A%84%E8%AF%AD%E8%A8%80&linkCode=ur2&tag=droidyue-23&url=search-alias%3Daps";
    appendProgramBooks(name, alimamaLink, amazonLink);


    name = '深入理解计算机系统';
    alimamaLink = 'http://union.click.jd.com/jdc?e=&p=AyIHZR5aEQISA1AYUyUCEwVSGlMUBSJDCkMFSjJLQhBaUAscSkIBR0ROVw1VC0dFFQMQAFQTWhIdS0IJRmtwABtwNRsaaGdoR11kKH5RS3spUAdlDh43Vx1TFgQSBFQaaxcAEgdcH1sUByI3NGlrR2zKsePD%2FqQexq3aztOCMhABXRhdFwEbAGUbXhEKFQNXEl0cBBIEZRw%3D&t=W1dCFBBFC1pXUwkEAEAdQFkJBVsUABUGXRpcCltXWwg%3D';
    amazonLink = 'http://www.amazon.cn/gp/product/B004BJ18KM/ref=as_li_qf_sp_asin_il_tl?ie=UTF8&camp=536&creative=3200&creativeASIN=B004BJ18KM&linkCode=as2&tag=droidyue-23';
    appendProgramBooks(name, alimamaLink, amazonLink);


    name = '程序员的呐喊';
    alimamaLink = 'http://union.click.jd.com/jdc?e=&p=AyIHZR5aEQISA1AYUyUCEgJRElkVCyJDCkMFSjJLQhBaUAscSkIBR0ROVw1VC0dFFQIXA1wZWxwdS0IJRmtSQ1laLmcFTWFneQptHFACYUcSUhtlDh43Vx1TFgQSBFQaaxcAEgdcH1sUByI3NGlrR2zKsePD%2FqQexq3aztOCMhABXRhdFwEbAGUbXhEKFQNTHVgdABcDZRw%3D&t=W1dCFBBFC1pXUwkEAEAdQFkJBVsVBxYOVxtSCltXWwg%3D';
    amazonLink = 'http://www.amazon.cn/gp/product/B00K5KNXJA/ref=as_li_qf_sp_asin_il_tl?ie=UTF8&camp=536&creative=3200&creativeASIN=B00K5KNXJA&linkCode=as2&tag=droidyue-23';
    appendProgramBooks(name, alimamaLink, amazonLink);


    name = "Gradle for Android 中文版";
    alimamaLink = "http://union.click.jd.com/jdc?e=&p=AyIHZR5aEQISA1AYUyUCEg9dH10RCiJDCkMFSjJLQhBaUAscSkIBR0ROVw1VC0dFFQIaD1EdXx0dS0IJRmtxQGdVLlovFmcSWzcFW0l6WUU8bS5TDh43Vx1TFgQSBFQaaxcAEgdcH1sUByI3NGlrR2zKsePD%2FqQexq3aztOCMhABXRhdFwEbAGUbXhwCEg9RE18XARoOZRxrRV1HRAtDDl1GRjdl&t=W1dCFBBFC1pXUwkEAEAdQFkJBVsVChoDUx9TCltXWwg%3D";
    amazonLink = "https://www.amazon.cn/gp/product/B01M27OLDP/ref=as_li_qf_sp_asin_il_tl?ie=UTF8&camp=536&creative=3200&creativeASIN=B01M27OLDP&linkCode=as2&tag=droidyue-23";
    appendProgramBooks(name, alimamaLink, amazonLink);




    data = booksToJSON(programBooks, LINK_TYPE_ALIMAMA);  
    data = shuffleJsonObject(data);
    data = splitJSONObject(data, 40);
    data = sortJsonObject(data);  
    return data;
}
