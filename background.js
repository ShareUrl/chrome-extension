var imported = document.createElement('script');
imported.src = 'jquery.js';
document.head.appendChild(imported);

chrome.runtime.onMessage.addListener(function(response,sender,sendResponse){
    url = parseUrl(sender.url);
    hashCode = url.pathname.split('/')[1];
    getDataFromCode(hashCode);
});

function parseUrl(href) {
    var l = document.createElement("a");
    l.href = href;
    return l;
};

function myOutsideFunc(domainUrl){
    console.log(domainUrl);
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        var current = tabs[0];
        console.log("current"+current.id);
        chrome.tabs.update(current.id, {'url': domainUrl});
     });
}

function getDataFromCode(refCode){
    $.ajax({
        url: 'https://shareurl-007.appspot.com/url/' + refCode,
        type: 'GET',
        async: false,
        success: function(response) {
            console.log(response);
            myOutsideFunc(setDataToCurrentTab(response));
        },
        error: function(error) {
            console.log(error);
            return "url";
        }
    });
};

function setDataToCurrentTab(refData){
    var domainUrl = "";
    setJsons = JSON.parse(refData);
    for(var i=0;i<setJsons.length;i++){
        var singleCookie = setJsons[i];
        singleCookie.url = "http" + ((singleCookie.secure) ? "s" : "") + "://" + singleCookie.domain + singleCookie.path;
        if(domainUrl.length===0){
            domainUrl = "https://www"+singleCookie.domain;
        }
        delete singleCookie["secure"];
        singleCookie["expirationDate"] = parseInt(singleCookie["expirationDate"]);
         delete singleCookie["expirationDate"];
        console.log(JSON.stringify(setJsons[i]));
        console.log(singleCookie);
        
        chrome.cookies.set(setJsons[i],function (cookie){
            console.log(JSON.stringify(cookie));
            console.log(chrome.extension.lastError);
            console.log(chrome.runtime.lastError);
        });
      }
      return domainUrl; 
};