const math = require('mathjs');

var exports = module.exports = {};

function isolateX(matrix) {
  var newMatrix = [];
  for (let subMatrix of matrix) {
    newMatrix.push(subMatrix[0]);
  }
  return newMatrix;
}

function isolateY(matrix) {
  var newMatrix = [];
  for (let subMatrix of matrix) {
    newMatrix.push(subMatrix[1]);
  }
  return newMatrix;
}

exports.findMMLine = function(points) {

  var points = points;

  points.sort(function(a,b) {
    return a[0] - b[0];
  })

  console.log(points)

  var remainder = points.length % 3;
  var quotient = Math.floor(points.length/3)

  var groupThreeBegin;
  var groupThreeEnd;
  var groupTwoEnd;

  if (remainder == 1) {
    groupThreeEnd = quotient*3 + 1;
  } else if (remainder == 2) {
    groupThreeEnd = quotient*3 + 2;
    groupThreeBegin = quotient*2 + 1;
    groupTwoEnd = quotient*2 + 1;
  } else {
    groupTwoEnd = quotient*2;
    groupThreeBegin = quotient*2;
    groupThreeEnd = quotient*3;
  }

  var groupOne = points.slice(0, quotient)
  var groupTwo = points.slice(quotient, groupTwoEnd)
  var groupThree = points.slice(groupThreeBegin, groupThreeEnd)

  console.log(groupOne);
  console.log(groupTwo);
  console.log(groupThree);

  var groupOneX = isolateX(groupOne)
  var groupOneY = isolateY(groupOne)
  var groupTwoX = isolateX(groupTwo)
  var groupTwoY = isolateY(groupTwo)
  var groupThreeX = isolateX(groupThree)
  var groupThreeY = isolateY(groupThree)

  var leftPoint = [math.median(groupOneX), math.median(groupOneY)]
  var midPoint = [math.median(groupTwoX), math.median(groupTwoY)]
  var rightPoint = [math.median(groupThreeX), math.median(groupThreeY)]

  var slope = (rightPoint[1] - leftPoint[1]) / (rightPoint[0] - leftPoint[0])
  var intercept;

  if (isFinite(slope)) {
    intercept = ((leftPoint[1] - slope*leftPoint[0]) + (rightPoint[1] - slope*rightPoint[0]) + (midPoint[1] - slope*midPoint[0])) / 3
  } else {
    intercept = (leftPoint[0] + midPoint[0] + rightPoint[0]) / 3
  }

  return {descriptor: slope: slope, intercept: intercept, }
}


// find intercept of lines of map and circle around predicted point of intruder
