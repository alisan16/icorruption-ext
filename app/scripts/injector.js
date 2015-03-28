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
    // DO EVERYTHING IN HERE
    var pmcElt = $('.status_icon');
    if (pmcElt.length > 0) {
        var link = pmcElt.attr('href');
        console.log(link); 
        var substring = link.split('/');
        var pmcid = substring[3].substring(3);
        console.log(pmcid);
    } else {
        return
    }

    var fulltexturl = 'http://www.pubmedcentral.nih.gov/oai/oai.cgi?verb=GetRecord&identifier=oai:pubmedcentral.nih.gov:' + pmcid + '&metadataPrefix=pmc';
    console.log(fulltexturl);

    // request full text from OAI and parse with parseFullText
    $.ajax({type:"GET", url:fulltexturl, dataType:"xml", success: parseFullText});
});


function parseFullText(xml) {
    // get funding statement
    var fundingStatement = $(xml).find("funding-statement").text();
    console.log(fundingStatement);
};

	var div = $("<div>", {id: "funding"});
	var fundingText = "Funding";
	$(div).append(fundingText);
	$(div).css({"color": "red", "font-size":"large", "font-weight":"bold"});

	$('.abstr').prepend(div);
	



