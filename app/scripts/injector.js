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
    $.extend($.expr[":"], {
        "contains": function(elem, i, match, array) {
            return (elem.textContent || elem.innerText || "").toLowerCase().indexOf((match[3] || "").toLowerCase()) >= 0;
        }
    });
    
    var data = {
        fundingStatement: "",
        conflictStatement: "",
        update: function() {
            $('#funding').html(data.fundingStatement + '<br>' + data.conflictStatement);
        },
        parseFullText: function(html) {
            // data.fundingStatement = $(html).find("h3:contains('Funding'), h2:contains('Funding')").nextUntil("div.tsec").text()
            // data.update();
            var matches = [];
            $(".content.article > div > .sec", $(html)).each(function(i, sec) {
                var secid = $(sec).attr('id')
                var secmatches = $(sec).text().match(/funding/gi);
                if (secmatches && secmatches.length > 0 && secid.match(/ref-list|body|abstract/gi) == null) {
                    $("h2, h3, br", $(sec)).remove();
                    matches.push($(sec).html());
                };
            });
            console.log(matches);
            data.fundingStatement = matches[0];
            data.update();
        },
        parseFullXML: function(xml) {
            data.fundingStatement = $(xml).find("funding-group").text();
            data.conflictStatement = $.trim($(xml).find("fn[fn-type='conflict']").text());
            data.update();
        }
    };
    
    var pmcElt = $('.status_icon');
    if (pmcElt.length > 0) {
        var texturl= pmcElt.attr('href');
    } else return;
    var xmlurl = 'http://www.pubmedcentral.nih.gov/oai/oai.cgi?verb=GetRecord&identifier=oai:pubmedcentral.nih.gov:' + texturl.split('/')[3].substring(3) + '&metadataPrefix=pmc';

    $('.rprt_all').prepend($("<div>", {id: "funding"}));
    $('#funding').css({
      "color": "red", "font-size":"large", "font-weight":"bold",
	  "border": "solid 1px", "padding": "8px"	
    });
    
    // request full text from PMC
    $.ajax({type:"GET", url:texturl, success: data.parseFullText});
    $.ajax({type:"GET", url:xmlurl, dataType:"xml", success: data.parseFullXML});
});