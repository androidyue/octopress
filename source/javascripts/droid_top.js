		var sDate = new Date();
		function getFullDataUrl() {
			return 'http://7xnaad.dl1.z0.glb.clouddn.com/' + getDataFileName() + "?v=" + Date.now();
		}


		function getCurrentMonth() {
			return ("0" + (sDate.getMonth() + 1) ).slice(-2);
		}

		function getCurrentDate() {
			return ("0" + sDate.getDate()).slice(-2)
		}

		function sortDesc(a, b) {
			return b - a;
		}

		function getCurrentReleasedMonth() {
			var date = new Date();
			return date.getFullYear() + '' +  (  "0" +  (date.getMonth() + 1)).slice(-2);
		}

		function getReleasedMonths() {
			var firstReleasedYear = 2015;
			var firstReleasedMonth = 10;
			var releasedMonths = [];
			var date = new Date();
			var currentMonth = date.getMonth() + 1;
			var currentYear = date.getFullYear();
			for (var year = currentYear; year >= firstReleasedYear; year --) {
				console.info("getReleasedMonths year=" + year);
				for (var month = 1; month <= 12; month ++) {
					var reallyMonth = ('0' + month).slice(-2);
					var releasedMonth = year + reallyMonth;
					if (year == firstReleasedYear && month < firstReleasedMonth) {
						console.info("getReleasedMonths skip=" + releasedMonth);
						//skip
					} else if (year == currentYear && month > currentMonth ) {
						//skip
					} else {
						releasedMonths.push(releasedMonth);
					}
				}
			}

			// for (var month = date.getMonth() + 1; month >=10; month --) {
			// 	releasedMonths.push(releasedYear + ('0' + month).slice(-2));
			// }
			var currentReleasedMonth = getCurrentReleasedMonth();
			//releasedMonths = $.grep(releasedMonths, function(n,i) {return n != currentReleasedMonth;});			
			releasedMonths = releasedMonths.sort(sortDesc);
			console.info(releasedMonths);
			return releasedMonths;
		}

		getReleasedMonths();

		function getDataFileName() {
			var releasedMonth =  getParamValue('release_month');
			if (!releasedMonth) {
				releasedMonth = getCurrentReleasedMonth();
			}
			return  releasedMonth + '.json';
		}

		function getToday() {
			var date = new Date();
			return date.getFullYear() + '' +  getCurrentMonth() + getCurrentDate();
		}

		function displayTodaysNews(todaysNewsData) {
            todaysNewsData = sortJsonObject(todaysNewsData);
			var content = makeDisplayContent(todaysNewsData, "<h2>今日的奇妙探索</h2>", "", "todaysnews");
			$("#ganhuo_today").empty();
			$("#ganhuo_today").append(content);
		}

		

		function displayOtherNews(otherNewsData) {
			var dates = Object.keys(otherNewsData);
			var sortedDates = dates.sort(sortDesc);
			
			var date;
			
			for (var index in sortedDates) {
				date = sortedDates[index];
				var dateNewsData = otherNewsData[date];
				if (dateNewsData) {
					dateNewsData = JSON.parse(dateNewsData);
                    dateNewsData = sortJsonObject(dateNewsData);
					var content = makeDisplayContent(dateNewsData, "<h3>" + date + "奇妙探索</h3>", "", "otherdatesnews");
					$("#ganhuo_others").append(content);
				}
			}
			
		}


		function handleData(jsonString) {
			var monthData = JSON.parse(jsonString);
			var today = getToday();
			var todaysData = monthData[today];
			if (todaysData) {
				todaysData = JSON.parse(todaysData);	
				displayTodaysNews(todaysData);
				delete monthData[today];
			}
			displayOtherNews(monthData);
		}




		function loadDoc(url) {
		  var xhttp = new XMLHttpRequest();
		  xhttp.onreadystatechange = function() {
		    if (xhttp.readyState == 4 && xhttp.status == 200) {
		      	handleData(xhttp.responseText);
		    }
		  }
		  xhttp.open("GET", url, false);
		  xhttp.send();
		}
		loadDoc(getFullDataUrl());

		function displayReleasedList() {
			var releasedMonths = getReleasedMonths();
			var releasedDataSource = {};
			for (var index in releasedMonths) {
				var month = releasedMonths[index];
				releasedDataSource[month + '奇妙探索月报'] = '/read/?release_month=' + month;
			}
			console.info(releasedDataSource);
			if (!isJsonObjectEmpty(releasedDataSource)) {
				var content = makeDisplayContent(releasedDataSource, "<h3>归档</h3>", '', 'released_archive');
				$("#ganhuo_list").append(content);
			}
		}
		displayReleasedList();