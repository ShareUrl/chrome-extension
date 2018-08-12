function escapeForPre(e) {
  return String(e).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;")
}

function getDomain(e) {
  if (server = e.match(/:\/\/(.[^/:#?]+)/)[1], parts = server.split("."), isip = !isNaN(parseInt(server.replace(".", ""), 10)), parts.length <= 1 || isip) domain = server;
  else {
    var o = new Array;
    for (o[0] = parts[parts.length - 1], i = 1; i < parts.length; i++)
      if (o[i] = parts[parts.length - i - 1] + "." + o[i - 1], !domainlist.hasOwnProperty(o[i])) {
        domain = o[i];
        break
      }
      "undefined" == typeof domain && (domain = server)
  }
  return domain
}



var content = "",
  downloadable = "",
  popup = "",
  jsons = [];
  setJsons = [];

  function reloadTabForMe(){
  chrome.tabs.getSelected(null, function(tab) {
  var code = 'window.location.reload();';
  chrome.tabs.executeScript(tab.id, {code: code});
});
}

function sendDataToServer(jsonData){
  $.ajax({
    url: 'https://shareurl-007.appspot.com/createUrl',
    data: JSON.stringify(jsonData),
    type: 'POST',
    success: function(response) {
        document.getElementById("inputUrl").value = "https://shareurl.in/"+response;
        document.getElementById("inputUrl").select();
        console.log(response);
    },
    error: function(error) {
      document.getElementById("inputUrl").value = "an error occered. please try again.";
      console.log(error);
    }
});
}

function setCookieForMe(){
  for(var i=0;i<setJsons.length;i++){
    var singleCookie = setJsons[i];
    singleCookie.url = "http" + ((singleCookie.secure) ? "s" : "") + "://" + singleCookie.domain + singleCookie.path;
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
  sendDataToServer(setJsons);
  reloadTabForMe(); 
}

function parseCookieForMe(){
  var inputString = document.getElementById("jsonInput").value;
  try{
      setJsons = JSON.parse(inputString);
      console.log(setJsons);
  }catch(e){
    console.log(e);
    var errorText = document.getElementById("errorText");
    errorText.style.display="";
  }
}

function createShareUrl(){
  console.log(setJsons);
  sendDataToServer(setJsons);
}

function copyShareUrl(){
  document.getElementById("inputUrl").select();
  document.execCommand("copy");
}


chrome.tabs.getSelected(null, function(e) {
  domain = getDomain(e.url);
  console.log(domain);
  chrome.cookies.getAll({}, function(o) {

    for (var t in o) {
      cookie = o[t];

      if (-1 != cookie.domain.indexOf(domain)) {
        jsons.push({
          name : escapeForPre(cookie.name),
          value: escapeForPre(cookie.value),
          domain: escapeForPre(cookie.domain),
          path : escapeForPre(cookie.path),
          expirationDate : escapeForPre(cookie.expirationDate ? cookie.expirationDate : "0"),
          secure : cookie.secure

        });

      };
    }

    //json string
    content += JSON.stringify(jsons, null, 2);
    setJsons = content;
    console.log(setJsons);
    document.getElementById("createButton").addEventListener("click", createShareUrl);
    document.getElementById("copyButton").addEventListener("click", copyShareUrl);    
  });
});