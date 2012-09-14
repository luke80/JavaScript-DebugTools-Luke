/*
Independent Study Logger
*/
var IsLog = {
	LOG_ON: false, // if LOG_ON = false log messages are logged, and not otherwise

	/*
	Initializes the logger
	*/
	init: function() {

	},

	/*
	Logs the message to the browser console.
	*/
	log: function (msg) {
		if(this.LOG_ON)
			console.log(msg);
	}
};
