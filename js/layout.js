function updateNewSuggestion() {
  var input = document.getElementById("textInput").value;
  document.getElementById("suggestion-text").innerText = input;
  document.getElementById("suggestion-link").href = 'javascript:keywordRequest("'+input+'");'
}

function keywordRequest(name, twitter_query = null, keyword_regex = null, cities_list = "cities_global") {
  if (twitter_query === null) {
      twitter_query = '\\"'+name+'\\"' 
  }
  if (keyword_regex === null) {
      keyword_regex = name;
  }

  var obj = '{ '
     +'"name" : "'+name+'", '
     +'"twitter_query" : "'+twitter_query+'", '
     +'"keyword_regex" : "'+keyword_regex+'", '
     +'"cities_list" : "'+cities_list+'"'
     +' }';

  if (/^[\],:{}\s]*$/.test(obj.replace(/\\["\\\/bfnrtu]/g, '@').
  replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']').
  replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {
  
    var request = new XMLHttpRequest();

    request.open('POST', base_server + '/keywords/', true);
    request.send(obj);
    topicSuggestions();
    document.getElementById("textInput").value = "";
  
  } else {
  
    console.log('invalid json post request')
  
  }

}

function topicSuggestions() {
  var base_server = "https://tsw.valutadev.com";
  var content = `<li><a id="suggestion-link" href="#">Add new topic: <span style="font-weight: bold;" id="suggestion-text"></span><br /><span>Default city list: <span style="font-weight: bold;">cities_global</span></></span></a></li>`

  ul = document.getElementsByClassName('results')[0];
  
  ul.innerHTML = "";

  ul.insertAdjacentHTML('beforeend', content);

  var request = new XMLHttpRequest();

  request.open('GET', base_server + '/keywords/', true);

  request.onload = function () {
    var data = JSON.parse(this.response);
    if (request.status >= 200 && request.status < 400) {
      data.forEach(keyword => {
        var content = `<li><a href="javascript:setKeyword(`+keyword.id+`);"><span style="font-weight: bold;">` + keyword.name + `</span><br /><span>Uses the <span style="font-weight: bold;">` + keyword.cities_list + `</span> city list.</span></a></li>`;
        ul.insertAdjacentHTML('beforeend', content);
      });
    } else {
      console.log('error');
    }
  }

  request.send();
}

function myFunction() {
  var x = document.getElementById("myTopnav");
  if (x.className === "topnav") {
    x.className += " responsive";
  } else {
    x.className = "topnav";
  }
}

function plotOpen() {
  document.getElementById("plot-holder").style.bottom = "0";
  document.getElementById("plot-open").style.display = "none";
  document.getElementById("plot-close").style.display = "block";
}

function plotClose() {
  document.getElementById("plot-holder").style.bottom = "-430px";
  document.getElementById("plot-close").style.display = "none";
  document.getElementById("plot-open").style.display = "block";
}