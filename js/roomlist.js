/**
 * @author Teppo Kankaanpää
 */

function startRoom(data) {
	//var xmlDoc = $.parseXML(data);
	//var $xml = $(xmlDoc);
	//var $datadata = $('data', $xml);
	

	if ($(data).find("status").text() == 1) {
		$("#warning").html("Kirjautuminen ei onnistunut.");
	} else {
		if ($(data).find("status").text() == 10) {
			initRoomList();
	 	} else {
			room = $(data).find("id").text();
			updatewords(data);
//			populateGrid("????????????????");
			update(data);
			poll();
	//		wordwaiter();
	//		chatwaiter();
			document.getElementById("roomnumber").innerHTML = "Huone: " + $(data).find("roomname").text();
			document.getElementById("titlescreen").style.display = "none";
			document.getElementById("roomform").style.display = "none";
			document.getElementById("playarea").style.display = "block";
		}
	}

}


function setPlayer() {
	$("#warning").html("");
	var tmpplayer = document.registerform.name.value;
	var tmppasscode = document.registerform.passcode.value; 
	if (tmpplayer.search(/[^a-zA-Z0-9]/) != -1 || tmpplayer.length > 16) {
		$("#warning").html("Viallinen pelaajan nimi.");
		return;
	}
	if (tmppasscode.search(/[^a-zA-Z0-9]/) != -1 || tmppasscode.length > 16) {
		$("#warning").html("Viallinen tunnussana.");
		return;
	}
	player = tmpplayer;
	passcode = tmppasscode;
	if (player != "" && passcode != "") {

		var geturl = "/cgi-bin/process.cgi?func=registerp&player=" + player + "&passcode=" + passcode;
		//document.myForm.debug.value = geturl;
		$.ajax({
			cache: false,
			dataType : 'xml',
			type : 'GET',
			url : geturl,
			success : function(data) {
				startRoom(data);
			},
		});
		//document.myForm.word.focus();
	}
}



function initRoomList() {
	room = -1;
	document.getElementById("titlescreen").style.display = "none";
	document.getElementById("roomform").style.display = "block";
	document.getElementById("playarea").style.display = "none";
	if (player != "") {
		var geturl = "/cgi-bin/process.cgi?func=getrooms&player=" + player + "&passcode=" + passcode;
		$.ajax({
			dataType : 'xml',
			type : 'GET',
			url : geturl,
			success : function(data) {
				showRoomList(data);
			},
		});
	}	
}

function showRoomList(data) {
//	var xmlDoc = $.parseXML(data);
//	var $xml = $(xmlDoc);
//	var $room = $('room', $xml);

	var $room = $(data).find("room");

	var roomlist = "";

	$room.each(function () {
		roomlist += "<div><a href='#' onclick='joinroom(" + $(this).find("id").text() + 
		  ");'>Room: " + $(this).find("roomname").text() + 
		  ", Players: " + $(this).find("players").text() + "</a></div>";
	});
	
	if (roomlist == "") { roomlist = "Ei aktiivisia huoneita."; }
	
	$("#roomlist").html(roomlist);
}

function joinroom(data) {
	var tmproom = data;
	if (player != "" && passcode != "" && tmproom >= 0) {

		var geturl = "/cgi-bin/process.cgi?func=joinroom&player=" + player + "&passcode=" + passcode + "&room=" + tmproom;
		$.ajax({
			cache: false,
			dataType : 'xml',
			type : 'GET',
			url : geturl,
			success : function(data) {
				startRoom(data);
			},
		});
		//document.myForm.word.focus();
	}
}

function newroom() {
	$("#warning2").html("");
	var tmproomname = document.roomform.roomname.value;
	if (tmproomname.search(/[^a-zA-Z0-9]/) != -1 || tmproomname.length > 16) {
		$("#warning2").html("Viallinen huoneen nimi.");
		return;
	}
	var roomname = tmproomname;
	if (player != "" && passcode != "" && roomname != "") {

		var geturl = "/cgi-bin/process.cgi?func=newroom&player=" + player + "&passcode=" + passcode + "&roomname=" + roomname;
		$.ajax({
			cache: false,
			dataType : 'xml',
			type : 'GET',
			url : geturl,
			success : function(data) {
				startRoom(data);
			},
		});
		//document.myForm.word.focus();
	}
}

function leaveRoom() {
	if (player != "") {
		roundEnded();
		var geturl = "/cgi-bin/process.cgi?func=leaveroom&player=" + player + "&passcode=" + passcode;
		//document.myForm.debug.value = geturl;
		$.ajax({
			cache: false,
			dataType : 'xml',
			type : 'GET',
			url : geturl,
			success : function(data) {
				initRoomList();
			},
		});
	}
}


