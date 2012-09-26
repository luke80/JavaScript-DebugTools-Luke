/*
Independent Study Logger is a wrapper for the browswer's logging
functions.  It is unique from the browser's logging in that it 
attempts to automatically turns off if it is a non-debugging environment
(i.e. not on localhost, production server, or test server).
*/
var devServersRegEx = /(test|dev|localhost|prod)/i;
var IsLog = {
	/*
	Flag that determines if the logger is active or not.	
	If LOG_ON = false log messages are logged, and not otherwise.
	Note that log defaults to on if the url contains certain keywords
	that indicate the site is on a testing server.
	*/
	_LOG_ON: devServersRegEx.test(window.location.host),

	/*
	Turns logging on.
	*/
	on: function() {
		this._LOG_ON = true;
	},

	/*
	Turns logging off.
	*/
	off: function() {
		this._LOG_ON = false;
	},

	/*
	Logs the message to the browser console. The "c" stands for
	console.
	*/
	c: function (msg) {
		if(this._LOG_ON)
			console.log(msg);
	}
};

/*
This assertion code is from: http://aymanh.com/9-javascript-tips-you-may-not-know#assertion
*/

function AssertException(message) { this.message = message; }
AssertException.prototype.toString = function () {
  return 'AssertException: ' + this.message;
}

function assert(exp, message) {
  if (!exp) {
    throw new AssertException(message);
  }
}
