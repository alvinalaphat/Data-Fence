var modal = document.getElementById("modalbox");
var answers = [];
function show() {
  modal.style.display = "block";
}
function hide() {
  modal.style.display = "none";
}
var yes = document.getElementById("yes");
var no = document.getElementById("no");

yes.onclick = function() {
  console.log("Yes");
  modal.style.display = "none";
  open();
  getLocation();
};

no.onclick = function() {
  modal.style.display = "none";
  console.log("No");
  open();
  getLocation2();
};

function open() {
  setTimeout(function() {
    modal.style.display = "block";
  }, 10000);
}

var x = document.getElementById("demo");

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  } else {
    x.innerHTML = "Geolocation is not supported by this browser.";
  }
}

function showPosition(position) {
  console.log([position.coords.latitude, position.coords.longitude]);
  var long = position.coords.longitude;
  var lat = position.coords.latitude;
  var answ = "yes";
  var response = {
    longitude: long,
    latitude: lat,
    answer: "yes"
  };
  var myJson = JSON.stringify(response);
  document.getElementById("demo2").innerHTML = myJson;
}

function getLocation2() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition2);
  } else {
    x.innerHTML = "Geolocation is not supported by this browser.";
  }
}

function showPosition2(position) {
  console.log([position.coords.latitude, position.coords.longitude]);
  var long = position.coords.longitude;
  var lat = position.coords.latitude;
  var answ = "no";
  var response = {
    longitude: long,
    latitude: lat,
    answer: "no"
  };
  var myJson = JSON.stringify(response);
  document.getElementById("demo2").innerHTML = myJson;
}
