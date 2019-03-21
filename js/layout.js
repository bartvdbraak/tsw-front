window.onscroll = function() {myFunction()};

var navbar = document.getElementById("navbar");
var sticky = navbar.offsetTop;



function myFunction() {
  if (window.pageYOffset >= sticky) {
    navbar.classList.add("sticky")
  } else {
    navbar.classList.remove("sticky");
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