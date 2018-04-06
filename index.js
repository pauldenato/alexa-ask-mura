// Copy and paste this into the Lambda Function Console
// console.log('Function Started...');
// Using http it should be https you can require that if necessary. with the following.
//const https = require('https');
const http = require('http');
const alexaSDK = require('alexa-sdk');

// These are created in Mura - for the Basic Auth in the Webservices Section
// I created a User -- Amazon Alexa
var key = '{}';
var secret = '{}';
var apiAuth = new Buffer(key + ':' + secret).toString('base64');

var options = {
	host: '{your domain}',
	port: 80,
	path: '/index.cfm/_api/rest/v1/alexa/askmuraservice/', // setting this later, you can switch this in each call set, get, etc
	method: 'POST'
};

const instructions = 'Welcome to the {Your Skill Name} Skill!<break strength="medium" /> What awesomeness do you have for me today?';

const handlers = {

		/**
			* Triggered when the user says "Alexa, open Mura.
		**/
		'LaunchRequest' () {
			this.emit(':ask', instructions);
		},

		/**
			* Adds a recipe to the current user's saved Ideas.
			* Slots: IdeaName, IdeaContent, IdeaRating
		**/
		'AddIdeaIntent' () {
			const {userId} = this.event.session.user;
			const {slots} = this.event.request.intent;

			// prompt for slot values and request a confirmation for each

			// IdeaName
			if (!slots.IdeaName.value) {
				const slotToElicit = 'IdeaName';
				const speechOutput = 'What is the name of this idea?';
				const repromptSpeech = 'Please tell me what you would like to call this idea.';
				return this.emit(':elicitSlot', slotToElicit, speechOutput, repromptSpeech);

			} else if (slots.IdeaName.confirmationStatus !== 'CONFIRMED') {

				if (slots.IdeaName.confirmationStatus !== 'DENIED') {
					// slot status: unconfirmed
					const slotToConfirm = 'IdeaName';
					const speechOutput = `The name of your idea is ${slots.IdeaName.value}, correct?`;
					const repromptSpeech = speechOutput;
					return this.emit(':confirmSlot', slotToConfirm, speechOutput, repromptSpeech);
				}

				// slot status: denied -> reprompt for slot data
				const slotToElicit = 'IdeaName';
				const speechOutput = 'What is the name of the idea you would like to add?';
				const repromptSpeech = 'Please tell me what you would like to call this idea.';
				return this.emit(':elicitSlot', slotToElicit, speechOutput, repromptSpeech);
			}

			// IdeaContent
			if (!slots.IdeaContent.value) {
				const slotToElicit = 'IdeaContent';
				const speechOutput = 'So what is your idea?';
				const repromptSpeech = 'Please give me the content for this idea.';
				return this.emit(':elicitSlot', slotToElicit, speechOutput, repromptSpeech);

			} else if (slots.IdeaContent.confirmationStatus !== 'CONFIRMED') {

				if (slots.IdeaContent.confirmationStatus !== 'DENIED') {
					// slot status: unconfirmed
					const slotToConfirm = 'IdeaContent';
					const speechOutput = `The idea is ${slots.IdeaContent.value}, correct?`;
					const repromptSpeech = speechOutput;
					return this.emit(':confirmSlot', slotToConfirm, speechOutput, repromptSpeech);
				}

				// slot status: denied -> reprompt for slot data
				const slotToElicit = 'IdeaContent';
				const speechOutput = 'So what is your idea?';
				const repromptSpeech = 'Please give me the content for this idea.';
				return this.emit(':elicitSlot', slotToElicit, speechOutput, repromptSpeech);
			}

			// IdeaRating -- crazy, great, ok
			if (!slots.IdeaRating.value) {
				const slotToElicit = 'IdeaRating';
				const speechOutput = 'Is this a great, crazy or just ok idea?';
				const repromptSpeech = 'Is this a great, crazy or just ok idea?';
				return this.emit(':elicitSlot', slotToElicit, speechOutput, repromptSpeech);

			} else if (slots.IdeaRating.confirmationStatus !== 'CONFIRMED') {

				if (slots.IdeaRating.confirmationStatus !== 'DENIED' && (slots.IdeaRating.value === 'great' || slots.IdeaRating.value === 'crazy' || slots.IdeaRating.value === 'OK')) {
					// slot status: unconfirmed
					const slotToConfirm = 'IdeaRating';
					const speechOutput = `This is a ${slots.IdeaRating.value} idea, correct?`;
					const repromptSpeech = speechOutput;
					return this.emit(':confirmSlot', slotToConfirm, speechOutput, repromptSpeech);
				}

				// slot status: denied -> reprompt for slot data
				const slotToElicit = 'IdeaRating';
				const speechOutput = 'Is this a great, crazy or just ok idea?';
				const repromptSpeech = 'Is this a great, crazy or just ok idea?';
				return this.emit(':elicitSlot', slotToElicit, speechOutput, repromptSpeech);
			}

			// all slot values received and confirmed, now add the record to Mura

			const iname = slots.IdeaName.value;
			const icontent = slots.IdeaContent.value;
			const irating = slots.IdeaRating.value.toLowerCase();
			const muraParams = {
				"message": {
					"title": iname,
					"remoteid": userId,
					"contentbody": icontent,
					"irating": irating
				}
			};

			// console.log('Attempting to add idea', JSON.stringify(muraParams));
			// console.log('Check Data', JSON.stringify(checkIfIdeaExistsParams.message));

			// method -- resetting the path from above to point to this specific intents bean in Mura
			var servicenamesetter = '/index.cfm/_api/rest/v1/alexa/askmuraservice/addAnIdea/';
			// append path with method
			options.path = servicenamesetter;
			// append body to post call
			var myNewIdea = JSON.stringify(muraParams);

			options.headers = {
				"Cache-Control": "no-cache",
				'Content-Type': 'application/json',
				'Authorization': 'Basic ' + apiAuth,
				'Content-Length': Buffer.byteLength(myNewIdea)
			};

			setAnIdea(options, myNewIdea).then((json) => {
				console.log('JSON: ' + json);
				var md = JSON.parse(json);
				var isMuraIdeaAdded = "";
				isMuraIdeaAdded = md.data;
				console.log(isMuraIdeaAdded.added);

				//Anything other than true is considered an error.\
		if (isMuraIdeaAdded.added) {

				const successMessage = `Idea ${iname} added, and may I say<break strength="medium" />It's wonderful!`;
				// this.emit(':tell', `Idea ${iname} added, and may I say<break strength="medium" />It's wonderful!`);
				this.emit(':tellWithCard', successMessage, iname, icontent);
				console.log('Add item succeeded', json);

			} else {

				const errorMsg = `You already had the ${iname} idea. Great Idea by the way.`;
				// this.emit(':tell', errorMsg);
				this.emit(':tellWithCard', errorMsg, iname, icontent);
				console.error(errorMsg);

			}}).catch((err) => {

			console.error('ERROR: ' + err);

		});

	},

	// Any unhandeled error
	'Unhandled' : function() {
		const speechOutput = 'It looks like there was an issue.';
		const repromptSpeech = 'It looks like there was an issue.';
		this.emit(':ask', speechOutput, repromptSpeech);
	},

	'AMAZON.HelpIntent' () {
		const speechOutput = instructions;
		const reprompt = instructions;
		this.emit(':ask', speechOutput, reprompt);
	},

	'AMAZON.CancelIntent' () {
		this.emit(':tell', 'Goodbye!');
	},

	'AMAZON.StopIntent' () {
		this.emit(':tell', 'Goodbye!');
	}
};

exports.handler = function handler(event, context, callback) {
	context.callbackWaitsForEmptyEventLoop = false;
	// console.log('Received event:', JSON.stringify(event, null, 2));
	// console.log('Context event:', JSON.stringify(context));
	const alexa = alexaSDK.handler(event, context, callback);
	var appId = '{Add your Alexa Skill ID}';
	alexa.appId = appId;
	alexa.registerHandlers(handlers);
	alexa.execute();
};

// Request Promise Call
const setAnIdea = function(options, postData) {
	// return new pending promise
	return new Promise((resolve, reject) => {

		const request = http.request((options), (response) => {
			// handle http errors
			if (response.statusCode < 200 || response.statusCode > 299) {
				reject(new Error('Failed to load page, status code: ' + response.statusCode));
			}
			// temporary data holder
			const body = [];
			// on every content chunk, push it to the data array
			response.on('data', (chunk) => body.push(chunk));
			// we are done, resolve promise with those joined chunks
			response.on('end', () => resolve(body.join('')));
		});

		request.write(postData);
		request.end();
		// handle connection errors of the request
		request.on('error', (err) => reject(err));

	});
};
