// WebTrends SmartSource Data Collector Tag v10.2.10
// Copyright (c) 2012 Webtrends Inc.  All rights reserved.
// Tag Builder Version: 4.1.0.10
// Created: 2012.05.15
window.webtrendsAsyncInit=function(){
    var dcs=new Webtrends.dcs().init({
        dcsid:"dcstx435ie9xjy0zap7w54ik5_6s2l", //DCSID for QA Webtrends
        domain:"statse.webtrendslive.com",
        timezone:-5,
        fpcdom:".ocw5.mit.edu",
        plugins:{
            //hm:{src:"//s.webtrends.com/js/webtrends.hm.js"}
        }
        }).track();
    var dcs2=new Webtrends.dcs().init({
        dcsid:"dcs8q9s2ag9xjywz8l6x34ik5_6b3t", //DCSID for Production Webtrends
        domain:"statse.webtrendslive.com",
        timezone:-5,
        fpcdom:".ocw.mit.edu",
        plugins:{
            //hm:{src:"//s.webtrends.com/js/webtrends.hm.js"}
        }
        }).track();
};
(function(){
    var s=document.createElement("script"); s.async=true; s.src="/scripts/webtrends.min.js";    
    var s2=document.getElementsByTagName("script")[0]; s2.parentNode.insertBefore(s,s2);
}());