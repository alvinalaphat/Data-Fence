var reopen;

$(function tester() {
  $("#dialog-confirm").dialog({
    resizable: false,
    height: "auto",
    width: 400,
    modal: true,
    autoOpen: true,
    buttons: {
      YES: function() {
        $("#dialog-confirm").css("display", "none");
        console.log("it worked");
        setTimeout(reopen(), 5000);
      },
      NO: function() {
        $(this).hide();
        reopen();
      }
    }
  });
});

function reopen() {
  $("dialog-confirm").show();
}

$("#show").click(function() {
  $("dialog-confirm").show();
});
