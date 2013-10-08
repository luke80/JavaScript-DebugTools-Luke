/*
 * Copyright (C) 2013 Independent Study - BYU ( Luke Rebarchik <luke.rebarchik@byu.edu> )
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/*
Independent Study Logger is a wrapper for the browser's logging
functions.  It is unique from the browser's logging in that it 
attempts to automatically turns off if it is a non-debugging environment
(i.e. not on localhost, production server, or test server).
*/

/*
	*** This project requires jQuery	***
*/
var jQueryVersion = "1.10.2";		//	It has been tested on this version, update as required.
if(typeof jQuery == "undefined") {
	(function() {
    var jqLoad = document.createElement('script'); jqLoad.type = 'text/javascript'; jqLoad.async = true;
    jqLoad.src = ('https:' == document.location.protocol ? 'https://' : 'http://') + 'ajax.googleapis.com/ajax/libs/jquery/'+jQueryVersion+'/jquery.min.js';
    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(jqLoad, s);
  })();
}

//	There are some hosts where we want the debug to run. All others it will be silenced.
//		Note: these patterns should match part of the hostname where you do your development. If you don't want to turn the logging of for non-development, simply add a pattern that will always be found.
var devServersRegEx = /(test|dev|localhost|prod|^$)/i;
var IsLog = {
	/*
	Flag that determines if the logger is active or not.	
	If LOG_ON = false log messages are logged, and not otherwise.
	Note that log defaults to on if the url contains certain keywords
	that indicate the site is on a testing server.
	*/
	_LOG_ON: devServersRegEx.test(window.location.host),

	/*
	The prefix is shown before the debug output. This can optionally be turned off.
	*/	
	_LOG_PREFIX_ON: true,
	_LOG_PREFIX: "",
	_LOG_CALLERLOOP_ON: false,
	_LOG_CALLERARGS_ON: false,
	_LOG_CALLERLOOP_STACKTRACE_ON: false,
	
	/*
	Occasionally showing the timing of logged events is important. This can optionally be turned on.
	*/
	_TIMER: new Date(),
	_TIMER_LOG: false,

	/*
	Occasionally you want the debug output deverted to the webpage itself (such as debugging mobile?)
	In these cases you need to turn this on and provide an element to populate with the debug output.
	If none is provided, it will create one.
	*/
	_LOG_HTML_ON: false,
	_LOG_HTML_ELEMENT: null,
	_ADDED_BUTTON: false,
	
	/*
	This method turns logging on.
	*/
	"on": function() {
		this._LOG_ON = true;
	},

	/*
	This method turns logging off.
	*/
	"off": function() {
		this._LOG_ON = false;
	},

	/*
	This method turns timer output on.
	*/
	"timerOn": function() {
		this._TIMER_LOG = true;
	},
	/*
	This method turns timer output off.
	*/
	"timerOff": function() {
		this._TIMER_LOG = false;
	},
	/*
	This method resets timer.
	*/
	"timerReset": function() {
		this._TIMER = new Date();
	},

	/*
	This method turns timer output on.
	*/
	"prefixOn": function() {
		this._LOG_PREFIX_ON = true;
	},
	/*
	This method turns timer output off.
	*/
	"prefixOff": function() {
		this._LOG_PREFIX_ON = false;
	},
	/*
	This method sets the log prefix (overrides the automatic detection).
	*/
	"prefix": function(prefix) {
		if(typeof prefix == "string")
			this._LOG_PREFIX = prefix;
		else
			this.o("IsLog Error: You can't set the prefix to a non-string. (You attempted to set it to a \""+typeof(prefix)+"\")");
	},
	/*
	This method turns caller output on.
	*/
	"findCallerOn": function() {
		this._LOG_CALLERLOOP_ON = true;
	},
	/*
	This method turns caller output off.
	*/

	"findCallerOff": function() {
		this._LOG_CALLERLOOP_ON = false;
	},
	/*
	This method turns caller output on.
	*/
	"showCallerArgsOn": function() {
		this._LOG_CALLERARGS_ON = true;
	},
	/*
	This method turns caller output off.
	*/
	"showCallerArgsOff": function() {
		this._LOG_CALLERARGS_ON = false;
	},
	/*
	This method turns stacktrace output on.
	*/
	"stackTraceOn": function() {
		this._LOG_CALLERLOOP_STACKTRACE_ON = true;
	},
	/*
	This method turns stacktrace output off.
	*/
	"stackTraceOff": function() {
		this._LOG_CALLERLOOP_STACKTRACE_ON = false;
	},

	/*
	This method turns HTML output on.
	*/
	"htmlOn": function() {
		this._LOG_HTML_ON = true;
		if(this._LOG_HTML_ELEMENT == null) this.htmlElement();
		if(this._ADDED_BUTTON == false)
			this.addShowHTMLLogButton();
		$("#"+this._LOG_HTML_ELEMENT_ID).css("display","block");
	},
	/*
	This method turns HTML output off.
	*/
	"htmlOff": function() {
		this._LOG_HTML_ON = false;
	},
	/*
	This method sets the HTML output element.
	*/
	"htmlElement": function(id) {
		//	First detect if there isn't an id provided.
		if(typeof id == "undefined" || id == "undefined") id = "default-debug-log-id";
		//	If an element wasn't provided, hopefully it is an ID (string).
		if(typeof id == "string") {
			//	If the element is found, then set it.
			if($("#"+id).length > 0)
				this._LOG_HTML_ELEMENT = $("#"+id);
			//	If not, then we have some work to do...
			else {
				this.o("IsLog: debug element HTML output element not found. Creating one and setting it.");
				this._LOG_HTML_ELEMENT = $("<div class=\"debug-log\"></div>");
				$(this._LOG_HTML_ELEMENT).attr("id", id);	//	We already know it's a string, so setting the id here is safe.
				if($("body").length > 0) {
					this.o("Found body");
					//	No need to make a body.. it's already there!
					$($("body")[0]).append(this._LOG_HTML_ELEMENT);
				} else {
					//	Sometimes (often, actually) the errors are appearing before the body is loaded. In this case we need to delay the HTML logging until there is someplace to put it.
					this.o("IsLog: putting off display of the output HTML element until ready event fires.");
					$(document).ready(function() {	//	On ready for the document, add the back-log of debug messages.
						if(IsLog._LOG_HTML_ELEMENT == null) {
							IsLog.o("IsLog: resetting log element.");
							IsLog._LOG_HTML_ELEMENT = $("<div class=\"debug-log\"></div>");
						}
						if($($("body")[0]).find("#"+IsLog._LOG_HTML_ELEMENT_ID).length == 0)	//	The output element may not be in the body already, if it's not - add it.
							$($("body")[0]).append(IsLog._LOG_HTML_ELEMENT);
						else
							$("#"+IsLog._LOG_HTML_ELEMENT_ID).append(IsLog._LOG_HTML_ELEMENT);	//	If the element is already found in the body, append the new content.
						//delete IsLog._LOG_HTML_ELEMENT_ID;	//	I played around with doing some garbage collection on this string. It seems unnecessary, so I took it out.
					});
				}
			}
		} else if(!id) {
			//	If there is no id, I thought about throwing an error, but in the first statement of this method I removed that possibility, so there should never be a null value.
		} else if(id instanceof HTMLElement) {
			//	if the "id" is an element, then it needs to be the HTML element!
			this._LOG_HTML_ELEMENT = id;
		}
		//	Now that we have all the assumptions taken care of (most of them anyway) we can continue with the formatting for the HTML output.
		$(this._LOG_HTML_ELEMENT).attr("id", id);
		this._LOG_HTML_ELEMENT_ID = id;	//	The id should match, so that later on we can use it later.
		/*
		The following are some style choices I made for my own taste. Changes here are encouraged to fit your sensibilities.
		*/
		$(this._LOG_HTML_ELEMENT).css("font-size", "10pt");
		$(this._LOG_HTML_ELEMENT).css("background-color", "#000");
		$(this._LOG_HTML_ELEMENT).css("color", "#FFF");
		$(this._LOG_HTML_ELEMENT).css("overflow", "scroll");
		$(this._LOG_HTML_ELEMENT).css("position", "fixed");
		$(this._LOG_HTML_ELEMENT).css("width", "100%");
		$(this._LOG_HTML_ELEMENT).css("height", "15em");
		$(this._LOG_HTML_ELEMENT).css("bottom", "0");
		$(this._LOG_HTML_ELEMENT).css("left", "0");
		$(this._LOG_HTML_ELEMENT).css("border-top", "groove");
		//	I thought it would make sense to let this element be easily hidable, however this implementation isn't ideal for mobile device debugging.
		//		For the mobile debug needs I've entertained the idea of detecting mobile and binding "touch" or something instead of "right click"
		$(this._LOG_HTML_ELEMENT).bind("contextmenu", function() { $(IsLog._LOG_HTML_ELEMENT).css("display","none"); return false; } );
		//	If the log isn't on, simply hide the element. Sloppy, but effective.
		if(!this._LOG_HTML_ON)
			$(this._LOG_HTML_ELEMENT).css("display","none");
		//	For some reason I decided to return the element. I'm no longer sure why. Perhaps this can be skipped.
		return this._LOG_HTML_ELEMENT;
	},


	/*
	Logs the message to the browser console. The "o" stands for output.
	*/
	"o": function (msg) {
		//	The log on detection makes sense (I hope) but for some versions of IE, console is not defined when the browser isn't showing it (it isn't open). For that reason we're making sure it's defined.
		if(this._LOG_ON && typeof console != "undefined") {
			//	Just because IE makes my head hurt sometimes, I'm also checking to make sure that console has the "log" method, in case it doesn't. We don't want our debug to require debug.
			if(typeof console.log != "undefined") {
				//	The prefix issue can be complicated.
				//		The this.o.caller lets you know which function called the log (that way it can show you in the log which function called the log)
				var prefix = (this._LOG_PREFIX_ON)?((this._LOG_PREFIX != "")?this._LOG_PREFIX:((this.o.caller != null)?this.o.caller:((arguments.callee.caller != null)?arguments.callee.caller:"top"))):"";
				//	If the prefix has been set by the .prefix() method, it will be a string. Otherwise it should have been retrieved from this.o.caller or arguments.callee.caller or "top"
				if(typeof prefix != "string") {
					//	There is a different process to generating the prefix if we're meant to do a stack trace...
					//		First comes the stack tracing logic.
					if(this._LOG_CALLERLOOP_STACKTRACE_ON && this._LOG_CALLERLOOP_ON) {
						//	Can't get anywhere if there is no prefix variable holding the calling function at this point. The above shorthand for creating the prefix should have given us the calling function stored in "prefix"
						if(prefix) {
							var preprefix = ((prefix.name)?prefix.name:"Unnamed Caller:"+this._getCallerHash(prefix))+((this._LOG_CALLERARGS_ON)?this._getCallerArgs(prefix.arguments):"");
							//	Since this._loop could easily become problematic (infinite loop, anyone?) lets impose a limit.
							var maxLoops = 64;
							var loopCounter = 0;
							//	Now we gather all (or 64 of them) the caller names (and optionally their parameters)
							while(prefix.caller && loopCounter < maxLoops) {
								preprefix += " <- "+((prefix.caller.name)?prefix.caller.name:"Unnamed Caller:"+this._getCallerHash(prefix.caller))+((this._LOG_CALLERARGS_ON)?this._getCallerArgs(prefix.caller.arguments):"")
								prefix = prefix.caller;
								loopCounter++;
							}
							prefix = preprefix;
						} else {
							this.stackTraceOff();
							this.o("IsLog: Notice; Stack trace cannot be performed, lack of caller identity.");
							this.stackTraceOn();
						}
					//	Now for the standard - non-stack tracing code...
					} else {
						//	Since we're only looking for the first named caller, we may not have to loop at all.
						var loopForCaller = false;
						if(prefix.name)
							prefix = prefix.name+((this._LOG_CALLERARGS_ON)?this._getCallerArgs(prefix.arguments):"");
						else if (prefix['caller']) {
							if(prefix['caller']['name'])
								prefix = ""+prefix['caller']['name']+((this._LOG_CALLERARGS_ON)?this._getCallerArgs(prefix['caller']['arguments']):"");
							else
								loopForCaller = true;
						} else {
							loopForCaller = true;
						}
						//	If we still need to, we loop here for the caller.
						if((loopForCaller && this._LOG_CALLERLOOP_ON)) {
							if(prefix.caller) {
								var preprefix = "";
								//	Again, this._loop could get infinite, and we're not super-obsessed with detail since we're not stack tracing, so 10 loops should do our needs well.
								var maxLoops = 10;
								var loopCounter = 0;
								while(prefix.caller && loopCounter < maxLoops) {
									preprefix += ((prefix.caller.name)?prefix.caller.name+" ":"Unnamed Caller:"+this._getCallerHash(prefix.caller))+((this._LOG_CALLERARGS_ON)?this._getCallerArgs(prefix.caller.arguments):"");
									prefix = prefix.caller;
									loopCounter++;
								}
								prefix = preprefix.trim();
							}
							//	If all else fails, we are either at the top, or so close to top that it shouldn't matter.
							if(prefix == "")
								prefix = "top";
						}
					}
				}
				//	If all else fails, we are either at the top, or so close to top that it shouldn't matter.
				if(typeof prefix != "string") {
					prefix = "top";
				}
				//	Occasionally the prefix contains newline characters. These make it difficult to interpret the log. I remove them.
				if(prefix.indexOf(/[\r\n]/) > -1) {
					prefix = prefix.substr(prefix.indexOf(/\S\s*\(/, prefix.indexOf("(")));
					if(prefix == "function") prefix = "anonymous";
				}
				//	To differentiate the prefix from the debug output I place them into square braces.
				if(prefix != "") prefix = "["+prefix+"] "

				if(this._TIMER_LOG) {
					//	This is meant to calculate the time since page-load.
					var difference = (parseFloat( parseInt( (new Date).valueOf() ) - parseInt( this._TIMER.valueOf() ) ) / 1000);
				}
				//	If the "message" is a string, then adding the prefix won't break it.
				//		First, if the timer is on put that first.
				if(typeof msg == "string" && this._TIMER_LOG) {
					//	The time is added with a trailing parenthesis ")"
					this._l(difference+") "+prefix+msg);
				//		Now, if the message is a string, output it.
				} else if(typeof msg == "string") {
					this._l(prefix+msg);
				//		In this last case, the output is an object of some sort. First we output the "prefix" data, then the object. Taking 2 lines.
				} else {
					try {
						msg = JSON.stringify(msg);
					} catch (err) {
						IsLog.o("log error: can't parse object (too large; \""+err.message+"\")");
					}
					if(this._TIMER_LOG) {
						this._l(difference+") "+prefix);
					} else {
						this._l(prefix);
					}
					// Now output the object.
					this._l(msg);
				}
			}
		} else if(this._LOG_HTML_ELEMENT != null) {
			//	The many considerations made for the console are not required when outputting to HTML...
			this.html(msg);
		}
	},
	//	This method outputs the time (seconds) since pageload.
	"t": function (msg) {
		var difference = (parseFloat( parseInt( (new Date).valueOf() ) - parseInt( this._TIMER.valueOf() ) ) / 1000);
		this.o("Scripts have been running for "+difference+" seconds; "+msg)
	},
	//	This is an internal function used to "log" things.
	"_l": function (msg) {
		//	Might as well double-check?
		if(typeof console != "undefined") {
			if(typeof console.log != "undefined") {
				console.log(msg);
			}
		}
		if(this._LOG_HTML_ELEMENT != null) {
			this.html(msg);
		}
	},
	//	This method is used to output the debug information to HTML
	"html": function (msg) {
		if(this._LOG_HTML_ELEMENT != null) {
			var outElement = (this._LOG_HTML_ELEMENT)?$(this._LOG_HTML_ELEMENT):(typeof jQuery != "undefined")?$("body")[0]:document.getElementsByTagName("body")[0];
			if(typeof outElement == "undefined") {
				console.log("IsLog Error: no output element yet.");
				outElement = $("<div></div>");
			}
			if(typeof jQuery != "undefined") {
				var outLineElement = $("<div class=\"log-message\"></div>");
				outLineElement.text(msg);
				outElement.append(outLineElement);
			} else {
				var newLogMessageElement = document.createElement("div");
				newLogMessageElement.className = "log-message";
				newLogMessageElement.appendChild(document.createTextNode(msg));
				outElement.appendChild(newLogMessageElement);
			}
		}
	},
	"addShowHTMLLogButton": function() {
		if(!this._ADDED_BUTTON) {
			this._SHOW_BUTTON = $("<div title=\"Don't worry: this will not show up outside of a 'development' environment.\">Show Error IsLog</div>");
			this._SHOW_BUTTON.css("position","fixed");
			this._SHOW_BUTTON.css("bottom","0");
			this._SHOW_BUTTON.css("right","0");
			this._SHOW_BUTTON.css("font-size","6pt");
			this._SHOW_BUTTON.bind("click",function() {
				IsLog.o("IsLog: Showing HTML log \""+"#"+IsLog._LOG_HTML_ELEMENT_ID+"\"");
				$("#"+IsLog._LOG_HTML_ELEMENT_ID).css("display","block");
				return false;
			});
			$(document).ready(function() {
				var parentElement = $($("#"+IsLog._LOG_HTML_ELEMENT_ID).parent());
				if(parentElement.length > 0) {
					$($("#"+IsLog._LOG_HTML_ELEMENT_ID).parent()).append(IsLog._SHOW_BUTTON);
					IsLog.o($($("#"+IsLog._LOG_HTML_ELEMENT_ID).parent()));
				} else {
					$($("body")[0]).append(IsLog._SHOW_BUTTON);
				}
				IsLog.o("IsLog: added HTML log show button.");
			});
		}
		this._ADDED_BUTTON = true;
	},
	"_getCallerArgs": function(obj) {
		return JSON.stringify(Array.prototype.slice.call(obj),this._detectCircularity(Array.prototype.slice.call(obj))).replace(/^\[/,"(").replace(/\]$/,")");
	},
	"_detectCircularity": function(obj) {
		return (function() {
			var i = 0;
			return function(key, value) {
				if(i !== 0 && typeof(obj) === 'object' && typeof(value) == 'object' && obj == value) return '[Circular]'; 
				if(i >= 29)	return '[Too deep, not mined]';
				++i;
				return value;  
			}
		})(this._detectCircularity);
	},
	"_getCallerHash": function(callerFunc) {
		return callerFunc.toString().hashCode();
	}
};

/*
String prototype .hashCode()
*/
if(typeof String['hashCode'] == "undefined") {
	String.prototype.hashCode = function(){
			var hash = 0, i, char;
			if (this.length == 0) return hash;
			for (i = 0, l = this.length; i < l; i++) {
					char  = this.charCodeAt(i);
					hash  = ((hash<<5)-hash)+char;
					hash |= 0; // Convert to 32bit integer
			}
			return hash;
	};
}

if(typeof isIE == "undefined")
	var isIE =	/*@cc_on!@*/false;
if(typeof loc == "undefined")
	var loc = window.location;
if(typeof devRegEx == "undefined")
	var devRegEx = /(dev|^$|localhost)/i;
if(typeof isDev == "undefined")
	var isDev = devRegEx.test(loc.hostname);

if(isIE && isDev) {
	IsLog.htmlElement();
	IsLog.addShowHTMLLogButton();
}

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
