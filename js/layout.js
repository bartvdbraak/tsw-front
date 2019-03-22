function updateNewSuggestion() {
  
  document.getElementById("suggestion-text").innerText = document.getElementById("textInput").value;
}

function topicSuggestions() {
  var base_server = "https://tsw.valutadev.com";
  var content = `<li><a href="#">Add new topic: <span style="font-weight: bold;" id="suggestion-text"></span><br /><span><i>To be added soon</></span></a></li>`

  ul = document.getElementsByClassName('results')[0];
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

topicSuggestions();

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