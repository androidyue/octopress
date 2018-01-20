var javaBooks = [];

function appendJavaBooks(name ,alimamaLink, amazonLink) {
    var book = new Book(name);
    book.alimamaLink = alimamaLink;
    book.amazonLink = amazonLink;
    javaBooks.push(book);
}


function shouldDisplayJavaBook() {
   
	return isDesktop() || isWeixinBrowser();
}

function makeJavaBookPrefix() {
	return '<section><h1>Java经典</h1>';
}

function makeJavaBookSuffix() {
	return '</section>';
}

function isJavaBookInDebug() {
	return false;
}

function makeJavaBookData() {
    var data = {};

    var name, alimamaLink, amazonLink;

    name = 'Java并发编程实战';
    alimamaLink = 'http://union.click.jd.com/jdc?e=&p=AyIHZR5aEQISA1AYUyUCEw9WGFgRAyJDCkMFSjJLQhBaUAscSkIBR0ROVw1VC0dFFQMaBFYYXxQdS0IJRmsQRxBlLm0JSmAIUylYOxZmSR0rGzlDDh43Vx1TFgQSBFQaaxcAEgdcH1sUByI3NGlrR2zKsePD%2FqQexq3aztOCMhABXRhdFwEbAGUbXhELFwBTGVMRARUEZRw%3D&t=W1dCFBBFC1pXUwkEAEAdQFkJBVsUChEEVh9aCltXWwg%3D';
    amazonLink = 'http://www.amazon.cn/gp/product/B0077K9XHW/ref=as_li_qf_sp_asin_il_tl?ie=UTF8&camp=536&creative=3200&creativeASIN=B0077K9XHW&linkCode=as2&tag=droidyue-23';
    appendJavaBooks(name, alimamaLink, amazonLink);

    name = 'Effective Java';
    alimamaLink = 'http://union.click.jd.com/jdc?e=&p=AyIHZR5aEQISA1AYUyUCEwZRElMUASJDCkMFSjJLQhBaUAscSkIBR0ROVw1VC0dFFQMTA1wTWhYdS0IJRmt2YRRMDkZdFWd7Tz1QDHxqFFMlZRNDDh43Vx1TFgQSBFQaaxcAEgdcH1sUByI3NGlrR2zKsePD%2FqQexq3aztOCMhABXRhdFwEbAGUbXhELFwBTHlkXChYGZRw%3D&t=W1dCFBBFC1pXUwkEAEAdQFkJBVsUAxYOXRpYCltXWwg%3D';
    amazonLink = 'http://www.amazon.cn/gp/product/B001PTGR52/ref=as_li_qf_sp_asin_il_tl?ie=UTF8&camp=536&creative=3200&creativeASIN=B001PTGR52&linkCode=as2&tag=droidyue-23';
    appendJavaBooks(name, alimamaLink, amazonLink);

    name = 'Java编程思想';
    alimamaLink = 'http://union.click.jd.com/jdc?e=&p=AyIHZR5aEQISA1AYUyUCEgVVG1wQBiJDCkMFSjJLQhBaUAscSkIBR0ROVw1VC0dFFQIQB1UcXhEdS0IJRmsPZRBmPE0fHWdtZTVDG2tUF1QheCh1Dh43VCtZFwISDlEbWhAyImYnKwl72qSxjb7qCda4iICTzCUHEwNdGVgSBBc3VR5fHQYSAl0SXBcFGzdXGw%3D%3D&t=W1dCFBBFC1pXUwkEAEAdQFkJBVsVABIHUh5fCltXWwg%3D';
    amazonLink  = 'http://www.amazon.cn/gp/product/B0011F7WU4/ref=as_li_qf_sp_asin_il_tl?ie=UTF8&camp=536&creative=3200&creativeASIN=B0011F7WU4&linkCode=as2&tag=droidyue-23';
    appendJavaBooks(name, alimamaLink, amazonLink);


    name = 'Java性能优化权威指南';
    alimamaLink = undefined;
    amazonLink  = 'http://www.amazon.cn/gp/product/B00IOB0K1Q/ref=as_li_qf_sp_asin_il_tl?ie=UTF8&camp=536&creative=3200&creativeASIN=B00IOB0K1Q&linkCode=as2&tag=droidyue-23';
    appendJavaBooks(name, alimamaLink, amazonLink);

    name = 'Java核心技术卷一';
    alimamaLink = 'http://union.click.jd.com/jdc?e=&p=AyIHZR5aEQISA1AYUyUCEgVQH10WAiJDCkMFSjJLQhBaUAscSkIBR0ROVw1VC0dFFQIQAlEdWBUdS0IJRmtOBWp0L24SaGJyR1BaMGdrQAQ8eR11Dh43Vx1TFgQSBFQaaxcAEgdcH1sUByI3NGlrR2zKsePD%2FqQexq3aztOCMhABXRhdFwEbAGUbXhEKFgdRElwXABoBZRw%3D&t=W1dCFBBFC1pXUwkEAEAdQFkJBVsVABcDUxhbCltXWwg%3D';
    amazonLink  = 'http://www.amazon.cn/gp/product/B00G9KF4JC/ref=as_li_qf_sp_asin_il_tl?ie=UTF8&camp=536&creative=3200&creativeASIN=B00G9KF4JC&linkCode=as2&tag=droidyue-23';
    appendJavaBooks(name, alimamaLink, amazonLink);

    name =  'Java核心技术卷二';
    alimamaLink = 'http://union.click.jd.com/jdc?e=&p=AyIHZR5aEQISA1AYUyUCEwZRElMUBCJDCkMFSjJLQhBaUAscSkIBR0ROVw1VC0dFFQMTA1wTWhMdS0IJRmsRaRpiA2kca2JHYRNYDBVpSUMcZFh1Dh43Vx1TFgQSBFQaaxcAEgdcH1sUByI3NGlrR2zKsePD%2FqQexq3aztOCMhABXRhdFwEbAGUbXhEKFgdSGlkQBBQCZRw%3D&t=W1dCFBBFC1pXUwkEAEAdQFkJBVsUAxYOXRpdCltXWwg%3D';
    amazonLink  = 'http://www.amazon.cn/gp/product/B00IK7SM6O/ref=as_li_qf_sp_asin_il_tl?ie=UTF8&camp=536&creative=3200&creativeASIN=B00IK7SM6O&linkCode=as2&tag=droidyue-23';
    appendJavaBooks(name, alimamaLink, amazonLink);

    name = '深入理解Java虚拟机';
    alimamaLink = 'http://union.click.jd.com/jdc?e=&p=AyIHZR5aEQISA1AYUyUCEgRRGF0TCyJDCkMFSjJLQhBaUAscSkIBR0ROVw1VC0dFFQIRA1YdXRwdS0IJRmsTQnNBKR4ic2IMW1N6Hm16bXkUGBBlDh43Vx1TFgQSBFQaaxcAEgdcH1sUByI3NGlrR2zKsePD%2FqQexq3aztOCMhABXRhdFwEbAGUbXhEKFgdSGlwcChsEZRw%3D&t=W1dCFBBFC1pXUwkEAEAdQFkJBVsVARYEUx1SCltXWwg%3D';
    amazonLink  = 'http://www.amazon.cn/gp/product/B00D2ID4PK/ref=as_li_qf_sp_asin_il_tl?ie=UTF8&camp=536&creative=3200&creativeASIN=B00D2ID4PK&linkCode=as2&tag=droidyue-23';
    appendJavaBooks(name, alimamaLink, amazonLink);

    name = 'Java程序员修炼之道';
    alimamaLink = 'http://union.click.jd.com/jdc?e=&p=AyIHZR5aEQISA1AYUyUCEgRSE1wWBiJDCkMFSjJLQhBaUAscSkIBR0ROVw1VC0dFFQIRAF0cWBEdS0IJRmsWBkFeUlldVmdkZSBjUxVQTXBPUCJTDh43Vx1TFgQSBFQaaxcAEgdcH1sUByI3NGlrR2zKsePD%2FqQexq3aztOCMhABXRhdFwEbAGUbXhEKFgdSG1sUAxIOZRw%3D&t=W1dCFBBFC1pXUwkEAEAdQFkJBVsVARUPUhhfCltXWwg%3D';
    amazonLink = 'http://www.amazon.cn/gp/product/B00E0D2OX4/ref=as_li_qf_sp_asin_il_tl?ie=UTF8&camp=536&creative=3200&creativeASIN=B00E0D2OX4&linkCode=as2&tag=droidyue-23';
	appendJavaBooks(name, alimamaLink, amazonLink);

    name = 'Java虚拟机规范(Java SE 7版)';
    alimamaLink = 'http://union.click.jd.com/jdc?e=&p=AyIHZR5aEQISA1AYUyUCEgVSH18SAiJDCkMFSjJLQhBaUAscSkIBR0ROVw1VC0dFFQIQAFEfXBUdS0IJRmtCZHtfBnAuRWBbUwZBDXR4E28oRRxTDh43Vx1TFgQSBFQaaxcAEgdcH1sUByI3NGlrR2zKsePD%2FqQexq3aztOCMhABXRhdFwEbAGUbXhEKFgdSG14SABMDZRw%3D&t=W1dCFBBFC1pXUwkEAEAdQFkJBVsVABUDURxbCltXWwg%3D';
    amazonLink  = 'http://www.amazon.cn/gp/product/B00H1FXTNM/ref=as_li_qf_sp_asin_il_tl?ie=UTF8&camp=536&creative=3200&creativeASIN=B00H1FXTNM&linkCode=as2&tag=droidyue-23';
	appendJavaBooks(name, alimamaLink, amazonLink);

    data = booksToJSON(javaBooks, LINK_TYPE_ALIMAMA);

    return data;
}

function displayJavaBook() {
    var data = makeJavaBookData();
    data = sortJsonObject(data);
	displaySection(shouldDisplayJavaBook(), isJavaBookInDebug(),   data,    makeJavaBookPrefix(),    makeJavaBookSuffix(), 'java_book'  );
}
