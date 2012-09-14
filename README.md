JavaScript-DebugTools
=====================

Debug tools for building javascript.

IsLog
=====

IsLog stands for Independt Study Log.  It is a logger that outputs to the browswer's console.  It is different
from the browser's log functions in that it will attempt to automatically detect what environment it is in.
For example, if the page is running from www.byu.is.edu/test/my-page-with-logging.html, then the logger will detect
that it is on a testing site and default to turn on all logging.  On the other hand if it is on a live site the logger
will detect this, and it will turn off all of its console messages.  The idea is that you only have to write your code
once and not have to worry about turning on and off console messages when you deploy to production.

Use case:

var complexObj = new ComplexObj();
// ..
// do lots of stuff to a
// ..
LogIs.c(complexObj);  

This will output complexObj to the console. Note that you do not have to make complexObj a string in order to log it.  
In fact you can put whatever variable you would like into the LogIs.c function and it will log it.

You also have the option to manually turn the log on and off using Log.on() and Log.off().
