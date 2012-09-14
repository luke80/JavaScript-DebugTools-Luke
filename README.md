JavaScript-DebugTools
================================

Debug tools for building javascript.

IsLog
-------------------------

IsLog stands for Independt Study Log.  It is a logger that outputs to the browswer's console.  It is different
from the browser's log functions in that it will attempt to automatically detect what environment it is in.
For example, if the page is running from www.byu.is.edu/test/my-page-with-logging.html, then the logger will detect
that it is on a testing site and default to turn on all logging.  On the other hand if it is on a live site the logger
will detect this, and it will turn off all of its console messages.  The idea is that you only have to write your code
once and not have to worry about turning on and off console messages when you deploy to production.

Use case:
<pre>
<code>
  var complexObj = new ComplexObj();
  // ..
  // do lots of stuff to it
  // ..
  LogIs.c(complexObj);
  // somehow it isn't on... maybe your domain is weird (like 127.0.0.1) and you need to explicitly turn output on?
  LogIs.on();
  /* PLEASE BE CAREFUL with this! We don't want console logs in our live versions of
  code. This is the reason it is off by default, so if you are explicitly turning this
  on before you release your code to our GitHub account, add your host to the check! */
  // If you are paranoid about meaningless logs in the console you can also turn it off explicitly:
  LogIs.off();
</code>
</pre>

This will output complexObj to the console. Note that you do not have to make complexObj a string in order to log it, though strings are output too.  

In fact you can put whatever variable you would like into the LogIs.c function and it will log it.

