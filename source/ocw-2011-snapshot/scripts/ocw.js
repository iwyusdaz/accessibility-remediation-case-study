// MIT OpenCourseWare 

window.onload=function(){
    //enableSpringSurvey();
	populateYoutubePlaceholders();
    showRandomSidebarQuote();
    //showRandomIndividualSupporterQuote();
}

function changeQuote(){
var quotes = new Array(
'I\'m a physics student in Argentina, and I appreciate the teaching material. I\'d like OCW to be kept free for others.\"',
'Because I believe in the world class education that MIT is giving to the human society.\"',
'I am so thankful for the lectures in classical physics which help me improve my understanding.\"',
'I and others believe in the way of knowledge to unlock human potential, hopefully beyond.\"',
'It\'s a delight to learn new stuff, see reading lists and video-classes from MIT lecturers.\"',
'I donate to OCW because I love the idea of sharing knowledge for its own sake and the humanity of freely sharing, rather than for profit.\"',
'I feel it\'s kind of a gift being able to study on my own this way.\"',
'I think that online learning is absolutely the right way for education to be conducted in the future.\"',
'I intend to become a teacher and teach math in the most interesting way to every child, including my daughter.\"',
'I donated to encourage this invaluable humanitarian venture and help others receive its benefits.\"',
'I need to understand spoken English and improve my scientific knowledge. There\'s nothing better than lectures on my scientific areas.\"',
'I am dedicated to teaching myself with OCW. I may never get a degree, but I will never be denied access to these remarkable resources.\"',
'It\'s an indirect way to contribute to the development of my country where poverty, child labor and hunger are challenges to be solved.\"',
'I\'ll suggest to my kids that MIT will be a good place for them to realize their dream as well.\"',
'Spreading knowledge, sharing information will save the world.\"',
'Because I believe every person has a chance to make a difference in this world through education and self-improvement.\"',
'I love it :)\"',
'I consider that investment in education is an investment for future of the mankind.\"',
'OCW gives me the opportunity to learn and discover present-day technology in a very fascinating and exciting way.\"',
'OCW allows me to pursue my dream career while working a realistic full time job, thanks OCW.\"',
'Your efforts enable ordinary people to access extraordinary knowledge.\"',
'The OCW lectures really confirmed my decision to enroll in a physics course at my local university soon.\"',
'I\'m amazed by the wealth of courses here and it\'s a great that MIT opens up knowledge for people everywhere.\"',
'This course material is free and of prime quality.\"',
'I am contributing to a great project that will help many others improve their lives, materially, intellectually and spiritually.\"',
'To provide such cutting-edge information freely is truly a herculean generosity.  It deserves supporting.\"'
					);
					
var images=new Array(
' <img src=\"/images/individualsupporter/2012_hp_donor_alberto_t.jpg\" style=\"width: 73px; height: 68px; float: left;\" alt=\"A photo of OCW Supporter Alberto.\" /> ',
' <img src=\"/images/individualsupporter/2012_hp_donor_arthur_n.jpg\" style=\"width: 73px; height: 68px; float: left;\" alt=\"A photo of OCW Supporter Arthur.\" /> ',
' <img src=\"/images/individualsupporter/2012_hp_donor_asbjoern_p.jpg\" style=\"width: 73px; height: 68px; float: left;\" alt=\"A photo of OCW Supporter Asbjoern.\" /> ',
' <img src=\"/images/individualsupporter/2012_hp_donor_charles_r.jpg\" style=\"width: 73px; height: 68px; float: left;\" alt=\"A photo of OCW Supporter Charles.\" /> ',
' <img src=\"/images/individualsupporter/2012_hp_donor_eire_z.jpg\" style=\"width: 73px; height: 68px; float: left;\" alt=\"A photo of OCW Supporter Eire.\" /> ',
' <img src=\"/images/individualsupporter/2012_hp_donor_gary_s.jpg\" style=\"width: 73px; height: 68px; float: left;\" alt=\"A photo of OCW Supporter Gary.\" /> ',
' <img src=\"/images/individualsupporter/2012_hp_donor_hans_k.jpg\" style=\"width: 73px; height: 68px; float: left;\" alt=\"A photo of OCW Supporter Hans.\" /> ',
' <img src=\"/images/individualsupporter/2012_hp_donor_ian_r.jpg\" style=\"width: 73px; height: 68px; float: left;\" alt=\"A photo of OCW Supporter Ian.\" /> ',
' <img src=\"/images/individualsupporter/2012_hp_donor_itamar_o.jpg\" style=\"width: 73px; height: 68px; float: left;\" alt=\"A photo of OCW Supporter Itamar.\" /> ',
' <img src=\"/images/individualsupporter/2012_hp_donor_joajo_m.jpg\" style=\"width: 73px; height: 68px; float: left;\" alt=\"A photo of OCW Supporter Joao.\" /> ',
' <img src=\"/images/individualsupporter/2012_hp_donor_luiz_d.jpg\" style=\"width: 73px; height: 68px; float: left;\" alt=\"A photo of OCW Supporter Luiz.\" /> ',
' <img src=\"/images/individualsupporter/2012_hp_donor_moses_k.jpg\" style=\"width: 73px; height: 68px; float: left;\" alt=\"A photo of OCW Supporter Moses.\" /> ',
' <img src=\"/images/individualsupporter/2012_hp_donor_ramon_r.jpg\" style=\"width: 73px; height: 68px; float: left;\" alt=\"A photo of OCW Supporter Ramon.\" /> ',
' <img src=\"/images/individualsupporter/2012_hp_donor_xueyi_c.jpg\" style=\"width: 73px; height: 68px; float: left;\" alt=\"A photo of OCW Supporter Xueyi.\" /> ',
' <img src=\"/images/individualsupporter/2012_hp_donor_zoran_b.jpg\" style=\"width: 73px; height: 68px; float: left;\" alt=\"A photo of OCW Supporter Zoran.\" /> ',' <img src=\"/images/individualsupporter/2012_hp_donor_rica_p.jpg\" style=\"width: 73px; height: 68px; float: left;\" alt=\"A photo of OCW Supporter Ricardo.\" /> ',
' <img src=\"/images/individualsupporter/2012_hp_donor_animesh.jpg\" style=\"width: 73px; height: 68px; float: left;\" alt=\"A photo of OCW Supporter Animesh.\" /> ',
' <img src=\"/images/individualsupporter/2012_hp_donor_prakash.jpg\" style=\"width: 73px; height: 68px; float: left;\" alt=\"A photo of OCW Supporter Prakash.\" /> ',
' <img src=\"/images/individualsupporter/2012_hp_donor_alessandro.jpg\" style=\"width: 73px; height: 68px; float: left;\" alt=\"A photo of OCW Supporter Alessandro.\" /> ',
' <img src=\"/images/individualsupporter/2012_hp_donor_aaron.jpg\" style=\"width: 73px; height: 68px; float: left;\" alt=\"A photo of OCW Supporter Aaron.\" /> ',
' <img src=\"/images/individualsupporter/2012_hp_donor_lawrence_c.jpg\" style=\"width: 73px; height: 68px; float: left;\" alt=\"A photo of OCW Supporter Lawrence.\" /> ',
' <img src=\"/images/individualsupporter/2012_hp_donor_martin_u.jpg\" style=\"width: 73px; height: 68px; float: left;\" alt=\"A photo of OCW Supporter Martin.\" /> ',
' <img src=\"/images/individualsupporter/2012_hp_donor_vassilis.jpg\" style=\"width: 73px; height: 68px; float: left;\" alt=\"A photo of OCW Supporter Vassilis.\" /> ',
' <img src=\"/images/individualsupporter/2012_hp_donor_francesco_b.jpg\" style=\"width: 73px; height: 68px; float: left;\" alt=\"A photo of OCW Supporter Francesco.\" /> ',
' <img src=\"/images/individualsupporter/2012_hp_donor_carlos_f.jpg\" style=\"width: 73px; height: 68px; float: left;\" alt=\"A photo of OCW Supporter Carlos.\" /> ',
' <img src=\"/images/individualsupporter/2012_hp_donor_sigit.jpg\" style=\"width: 73px; height: 68px; float: left;\" alt=\"A photo of OCW Supporter Sigit.\" /> '
	);
var names=new Array(
'<p><strong>Alberto</strong><br /><span style=\"font-size: 0.9em;\">Student - College/University<br />Argentina</span></p>',
'<p><strong>Arthur</strong><br /><span style=\"font-size: 0.9em;\">Self Learner<br />Canada</span></p>',
'<p><strong>Asbjoern</strong><br /><span style=\"font-size: 0.9em;\">Self Learner<br />Denmark</span></p>',
'<p><strong>Charles</strong><br /><span style=\"font-size: 0.9em;\">Self Learner<br />Belgium</span></p>',
'<p><strong>Eire</strong><br /><span style=\"font-size: 0.9em;\">Student<br />Brazil</span></p>',
'<p><strong>Gary</strong><br /><span style=\"font-size: 0.9em;\">Self Learner<br />Australia</span></p>',
'<p><strong>Hans</strong><br /><span style=\"font-size: 0.9em;\">Self Learner<br />Denmark</span></p>',
'<p><strong>Ian</strong><br /><span style=\"font-size: 0.9em;\">Parent<br />Canada</span></p>',
'<p><strong>Itamar</strong><br /><span style=\"font-size: 0.9em;\">Self Learner<br />Brazil</span></p>',
'<p><strong>Joao</strong><br /><span style=\"font-size: 0.9em;\">Self Learner<br />Canada</span></p>',
'<p><strong>Luiz</strong><br /><span style=\"font-size: 0.9em;\">Self Learner<br />Brazil</span></p>',
'<p><strong>Moses</strong><br /><span style=\"font-size: 0.9em;\">Self Learner<br />Canada</span></p>',
'<p><strong>Ramon</strong><br /><span style=\"font-size: 0.9em;\">Self Learner<br />Brazil</span></p>',
'<p><strong>Xueyi</strong><br /><span style=\"font-size: 0.9em;\">Self Learner<br />China</span></p>',
'<p><strong>Zoran</strong><br /><span style=\"font-size: 0.9em;\">Parent - College/University<br />Croatia</span></p>',
'<p><strong>Ricardo</strong><br /><span style="font-size: 0.9em;">Independent Learner<br />Mexico</span></p>',
'<p><strong>Animesh</strong><br /><span style="font-size: 0.9em;">Student<br />India</span></p>',
'<p><strong>Prakash</strong><br /><span style="font-size: 0.9em;">Parent<br />India</span></p>',
'<p><strong>Alessandro</strong><br /><span style="font-size: 0.9em;"><br />Italy</span></p>',
'<p><strong>Aaron</strong><br /><span style="font-size: 0.9em;">Independent Learner<br />United Kingdom</span></p>',
'<p><strong>Lawrence</strong><br /><span style="font-size: 0.9em;">Independent Learner<br />USA</span></p>',
'<p><strong>Martin</strong><br /><span style="font-size: 0.9em;">Student - High School<br />Germany</span></p>',
'<p><strong>Vassilis</strong><br /><span style="font-size: 0.9em;">Independent Learner<br />Greece</span></p>',
'<p><strong>Francesco</strong><br /><span style="font-size: 0.9em;">Independent Learner<br />Italy</span></p>',
'<p><strong>Carlos</strong><br /><span style="font-size: 0.9em;">Independent Learner<br />Italy</span></p>',
'<p><strong>Sigit</strong><br /><span style="font-size: 0.9em;">Educator - College/University<br />Indonesia</span></p>'
	);
	
	var rand = Math.floor(Math.random()*quotes.length);

var txt="";
document.getElementById("support-c1").innerHTML="<p>Support OCW</p>";
document.getElementById("support-c2").innerHTML=quotes[rand];
txt+=images[rand];
txt+=names[rand];
document.getElementById("support-c3").innerHTML=txt;
document.getElementById("support-c4").innerHTML="<a href=\"http://ocw.mit.edu/donate\"><img src=\"/images/button_donate.png\" style=\"width: 172px; height: 36px;\" alt=\"Donate Now\" /></a>";

//Enable survey on Site Home Page
//Hack for Opera -- dont know why Opera is running both window.onload and changequote functions for site home page. All others run changequote only
//if(!(navigator.appName =='Opera'))
//   enableSpringSurvey();
}




function fillEmailText()
{
    var txt='';
    txt+='<ul><li class="email"><a href="javascript:emailPopUp()">Email this page<\/a><\/li><\/ul>';
    if(document.getElementById("switchbutton"))
        document.getElementById("switchbutton").innerHTML=txt;
//Enable survey on Site Home Page
   // customResearch();
}

function showRandomSidebarQuote()
{
	var quotes = new Array(
	'<p>&quot;I donated because I want MIT to keep OCW going.&quot;<br /><br /> &mdash;Heath Novak<br />Student, USA</p>', 
	'<p>&quot;OCW inspires just as much as it enriches.&quot;<br /><br /> &mdash;Jeff Breidenbach<br /> MIT Alumnus, Class of 1996</p>',
	'<p>&quot;It\'s every person\'s responsibility to stand up and support the things he (or she) values.&quot;<br /><br /> &mdash;Assaf Tal<br /> Self Learner, Israel</p>',
	'<p>&quot;Supporting OCW was my way of saying \'thank you\' for having the courage and insight to take this bold step.&quot;<br /><br /> &mdash;Ted Inoue<br /> Self Learner, USA</p>',
	'<p>&quot;I gained so much by the educational materials from MIT faculty.&quot;<br /><br /> &mdash;Aditi Gupta<br /> Student, USA</p>',
	'<p>&quot;OCW has been instrumental in my professional development.&quot;<br /><br /> &mdash;Harry Crissy<br /> Self Learner, USA</p>') 
	
	var rand = Math.floor(Math.random() * quotes.length);
	var sidebarQuotesPlaceHolder = document.getElementById("quote_sidebar");
	if(sidebarQuotesPlaceHolder){
		sidebarQuotesPlaceHolder.innerHTML = "<strong>" + quotes[rand] + "</strong>" ;
	}
}
function showRandomIndividualSupporterQuote()
{
	var images = new Array (
	"/images/individualsupporter/donor_1.gif", 
	"/images/individualsupporter/donor_2.gif", 
	"/images/individualsupporter/donor_3.gif",
	"/images/individualsupporter/donor_4.gif",
	"/images/individualsupporter/donor_5.gif",
	"/images/individualsupporter/donor_6.gif",
	"/images/individualsupporter/donor_7.gif",
	"/images/individualsupporter/donor_8.gif",
	"/images/individualsupporter/donor_9.gif",
	"/images/individualsupporter/donor_10.gif");

	var quotes = new Array(
	'OpenCourseWare is how MIT will be remembered 500 years from now.',
	'I gave to OCW because I think it\'s one of the most noble endeavors imaginable. MIT, you rock! I\'m so proud of you!',
	'I\'ve used OCW as a reference long after my old college \'bibles\' ended up in the recycling bin. OCW is a shining example of ideas being celebrated.',
	'I\'ve been dreaming for years an initiative like the OCW for young students in Haiti and other Developing countries.',
	'I know the value of good educational content - and the tangible positive changes it can bring to an aspiring student. It really transforms life.',
	'I support you because you support me! Thank you for contributing to my professional development.',
	'As a Physics teacher, I find your website to be of enormous utility both for my own edification, as well as the education of my students.',
	'I find it inspiring that so many people, rich or poor, get to learn anything they desire from OpenCourseWare.',
	'This is the way education should be: open, high-quality and available to all who are interested in learning.',
	'This is what education is all about and it is boundless. This is why I support OCW.') 
	
	var rand = Math.floor(Math.random() * quotes.length);
	var sidebarQuotesPlaceHolder = document.getElementById("rotating_quotes");
	if(sidebarQuotesPlaceHolder){
		sidebarQuotesPlaceHolder.innerHTML = '<p><img title="' + quotes[rand] + '" src="' + images[rand] + '" alt="' + quotes[rand] + '" \/><\/p>';
	}
}

function emailPopUp()
{
	var pageTitle = document.title;
	var pageUrl   = document.location;
	var URL = "/jsp/emailpage.jsp?title=" + pageTitle + "&referer=" + pageUrl;
	window.open(URL,null,"height=660,width=530,status=yes,toolbar=no,menubar=no,location=no,resizable=yes");
}

//Clear the default value of search input 

function clearSearchBox()
{
	if(document.getElementById("terms").value == "Search")
	{
		document.getElementById("terms").value = "";	
	}
	
}

function fillSearchBox()
{
	if(document.getElementById("terms").value == "")
	{
		document.getElementById("terms").value = "Search";	
	}
}

function clearEmailBox()
{

	if(document.getElementById("email").value == "Enter Email")
	{
		document.getElementById("email").value = "";	
	}
	
} 

function fillEmailBox()
{
	if(document.getElementById("email").value == "")
	{
		document.getElementById("email").value = "Enter Email";	
	}
}

//Redirect the selected value of Translated Courses

function OnTranslatedCoursesChange(url)
{
	if(url !="")
	{
		location = url;
	}
}


function populateYoutubePlaceholders(){
    var stringToReplace = "ACTUAL_LINK_GOES_HERE";
    var videoinjectionstring = '<object type="application/x-shockwave-flash" style="width:425px; height:344px;" data="' + stringToReplace+ '">'
            + '<param name="movie" value="' + stringToReplace + '"></param>'
            + '<param name="allowFullScreen" value="true"></param></object>';
    var blacklist_div = document.getElementById("dept_links");
    if(blacklist_div != null){
        return;
        }
    var videoContainers = document.getElementsByClassName("youtubevideo");
    
    for(i = 0; i < videoContainers.length; i ++){
        var videoURL = videoContainers[i].getElementsByTagName("a")[0].getAttribute("href");
        var finalvideoinjectionstring = videoinjectionstring.replace(stringToReplace, videoURL).replace(stringToReplace, videoURL);
        videoContainers[i].innerHTML = finalvideoinjectionstring;
    }
}

document.getElementsByClassName = function(cl) {
    var retnode = [];
    var myclass = new RegExp('\\b'+cl+'\\b');
    var elem = this.getElementsByTagName('div');
    for (var i = 0; i < elem.length; i++) {
    var classes = elem[i].className;
    if (myclass.test(classes)) {
        retnode.push(elem[i]);
        break;
        }
    }
    return retnode;
};


// This next little bit of code tests whether the user accepts cookies.
var WM_acceptsCookies = false;
if(document.cookie == '') {
	document.cookie = 'WM_acceptsCookies=yes'; // Try to set a cookie.
	if(document.cookie.indexOf('WM_acceptsCookies=yes') != -1) {
	WM_acceptsCookies = true;
	}// If it succeeds, set variable
} else { // there was already a cookie
	WM_acceptsCookies = true;
}

function WM_setCookie (name, value, hours, path, domain, secure) {
if (WM_acceptsCookies) { // Don't waste your time if the browser doesn't accept cookies.
var not_NN2 = (navigator && navigator.appName && (navigator.appName == 'Netscape') && navigator.appVersion && (parseInt(navigator.appVersion) == 2))?false:true;

if (!hours)
hours = 2000;

if(hours && not_NN2) { // NN2 cannot handle Dates, so skip this part
	if ( (typeof(hours) == 'string') && Date.parse(hours) ) { // already a Date string
	var numHours = hours;
	} 
	else if (typeof(hours) == 'number') { // calculate Date from number of hours
	var numHours = (new Date((new Date()).getTime() + hours*3600000)).toGMTString();
	}
}
document.cookie = name + '=' + escape(value) + ((numHours)?(';expires=' + numHours):'') + ';path=/' + ((domain)?';domain=' + domain:'') + ((secure && (secure == true))?'; secure':''); // Set the cookie, adding any parameters that were specified.
}
} // WM_setCookie

function WM_readCookie(name) {
if(document.cookie == '') { // there's no cookie, so go no further
	return false;
} 
else { // there is a cookie
	var firstChar, lastChar;
	var theBigCookie = document.cookie;
	firstChar = theBigCookie.indexOf(name); // find the start of 'name'
	var NN2Hack = firstChar + name.length;
	if((firstChar != -1) && (theBigCookie.charAt(NN2Hack) == '=')) { // if you found the cookie
		firstChar += name.length + 1; // skip 'name' and '='
		lastChar = theBigCookie.indexOf(';', firstChar); // Find the end of the value string (i.e. the next ';').
		if(lastChar == -1) lastChar = theBigCookie.length;
		return unescape(theBigCookie.substring(firstChar, lastChar));
	} else { // If there was no cookie of that name, return false.
		return false;
	}
}
} // WM_readCookie

//Code for 2011 Fall campaign
document.getElementsByClassName = function(cl) {
var retnode = [];
var myclass = new RegExp('\\b'+cl+'\\b');
var elem = this.getElementsByTagName('div');
for (var i = 0; i < elem.length; i++) {
var classes = elem[i].className;
if (myclass.test(classes)) {
	retnode.push(elem[i]);
	break;
	}
}
return retnode;
};

function enableSpringSurvey(){
var metaTags = document.getElementsByTagName('meta');
for(i=0;i<metaTags.length;i++){
    if(metaTags[i].getAttribute('name')== 'WT.cg_n'){
        content = metaTags[i].getAttribute('content');        
    }
}
if(content != 'Highlights'){
customResearch();
}
}


function customResearch(){
var n = 100; /* One out of n visitors will be given survey */
var random_num;
var offset = -1;
var cookiename = "InterceptSurvey2010";

var surveymarkup='<div id="mainsurvey"><img border="0" src="http://ocw.mit.edu/images/spring_2012_overlay.jpg" usemap="#campaign" alt="Sign up for the OCW newsletter and get updates on courses and features." title="Sign up for the OCW newsletter and get updates on courses and features." /><map name="campaign"><area shape="rect" coords="4,119,20,162" href="http://www.flickr.com/photos/auntiep/50068713/"><area shape="rect" coords="4,2,20,99" href="http://www.flickr.com/photos/myblackrainbow/317369/"><area shape="rect" coords="743,138,829,155" href="http://ocw.mit.edu/donate/why-donate/"><area shape="rect" coords="922,2,947,27" href="javascript:void(0)" onclick="onClickMinimize();"></map></div>';
var pageHeader = document.getElementsByClassName('logo')[0];

random_num = Math.round(n * Math.random());
random_num = 1; // uncomment this line to debug, this will trigger the research everytime
if ((random_num == 1) && (navigator.appName.indexOf('WebTV') == -1))
	if (!WM_readCookie(cookiename)) {
	//insert survey code
	var ndiv = document.createElement("div");
	ndiv.innerHTML = surveymarkup;
	if(!(pageHeader.innerHTML == surveymarkup))
	pageHeader.parentNode.insertBefore(ndiv,pageHeader);	
	}
}
var newwindow = '';
function onClickGetStarted(url) {
document.getElementById("mainsurvey").style.display = "none";
random_num = 1;
var cookiename = "InterceptSurvey2010";
if ((random_num == 1) && (navigator.appName.indexOf('WebTV') == -1))
  if (!WM_readCookie(cookiename)) {
   /* comment this to prompt until they complete the survey */
   WM_setCookie(cookiename,'2010')      
}
}

function onClickMinimize(){
random_num = 1;
var cookiename = "InterceptSurvey2010";
var cururl = window.location;
if ((random_num == 1) && (navigator.appName.indexOf('WebTV') == -1)){
   WM_setCookie(cookiename,'2010',24*21)
   document.getElementById("mainsurvey").style.display = "none";
}
}
//Code for Fall campaign ends