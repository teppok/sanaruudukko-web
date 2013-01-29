/**
 * @author Teppo Kankaanpää
 */

var allWordsShown = false;

var allWordsRequested = false;

function initAllWords() {
	if (! allWordsRequested && ! roundCont) {
		allWordsRequested = true;
		if (player != "" && passcode != "") {
			$("#allwords").html("Ladataan.");
			var geturl = "/cgi-bin/process.cgi?func=allwords&player=" + player + "&passcode=" + passcode;
			$.ajax({
				type : 'GET',
				datatype : 'xml',
				url : geturl,
				success : function(data) {
					showAllWords(data);
				},
			});
	    }
	}
}

function showAllWords(data) {
	var $word = $(data).find("word");

	var allwords = "<div class='allwordlist'>";

	var i = 0;
	$word.each(function () {
		if (i % 20 == 19) { 
			allwords += "</div><div class='allwordlist'>";
		}
		allwords += $(this).text().replace(/a/g, "&Auml;").replace(/o/g, "&Ouml;") + "<br />";
		i++;
	});
	allwords += "</div>";
	
	if (i == 0) { allwords = "Ei sanoja."; }
	
	$("#allwords").html(allwords);

}

function resetallwords() {
	allWordsRequested = false;
	allWordsShown = false;
	$("#allwords").html("Kierros on kesken.");
	document.getElementById('allwords').style.display = 'none';
}

function showhideallwords() {
		if (allWordsShown == false) {
			initAllWords();
			allWordsShown = true;
			document.myForm.showhide.value="Piilota kaikki mahdollisuudet";
			document.getElementById('allwords').style.display = 'block';
		} else {
			allWordsShown = false;
			document.myForm.showhide.value="Näytä kaikki mahdollisuudet";
			document.getElementById('allwords').style.display = 'none';
		}
}

