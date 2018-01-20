function shouldDisplayFriendLinks() {
    return true ;
}

function makeFriendLinksPrefix() {
    return '<section><h1>友情链接</h1>';
}

function makeFriendLinksSuffix() {
    return '</section>';
}

function isFriendLinksInDebug() {
    return false;
}


var sDroidFriendLinksClass = "friendlinks_class";


function makeFriendLinksDataSource() {
    var data = {};
    
    data['刚刚在线-分享iOS开发技术经验的自媒体网站'] = 'http://www.superqq.com/';
    
    data['程序员头条'] = 'http://www.iswifting.com/';
    
    data['某学姐的技术成长之路'] = 'http://wangxinghe.me/';

    data['大侠咕咚'] = 'http://gudong.name/';

    data['吴小龙同學'] = 'http://wuxiaolong.me/';

    data['金山云'] = 'https://bbs.ksyun.com/forum.php?ch=00008.00009&hmsr=yylt&hmpl=&hmcu=&hmkw=&hmci= ';
    
    data = sortJsonObject(data);
    
    return data;

}


displaySection(shouldDisplayFriendLinks(), isFriendLinksInDebug(), makeFriendLinksDataSource(), makeFriendLinksPrefix(),makeFriendLinksSuffix() , sDroidFriendLinksClass)
