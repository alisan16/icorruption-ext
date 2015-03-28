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
        var texturl= pmcElt.attr('href');
    } else return;
    var xmlurl = 'http://www.pubmedcentral.nih.gov/oai/oai.cgi?verb=GetRecord&identifier=oai:pubmedcentral.nih.gov:' + texturl.split('/')[3].substring(3) + '&metadataPrefix=pmc';

    $('.abstr').prepend($("<div>", {id: "funding"}));
    $('#funding').css({"color": "red", "font-size":"large", "font-weight":"bold"});
    
    // request full text from PMC
    $.ajax({type:"GET", url:texturl, success: parseFullText});
    $.ajax({type:"GET", url:xmlurl, dataType:"xml", success: parseFullXML});
});


function parseFullText(html) {
    var data = {};
    data.fundingStatement = $($(html).find("h3:contains('Funding'), h2:contains('Funding')").next()[0]).text()

    $('#funding').text(data.fundingStatement);
    
};

function parseFullXML(xml) {
    var data = {};
    
    data.fundingStatement = $(xml).find("funding-statement").text();
    data.conflictStatement = $.trim($(xml).find("fn[fn-type='conflict']").text());
    
    $('#funding').text(data.fundingStatement);
    
};


	



