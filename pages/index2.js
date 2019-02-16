var modal = document.getElementById("modalbox");

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
};

no.onclick = function() {
  modal.style.display = "none";
  console.log("No");
  open();
};

function open() {
  setTimeout(function() {
    modal.style.display = "block";
  }, 3000);
}
