/**
 * @author Teppo Kankaanpää
 */


function htmlEscape(str) {
    return String(str)
            .replace(/&/g, '&amp;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
}


function submitChat() {
	if (player != "" && room != -1) {
		var chat = document.myForm.chat.value;
		var geturl = "/cgi-bin/submitchat.cgi";
		var postdata = "player=" + player + "&passcode=" + passcode + "chat=" + chat.replace(/=/g, "%3D").replace(/&/g, "%3F");
		$.ajax({
			cache: false,
			dataType : 'xml',
			type : 'POST',
			data : { player: player, passcode: passcode, chat: chat },
			url : geturl,
			success : function(data) {
				updatechat(data);
			}
		});
		document.myForm.chat.value = "";
	}
}

var chatLines = new Array();
var chatIds = new Array();
var chatIndex = 0;

function updatechat(data) {
	//	document.myForm.debug.value = data;
	//    document.myForm.time.value = data;
	//var xmlDoc = $.parseXML(data);
	//var $xml = $(xmlDoc);
	//var $chatrecord = $('chatrecord', $xml);

	var $chatrecord = $(data).find("chatrecord");

	//$("#debug").text($chatrecord.text());

    //chatHTML = $('#inchatbox').html();

	//var lines = chatHTML.split("\n");

	if ($chatrecord.length > 0) {
	    $chatrecord.each(function() {
	    	var id = $(this).find("id");
	    	if ($.inArray(id, chatIds) < 0) {
		    	chatLines[chatIndex] = "<b>" + htmlEscape($(this).find("player").text()) + "</b>: " + htmlEscape($(this).find("line").text()) + "<br />";
		    	chatIds[chatIndex] = id;
		    	chatIndex++;
		    }
	    });

	//	$("#debug").text(chatLines[chatIndex-1]);
	
		if (chatIndex > 30) {
			for (i=chatIndex-30; i<chatIndex; i++) {
				chatLines[i-(chatIndex-30)] = chatLines[i];
			}
			chatIndex = 30;
		}
	
		chatHTML = "";
		for (i=0; i<chatIndex; i++) {
			chatHTML = chatHTML + chatLines[i];
		}

        $("#inchatbox").html(chatHTML);
	
	//	document.getElementById("inchatbox").innerHTML = chatHTML;
	//	document.getElementById("inchatbox").innerHTML = chatHTML;
	
		var height = $("#inchatbox").height() - 180;
		if (height < 0) { height = 0; }
//		$("#debug").text(chatLines[chatIndex-1]);
		$("#chatbox").scrollTop(height);
	}
}

