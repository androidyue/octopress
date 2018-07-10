toastr.options = {
  "closeButton": true,
  "debug": false,
  "newestOnTop": false,
  "progressBar": false,
  "positionClass": "toast-bottom-right",
  "preventDuplicates": false,
  "onclick": undefined,
  "showDuration": "300",
  "hideDuration": "1000",
  "timeOut": "50000000",
  "extendedTimeOut": "100000000",
  "showEasing": "swing",
  "hideEasing": "linear",
  "showMethod": "fadeIn",
  "hideMethod": "fadeOut"
};


var recDialogContent = '';
//if (isMobile()) {
//    recDialogContent = recDialogContent + '<p align="center">来自技术小黑屋的红包</p><a href="http://droidyue.com/2018_hongbaoyu.html"><img width="200" src="http://7jpolu.com1.z0.glb.clouddn.com/dahongbao.png"></a>';
//} else {*/
/*recDialogContent = recDialogContent + '<p align="center">很有意思的网络协议讲解</p><img width="200" src="https://asset.droidyue.com/image/qutan_wangluo_xieyi.png">'*/

recDialogContent = recDialogContent + '<p align="center">货真价实的Kotlin讲解</p><img width="200" src="https://asset.droidyue.com/image/kotlin_zhangtao.jpeg">'
/*}*/

/*
<h3>知乎Live推荐</h3>
<ul>
  <li><a href="https://www.zhihu.com/lives/802899577341620224">我学安卓的那些套路</a></li>
  <li><a href="https://www.zhihu.com/lives/796775894273363968">程序员如何写好一篇技术文章？</a></li>
</ul>
*/

if (true) {
    toastr.info(recDialogContent, " ");
}
