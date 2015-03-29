$(document).ready(function() {
    $.extend($.expr[":"], {
        "contains": function(elem, i, match, array) {
            return (elem.textContent || elem.innerText || "").toLowerCase().indexOf((match[3] || "").toLowerCase()) >= 0;
        }
    });
    
    var getLabelerResults = function(name) {
        // search fda database for labeler name
        $.get('http://www.accessdata.fda.gov/scripts/cder/ndc/default.cfm', success= function(data, status, xhr) { 
            $.post('http://www.accessdata.fda.gov/scripts/cder/ndc/dsp_searchresult.cfm', { sugg:'LabelerName', ApptName: name, Search: 'Search' }, success=function(response) { 
                console.log($("strong:contains('No matching records found. Please enter new search criteria.')", $(response)).text()); 
            });
        });
    };
    
    var data = {
        fundingStatement: "",
        conflictStatement: "",
        fshow: false,
        cshow: false,
        redraw: function() {
            div = $('#funding');
            fhead = $('#fhead', div);
            chead = $('#chead', div);
            fdiv = $('#funding #fstatement');
            cdiv = $('#funding #cstatement');
            if (this.fundingStatement == "" && this.conflictStatement == "") {
                fdiv.css('display', 'none');
                cdiv.css('display', 'none');
                div.append($("<div id='noresults'>No reported funding or conflict of interest found."));
            } else {
                if (this.fundingStatement != "") {
                    this.fshow = true;
                    fdiv.html(this.fundingStatement);
                    fhead.show();
                    fdiv.show();
                    $('#noresults', div).hide();
                }
                if (this.conflictStatement != "") {
                    this.cshow = false;
                    cdiv.html(this.conflictStatement);
                    chead.show();
                    $('#noresults', div).hide();
                }
            }
        },
        setFundingStatement: function(fs) {
            if (this.fundingStatement == "" && fs) {
                this.fundingStatement = fs;
            }
        },
        setConflictStatement: function(cs) {
            if (this.conflictStatement == "" && cs) {
                this.conflictStatement = cs;
            }
        },
        parseFullText: function(html) {
            // find the shortest section that contains the search term
            // which is not in the body of the text or the references
            var fmatches = []; // funding matches
            var cmatches = []; // conflict matches
            $(".content.article > div .sec", $(html)).each(function(i, sec) {
                var secid = $(sec).attr('id');
                var secfmatches = $(sec).text().match(/fund(ed|ing|s)|(supported|granted|provided|sponsored) by|financial (|support)/gi);
                if (secfmatches && secfmatches.length > 0 && (!secid || secid.match(/ref-list|body|abstract/gi) == null)) {
                    fmatches.push($(sec));
                }
                var seccmatches = $(sec).text().match(/disclos|conflict|of interest|competing interest/gi);
                if (seccmatches && seccmatches.length > 0 && (!secid || secid.match(/ref-list|body|abstract/gi) == null)) {
                    cmatches.push($(sec));
                }
            });
            
            var emptydiv = $('<div></div>').text("");
            fmatches.sort(function(a, b) { return a.text().length - b.text().length });
            cmatches.sort(function(a, b) { return a.text().length - b.text().length });
            console.log(fmatches.length);
            console.log(cmatches.length);
            // if top matches overlap, delete the other one
            if (fmatches.length != 0 && cmatches.length != 0 && fmatches[0].text().indexOf(cmatches[0].text()) > -1) {
                cmatches = [emptydiv];
            } else if (fmatches.length != 0 && cmatches.length != 0 && cmatches[0].text().indexOf(fmatches[0].text()) > -1) {
                fmatches = [emptydiv];
            }
            
            // clean match
            // todo: clean classes and/or extraneous wrapping divs
            $("h2, h3, br", fmatches[0]).remove();
            $("h2, h3, br", cmatches[0]).remove();
            
            if (fmatches.length != 0 && fmatches[0].text().length > 0) {
                var buf = fmatches[0];
                $('*', buf).removeClass().css({"margin": 0});
                this.setFundingStatement(buf.html());
            }
            if (cmatches.length != 0 && cmatches[0].text().length > 0) {
                var buf = cmatches[0];
                $('*', buf).removeClass().css({"margin": 0});
                this.setConflictStatement(buf.html());
            }
            this.redraw();
        },
        parseFullXML: function(xml) {
            this.setFundingStatement($(xml).find("funding-group").text());
            this.setConflictStatement($.trim($(xml).find("fn[fn-type='conflict']").text()));
            this.redraw();
        }
    };
    
    var pmcElt = $('.status_icon');
    if (pmcElt.length > 0) {
        var texturl= pmcElt.attr('href');
    } else return;
    var xmlurl = 'http://www.pubmedcentral.nih.gov/oai/oai.cgi?verb=GetRecord&identifier=oai:pubmedcentral.nih.gov:' + texturl.split('/')[3].substring(3) + '&metadataPrefix=pmc';

    $('.rprt_all').prepend($("<div>", {id: "funding"}));
    $('#funding').append($("<h4 id='fhead' style='cursor:pointer'>Funding information [-]</h4>"));
    $('#funding').append($("<div>", {id: "fstatement"}));
    $('#funding').append($("<h4 id='chead' style='cursor:pointer'>Conflicts of interest [+]</h4>"));
    $('#funding').append($("<div>", {id: "cstatement"}));
    $('#funding').css({
      "color": "red", "font-size":"regular", "font-weight":"bold",
	  "border": "solid 1px", "padding": "8px"	
    });
    $('#funding #fhead').click(function () { 
        $('#funding #fstatement').slideToggle();
        data.fshow = !data.fshow;
        if (data.fshow) {
            $('#funding #fhead').text('Funding information [-]')
        } else {
            $('#funding #fhead').text('Funding information [+]')
        }
    });
    $('#funding #chead').click(function () { 
        $('#funding #cstatement').slideToggle();
        data.cshow = !data.cshow;
        if (data.cshow) {
            $('#funding #chead').text('Conflicts of interest [-]')
        } else {
            $('#funding #chead').text('Conflicts of interest [+]')
        }
    });
    
    // request full text from PMC
    $.ajax({type:"GET", url:texturl, success: data.parseFullText, context: data});
    $.ajax({type:"GET", url:xmlurl, dataType:"xml", success: data.parseFullXML, context: data});
});