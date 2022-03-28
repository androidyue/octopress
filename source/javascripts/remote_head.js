

//Google Analytics init
(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script',  window.location.protocol + '//' + window.location.host + '/javascripts/analytics.js','ga');

ga('create',  'UA-72839443-1', 'auto');
ga('send', 'pageview');


function getTitleCandidate(element) {
	var candidate = element.title;
	if (isStringEmpty(candidate)) {
		var innerText = element.innerText;
		if (isStringEmpty(innerText)) {
			candiate = element.href;
		} else {
			candiate = innerText;
		}
	}
	return candiate;
}

//bind a click
$(document).bind('DOMNodeInserted', function(event) {
	$('a[href^="http"]').each(
		function(){
			if (!$(this).attr('target')) {
				$(this).attr('target', '_blank')
			} 
			if ($(this).attr('href').indexOf("droidyue.com") != -1) {
				if ($(this).attr('href').indexOf('newtab.html') != -1) {
					$(this).attr('target', '_blank')
				} else {
					$(this).attr('target', '_self')
				}
			}
			if (!$(this).attr('title')) {
				$(this)[0].title = getTitleCandidate($(this)[0]);
			}
			
			$(this)[0].onclick = function() {
				var className = this.className;
				if (isStringEmpty(className)) {
					className = 'a_tag';
				}
				trackEvent( 'droid_section', className, className + '_' + this.title);
			};
		}
	);
});


