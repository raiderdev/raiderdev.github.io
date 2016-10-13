// ==UserScript==
// @icon         https://itsupport.grcc.edu:8443/ehelpdesk/images/favicon.ico
// @name         GroupLink Super User
// @author       Brian Moore
// @version      1.2.23
// @namespace    https://gist.github.com/mooreb0314
// @homepage     https://gist.github.com/mooreb0314/b1d4cb3be398840184bc
// @downloadURL  https://gist.github.com/mooreb0314/b1d4cb3be398840184bc/raw/GroupLinkSuperUser.user.js
// @description  Master Script
// @match        http://tampermonkey.net/index.php?version=3.10.84&ext=dhdg&updated=true
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



if (document.location.href.search("ehelpdesk/tickets/displayTTLaunch.glml?") !== -1){

    var refreshPageAfterSave = true;
    var runScript = true;

    // Create mouse event
    var dispatchMouseEvent = function(target, var_args) {
        var e = document.createEvent("MouseEvents");
        e.initEvent.apply(e, Array.prototype.slice.call(arguments, 1));
        target.dispatchEvent(e);
    };

    // Password Page Boolean
    var isPassword;

    var fullName;

    // Information Page Boolean
    var isInformational;

    // Various Request Template Boolean
    var isRequestTemplate;

    // Changes tech assignment if needed on template page. False by default
    var changeAssignment = false;

    var innerDoc;
    var lastName;

    var saveChangesBtn;
    var iframe;

    if(document.URL.includes('launchSuccessful=true')){
        runScript = false;
    }

    waitForKeyElements("#dijit_TitlePane_2_pane",function(){
        if(runScript){
            mainFunction();
        }
    },false,'#ticketPaneFrame');

    waitForKeyElements("#tlMainDiv",getTemplate);

    $( document ).ready(function() {
        if(isInformational){
            informationalPageTable();
        }

    });


    // select the target node
    var target;

    // create an observer instance
    var observer;


    /**********************************************************
* Main function that runs at the start of the page load
**********************************************************/
    function mainFunction(){
        console.log("Main Function");
        // Templates inner iFrame element

        iframe = document.getElementById('ticketPaneFrame');
        innerDoc = iframe.contentDocument || iframe.contentWindow.document;

        // Searches for users name in assignments and selects them
        if (changeAssignment){
            selectAssignment();
        }

    }

    function saveChanges(){
        console.log("saveChange()");
        saveChangesBtn = document.evaluate('//*[@id="dijit_layout_ContentPane_0"]/div[2]/table/tbody/tr/td[1]/span/span', innerDoc, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        dispatchMouseEvent(saveChangesBtn, 'mouseover', true, true);
        dispatchMouseEvent(saveChangesBtn, 'mousedown', true, true);
        dispatchMouseEvent(saveChangesBtn, 'click', true, true);
        dispatchMouseEvent(saveChangesBtn, 'mouseup', true, true);
    }


    /************************************************************
* Only for Table HTML String Use
************************************************************/
    function informationalPageTable(){
        console.log("informationalPageTable");
        var ticketTreeDiv = document.createElement('div');
        ticketTreeDiv.setAttribute('id', 'ticketTreeDiv');
        ticketTreeDiv.setAttribute('style', 'text-align:left');


        var ticketTreeSpan = document.createElement('span');
        var ticketTree =  document.getElementById('ticketTree');
        ticketTree.appendChild(ticketTreeDiv);
        var strVar="";
        strVar += "<table  style=\"border-spacing: 20px 10;\">";
        strVar += "<tbody>";
        strVar += "<tr>";
        strVar += "<td><input type=button id='Network_Password' value =\"Network Password\" style=\"width:100;\"><\/td>";
        strVar += "<td><input type=button id= 'Student_Email' value=\"Student Email\" style=\"width:100;\"><\/td>";
        strVar += "<\/tr>";
        strVar += "<tr>";
        strVar += "<td><input type=button id='ID_Request'value=\"ID Request\" style=\"width:100;\">";
        strVar += "<td><input type=button id='Term_Activation' value=\"Term Activation\" style=\"width:100;\"><\/td>";
        strVar += "<\/tr>";
        strVar += "<tr>";
        strVar += "<td><input type=button id='General_Transfer' value=\"General Transfer\" style=\"width:100;\"><\/td>";
        strVar += "<td><input type=button id='FERPA_Call' value='FERPA Call' style=\"width:100;\"><\/td>";
        strVar += "<\/tr>";
        strVar += "<tr>";
        strVar += "<td><input type=button id='Enabled_Account' value=\"Enabled Account\" style=\"width:100;\"><\/td>";
        strVar += "<td><input type=button id='OC_Enable' value='OC Enable' style=\"width:100;\"><\/td>";
        strVar += "<\/tr>";
        strVar += "<\/tbody>";
        strVar += "<table>";
        ticketTreeDiv.innerHTML = strVar;

        document.getElementById("Network_Password").addEventListener("click", networkPasswordText);
        document.getElementById("Student_Email").addEventListener("click", studentEmailText);
        document.getElementById("ID_Request").addEventListener("click", idRequestText);
        document.getElementById("Term_Activation").addEventListener("click", termActivationText);
        document.getElementById("General_Transfer").addEventListener("click", generalTransferText);
        document.getElementById("FERPA_Call").addEventListener("click", ferpaCallText);
        document.getElementById("Enabled_Account").addEventListener("click", enabledAccountText);
        document.getElementById("OC_Enable").addEventListener("click", ocEnabledText);

    }

    /*********************************************************
* Selects current user for the tech assignment on ticket
* NOTE: Only works if no two techs share a last name
* FIXME: Fix for shared last name eventually^TM
**********************************************************/
    function selectAssignment() {
        console.log("selectAssignment");
        // Gets last name of user and cleans up string
        lastName = getElementByXPath('//*[@id="head"]/table[1]/tbody/tr/td[2]/div/div/a').innerHTML.replace(/(\r\n|\n|\r)/gm,"");
        lastName = lastName.replace(/ +(?= )/g,'').trim();
        fullName = lastName;
        lastName = lastName.substring(lastName.search(" ") + 1, lastName.length);




        // Clicks on assignment dropdown
        var assignDropDown = innerDoc.getElementById('widget_assignedTo');
        assignDropDown = assignDropDown.firstChild;
        dispatchMouseEvent(assignDropDown, 'mousedown', true, true);
        dispatchMouseEvent(assignDropDown, 'mouseup', true, true);




        target = innerDoc.getElementById('widget_assignedTo');

        observer = new MutationObserver(function(mutations) {
            // For the sake of...observation...let's output the mutation to console to see how this all works
            mutations.forEach(function(mutation) {
                //console.log(mutation.type);
                selectName();

                //stops observation
                observer.disconnect();
            });
        });


        // configuration of the observer:
        var config = { attributes: true, childList: false, characterData: false, subtree: false };

        // pass in the target node, as well as the observer options
        observer.observe(target, config);




    }

    function selectName() {
        console.log("selectName");
        var myName = assignSearch();


        // Clicks on current user in assignment list
        dispatchMouseEvent(myName, 'mouseover', true, true);
        dispatchMouseEvent(myName, 'mousedown', true, true);
        dispatchMouseEvent(myName, 'click', true, true);
        dispatchMouseEvent(myName, 'mouseup', true, true);
        console.log('before save changes loops');
        if (isPassword && refreshPageAfterSave){
            console.log('inside save changes loops');
            saveChanges();
            refreshPageAfterSave = false;
        }
        console.log('after save changes loops');
    }


    // Searchs for current user in the list of available tech and returns user element
    function assignSearch(){
        console.log("assignSearch");
        var assignments = innerDoc.getElementById('assignedTo_popup').children;

        // Loops through list children
        for(i = 0; i < assignments.length; i++){
            if (assignments[i].innerHTML.includes(lastName)){

                // Returns user element if user's last name is found
                return assignments[i];
            }
        }
    }


    function saveChanges(){
        console.log("saveChagnes");
        changeAssignment = false;
        var saveChangesBtn = document.evaluate('//*[@id="dijit_layout_ContentPane_0"]/div[2]/table/tbody/tr/td[1]/span/span', innerDoc, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        dispatchMouseEvent(saveChangesBtn, 'mouseover', true, true);
        dispatchMouseEvent(saveChangesBtn, 'mousedown', true, true);
        dispatchMouseEvent(saveChangesBtn, 'click', true, true);
        dispatchMouseEvent(saveChangesBtn, 'mouseup', true, true);
    }


    /**********************************************************************
     * Sets specific template variable to true as well as setting
     * changeAssignment to the correct boolean value
     ***********************************************************************/
    function getTemplate(){
        console.log("getTemplate");
        // Current Template's Name
        var templateName = getElementByXPath('//*[@id="dijit_layout_ContentPane_0"]/table/tbody/tr[1]/td[1]/strong').innerHTML;
        isPassword = false;
        isInformational = false;
        changeAssignment = false;

        if(templateName === " Password Changes"){
            isPassword = true;
            changeAssignment = true;

        }else if(templateName === "Informational Request / Student Assistance"){
            isInformational = true;
            changeAssignment = true;
        }else if(templateName === "CS PROD Access Request"
                 || templateName === "FS PROD Access Request"
                 || templateName === "ImageNow Access Request"
                 || templateName === "Blackboard Incident/Service Request"
                 || templateName === "Hardware Replacement"
                 || templateName === "GWMC Mobile Device GW Access"){
            isRequestTemplate = true;
            changeAssignment = false;
        }

    }

    function insertTextStr(str, value) {
        return str.substr(0, 21) + value + str.substr(21);
    }






    function networkPasswordText(){

        var subject = innerDoc.getElementById('subject');
        subject.value = "Informational Request - Customer could not remember their network username/password";

        var note = innerDoc.getElementById('note');
        var ticketStr = note.innerHTML;
        var insertStr = " Walked customer through network password reset at grcc.edu/password";
        note.value = insertTextStr(ticketStr, insertStr);


    }

    function studentEmailText(){

        var subject = innerDoc.getElementById('subject');
        subject.setAttribute("value", "Informational Request -");
        subject.value = "Informational Request -  Student could not login/remember student email";

        var note = innerDoc.getElementById('note');
        var ticketStr = note.innerHTML;
        var insertStr = " Provided student email address to student.";
        note.value = insertTextStr(ticketStr, insertStr);

    }

    function idRequestText(){

        var subject = innerDoc.getElementById('subject');
        subject.value = "Informational Request -  Student forgot their ID number";

        var note = innerDoc.getElementById('note');
        var ticketStr = note.innerHTML;
        var insertStr = " Provided student with their ID number after verification.";
        note.value = insertTextStr(ticketStr, insertStr);


    }


    function termActivationText(){

        var subject = innerDoc.getElementById('subject');
        subject.value = "Informational Request -  Student was unable to sign up for classes";

        var note = innerDoc.getElementById('note');
        var ticketStr = note.innerHTML;
        var insertStr = " Student needed to be term activated by the Enrollment Center";
        note.value = insertTextStr(ticketStr, insertStr);


    }

    function generalTransferText(){

        var subject = innerDoc.getElementById('subject');
        subject.value = "Informational Request -  Customer requested information pertaining to another department";

        var note = innerDoc.getElementById('note');
        var ticketStr = note.innerHTML;
        var insertStr = " Transferred customer to the appropriate department.";
        note.value = insertTextStr(ticketStr, insertStr);


    }

    function ferpaCallText(){

        var subject = innerDoc.getElementById('subject');
        subject.value = "Informational Request -  Requesting information pertaining to another customer";

        var note = innerDoc.getElementById('note');
        var ticketStr = note.innerHTML;
        var insertStr = " Unable to provide information due to FERPA regulations.'";
        note.value = insertTextStr(ticketStr, insertStr);


    }

    function enabledAccountText(){

        var subject = innerDoc.getElementById('subject');
        subject.value = "Informational Request -  Network account disabled.";

        var note = innerDoc.getElementById('note');
        var ticketStr = note.innerHTML + "\n #enabled";
        var insertStr = " Enabled the network account.";
        note.value = insertTextStr(ticketStr, insertStr);
    }



    function ocEnabledText(){

        var subject = innerDoc.getElementById('subject');
        subject.value = "Informational Request -  Unable to log into Online Center.";

        var note = innerDoc.getElementById('note');
        var ticketStr = note.innerHTML + "\n #OCLocked";
        var insertStr = " Locked then unlocked account in CSProd. User was able to successfully log in afterwards.";
        note.value = insertTextStr(ticketStr, insertStr);
    }

}


if (document.location.href.search("ehelpdesk/ticket/edit2.glml") !== -1){

    // Make the Submitted by readable in Chrome
    $('#dijit_form_TextBox_0').css('color','#545454');


    // Saving the employee name (used for AAF tickets)
    setTimeout(saveEmpName, 500);
    function saveEmpName(){
        if (getElementByXPath('//*[@id="ticketInfoTable"]/tbody/tr[6]/td[3]').innerHTML === "*Employee Name:"){
            var empName = getElementByXPath('//*[@id="ticketInfoTable"]/tbody/tr[6]/td[4]');
            empName = empName.firstChild;
            empName = empName.firstChild;
            empName = empName.firstChild;
            //Alert to check the employee name.
            //alert(empName.value);
            setStorage('employeeName' , empName.value);
        }
    }

}



if (document.location.href.search("\/ehelpdesk\/tickets\/ticketHistoryEdit2.glml")!==-1){


    var lastElement = getElementByXPath('//*[@id="ticketHistoryForm"]/table/tbody/tr[6]');

    /* USE TO ADD A NEW ROW OF BUTTONS
    strVar += "<tr>";
    strVar += "<td><\/td>";
    strVar += "<td>";
    strVar += "<input id='buttonID' type='button' value='ButtonName' title = '' style ='width:100%'><\/button>";
    strVar += "<\/td>";
    strVar += "<td>";
    strVar += "<input id='buttonID' type='button' value='ButtonName' title = '' style ='width:100%'><\/button>";
    strVar += "<\/td>";
    strVar += "<td>";
    strVar += "<input id='buttonID' type='button' value='ButtonName' title = '' style ='width:100%'><\/button>";
    strVar += "<\/td>";
    strVar += "<td>";
    strVar += "<input id='buttonID' type='button' value='ButtonName' title = '' style ='width:100%'><\/button>";
    strVar += "<\/td>";
    strVar += "<\/tr>";


    // USE TO CREATE BUTTON ACTION LISTENER WITH TEXT VALUE MODIFIATION FUNCTION
    document.getElementById('buttonID').addEventListener('click', sampleText);


    // USE AS THE TEXT VALUE MODIFICATION FUNCTION
        function sampleText() {
        document.getElementById("note").value = ("put text here");
        document.getElementById("note").focus();
    }
    */



    var tableBody = document.createElement('table');
    tableBody.setAttribute("cellpadding", "3");
    tableBody.setAttribute("width", "509");
    tableBody.setAttribute("style","border-spacing: 3px 7px");

    var strVar = "";
    strVar += "<tbody>";

    // Row One
    strVar += "<tr >";
    strVar += "<td class=\"label totop\" style =\"width: 83px\">Templates:<\/td >";
    strVar += "<td style =\"width: 96px\">";
    strVar += "<input id=\"clearBtn\" type=\"button\" value='Clear All' title = 'Clears the text area.' style =\"width: 100%\"><\/input>";
    strVar += "<\/td>";
    strVar += "<td style =\"width: 96px\">";
    strVar += "<input id=\"signatureBtn\" type=\"button\" value='Signature' title = 'Add signature to bottom of note.' style =\"width: 100%\"><\/input>";
    strVar += "<\/td>";
    strVar += "<td style =\"width: 96px\">";
    strVar += "<input id='emailTemplateBtn' type='button' value='Template' title = 'Adds greeting and signaure' style ='width:100%'><\/button>";
    strVar += "<\/td>";
    strVar += "<td style =\"width: 96px\">";
    strVar += "<input id=\"onlineCenterBtn\" type=\"button\" value='Online Center' title = 'Online Center password change request denial.' style =\"width: 100%\"><\/input>";
    strVar += "<\/td>";
    strVar += "<\/tr>";

    // Row Two
    strVar += "<tr>";
    strVar += "<td><\/td>";
    strVar += "<td>";
    strVar += "<input id='nameChange' type='button' value='Name Change' title = 'Network Account Username scheduled for name change.' style ='width:100%'><\/button>";
    strVar += "<\/td>";
    strVar += "<td>";
    strVar += "<input id='noNameChange' type='button' value='No Name Change' title = 'Network Account NOT scheduled for name change.' style ='width:100%'><\/button>";
    strVar += "<\/td>";
    strVar += "<td>";
    strVar += "<input id='networkInfoBtn' type='button' value='Campus Login' title = 'Network account reset information.' style ='width:100%'><\/button>";
    strVar += "<\/td>";
    strVar += "<td>";
    strVar += "<input id='emailInfoBtn' type='button' value='Student Email' title = 'Student email information.' style ='width:100%'><\/button>";
    strVar += "<\/td>";
    strVar += "<\/tr>";

    // Row Three
    strVar += "<tr>";
    strVar += "<td><\/td>";
    strVar += "<td>";
    strVar += "<input id=\"wirelessBtn\" type=\"button\" value='Wireless' title = 'Wireless event account creation email template.' style =\"width: 100%\"><\/input>";
    strVar += "<\/td>";
    strVar += "<td>";
    strVar += "<input id=\"eventBtn\" type=\"button\" value='Event' title = 'Event logon account creation email template.' style =\"width:100%\"><\/button>";
    strVar += "<\/td>";
    strVar += "<td>";
    strVar += "<input id='costCenterBtn' type='button' value='Cost Center' title = 'Template for adding a cost center to a users account.' style ='width:100%'><\/button>";
    strVar += "<\/td>";
    strVar += "<td>";
    strVar += "<input id='sDriveBtn' type='button' value='S: Drive' title = 'Template for granding S: Drive access to a user.' style ='width:100%'><\/button>";
    strVar += "<\/td>";
    strVar += "<\/tr>";

    // Row Four

    strVar += "<tr>";
    strVar += "<td><\/td>";
    strVar += "<td>";
    strVar += "<input id=\"AAFPSftBtn\" type=\"button\" value='AAF w\/ PS' title = 'Application Access Form with PeopleSoft access email template.' style =\"width: 100%\"><\/input>";;
    strVar += "<\/td>";
    strVar += "<td>";
    strVar += "<input id=\"AAFBtn\" type=\"button\" value='AAF w\/o PS' title = 'Application Access Form without PeopleSoft access email template.' style =\"width:100%\"><\/button>";
    strVar += "<\/td>";
    strVar += "<td>";
    strVar += "<input id='AAFAccesStatus' type='button' value='AAF Status' title = 'Application Access Status Update Button' style ='width:100%'><\/button>";
    strVar += '<div id="divdeps" style="display:none" title=""></div>'
    strVar += "<\/td>";
    strVar += "<td>";
    strVar += "<input id='spamEmail' type='button' value='Spam Email' title = 'Spam email template with FuseMail information' style ='width:100%'><\/button>";
    strVar += "<\/td>";
    strVar += "<\/tr>";

    // Row Five

    strVar += "<tr>";
    strVar += "<td><\/td>";
    strVar += "<td>";
    strVar += "<input id='preferredStudent' type='button' value='Preferred Student' title = 'Information regarding preferred name for a student.' style ='width:100%'><\/button>";
    strVar += "<\/td>";
    strVar += "<td>";
    strVar += "<input id='preferredStaff' type='button' value='Preferred Staff' title = 'Information regarding preferred name for a staff.' style ='width:100%'><\/button>";
    strVar += "<\/td>";
    strVar += "<td>";
    //strVar += "<input id='buttonID' type='button' value='ButtonName' title = '' style ='width:100%'><\/button>";
    strVar += "<\/td>";
    strVar += "<td>";
    //strVar += "<input id='buttonID' type='button' value='ButtonName' title = '' style ='width:100%'><\/button>";
    strVar += "<\/td>";
    strVar += "<\/tr>";





    strVar +="<\/tbody>";
    tableBody.innerHTML += strVar;
    document.getElementById('ticketHistoryForm').appendChild(tableBody);

    // Button Event Listeners
    // Row One
    document.getElementById('clearBtn').addEventListener('click', clearText);
    document.getElementById('signatureBtn').addEventListener('click', signatureText);
    document.getElementById('emailTemplateBtn').addEventListener('click', emailTemplateText);
    document.getElementById('onlineCenterBtn').addEventListener('click', onlineCenterText);

    // Row Two
    document.getElementById('networkInfoBtn').addEventListener('click', networkInfoText);
    document.getElementById('emailInfoBtn').addEventListener('click', emailInfoText);
    document.getElementById('costCenterBtn').addEventListener('click', costCenterText);
    document.getElementById('sDriveBtn').addEventListener('click', sDriveText);

    // Row Three
    document.getElementById('wirelessBtn').addEventListener("click", wirelessText);
    document.getElementById('eventBtn').addEventListener('click', eventText);
    document.getElementById('AAFPSftBtn').addEventListener("click", applicationPsftText);
    document.getElementById('AAFBtn').addEventListener('click', applicationNoPsftText);

    // Row Four
    document.getElementById('nameChange').addEventListener('click', nameChangeText);
    document.getElementById('noNameChange').addEventListener('click', noNameChangeText);
    document.getElementById('spamEmail').addEventListener('click', spamEmailText);
    document.getElementById('AAFAccesStatus').addEventListener('click', AAFAccesStatusText);

    // Row Five
    document.getElementById('preferredStudent').addEventListener('click', preferredStudentText);
    document.getElementById('preferredStaff').addEventListener('click', preferredStaffText);
    //document.getElementById('buttonID').addEventListener('click', sampleText);
    //document.getElementById('buttonID').addEventListener('click', sampleText);




    function clearText() {
        document.getElementById("note").value = ("");
        document.getElementById("note").focus();
    }

    function emailTemplateText() {
        document.getElementById("note").value = ("Greetings,\n\n\n\nThank you and have a great day!\n\n" + getStorage('fullName') +
                                                 "\nIT Customer Support" +
                                                 "\n(616)234-4357" +
                                                 "\nithelp@grcc.edu");
        document.getElementById("note").focus();
        document.getElementById("note").setSelectionRange(12, 12);
    }


    function signatureText() {
        document.getElementById("note").value += ("\n\n" + getStorage('fullName') +
                                                  "\nIT Customer Support" +
                                                  "\n(616)234-4357" +
                                                  "\nithelp@grcc.edu");
        document.getElementById("note").focus();
    }

    function onlineCenterText() {
        document.getElementById("note").value = ("Greetings,\n\nDue to security concerns, we are unable to provide Online Center " +
                                                 "UserIDs or passwords via email. Please call the Customer Support Desk at (616)234-4357 at your " +
                                                 "earliest convenience." +
                                                 "\n\nThank you and have a great day!" +
                                                 "\n\n" + getStorage('fullName') +
                                                 "\nIT Customer Support" +
                                                 "\n(616)234-4357" +
                                                 "\nithelp@grcc.edu");
        document.getElementById("note").focus();
    }

    function networkInfoText() {
        document.getElementById("note").value = ("Greetings,\n\nPlease go to grcc.edu/password to view your username or reset your " +
                                                 "network password. If you do not know your student ID number or you are having issues with " +
                                                 "the password reset tool, call the Customer Support Desk at (616)234-4357. " +
                                                 "" +
                                                 "\n\nThank you and have a great day!" +
                                                 "\n\n" + getStorage('fullName') +
                                                 "\nIT Customer Support" +
                                                 "\n(616)234-4357" +
                                                 "\nithelp@grcc.edu");
        document.getElementById("note").focus();
    }

    function emailInfoText() {
        document.getElementById("note").value = ("Greetings,\n\nTo log into your student email, please go to email.grcc.edu. Your email address is " +
                                                 "your Blackboard username followed by @email.grcc.edu (username@email.grcc.edu). Your password is " +
                                                 "the same password you use to log into Blackboard.\n\nPlease go to grcc.edu/password to view your username or reset your " +
                                                 "network password. If you are still experiencing issues with your student email, do not know your student ID number, " +
                                                 "or you are having issues with the password reset tool, call the Customer Support Desk at (616)234-4357. " +
                                                 "\n\nThank you and have a great day!" +
                                                 "\n\n" + getStorage('fullName') +
                                                 "\nIT Customer Support" +
                                                 "\n(616)234-4357" +
                                                 "\nithelp@grcc.edu");
        document.getElementById("note").focus();
    }

    function costCenterText() {
        document.getElementById("note").value = ("Greetings,\n\n[User] has been granted printing access to the [cost center] cost center." +
                                                 "\n\nThank you and have a great day!" +
                                                 "\n\n" + getStorage('fullName') +
                                                 "\nIT Customer Support" +
                                                 "\n(616)234-4357" +
                                                 "\nithelp@grcc.edu");

        document.getElementById("note").focus();
    }

    function sDriveText() {
        document.getElementById("note").value = ("Greetings,\n\n[User] has been granted S: drive access to the following location:\n\n" +
                                                 "[List Pathway]\n\nIf you have any issues or concerns, please do not hesitate to let us know. " +
                                                 "We also ask that the end-user please restart their computer so that the network may update their new access rights." +
                                                 "\n\nThank you and have a great day!" +
                                                 "\n\n" + getStorage('fullName') +
                                                 "\nIT Customer Support" +
                                                 "\n(616)234-4357" +
                                                 "\nithelp@grcc.edu");
        document.getElementById("note").focus();
    }


    function wirelessText() {
        document.getElementById("note").value = ("Greetings,\n\nPlease instruct guests to connect to GRCC Wireless and open a web browser." +
                                                 " From there they will be prompted to enter the following credentials:" +
                                                 "\n\nUsername: " +
                                                 "\nPassword: " +
                                                 "\n\nThank you and have a great day!" +
                                                 "\n\n" + getStorage('fullName') +
                                                 "\nIT Customer Support" +
                                                 "\n(616)234-4357" +
                                                 "\nithelp@grcc.edu");
        document.getElementById("note").focus();
        document.getElementById("note").setSelectionRange(167, 167);
    }

    function eventText() {
        document.getElementById("note").value = ("Greetings, \n\nPlease use the following login credentials for the scheduled event today." +
                                                 " This temporary account will work for logging into the campus computers as well as" +
                                                 " logging into GRCC Secure." +
                                                 "\n\nUsername: " +
                                                 "\nPassword: " +
                                                 "\n\nThank you and have a great day!" +
                                                 "\n\n" + getStorage('fullName') +
                                                 "\nIT Customer Support" +
                                                 "\n(616)234-4357" +
                                                 "\nithelp@grcc.edu");
        document.getElementById("note").focus();
        document.getElementById("note").setSelectionRange(208, 208);
    }


    function applicationPsftText() {
        document.getElementById("note").value = ("Greetings,\n\nThe Campus Network Account for " + getStorage('employeeName') + " has been modified to reflect" +
                                                 " their staff roles. If they are not be able to log in, please have them enter the username, \"lookup\"" +
                                                 " and the password, \"lookup\" into any campus computer to reset their login credentials. " +
                                                 "\n\nA separate ticket for their PeopleSoft access has been created, you will receive a separate" +
                                                 " notification when this has been completed. If you have any questions please contact us at -4357." +
                                                 "\n\nThank you and have a terrific day!" +
                                                 "\n\n" + getStorage('fullName') +
                                                 "\nIT Customer Support" +
                                                 "\n(616)234-4357" +
                                                 "\nithelp@grcc.edu");
        document.getElementById("note").focus();
    }

    function applicationNoPsftText() {
        document.getElementById("note").value = ("Greetings,\n\nThe Campus Network Account for " + getStorage('employeeName') + " has been modified to reflect" +
                                                 " their staff roles. If they are not be able to log in, please have them enter the username, \"lookup\"" +
                                                 " and the password, \"lookup\" into any campus computer to reset their login credentials. " +
                                                 "\n\nThank you and have a terrific day!" +
                                                 "\n\n" + getStorage('fullName') +
                                                 "\nIT Customer Support" +
                                                 "\n(616)234-4357" +
                                                 "\nithelp@grcc.edu");
        document.getElementById("note").focus();
    }

    function nameChangeText() {
        document.getElementById("note").value = ("Greetings,\n\nYour Campus Network Account is scheduled to be renamed at the end of the semester. The Campus " +
                                                 " Network username will change, however, your password will remain the same. If you have any questions or concerns," +
                                                 " please contact the IT Customer Support Desk at (616)234-4357." +
                                                 "\n\nThank you and have a terrific day!" +
                                                 "\n\n" + getStorage('fullName') +
                                                 "\nIT Customer Support" +
                                                 "\n(616)234-4357" +
                                                 "\nithelp@grcc.edu");
        document.getElementById("note").focus();
    }
    function noNameChangeText() {
        document.getElementById("note").value = ("ATTENTION:\n\nPlease contact Student Records at (616)234-4121 and get your name changed on file. This must be done before" +
                                                 " we can schedule you for a Campus Network Account name change. Once Student Records has changed your name, please resubmit" +
                                                 " the Network Account name change form." +
                                                 "\n\nThank you and have a terrific day!" +
                                                 "\n\n" + getStorage('fullName') +
                                                 "\nIT Customer Support" +
                                                 "\n(616)234-4357" +
                                                 "\nithelp@grcc.edu");
        document.getElementById("note").focus();
    }
    function spamEmailText() {
        document.getElementById("note").value = ("Thank you for notifying the Help Desk in regards to the spam email. You can add this email/domain to your FuseMail block" +
                                                 " list. If you have not set up a FuseMail account or forgot your FuseMail credentials, please contact the Help Desk and we" +
                                                 " can provide that information after verification." +
                                                 "\n\nThank you and have a terrific day!" +
                                                 "\n\n" + getStorage('fullName') +
                                                 "\nIT Customer Support" +
                                                 "\n(616)234-4357" +
                                                 "\nithelp@grcc.edu");
        document.getElementById("note").focus();
    }
    function AAFAccesStatusText() {


        document.getElementById("note").value = ("[ ] Employee Indicator: Y/N" +
                                                 "\n[ ] Network Account" +
                                                 "\n[ ] GroupWise Account" +
                                                 "\n[ ] Cost Center" +
                                                 "\n[ ] CSProd Ticket: [Enter TID]" +
                                                 "\n[ ] FSProd Ticket: [Enter TID]" +
                                                 "\n[ ] Telcom Ticket: [Enter TID]" +
                                                 "\n[ ] Misc. Needs: [Enter TID]" +
                                                 "\n\n**Remove any fields if not applicable to this AAF. Remove this line once completed, if I did not remove this line, I did not follow instructions**");
        document.getElementById("note").focus();
    }

    // Row Five

    function preferredStudentText() {
        document.getElementById("note").value = ("Greetings,\n\nIn the past, only the primary name on an account was updated to reflect a name change. We are now " +
                                                 "utilizing both primay name as well as preferred name. Now that this option has been implemented you may notice that " +
                                                 "your name appears incorrectly in certain systems, such as Blackboard. We apologize for this inconvenience. Students who wish " +
                                                 "to see a preferred name will need to submit a request to the Associate Registrar. They can be contacted at registrars@grcc.edu " +
                                                 "or (616)234-4121." +
                                                 "\n\nThank you and have a terrific day!" +
                                                 "\n\n" + getStorage('fullName') +
                                                 "\nIT Customer Support" +
                                                 "\n(616)234-4357" +
                                                 "\nithelp@grcc.edu");
        document.getElementById("note").focus();
    }

    function preferredStaffText() {
        document.getElementById("note").value = ("Greetings,\n\nIn the past, only the primary name on an account was updated to reflect a name change. We are now " +
                                                 "utilizing both primay name as well as preferred name. Now that this option has been implemented you may notice that " +
                                                 "your name appears incorrectly in certain systems, such as Blackboard. We apologize for this inconvenience. Staff who wish " +
                                                 "to see a preferred name will need to submit a request to Human Resources. They can be contacted at aramirez@grcc.edu " +
                                                 "or (616)234-3905." +
                                                 "\n\nThank you and have a terrific day!" +
                                                 "\n\n" + getStorage('fullName') +
                                                 "\nIT Customer Support" +
                                                 "\n(616)234-4357" +
                                                 "\nithelp@grcc.edu");
        document.getElementById("note").focus();
    }





}


if (document.location.href.search("\/ehelpdesk\/home.glml")!==-1){



    // Number of tickets in current tab gathered from page
    var numTickets;

    // Dispatch tab element (gets first tab by default)
    var dispatchTab;

    // First Ticket
    var ticketID;

    // Default preferences values that can be changed.
    var refreshTimeDelay = 120; //seconds
    var showPreference = false;
    var notificationDisplayTime = 6; //seconds
    var runDispatchNotifier = getStorage('RunDispatchNotifier');

    // Create mouse event to simulate a click.
    var dispatchMouseEvent = function(target, var_args) {
        var e = document.createEvent("MouseEvents");
        e.initEvent.apply(e, Array.prototype.slice.call(arguments, 1));
        target.dispatchEvent(e);
    };

    // Idle Counter
    var _idleSecondsCounter = 0;
    document.onclick = function() {
        _idleSecondsCounter = 0;
    };
    document.onmousemove = function() {
        _idleSecondsCounter = 0;
    };
    document.onkeypress = function() {
        _idleSecondsCounter = 0;
    };
    window.setInterval(CheckIdleTime, 1000);

    // Preferences Box

    window.onload(loadPreferences());
    waitForKeyElements("#dijit_layout_ContentPane_0", loadInitialSettings);


    // Web Notification Permission
    window.addEventListener('load', function () {
        var numTicketChange = getElementByXPath('//*[@id="dijit_layout_ContentPane_2"]/div');
        $("numTicketChange").onChange(ticketNumberNotificationDisplay());

        Notification.requestPermission(function (status) {
            // This lets us use Notification.permission with Chrome/Safari
            if (Notification.permission !== status) {
                Notification.permission = status;
            }

        });

    });




    function loadInitialSettings(){
        refreshBox();
        $('#maintc_tablist').click(function(){
            clickOnThis('dijit_form_Button_0');
        });

    }


    /*************************************************************************
 * Starts Notification Script
 *************************************************************************/
    startScript();
    function startScript(){
        GM_xmlhttpRequest({
            method: "GET",
            url: "\/ehelpdesk/tf/ticketFilterStore.glml?filter=true&ticketFilterId=430&ticketId=*&start=0&count=20",
            onload: function(response) {
                var sampleStr = response.responseText;
                var strIndexOne = sampleStr.indexOf("ticketNumber\":");
                var strIndexTwo = sampleStr.indexOf("numRows\":");
                ticketID = sampleStr.substr(strIndexOne + 14,6);
                numTickets = sampleStr.substr(strIndexTwo + 9, 1);

                if(numTickets != 0){
                    myFunction();
                }

            }
        });
    }

    /****************************************************************************************
 * Looks for tickets in dispatch tab. Displays notification if ticket is found.
 ****************************************************************************************/
    function myFunction()
    {

        // Web Notification Permission
        window.addEventListener('load', function () {

            Notification.requestPermission(function (status) {
                // This lets us use Notification.permission with Chrome/Safari
                if (Notification.permission !== status) {
                    Notification.permission = status;
                }
            });
        });

        if(getStorage('RunDispatchNotifier') == "true"){
            getNotification();
        }
        _idleSecondsCounter = 0;



    }

    /****************************************************************************************
 * Checks to see if the dispatch tab is selected
 ****************************************************************************************/
    function isDispatch(){
        // Create widget var for Awaiting Dispatch tab
        dispatchTab = getElementByXPath("//*[@id='maintc_tablist']/div[4]/div/div[1]");


        if(hasClass(dispatchTab, 'dijitTab dijitTabChecked dijitChecked')){
            return true;
        }else{
            return false;
        }
    }

    /****************************************************************************************
 * Returns boolean if element has a className
 ****************************************************************************************/
    function hasClass(element, className) {
        return element.className && new RegExp("(^|\\s)" + className + "(\\s|$)").test(element.className);
    }

    /****************************************************************************************
 * Builds and displays web notification
 ****************************************************************************************/
    function getNotification()
    {
        var myVar2;
        var tabTitle = document.title;
        var i = 0;

        var str;
        var str2;
        if (numTickets > 1){
            str = 'There are ' + numTickets + ' tickets awaiting dispatch.\n';
            str2 = ' Tickets In Pool.';
        }else{
            str = 'There is ' + numTickets + ' ticket awaiting dispatch.\n';
            str2 = ' Ticket In Pool.';
        }



        // CyclesFlashes the title of the eHD Chrome Tab
        documentTitle();
        function documentTitle (){

            i++;
            if (i < 14){
                if((i % 2) === 0){
                    document.title = numTickets + str2;
                }else{
                    document.title = tabTitle;
                }
                setTimeout(documentTitle, 500);
            }
        }

        // Notification Options
        var options;
        options = {
            icon: 'https://itsupport.grcc.edu:8443/ehelpdesk/images/favicon.ico',
            body: (str +
                   'Click to open TicketID: ' + ticketID)
        };

        // If the user agreed to get notified
        if (window.Notification && Notification.permission === "granted") {
            var n = new Notification("HelpDesk Notification ", options);

            setTimeout(n.close.bind(n), (getStorage("NotificationDisplay")*1000));

            n.addEventListener('click', function() {
                openTicket();
            });

        }

        // If the user hasn't told if he wants to be notified or not
        // Note: because of Chrome, we are not sure the permission property
        // is set, therefore it's unsafe to check for the "default" value.
        else if (window.Notification && Notification.permission !== "denied") {
            Notification.requestPermission(function (status) {
                if (Notification.permission !== status) {
                    Notification.permission = status;
                }

                // If the user said okay
                if (status === "granted") {
                    var n = new Notification("HelpDesk Notificationtest", options);

                    setTimeout(n.close.bind(n), (getStorage("NotificationDisplay")*1000));

                    n.addEventListener('click', function() {
                        openTicket();
                    });


                }

                // Otherwise, we can fallback to a regular modal alert
                else {
                    alert("Tickets in Queue!!!");
                }
            });
        }

        // If the user refuses to get notified
        else {
            // We can fallback to a regular modal alert
            alert("Tickets in Queue!!!");
        }

        window.onbeforeunload = function() {
            n.close();
        };
    }

    // Opens ticket in new window using TID.
    function openTicket()
    {


        var url = "/ehelpdesk/ticket/edit2.glml?tid=" + ticketID;
        openWindow(url, '_' + ticketID, '800px', '650px');

    }

    // Adds a second to idle counter, reloads if reaches timeout limit
    function CheckIdleTime() {

        _idleSecondsCounter++;
        // Checks to see if user has idled long enough
        if (_idleSecondsCounter >= refreshTimeDelay) {


            startScript();

            dispatchMouseEvent(document.getElementById('dijit_form_Button_0'), 'mouseover', true, true);
            dispatchMouseEvent(document.getElementById('dijit_form_Button_0'), 'mousedown', true, true);
            dispatchMouseEvent(document.getElementById('dijit_form_Button_0'), 'click', true, true);
            dispatchMouseEvent(document.getElementById('dijit_form_Button_0'), 'mouseup', true, true);

        }
    }

    function refreshBox(){

        // Gets users name and sets in storage for user in other functions
        var fullName = getElementByXPath('//*[@id="head"]/table[1]/tbody/tr/td[2]/div/div/a').innerHTML.replace(/(\r\n|\n|\r)/gm,"");
        fullName = fullName.replace(/ +(?= )/g,'').trim();
        setStorage('fullName' , fullName);


        var newTicketCell= getElementByXPath('//*[@id="dijit_layout_ContentPane_0"]/table/tbody/tr/td[1]');
        newTicketCell.setAttribute('width','20%');

        var table = getElementByXPath('//*[@id="dijit_layout_ContentPane_0"]/table/tbody/tr/td[2]');
        table.setAttribute('width','60%');
        var tableRow = getElementByXPath('//*[@id="dijit_layout_ContentPane_0"]/table/tbody');
        var maindiv = getElementByXPath('//*[@id="dijit_layout_ContentPane_0"]');
        var mainTabContainer = getElementByXPath('//*[@id="mainTabContainer"]');
        var preferencesStuff = getElementByXPath('//*[@id="preferenceDiv"]');


        if (table)
        {
            var showPreferenceLinkDiv = document.createElement('div');
            showPreferenceLinkDiv.setAttribute('id', 'showPreferenceLinkDiv');
            showPreferenceLinkDiv.setAttribute('style', 'text-align:left');
            showPreferenceLinkDiv.setAttribute('style', 'float:left');
            table.appendChild(showPreferenceLinkDiv);

            var showPreferenceSpan = document.createElement('span');
            var showPreferenceLinkStr = '<a id="showPreferenceLink" style=\'cursor: pointer;\' name="showPreferenceLink" onclick="if (document.getElementById(\'showPreferenceLink\').innerHTML == \'<b>[Hide Preferences]</b>\') { mainTabContainer.setAttribute(\'style\', \'width: 100%; margin-left: 5px; margin-right: 5px; top: 42px; left: 0px; right: 0px; bottom: 10px;\'); document.getElementById(\'preferenceDiv\').style.display=\'none\';  document.getElementById(\'showPreferenceLink\').innerHTML=\'<b>[Show Preferences]</b>\'; } else { mainTabContainer.setAttribute(\'style\', \'width: 100%; margin-left: 5px; margin-right: 5px; top: 200px; left: 0px; right: 0px; bottom: 10px;\'); document.getElementById(\'preferenceDiv\').style.display=\'block\'; document.getElementById(\'showPreferenceLink\').innerHTML=\'<b>[Hide Preferences]</b>\'; }">';
            showPreferenceLinkStr += '<b>[Show Preferences]</b>';
            showPreferenceLinkStr += '</a>';
            showPreferenceLinkStr += '&nbsp;&nbsp;&nbsp;';
            showPreferenceSpan.innerHTML = showPreferenceLinkStr;
            showPreferenceLinkDiv.appendChild(showPreferenceSpan);
            showPreferenceLinkStr = null;
            showPreferenceSpan = null;
            showPreferenceLinkDiv = null;


            var preferenceDiv = document.createElement('div');
            var mainContainer = document.getElementById("mainTabContainer");
            preferenceDiv.setAttribute('id', 'preferenceDiv');
            if (showPreference === true){
                preferenceDiv.setAttribute('style', 'display: block');
            }else{
                preferenceDiv.setAttribute('style', 'display: none');
            }
            maindiv.appendChild(preferenceDiv);



            var checkTicketsCell =  getElementByXPath('//*[@id="dijit_layout_ContentPane_0"]/table/tbody/tr/td[3]');
            checkTicketsCell.setAttribute('width','20%');
            var todayClosedTicketsDiv = document.createElement('div');
            todayClosedTicketsDiv.setAttribute('id', 'ticketIDSearch');
            todayClosedTicketsDiv.setAttribute('style', 'text-align:left');
            todayClosedTicketsDiv.setAttribute('style', 'float:right');

            table.appendChild(todayClosedTicketsDiv);

            var todayClosedTicketsSpan = document.createElement('span');
            var todaysClosedTickets = "14";
            todayClosedTicketsSpan.innerHTML = '<a><b>[Ticket Search] </b></a><input type="text" id="ticketSearchInput">';
            todayClosedTicketsDiv.appendChild(todayClosedTicketsSpan);
            $("#ticketSearchInput").keyup(function(event){
                if(event.keyCode == 13){
                    $("#id_of_button").click();
                    var url = "/ehelpdesk/ticket/edit2.glml?tid=" + ticketSearchInput.value;
                    openWindow(url, '816px', '716px');
                }
            });




            var preferenceHTMLtable = '';

            preferenceHTMLtable += "<hr><br><table cellpadding=\'1\' cellspacing=\'3\' style=\'padding-bottom:3px; width:500px; margin-left:auto; margin-right:auto; align:center;' class=\'bar\'>";
            preferenceHTMLtable += "<tbody >";


            preferenceHTMLtable += "<tr>";
            preferenceHTMLtable += "<td style='width:45%; text-align: right;'>";
            preferenceHTMLtable += '<b>Awaiting Dispatch Refresh Delay :</b>';
            preferenceHTMLtable += "</td>";
            preferenceHTMLtable += '<td style=\'width:55%\'><input type="text" id="RefreshTimeDelayInput" name="RefreshTimeDelay" value="' + getStorage('RefreshTimeDelay') + '" style="width: 100px;">&nbsp;seconds.';
            preferenceHTMLtable += "</tr>";


            preferenceHTMLtable += "<tr><td style='text-align: right;'>";
            preferenceHTMLtable += '<b>New Ticket Notification Duration :</b>';
            preferenceHTMLtable += "</td>";
            preferenceHTMLtable += '<td><input type="text" id="NotificationDisplayInput" name="NotificationDisplay" value="' + getStorage('NotificationDisplay') + '" style="width: 100px;">&nbsp;seconds.';
            preferenceHTMLtable += "</td>";
            preferenceHTMLtable += "</tr>";

            preferenceHTMLtable += "<tr>";
            preferenceHTMLtable += "<td style='text-align: right;'>";
            preferenceHTMLtable += '<b>Enable New Ticket Notifications :</b>';
            preferenceHTMLtable += "</td>";
            preferenceHTMLtable += '<td><input type="radio" id="DispatchNotifierTrue" name="DispatchNotifierRadio">True';
            preferenceHTMLtable += '<input type="radio" id="DispatchNotifierFalse" name="DispatchNotifierRadio">False';
            preferenceHTMLtable += "</td>";
            preferenceHTMLtable += '</tr>';

            //Insert new preference rows here.

            preferenceHTMLtable += "<tr><td align=\'right\' colspan=2>(User must save before changes go into effect)";
            preferenceHTMLtable += '<input type="button" id="PreferenceSaveInput" value="Save" onClick="window.localStorage.setItem(\'RefreshTimeDelay\', document.getElementById(\'RefreshTimeDelayInput\').value); ';
            preferenceHTMLtable += ' window.localStorage.setItem(\'NotificationDisplay\', document.getElementById(\'NotificationDisplayInput\').value); ';
            preferenceHTMLtable += ' window.location.reload()">';
            preferenceHTMLtable += "</td>";
            preferenceHTMLtable += "</tr>";
            preferenceHTMLtable += "</tbody>";
            preferenceHTMLtable += "</table>";

            // Add Above HTML to preferenceDiv

            preferenceDiv.innerHTML += preferenceHTMLtable;

            var dntRadio = document.getElementById('DispatchNotifierTrue');
            var dnfRadio = document.getElementById('DispatchNotifierFalse');
            if(getStorage('RunDispatchNotifier') === 'true'){
                dntRadio.checked = true;
            }else{
                dnfRadio.checked = true;
            }

            dntRadio.addEventListener('click', function(){setStorage('RunDispatchNotifier', true);});
            dnfRadio.addEventListener('click', function(){setStorage('RunDispatchNotifier', false);});
        }
    }
}

function clickOnThis(e){
    dispatchMouseEvent(document.getElementById(e), 'mouseover', true, true);
    dispatchMouseEvent(document.getElementById(e), 'mousedown', true, true);
    dispatchMouseEvent(document.getElementById(e), 'click', true, true);
    dispatchMouseEvent(document.getElementById(e), 'mouseup', true, true);   
}


function setStorage(name, value)
{
    // check if the web browser support HTML5 storage
    if ('localStorage' in window && window['localStorage'] !== null)
    {
        localStorage.setItem(name, value);
    }

    name = undefined;
    value = undefined;
}

function removeStorage(name)
{
    // check if the web browser support HTML5 storage
    if ('localStorage' in window && window['localStorage'] !== null)
    {
        localStorage.removeItem(name);
    }
    name = undefined;
}

function getStorage(name)
{
    // check if the web browser support HTML5 storage
    if ('localStorage' in window && window['localStorage'] !== null)
    {
        return (localStorage.getItem(name));
    }
    name = undefined;
}

function loadPreferences(){


    var refreshTimeDelayTemp = getStorage("RefreshTimeDelay");
    if (refreshTimeDelayTemp === undefined || refreshTimeDelayTemp === null)
    {
        setStorage("RefreshTimeDelay", refreshTimeDelay);
    }
    else
    {
        refreshTimeDelay = parseInt(refreshTimeDelayTemp);
    }

    var showPreferenceTemp = getStorage("ShowPreference");
    if (showPreferenceTemp === undefined || showPreferenceTemp === null)
    {
        setStorage("ShowPreference", showPreference);
    }

    var notificationDelayTemp = getStorage("NotificationDisplay");
    if (notificationDelayTemp === undefined || notificationDelayTemp === null)
    {
        setStorage("NotificationDisplay", notificationDisplayTime);
    }

    var runDispatchNotifierTemp = getStorage("RunDispatchNotifier");
    if (runDispatchNotifierTemp === undefined || runDispatchNotifierTemp === null)
    {
        setStorage("RunDispatchNotifier", runDispatchNotifier);
    }else{
        runDispatchNotifier = getStorage('RunDispatchNotifier');
    }
}


/****************************************************************************************
 * Gets element id by xpath.
 * Returns element
 ****************************************************************************************/
function getElementByXPath(path) {
    return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
}


function insertAfter(newNode, referenceNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}

// Add CSS to page
function addCss(cssString) {
    var head = document.getElementsByTagName('head')[0];
    // return unless head;
    var newCss = document.createElement('style');
    newCss.type = "text/css";
    newCss.innerHTML = cssString;
    head.appendChild(newCss);
}