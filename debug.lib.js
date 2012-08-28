// JavaScript Document

function Logger(type){

};

Logger.prototype.CONSOLE_ID = "logger_console";
Logger.prototype.BASIC_MSG_CSS = "padding: 0; margin: 0;"

/*
Creates the console where debug information is logged
*/
Logger.prototype.createConsole = function(msg){
	// Create the html for the console
	var console = document.createElement("div"); 	
	var consoleCss = 'float: right; \
			width: 100%; \
			height: 100px; \
			overflow: auto; \
			border-style: dashed; \
			background-color: #C0C0C0; opacity:0.6; filter:alpha(opacity=60);';
	console.setAttribute("id", this.CONSOLE_ID);
	console.setAttribute("style", consoleCss);

	var testMsg = document.createTextNode("Mmmm.... good! Campbell's Soup!");
	console.appendChild(testMsg);
	document.body.appendChild(console);
};

/*
Logs a message to the console of the level info
*/
Logger.prototype.info = function(msg){
	// Create the new text message
	var infoMsg = document.createElement("p"); 
	infoMsg.appendChild(document.createTextNode("INFO: " + msg));

	var msgCss = this.BASIC_MSG_CSS + " color:green";
	infoMsg.setAttribute("style", msgCss); 

	// Add it to the console
	document.getElementById(this.CONSOLE_ID).appendChild(infoMsg);
};

/*
Logs a message to the console of the level debug
*/
Logger.prototype.debug = function(msg){
	// Create the new text message
	var infoMsg = document.createElement("p"); 
	infoMsg.appendChild(document.createTextNode("DEBUG: " + msg));

	var msgCss = this.BASIC_MSG_CSS + " color:red";
	infoMsg.setAttribute("style", msgCss); 

	// Add it to the console
	document.getElementById(this.CONSOLE_ID).appendChild(infoMsg);
};
