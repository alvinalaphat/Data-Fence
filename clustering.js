const math = require('mathjs');
const DBSCAN = require('DBScan');
var epsVal = 0;
var minPtsVal = 0;
var gps_point_data = [
			{
				location: {
					accuracy: 30,
					latitude: 55.7858667,
					longitude: 12.5233995
				}
			},
			{
				location: {
					accuracy: 10,
					latitude: 45.4238667,
					longitude: 12.5233995
				}
			},
		        { 	location: {
					accuracy: 5,
					latitude: 25.3438667,
					longitude: 11.6533995
				}
			}
		];


function findCentroid(latLonPairs) {
  var lonCoords = [];
  var latCoords = [];
  for (var i = 0; i < latLonPairs.length; i++) {
    latCoords.push(latLonPairs[i][0]);
    lonCoords.push(latLonPairs[i][1]);
  }
  return [unweightedAverage(latCoords), unweightedAverage(lonCoords)];
}

function unweightedAverage(matrix) {
  var sum = 0;
  for (var i = 0; i < matrix.length; i++) {
    sum += matrix[i]
  }
  return sum/matrix.length
}

function initializeMapper() {
  return DBSCAN().eps(epsVal).minPts(minPtsVal).distance('EUCLIDEAN').data(gps_point_data);
}
