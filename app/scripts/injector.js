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


var pmcElt = $('.status_icon');
// DO EVERYTHING IN HERE
if (pmcElt.length > 0) {
    var link = pmcElt.attr('href');
    console.log(link); 
    var substring = link.split('/');
    var pmcid = substring[3].substring(3);
    console.log(pmcid);


    
}

