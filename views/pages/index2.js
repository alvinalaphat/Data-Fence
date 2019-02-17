var modal = document.getElementById("modalbox");
var socket = io('https://aa354e43.ngrok.io');
var answers = [];
var roomCoordinates = {'103': [38.711884, -90.311358], '104': [38.711729, -90.311345], '106': [38.711719, -90.311088], '100B': [38.711666, -90.311489]};

socket.on('intruderUpdate', function(update) {
  if (update['safeZone'] == 'left') {
    $('#mapImage').attr('src', 'staticfiles/left.png')
    $('#dangerNotification').hide()
    $('#safeNotificationLeft').show()
  } else if (update['safeZone'] == 'right') {
    $('#mapImage').attr('src', 'staticfiles/right.png')
    $('#dangerNotification').hide()
    $('#safeNotificationRight').show()
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
  }, 120000);
}

var x = document.getElementById("demo");

var options = {
  enableHighAccuracy: true,
  timeout: 10000,
  maximumAge: 0
};

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition, error, options);
  } else {
    x.innerHTML = "Geolocation is not supported by this browser.";
  }
}

function showPosition(position) {
  console.log([position.coords.latitude, position.coords.longitude]);
  var long = position.coords.longitude;
  var lat = position.coords.latitude;
  var answ = "yes";
  var room = $('#roomInput').val();

  var response = {
    longitude: long,
    latitude: lat,
    answer: "yes"
  };
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

function error(error) {
  console.log(error)
}
