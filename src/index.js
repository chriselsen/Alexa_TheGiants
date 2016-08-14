/**
 * App ID for the skill
 */
var APP_ID = undefined; //replace with "amzn1.echo-sdk-ams.app.[your-unique-value-here]";

/**
 * The AlexaSkill prototype and helper functions
 */
var AlexaSkill = require('./AlexaSkill');
var moment = require('moment');

var TheGiants = function () {
    AlexaSkill.call(this, APP_ID);
};

// Extend AlexaSkill
TheGiants.prototype = Object.create(AlexaSkill.prototype);
TheGiants.prototype.constructor = TheGiants;

TheGiants.prototype.eventHandlers.onSessionStarted = function (sessionStartedRequest, session) {
    console.log("TheGiants onSessionStarted requestId: " + sessionStartedRequest.requestId
        + ", sessionId: " + session.sessionId);
    // any initialization logic goes here
};

TheGiants.prototype.eventHandlers.onLaunch = function (launchRequest, session, response) {
    console.log("TheGiants onLaunch requestId: " + launchRequest.requestId + ", sessionId: " + session.sessionId);
	response.ask("You can ask me if the Giants are playing today, tomorrow, or on any other day!", "You can ask me if the Giants are playing today, tomorrow, or on any other day");
};

TheGiants.prototype.eventHandlers.onSessionEnded = function (sessionEndedRequest, session) {
    console.log("TheGiants onSessionEnded requestId: " + sessionEndedRequest.requestId
        + ", sessionId: " + session.sessionId);
    // any cleanup logic goes here
};

TheGiants.prototype.intentHandlers = {
    "TheGiantsDateIntent": function (intent, session, response) {
		var date = new Date();
		var today = (date.getFullYear() + "-" + ("0" + (date.getMonth() + 1)).slice(-2) + "-" + ("0" + date.getDate()).slice(-2));
		if (intent.slots.date.value) { var intentDate = intent.slots.date.value } else { var intentDate = today } 
		if (moment(intentDate, "YYYY-MM-DD", true).isValid()) { 
			var game = isThereGame(intentDate);
			var dateDifference = (moment(intentDate).diff(moment(today), 'days'));
			switch (dateDifference) {
				case 0:
					var responseDate = "today";
					break;
				case 1:
					var responseDate = "tomorrow";
					break;
				case 2:
				case 3:
				case 4:
				case 5:
				case 6:
					var responseDate = "on " + moment(intentDate).format("dddd");
					break;
				default:
					var responseDate = "on " + intentDate;
			}
			
			if (game[0]==''){
				response.tell("There is no Giants game " + responseDate);
			} else {
				response.tell("The Giants are playing the " + game[1] + " at " + game[0] + " at " + game[2] + " " + responseDate);
			}
		} else {
			response.tell("Sorry, I didn't understand that date.");
		}
    },
   "TheGiantsAtHomeIntent": function (intent, session, response) {
		var date = new Date();
		var today = (date.getFullYear() + "-" + ("0" + (date.getMonth() + 1)).slice(-2) + "-" + ("0" + date.getDate()).slice(-2));
		if (intent.slots.date.value) { var intentDate = intent.slots.date.value } else { var intentDate = today } 
		if (moment(intentDate, "YYYY-MM-DD", true).isValid()) { 
			var game = isThereGame(intentDate);
			var dateDifference = (moment(intentDate).diff(moment(today), 'days'));
			switch (dateDifference) {
				case 0:
					var responseDate = "today";
					break;
				case 1:
					var responseDate = "tomorrow";
					break;
				case 2:
				case 3:
				case 4:
				case 5:
				case 6:
					var responseDate = "on " + moment(intentDate).format("dddd");
					break;
				default:
					var responseDate = "on " + intentDate;
			}
			if (game[0]==''){
				response.tell("No, there is no Giants game " + responseDate);
			} else {
				if (game[3]) {
					response.tell("Yes, the Giants are playing the " + game[1] + " at " + game[2] + " at home " + responseDate);
				} else {
					response.tell("No, the Giants are playing the " + game[1] + " at " + game[0] + " at " + game[2] + " " + responseDate);
				}
			}
		} else {
			response.tell("Sorry, I didn't understand that date.");
		}
    },	
    "AMAZON.HelpIntent": function (intent, session, response) {
        response.ask("You can ask me if the Giants are playing today, tomorrow, or on any other day!", "You can ask me if the Giants are playing today, tomorrow, or on any other day");
    }
};

function isThereGame(gameDate) {
	var requestedDate = new Date(gameDate);
	var searchDate = ("0" + (requestedDate.getMonth() + 1)).slice(-2) + "/" + ("0" + requestedDate.getDate()).slice(-2) + "/" + requestedDate.getFullYear();
	var fs = require('fs');
	var importedJSON = JSON.parse(fs.readFileSync('giants_schedule.json', 'utf8'));

	var arrayFound = importedJSON.games.filter(function(item) {
			return item.date == searchDate;
	});
	if (arrayFound[0]) {
		var gameLocation = arrayFound[0].location;
		var gameOpponent = arrayFound[0].opponent;
		var gameTime = arrayFound[0].time;
		if (gameLocation=="AT&T Park"){
			var gameHome = true;
		} else {
			var gameHome = false;
		}
	} else { 
		var gameLocation = '';
		var gameOpponent = '';
		var gameTime = '';
		var gameHome = '';
	} 
		
	return [gameLocation, gameOpponent, gameTime, gameHome]
} 

// Create the handler that responds to the Alexa Request.
exports.handler = function (event, context) {
    // Create an instance of the TheGiants skill.
    var helloWorld = new TheGiants();
    helloWorld.execute(event, context);
};

