var modal = document.getElementById("modalbox");
var socket = io('http://localhost:3000');
var answers = [];

socket.on('intruderUpdate', function(update) {
  if (update['safeZone'] == 'left') {
    $('#mapImage').attr('src', 'left.png')
    $('#dangerNotification').hide()
    $('#safeNotification').show()
  } else if (update['safeZone'] == 'right') {
    $('#mapImage').attr('src', 'right.png')
    $('#dangerNotification').hide()
    $('#safeNotification').show()
  }
})

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
    modal.style.display = "flex";
  }, 30000);
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
  document.getElementById("demo2").innerHTML = myJson;
  socket.emit('locationUpdate', response);
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
  document.getElementById("demo2").innerHTML = myJson2;
  socket.emit('locationUpdate', response);
}

article = document.getElementById("article");

function changer() {
  article.classList.remove("is-warning");
  article.classList.add("is-danger");
}
function changer2() {
  article.classList.remove("is-danger");
  article.classList.add("is-warning");
}
window.setInterval(function() {
  changer();
}, 500);
window.setInterval(function() {
  changer2();
}, 1000);
