// Check for PMC full text link
// Navigate to PMC full text page
// Get and parse full text XML from OAI
// https://developer.chrome.com/extensions/xhr need this to do cross-domain requests! e.g. from OAI
// Get funding-source tag, if exists. This is the name of the organization that funded http://jats.nlm.nih.gov/publishing/tag-library/1.1d2/element/funding-source.html
// Get funding-statement tag
// Attempt to get conflict of interest statement
// On the current Pubmed Abstract page:
// If funding-source was NIH, have some indicator
// Add some box to the top of the page with a hover over to display the funding-statement text
// Add conflict of interest statement, highlighting authors names
$(document).ready(function() {
    var pmcElt = $('.status_icon');
    if (pmcElt.length > 0) {
        var link = pmcElt.attr('href');
    } else {
        return
    }

    // request full text from PMC
    $.ajax({type:"GET", url:link, dataType:"xml", success: parseFullText});
});


function parseFullText(xml) {
    var data = {}
    // get funding statement
   
    messages = [];
    $(xml).find("h3:contains('Funding')").next().each(function() {
        messages.push($(this).text());
    });
    console.log(messages);
    data.fundingStatement = messages.join('');
    
    console.log(data);
    
    var div = $("<div>", {id: "funding"});
	var fundingText = "Funding";
	$(div).append(data.fundingStatement);
	$(div).css({"color": "red", "font-size":"large", "font-weight":"bold"});

	$('.abstr').prepend(div);
};


	



