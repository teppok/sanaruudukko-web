var player = "";
var passcode = "";
var roundCont = false;
var room = -1;

var stop = false;
var polling = false;

var interval;
var targetDate;

var newRoundRequested = false;
var moreTimeRequested = false;
var lastMinute = false;

function debug(word) {
	if (0) {
		$("#helplink").text($("#helplink").text() + word);
	}
}


$(document).ready(function() {
	$("#ownwordlistcontainer").css("max-height", ($(window).height() - 55) + "px");
	
	$("#helpcopy").html($("#helpinfo").html());
//	poll2();
//	$("#help").text("a");
//	timerUpdate(5000);
//	interval = setInterval(timerCounter, 200);
});


function poll() {
	if (player != "" && room != -1 && !polling) {
		setTimeout(function() {
			if (stop == false && room != -1) {
				var geturl = '/cgi-bin/process.cgi?func=wordwaiter&player=' + player + "&passcode=" + passcode;
				//		document.myForm.debug.value = geturl;
				polling = true;
				$.ajax({
//					cache: false,
					dataType : 'xml',
					type : 'GET',
					url : geturl,
					success : function(data) {
						polling = false;
						update(data);
						updatewords(data);
						updatechat(data);
					},
					complete : poll
				});
			}
		}, 200);
	}
}
/*
function poll2() {
	setTimeout(function() {
		var geturl = '/cgi-bin/test.php';
				//		document.myForm.debug.value = geturl;
				$.ajax({
//					cache: false,
					dataType : 'text',
					type : 'GET',
					url : geturl,
					success : function(data) {
						
					},
					complete : poll2
				});
		}, 200);
}
*/

// Targetdate: sisältää ajan, jolloin nykyinen kierros päättyy
// Päivitetään vain, jos uusi aika on tiukempi taikka yli minuutin löysempi
// jolloin on tilattu lisää aikaa.

function timerUpdate(remainingMillis) {
	var currentDate = new Date();
	if (targetDate instanceof Date) {
		var targetMillis = targetDate.valueOf();
		if ((currentDate.valueOf() + remainingMillis) < targetMillis || (currentDate.valueOf() + remainingMillis) > targetMillis + 60000) {
			targetDate.setTime(currentDate.valueOf() + remainingMillis);
		}
	} else {
		targetDate = new Date();
		targetDate.setTime(currentDate.valueOf() + remainingMillis);
	}
}

function timerCounter() {
	var currentDate = new Date();
	var remainingNow = targetDate.valueOf() - currentDate.valueOf();


	if (remainingNow < 0) {
		$('#time').html("(Kierros päättynyt)");
		roundEnded();
	} else {
		var seconds = Math.floor((remainingNow / 1000)) % 60;
		var minutes = Math.floor((remainingNow / 1000) / 60);
		if (seconds < 10) { seconds = '0' + seconds; }
		$("#time").text(minutes + ":" + seconds);
	}

	if (remainingNow < 60000) {
		if (lastMinute == false) {
			lastMinute = true;
			updateButtons();
		}
	} else {
		if (lastMinute == true) {
			lastMinute = false;
			updateButtons();
		}
	}

}



function update(data) {
	//	document.myForm.debug.value = data;
		debug(":");
	
		//var xmlDoc = $.parseXML(data);
		//var $xml = $(xmlDoc);
		//var $time = $('time', $xml);
		
		var $time = $(data).find("time");
		var $board = $(data).find("board");
	
		//				document.myForm.time.value = $test.text();
	    //$("#help").text(data);
		if ($time.text() != "") {
			timerUpdate($time.text() * 10);
			roundContinues();
		}
	
		if ($board.text() != "") {
			populateGrid($board.text());
		}
}
function roundContinues() {
	if (roundCont == false) {
		interval = setInterval(timerCounter, 200);
		roundCont = true;
//		document.myForm.round.disabled = true;
		updateButtons();
		resetallwords();
	}
}

function roundEnded() {
	if (roundCont == true) {
		clearInterval(interval);
		targetDate = null;
		roundCont = false;
//		document.myForm.round.disabled = false;
		updateButtons();
		getWords();
	}
}

function updatewords(data) {
	//	document.myForm.debug.value = data;
	//    document.myForm.time.value = data;
	debug(".");

//	$("#helplink").text($(data).text());

	var $player = $(data).find("players").find("player");
		
	//var xmlDoc = $.parseXML(data);
	//var $xml = $(xmlDoc);
	//var $player = $('player', $xml);
	
	var container = document.getElementById("players");
	var ownContainer = document.getElementById("ownarea");
	var newHtml = "";
	//var ownHtml = "";
	//var targetContainer = newContainer;
	var containerHTML = "";

	var players = 0;
	
	if ($player.text() == "") { return; }

	moreTimeRequested = false;
	newRoundRequested = false;

	$player.each(function(index, elem) {
		newHtml = "";
		var isPlayer = ($(elem).find('name').text() == player);

		var backupscroll;
		if (isPlayer) {
			backupscroll = $("#ownwordlistcontainer").scrollTop();
		}
		/*
		 if ($ (elem ).find('name').text() == player) {
		 targetHtml = ownHtml;
		 } else {
		 targetContainer = newContainer;
		 }
		 */
		
		
		newHtml = "<div class='playername'>";
		if ($(elem).find("active").text() == "f") {
			newHtml = newHtml + "<span class='inactive'>";
		} else {
			if ($(elem).find("ready").text() == "t") {
				if (isPlayer) {
					newRoundRequested = true;
				}
				newHtml = newHtml + "<span class='ready'>";
			} else {
				if ($(elem).find("moretime").text() == "t" && roundCont) {
					if (isPlayer) {
						moreTimeRequested = true;
					}
					newHtml = newHtml + "<span class='moretime'>";
				} else {
					newHtml = newHtml + "<span>";
				}
			}
		}
		newHtml = newHtml + $(elem).find("name").text() + "</span>";
		
		var total = $(elem).find("totalscore").text();
		if (total == "" || total == " ") { total = "0"; } else {
			total = parseInt(total, 10);
		}
		var thisround = $(elem).find("thisroundscore").text();
		if (thisround == "") { thisround = "?"; } else {
			thisround = parseInt(thisround, 10);
		}
		newHtml = newHtml + "<br>Kerätyt pisteet: " + total + 
		   "<br />Tämä kierros: " + thisround + "</div>";

		if (isPlayer) {
			newHtml = newHtml + "<div id='ownwordlistcontainer'><div id='ownwordlist'>";
		} else {
			newHtml = newHtml + "<div><div class='wordlist'>";
		}
		
		var mode = $(elem).find('mode').text();
		if (mode == 0) {

			for ( i = 0; i < $(elem).find("wordcount").text(); i++) {
				newHtml = newHtml + "<div class='wordrow'>*****</div>";
			}
			//					container.innerHTML = container.innerHTML + $elem.find("name").text();
		}
		if (mode == 1) {
			$(elem).find("item").each(function() {
				var isdisabled = ($(this).find('disabled').text() == "t");
				var isduplicate = ($(this).find("duplicate").text() == "t");
				newHtml = newHtml + "<div class='wordrow'>";
				newHtml = newHtml + "<div class='delete'>";				
					if (isPlayer) {
						newHtml = newHtml + "<a href='#' onclick=\"removeWord('" + $(this).find('word').text() + "'); return false;\">";
						if (isdisabled) {
							newHtml = newHtml + "<img src='img/undelete.png'></a>";
						} else {
							newHtml = newHtml + "<img src='img/delete.png'></a>";
						}
					}
				newHtml = newHtml + "</div>";
								
				if (isduplicate && isdisabled) {
					newHtml = newHtml + "<span class='duplicateword disabledword'>";
				}
				if (isduplicate && ! isdisabled) {
					newHtml = newHtml + "<span class='duplicateword'>";
				}
				if (! isduplicate && isdisabled) {
					newHtml = newHtml + "<span class='disabledword'>";
				}
				if (! isduplicate && ! isdisabled) {
					newHtml = newHtml + "<span class='normal'>";
				}
				newHtml = newHtml + $(this).find("word").text().replace(/a/g, "&Auml;").replace(/o/g, "&Ouml;");
				newHtml = newHtml + "</span> ";
				if ($(this).find("languagecheck").text() == "t") {
					newHtml = newHtml + "<img src='img/checkmark_small.gif'>";
				}
					newHtml = newHtml + "<div class='points'>";
					newHtml = newHtml + parseInt($(this).find("score").text(), 10);
					newHtml = newHtml + " p</div>";
				newHtml = newHtml + "</div>";
			});
		}
		newHtml = newHtml + "</div></div>";
		if (isPlayer) {
			$('div.playerframe').html(newHtml);
			$("#ownwordlistcontainer").css("max-height", ($(window).height() - (55+65+25)) + "px");
			$("#ownwordlistcontainer").scrollTop(backupscroll);
			//						ownContainer.innerHTML = "<div class='playerframe'>" + newHtml + "</div>";
		} else {
			players++;
			if (players % 4 == 0) {
				containerHTML = containerHTML + "<div class='otherplayerframerow'>" + newHtml + "</div>";
			} else {
				containerHTML = containerHTML + "<div class='otherplayerframe'>" + newHtml + "</div>";
			}
		}

	});
	if (players > 0) {
		$('#players').html(containerHTML);
		$('#players').css("display", "block");
		if (players > 3) {
			players = 3;
		}
		$('#players').css("width", (players * 202) + "px");
	} else {
		$('#players').css("display", "none");
		$('#players').css("width", "10px");
	}
	updateButtons();
}

function updateButtons() {
	if (roundCont) {
		if (moreTimeRequested) {
			document.myForm.round.value = "Peruuta aikapyyntö";
		} else {
			document.myForm.round.value = "Lisää aikaa";
		}
		document.myForm.round.disabled = ! lastMinute;
	} else {
		if (newRoundRequested) {
			document.myForm.round.value = "Peruuta kierrospyyntö";
		} else {
			document.myForm.round.value = "Uusi kierros";
		}
		document.myForm.round.disabled = false;
	}
	document.myForm.showhide.disabled = roundCont;
}

function populateGrid(grid) {
	for ( i = 0; i < 16; i++) {
		var container = document.getElementById("lett" + (i + 1));
		if (grid.charAt(i) == 'a')
			container.innerHTML = "&Auml;";
		else if (grid.charAt(i) == 'o')
			container.innerHTML = "&Ouml;";
		else
			container.innerHTML = grid.charAt(i);
/*			
		else if (grid.charAt(i) == 'F')
			container.innerHTML = "FG";
		else if (grid.charAt(i) == 'B')
			container.innerHTML = "BC";*/
	}
}

function newRound() {
	if (player != "") {
		if (! roundCont) {
			
			var geturl = "/cgi-bin/process.cgi?func=newround&player=" + player + "&passcode=" + passcode;
			//document.myForm.debug.value = geturl;
			$.ajax({
				async: false,
				cache: false,
				type : 'GET',
				url : geturl,
				success : function(data) {
					update(data);
					updatewords(data);
				},
			});
		} else {
			var geturl = "/cgi-bin/process.cgi?func=moretime&player=" + player + "&passcode=" + passcode;
			//document.myForm.debug.value = geturl;
			$.ajax({
				async: false,
				cache: false,
				type : 'GET',
				url : geturl,
				success : function(data) {
					updatewords(data);
				},
			});
		}
	}
}

function submitWord() {
	if (player != "" && room != -1 && word != "") {
		debug("-");
		var word = document.myForm.word.value.toUpperCase().replace(/Ä/g, "a").replace(/Ö/g, "o");
		var geturl = "/cgi-bin/process.cgi?func=submitword&player=" + player + "&passcode=" + passcode + "&word=" + word;
		//document.myForm.debug.value = geturl;
		$.ajax({
//			async: false,
			cache: false,
			dataType : 'xml',
			type : 'GET',
			url : geturl,
			success : function(data) {
				updatewords(data);
			}
		});
		document.myForm.word.value = "";
	}
}

function getWords() {
	if (player != "" && room != -1) {
//		debug("-");
		var geturl = "/cgi-bin/process.cgi?func=getwords&player=" + player + "&passcode=" + passcode;
		$.ajax({
//			cache: false,
			dataType : 'xml',
			type : 'GET',
			url : geturl,
			success : function(data) {
				updatewords(data);
			}
		});
	}
}

function removeWord(data) {
	if (player != "" && room != -1) {
		var geturl = "/cgi-bin/process.cgi?func=removeword&player=" + player + "&passcode=" + passcode + "&word=" + data;
		//document.myForm.debug.value = geturl;
		$.ajax({
//			async: false,
			cache: false,
			dataType : 'xml',
			type : 'GET',
			url : geturl,
			success : function(data) {
				updatewords(data);
			}
		});
	}
}



function stoprun() {
	stop = true;
}

var showhelp = false;

function showhidehelp() {
	if (showhelp == false) {
		showhelp = true;
		document.getElementById('helpinfo').style.display = 'block';
	} else {
		showhelp = false;
		document.getElementById('helpinfo').style.display = 'none';
	}
}

