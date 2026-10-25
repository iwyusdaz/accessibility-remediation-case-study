// Google Analytics Tracking code Asynchronous Syntax

var _gaq = _gaq || [];

// Benchmark Tracker code
_gaq.push(['_setAccount', 'UA-5145472-1']);
_gaq.push(['_trackPageview']);

// Overall Tracker code
_gaq.push(['OT._setAccount', 'UA-5033010-1']);
_gaq.push(['OT._trackPageview']);

// QA Tracker code
_gaq.push(['QA._setAccount', 'UA-24784773-1']);
_gaq.push(['QA._trackPageview']);


(function() {
var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();

//Start Auto tracking code
var docIdentifier  = '/download';
  
function listenToClicks() { 

  var fileTypes  = [".doc",".xls",".exe",".zip",".pdf",".mp3"];
    
	if (document.getElementsByTagName) {
    var aTags = document.getElementsByTagName('a'); 
    
    ANCHOR:
    for (var i = 0; i < aTags.length; i++) { 
      if (aTags[i]=="")                                         {continue ANCHOR; }
      if (typeof aTags[i].hostname == "undefined")              {continue ANCHOR; }
      if (aTags[i].protocol.indexOf("javascript") != -1)        {continue ANCHOR; }
      
      if (aTags[i].hostname.indexOf(window.location.href)) {
       
        FILE:
        // look for a file extension
        for (k = 0; k < fileTypes.length; k++){
          if (aTags[i].pathname.indexOf(fileTypes[k]) != -1) {
            startListening(aTags[i],"click",trackDocuments);  continue ANCHOR; } // file extension was found, go to next anchor
        }
      }
    }    
	}
}

function startListening (obj,evnt,func) { 
  if (obj.addEventListener) { 
    obj.addEventListener(evnt,func,false);
  } else if (obj.attachEvent) { 
    obj.attachEvent("on" + evnt,func);
  }
}

// trackDocuments:  calls _trackPageview before downloading a file
function trackDocuments (evnt) { 
  var url = (evnt.srcElement) ? "/" + evnt.srcElement.pathname : this.pathname; 
  url = docIdentifier + url;
  
  if (typeof(_gat) == 'object')
    {
        var benchmarkTracker = _gat._getTrackerByName();
        var overallTracker = _gat._getTrackerByName('OT');
        var qaTracker = _gat._getTrackerByName('QA');

        if (typeof(qaTracker) == "object") {
            _gaq.push(['qaTracker._trackPageview', url]);
        }
        if (typeof(benchmarkTracker) == "object") {
            _gaq.push(['benchmarkTracker._trackPageview', url]);
        }
        if (typeof(overallTracker) == "object") {
            _gaq.push(['overallTracker._trackPageview', url]);
        }
    }
}

startListening(window, 'load', listenToClicks); // register an event listener to run the script when the load event fires.
//End Auto tracking code