// ==UserScript==
// @icon         https://raiderdev.github.io/favicon.ico
// @name         Singularistic
// @author       Austin Bollinger
// @version      1.0.1
// @description  Automating IT Support tasks.
// @match        https://mail.grcc.edu/*
// @match        https://csprod.grcc.edu/*
// @grant        metadata
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @include	  https://itsupport.grcc.edu:8443/ehelpdesk/*
// @include	  https://grouplink.grcc.edu:8443/ehelpdesk/*
// @require   https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js
// @require   https://ajax.googleapis.com/ajax/libs/jqueryui/1.11.4/jquery-ui.min.js
// @require     https://gist.github.com/raw/2625891/waitForKeyElements.js
// ==/UserScript==

if (document.location.href.search("1USERNAME") !== -1){
    var x = window.location.href;
    var breakup = x.split("USERNAME",2);
    var username1 = breakup[1];
    var breakup = x.split("PASSWORD",2);
    var password1 = breakup[1];
    $('#username').val(username1);
    $('#password').val(password1);
    $(".submitButton").trigger("click");
}

if (document.location.href.search("2USERNAME") !== -1){
    var x = window.location.href;
    var breakup = x.split("USERNAME",2);
    //CSPROD required uppercase characters.
    var username2 = breakup[1].toUpperCase();
    var breakup = x.split("PASSWORD",2);
    var password2 = breakup[1];
    $('#userid').val(username2);
    $('#pwd').val(password2);
    $('#login > div > div > div:nth-child(6) > div > input').trigger("click");
}
