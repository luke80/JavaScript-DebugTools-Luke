// JavaScript Document

function Logger(type){
	this.DRAGGING = false;
};

Logger.prototype.CONSOLE_ID = "logger_console";
Logger.prototype.CONSOLE_SCREEN_ID = "console_screen";
Logger.prototype.BASIC_MSG_CSS = "padding: 0; margin: 0;";

/*
Creates the console where debug information is logged
*/
Logger.prototype.createConsole = function(msg){
	// Create the console wrapper for the console 
	var consoleWrapper = document.createElement("div"); 	
	consoleWrapper.setAttribute("id", this.CONSOLE_ID);
	var consoleWrapperCss = 'width: 50%; \
			left: 0; \
			top: 0; \
			position: absolute;\
			z-index: 100;\
			opacity:0.6; filter:alpha(opacity=60);\
			background-color: #C0C0C0;';
	consoleWrapper.setAttribute("style", consoleWrapperCss);

	// Create the bar for dragging the console
	var consoleDragBar = document.createElement("div");
	consoleDragBar.innerHTML = "Console:"; 
	consoleDragBar.setAttribute("style", "opacity:1.0; filter:alpha(opacity=100);");
	consoleDragBar.addEventListener("click", this.toggleDrag);
	consoleDragBar.addEventListener("mousemove", this.drag);
	
	// Create the screen portion
	var consoleScreen = document.createElement("div");
	consoleScreen.setAttribute("id", this.CONSOLE_SCREEN_ID);
	consoleScreen.setAttribute("style", "overflow: auto; border-style: dashed; float: none; height: 100px;");

	// Put it all together
	consoleWrapper.appendChild(consoleDragBar);
	consoleWrapper.appendChild(consoleScreen);

	document.body.appendChild(consoleWrapper);
};

/*
Toggles the drag state.
*/
Logger.prototype.toggleDrag = function(){
	this.DRAGGING = !this.DRAGGING;
};

/*
Handles how the console is dragged.
*/
Logger.prototype.drag = function(event){
	if(this.DRAGGING)
	{
		alert(this.CONSOLE_ID);
		document.getElementById(this.CONSOLE_ID).style.left = event.pageX;
		document.getElementById(this.CONSOLE_ID).style.top = event.pageY;
		alert("Here!");
	}
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
	document.getElementById(this.CONSOLE_SCREEN_ID).appendChild(infoMsg);
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
	document.getElementById(this.CONSOLE_SCREEN_ID).appendChild(infoMsg);
};
