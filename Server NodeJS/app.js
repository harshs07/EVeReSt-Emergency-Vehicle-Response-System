require('dotenv').config({ silent: false }); // Retrieve options from .env

var http = require('http'); // Basic HTTP functionality
var express = require('express'); // Provide static routing to pages
var bodyParser = require('body-parser');
var Twitter = require('twitter');

//Create a Twitter Client
var twitterClient = new Twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});

var UNDERSCORE = "_";

var PORT_NO =  9090;
var TIMEOUT = 1000;
	
var app = express();
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

var paddingText = "-----------------------------------------------------";

//Map of the currently reported incidents
/*
KEY : username_beaconURL
VALUE : { 
	      key : key , 
		  reported : (true/false),
		  cancelled : (true/false),
		  emergencyCalled : (true/false),
		  location : {
		  				lat : lat,
		  				lng: lng
		  			 }
		}
*/
var incidentReportedMap = [];

// Get the index page (only option)
app.get('/', function(req, res){
	res.send("Everest server is initialized and I am Optimus Prime!!");
});


/*
data object

{
	"uuid" "123456789abcdefgh"
}
*/

//Records the device uuid and waits for TIMEOUT period to call for emergency services
app.post('/everest/incident/report', function(req, res){
	var data = req.body;
	if(data && data.uuid){
		console.log("POST request received for /everest/incident/report");
		console.log("For Device(UUID) : " + data.uuid);

		var key = data.uuid;

		var incident = {
			uuid : key,
			reported : true,
			cancelled : false,
			emergencyCalled : false,
			time : new Date().toLocaleString(),
			location : {
				lat : data.lat,
				lng : data.lng
			}
		};

		//incidentReportedMap.set(key, incident);
		incidentReportedMap[key] = incident;
		console.log("Incident reported map");
		console.log(incidentReportedMap);
		console.log(paddingText);

		//Start the timer
		setTimeout(function(){
		  //After 30 seconds, check if cancelled. If not, call for SOS help
		  var incident = incidentReportedMap[key];//incidentReportedMap.get(key);
		  if(incident && incident.reported === true && incident.cancelled === false){
		  		callEmergencyServices(incident);
		  		incident.emergencyCalled = true;
		  		incidentReportedMap[key]= incident;
		  		//incidentReportedMap.set(key , incident);
		  }
		  console.log(incidentReportedMap);
          
        }, TIMEOUT);

		res.send("Incident reported... Board UUID " + incident.uuid);
	}
});

//False accident reports are cancelled
app.post('/everest/incident/cancel', function(req, res){
	//Start the timer 
	//After 30 seconds, call for SOS help
	var data = req.body;
	if(data && data.uuid){
		console.log("POST request received for /everest/incident/cancel");
		console.log("UUID  : %s ", data.uuid);

		var key = data.uuid;
		var incident = incidentReportedMap[key] //incidentReportedMap.get(key);
		if(incident && incident.reported === true && incident.cancelled === false){
			
				incident.cancelled = true;
				console.log("Cancelling the request...");
				incidentReportedMap[key] = incident;
				//incidentReportedMap.set(key , incident);
				console.log("Incident reported map");

				if(incident.emergencyCalled && incident.emergencyCalled === true){
					var falseTweetReport = "FALSE ALARM reported|Device(UUID):" + incident.uuid +" Loc(" + incident.location.lat + "," + incident.location.lng + ") " + incident.time;
					var status  = {
									status : falseTweetReport
								};
					postOnTwitter(status);
				}	

				console.log(incidentReportedMap);
				console.log(paddingText);
			
			res.send("Cancelled the emergency request for Device(UUID)=" + incident.uuid);
		}else{
			res.send('No incident found or might have been cancelled already. Failed to cancel the request for Device(UUID) ' + incident.uuid);
		}
		
	}
});

//Accident reports are acknowledged by nearby users before TIMEOUT
app.post('/everest/incident/accept', function(req, res){
	
	//COnfirm the accident incident
	var data = req.body;
	if(data && data.uuid){
		console.log("POST request received for /everest/incident/accept");
		console.log("For Device(UUID) " + data.uuid);
		
		var key = data.uuid;
		var incident = incidentReportedMap[key]; //incidentReportedMap.get(key);
		var reported = false;
		if(incident && incident.reported === true && incident.cancelled === false) {
			reported = true;
			console.log("Accepting the accident report incident and calling for emergency services");
			if(incident.emergencyCalled === false){
				incident.emergencyCalled = true;
				callEmergencyServices(incident);
				incidentReportedMap[key] = incident;
				//incidentReportedMap.set(key , incident);
				console.log(incidentReportedMap);
			}
		}

		console.log("Incident reported map");
		console.log(incidentReportedMap);
		console.log(paddingText);

		if(reported){
			res.send(true);
		}else{
			res.send(false);
		}
	}
});

//Call for emergency services. In our case, it's a post on twitter
function callEmergencyServices(incident){
	console.log("Calling emergency services Device(UUID) : %s", incident.uuid);
	console.log("Posting on Twitter");
	//Implement Twitter API...
	var status  = {
		status : 'Accident reported|Device(UUID):' + incident.uuid + " Loc(" + incident.location.lat + "," + incident.location.lng + ") " + incident.time
	};
	postOnTwitter(status);
}

//Tweet the status on Twitter
/*
	status = {
		status : "The Prince who was promised - Jon Snow!"
	}
*/
function postOnTwitter(status){

	twitterClient.post('statuses/update', status,  function(error, tweet, response) {
  		if(error){
  			console.log(error);
  		}

  		console.log("Tweet posted succsessfully " + tweet);  // Tweet body. 
  		//console.log(response);  // Raw response object. 
	});

	//Twitter Post Promise
	//var twitterPost = twitterClient.post('statuses/update', status);

	/*twitterPost.then(function(data) {
		console.log("Tweet has been posted succsessfully");
		console.log(paddingText);
	}).catch(function(error){
		console.log("Error while posting tweet on Twitter")
		console.log(JSON.stringify(error));
	});*/
}


//CREATE A NEW SERVER
var server  = http.createServer(app);
server.listen(PORT_NO, function () {
	console.log("Server listening at port " + server.address().port);
});
