var express = require('express');
var router = express.Router();
var locationData = [];
var timeout = 30;
var open = true;

// deny all location points
router.post('/ping', function(req, res) {
  var answer = req.body.answer;

  if (locationData.length == 0) {
    setTimeout(function() {
      open = false;
    }, timeout * 1000);

    //!open
  }

  if (answer == 'yes' && open) {
    locationData.push([req.body.latitude, req.body.longitude])
  }

  return res.status
})
