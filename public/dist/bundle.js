(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/*!
 * jQuery Mousewheel 3.1.13
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 */

(function (factory) {
    if ( typeof define === 'function' && define.amd ) {
        // AMD. Register as an anonymous module.
        define(['jquery'], factory);
    } else if (typeof exports === 'object') {
        // Node/CommonJS style for Browserify
        module.exports = factory;
    } else {
        // Browser globals
        factory(jQuery);
    }
}(function ($) {

    var toFix  = ['wheel', 'mousewheel', 'DOMMouseScroll', 'MozMousePixelScroll'],
        toBind = ( 'onwheel' in document || document.documentMode >= 9 ) ?
                    ['wheel'] : ['mousewheel', 'DomMouseScroll', 'MozMousePixelScroll'],
        slice  = Array.prototype.slice,
        nullLowestDeltaTimeout, lowestDelta;

    if ( $.event.fixHooks ) {
        for ( var i = toFix.length; i; ) {
            $.event.fixHooks[ toFix[--i] ] = $.event.mouseHooks;
        }
    }

    var special = $.event.special.mousewheel = {
        version: '3.1.12',

        setup: function() {
            if ( this.addEventListener ) {
                for ( var i = toBind.length; i; ) {
                    this.addEventListener( toBind[--i], handler, false );
                }
            } else {
                this.onmousewheel = handler;
            }
            // Store the line height and page height for this particular element
            $.data(this, 'mousewheel-line-height', special.getLineHeight(this));
            $.data(this, 'mousewheel-page-height', special.getPageHeight(this));
        },

        teardown: function() {
            if ( this.removeEventListener ) {
                for ( var i = toBind.length; i; ) {
                    this.removeEventListener( toBind[--i], handler, false );
                }
            } else {
                this.onmousewheel = null;
            }
            // Clean up the data we added to the element
            $.removeData(this, 'mousewheel-line-height');
            $.removeData(this, 'mousewheel-page-height');
        },

        getLineHeight: function(elem) {
            var $elem = $(elem),
                $parent = $elem['offsetParent' in $.fn ? 'offsetParent' : 'parent']();
            if (!$parent.length) {
                $parent = $('body');
            }
            return parseInt($parent.css('fontSize'), 10) || parseInt($elem.css('fontSize'), 10) || 16;
        },

        getPageHeight: function(elem) {
            return $(elem).height();
        },

        settings: {
            adjustOldDeltas: true, // see shouldAdjustOldDeltas() below
            normalizeOffset: true  // calls getBoundingClientRect for each event
        }
    };

    $.fn.extend({
        mousewheel: function(fn) {
            return fn ? this.bind('mousewheel', fn) : this.trigger('mousewheel');
        },

        unmousewheel: function(fn) {
            return this.unbind('mousewheel', fn);
        }
    });


    function handler(event) {
        var orgEvent   = event || window.event,
            args       = slice.call(arguments, 1),
            delta      = 0,
            deltaX     = 0,
            deltaY     = 0,
            absDelta   = 0,
            offsetX    = 0,
            offsetY    = 0;
        event = $.event.fix(orgEvent);
        event.type = 'mousewheel';

        // Old school scrollwheel delta
        if ( 'detail'      in orgEvent ) { deltaY = orgEvent.detail * -1;      }
        if ( 'wheelDelta'  in orgEvent ) { deltaY = orgEvent.wheelDelta;       }
        if ( 'wheelDeltaY' in orgEvent ) { deltaY = orgEvent.wheelDeltaY;      }
        if ( 'wheelDeltaX' in orgEvent ) { deltaX = orgEvent.wheelDeltaX * -1; }

        // Firefox < 17 horizontal scrolling related to DOMMouseScroll event
        if ( 'axis' in orgEvent && orgEvent.axis === orgEvent.HORIZONTAL_AXIS ) {
            deltaX = deltaY * -1;
            deltaY = 0;
        }

        // Set delta to be deltaY or deltaX if deltaY is 0 for backwards compatabilitiy
        delta = deltaY === 0 ? deltaX : deltaY;

        // New school wheel delta (wheel event)
        if ( 'deltaY' in orgEvent ) {
            deltaY = orgEvent.deltaY * -1;
            delta  = deltaY;
        }
        if ( 'deltaX' in orgEvent ) {
            deltaX = orgEvent.deltaX;
            if ( deltaY === 0 ) { delta  = deltaX * -1; }
        }

        // No change actually happened, no reason to go any further
        if ( deltaY === 0 && deltaX === 0 ) { return; }

        // Need to convert lines and pages to pixels if we aren't already in pixels
        // There are three delta modes:
        //   * deltaMode 0 is by pixels, nothing to do
        //   * deltaMode 1 is by lines
        //   * deltaMode 2 is by pages
        if ( orgEvent.deltaMode === 1 ) {
            var lineHeight = $.data(this, 'mousewheel-line-height');
            delta  *= lineHeight;
            deltaY *= lineHeight;
            deltaX *= lineHeight;
        } else if ( orgEvent.deltaMode === 2 ) {
            var pageHeight = $.data(this, 'mousewheel-page-height');
            delta  *= pageHeight;
            deltaY *= pageHeight;
            deltaX *= pageHeight;
        }

        // Store lowest absolute delta to normalize the delta values
        absDelta = Math.max( Math.abs(deltaY), Math.abs(deltaX) );

        if ( !lowestDelta || absDelta < lowestDelta ) {
            lowestDelta = absDelta;

            // Adjust older deltas if necessary
            if ( shouldAdjustOldDeltas(orgEvent, absDelta) ) {
                lowestDelta /= 40;
            }
        }

        // Adjust older deltas if necessary
        if ( shouldAdjustOldDeltas(orgEvent, absDelta) ) {
            // Divide all the things by 40!
            delta  /= 40;
            deltaX /= 40;
            deltaY /= 40;
        }

        // Get a whole, normalized value for the deltas
        delta  = Math[ delta  >= 1 ? 'floor' : 'ceil' ](delta  / lowestDelta);
        deltaX = Math[ deltaX >= 1 ? 'floor' : 'ceil' ](deltaX / lowestDelta);
        deltaY = Math[ deltaY >= 1 ? 'floor' : 'ceil' ](deltaY / lowestDelta);

        // Normalise offsetX and offsetY properties
        if ( special.settings.normalizeOffset && this.getBoundingClientRect ) {
            var boundingRect = this.getBoundingClientRect();
            offsetX = event.clientX - boundingRect.left;
            offsetY = event.clientY - boundingRect.top;
        }

        // Add information to the event object
        event.deltaX = deltaX;
        event.deltaY = deltaY;
        event.deltaFactor = lowestDelta;
        event.offsetX = offsetX;
        event.offsetY = offsetY;
        // Go ahead and set deltaMode to 0 since we converted to pixels
        // Although this is a little odd since we overwrite the deltaX/Y
        // properties with normalized deltas.
        event.deltaMode = 0;

        // Add event and delta to the front of the arguments
        args.unshift(event, delta, deltaX, deltaY);

        // Clearout lowestDelta after sometime to better
        // handle multiple device types that give different
        // a different lowestDelta
        // Ex: trackpad = 3 and mouse wheel = 120
        if (nullLowestDeltaTimeout) { clearTimeout(nullLowestDeltaTimeout); }
        nullLowestDeltaTimeout = setTimeout(nullLowestDelta, 200);

        return ($.event.dispatch || $.event.handle).apply(this, args);
    }

    function nullLowestDelta() {
        lowestDelta = null;
    }

    function shouldAdjustOldDeltas(orgEvent, absDelta) {
        // If this is an older event and the delta is divisable by 120,
        // then we are assuming that the browser is treating this as an
        // older mouse wheel event and that we should divide the deltas
        // by 40 to try and get a more usable deltaFactor.
        // Side note, this actually impacts the reported scroll distance
        // in older browsers and can cause scrolling to be slower than native.
        // Turn this off by setting $.event.special.mousewheel.settings.adjustOldDeltas to false.
        return special.settings.adjustOldDeltas && orgEvent.type === 'mousewheel' && absDelta % 120 === 0;
    }

}));

},{}],2:[function(require,module,exports){
(function (global){
!function(){"use strict";function e(e){return!("number"!=typeof e||e!==e||e===1/0||e===-(1/0))}function t(e){return h.test(e)||s.test(e)?e+"th":u.test(e)?e.replace(u,"ieth"):a.test(e)?e.replace(a,n):e}function n(e,t){return d[t]}function o(t){var n=parseInt(t,10);if(!e(n))throw new TypeError("Not a finite number: "+t+" ("+typeof t+")");var o=String(n),r=n%100,i=r>=11&&13>=r,f=o.charAt(o.length-1);return o+(i?"th":"1"===f?"st":"2"===f?"nd":"3"===f?"rd":"th")}function r(n,o){var r,f=parseInt(n,10);if(!e(f))throw new TypeError("Not a finite number: "+n+" ("+typeof n+")");return r=i(f),o?t(r):r}function i(e){var t,n,o=arguments[1];return 0===e?o?o.join(" ").replace(/,$/,""):"zero":(o||(o=[]),0>e&&(o.push("minus"),e=Math.abs(e)),20>e?(t=0,n=x[e]):p>e?(t=e%v,n=M[Math.floor(e/v)],t&&(n+="-"+x[t],t=0)):y>e?(t=e%p,n=i(Math.floor(e/p))+" hundred"):c>e?(t=e%y,n=i(Math.floor(e/y))+" thousand,"):b>e?(t=e%c,n=i(Math.floor(e/c))+" million,"):g>e?(t=e%b,n=i(Math.floor(e/b))+" billion,"):m>e?(t=e%g,n=i(Math.floor(e/g))+" trillion,"):w>=e&&(t=e%m,n=i(Math.floor(e/m))+" quadrillion,"),o.push(n),i(t,o))}function f(e){var n=r(e);return t(n)}var l="object"==typeof self&&self.self===self&&self||"object"==typeof global&&global.global===global&&global||this,h=/(hundred|thousand|(m|b|tr|quadr)illion)$/,s=/teen$/,u=/y$/,a=/(zero|one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve)$/,d={zero:"zeroth",one:"first",two:"second",three:"third",four:"fourth",five:"fifth",six:"sixth",seven:"seventh",eight:"eighth",nine:"ninth",ten:"tenth",eleven:"eleventh",twelve:"twelfth"},v=10,p=100,y=1e3,c=1e6,b=1e9,g=1e12,m=1e15,w=9007199254740992,x=["zero","one","two","three","four","five","six","seven","eight","nine","ten","eleven","twelve","thirteen","fourteen","fifteen","sixteen","seventeen","eighteen","nineteen"],M=["zero","ten","twenty","thirty","forty","fifty","sixty","seventy","eighty","ninety"],z={toOrdinal:o,toWords:r,toWordsOrdinal:f};"undefined"!=typeof exports?("undefined"!=typeof module&&module.exports&&(exports=module.exports=z),exports.numberToWords=z):l.numberToWords=z}();
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],3:[function(require,module,exports){
var numWord = require('number-to-words');
require('jquery-mousewheel')($);

$(document).ready(function () {

    $("li").on('click', '.close', function () {//close 'x'

        var t=$(this).parent();
        t.hide(300, function() {
            t.remove();
        });
    });

});

function clearPageSelectors () {

    //$("img.page-select").attr('src', './style/page-scroller-neutral.jpg');

    var selectorCount = document.getElementsByClassName("page-select").length;//index starts at 0

    for(var i = 0; i < selectorCount; i++)
    { 
        $("img.page-select").eq(`${i}`).attr('src', './public/style/page-scroller-neutral.jpg');
    }
};

$(function() {//change bkgd and logo colour

   $('#logo').attr('src', "public/style/jn1000.jpg");

   var isScrolled = false;

   $("div").scroll(function () {

      if ($(this).scrollLeft() > 10 && isScrolled === false) 
      {
        $('body').addClass('changeColour');
        $('#logo').fadeOut(100);
        $('#logo').attr('src', "public/style/jn1000-white.jpg");
        $('#dateblock').css('background-color', '#221f1f');
        $('#logo').fadeIn(400);
        $('#date').fadeOut(100);
        $('#date').addClass('changeColourText');
        $('#date').fadeIn(400);
        isScrolled = !isScrolled;
      }
      if ($(this).scrollLeft() < 10) 
      {
        $('body').removeClass('changeColour');
        $('#logo').attr('src', "public/style/jn1000.jpg");
        $('#dateblock').css('background-color', '#4c4cff');
        $('#date').removeClass('changeColourText');
        isScrolled = false;
      }
   });
});

$(".page-select").mouseover(function () {//page selector hover

    if($(this).attr('src') == './public/style/page-scroller-neutral.jpg')
    {   
        $(this).attr('src', './public/style/page-scroller-hover.jpg');
    }
}).mouseout(function () {

    if($(this).attr('src') == './public/style/page-scroller-hover.jpg')
    {
        $(this).attr('src', './public/style/page-scroller-neutral.jpg');
    }
});

$(function() {//get today's numerical date

    var d = new Date();
    var daynum = d.getDate ();
    //document.getElementById("date").innerHTML = "today feels like " + daynum + ".";//One more than yesterday, (randomly generated)
});

window.onload = () => {//load screen
    $('#loadScreen').fadeOut(1000);
}

$(function(page) {//horizontal scroll

    scroll = 0;

    $("body").mousewheel(function(event, delta) {

    scroll -= delta * 80;

    if(page) 
    {
        $("div.linklist").scrollLeft(page);
    }
    $("div.linklist").scrollLeft(scroll);
    
    event.preventDefault();

   });
});

$("div.linklist").scroll(function() {//page selectors have correct activation with distance scrolled

    var selectorCount = document.getElementsByClassName("page-select").length;//index starts at 0
    const scrollDist = $("div.linklist").scrollLeft();

    for(var i = 0; i < selectorCount; i++)
    {
        
        const pageWidth = $("div.linklist > ul").eq(0).width() + 50;

        if(scrollDist <= (pageWidth - 200))
        {
            clearPageSelectors();
            $('img.page-select').eq(0).attr('src', './public/style/page-scroller-active.jpg');
        }
        else if(i != 0)
        {
            if(scrollDist > (pageWidth * i - 200) /*&& scrollDist < (pageWidth * (i + 1 - 200))*/)
            {
                clearPageSelectors();
                $('img.page-select').eq(i).attr('src', './public/style/page-scroller-active.jpg');
            }
        }
    }
});

$("#horizontal-list .page-select").click(function() {//page selector main function
    
    var count = parseInt($(this).attr('id')) - 1;//index starts at 0
    var dist = $("div.linklist > ul").eq(count).width();
    var returnDist = $("div.linklist").scrollLeft();//scrolled thus far
    var desiredDist = 0;//final dist when count is not 0
    var selectorCount = document.getElementsByClassName("page-select").length;//index starts at 0

    for(var i = 0; i < count; i++)//n = 0 - 3
    {
        desiredDist += $("div.linklist > ul").eq(i + 1).width();
        console.log(`${i}`);
    }

    if(count === 0)//correct
    {
        $("div.linklist").scrollLeft(-(returnDist));
    } 
    else
    {
        $("div.linklist").scrollLeft(desiredDist + (50 * count));
        console.log(`difference = ${desiredDist}`);
    }

    for(var i = 0; i < selectorCount; i++)
    {
        if(i === count)//no blue
        {
            $(this).attr('src', './public/style/page-scroller-active.jpg');
        }
        else//correct
        {
            $("img.page-select").eq(`${i}`).attr('src', './public/style/page-scroller-neutral.jpg');
        }
    }
    

});

$("div.linklist li > a").click(function (e) {//dropdown of a project
    
    e.preventDefault();

    var h = $(this).attr('href');

    const left = this.getBoundingClientRect().left;
    const top = this.getBoundingClientRect().top;

    const proj = $(this).parent().clone(true);
    proj.css("left", left);
    proj.css("top", top);
    proj.css("width", "50%");
    proj.css("border-right", "20px solid #7f2f2d");
    proj.css("border-bottom", "20px solid #7f2f2d");//was #a0a0ff
    proj.css("zIndex", "10");
    proj.css("background-color", "#ff5e5b");
    proj.css("position", "absolute");

    //exit button
    const x = document.createElement("a");
    x.className = "close";
    x.innerHTML = "x";
    x.style.position = "absolute";
    x.style.float = "right";
    x.style.top = "2.5vh";
    x.style.left = "95vw";
    x.style.fontSize = "48px";

    $(this).parent().append(proj);

    proj.animate({top: '0', left: '0'});
    proj.animate({left: '0'});    
    proj.animate({height: "100vh", width: "100vw"}, 100, function () {
        proj.css("border", "none");
        proj.append(x);
        proj.animate({backgroundColor: "#221f1f"}, 300, () => {
            window.location.href = h;
        });

    });



});

$("div.contact").mouseenter(function () {//contact hover


    $(this).animate({height: "25vh"}, 300, () => {
        $(this).css("background-color", "#ff5e5b");
    });
   
}).mouseout(function () {

    $(this).animate({height: "10vh"}, 100, () => {
        $(this).css("background-color", "transparent");
    });

});

$("img.pic:first").mouseenter(function () {//first image details

    var selectText = ["Logo and banner design; comissioned for a producer.",
    "Inspired by 80s AV hardware and a ton of Japanese pop from the same period of time.",
    "The concept for a foldable speaker system which uses the geometry of a butterfly to allow a wider spread of audio coverage.",
    "Grad-year class sweater concept; these designs have long existed as gears and machine parts and a grad year. Shipments of orders pending.",
    "Quick sketches to practice form and anatomy.",
    "Concept developed around the modular lunchboxes of some East Asian cultures. Sections are magnetic pull-aparts on twisted teeth.",
    "The first attempt at designing a trainer which does not use traditional laces. This design attempts wrapping elments of the shoe body and reattaching to secure tightness.",
    "A study on the maximized geometry of honeycomb and how to effectively use it's spatial advantage in residential planning.",
    "Covering the origin of playing cards, the Ace traces back to origins of Roman currency and Egyptian gods.",
    "Comissioned asset formulated from the recognizable appearance of UV resistant prescription bottles.",
    "Modern logo design intended for tech industry.",
    "Inspired by the awareness of air quality differences and their inevitable long-term impacts.",];

    $(this).animate({opacity: '0'}, 500, (projNum) => {

        const info = document.createElement("div");

        var projNum = parseInt($('div.horizontal-list').text().substring(1, 3), 10) - 1;        

        //const imgLeft = this.getBoundingClientRect().left;
        //const imgTop = this.getBoundingClientRect().top; //broken at the moment

        info.className = "info";
        info.innerHTML = selectText[projNum];
        //info.innerHTML = selectText[blah];
        info.style.backgroundColor = "#ffff4c";
        info.style.zIndex = -10;
        info.style.lineHeight = 1.5;
        info.style.textAlign = "justify";
        info.style.position = "absolute";
        info.style.float = "right";
        info.style.width = "100%";//this.clientWidth + "px";
        info.style.height = this.clientHeight + "px";
        //info.style.top = imgTop;
        info.style.top = 0;
        //info.style.left = imgLeft + "px";
        info.style.fontSize = "64px";

        $('div.mySlides').append(info);

    });
 

}).mouseout(function () {
        
    $('div.info').css('display', 'none');

    if($('div.info').css('display', 'none'))
    {
        $(this).animate({opacity: '1'}, 200)
    }
});

//add next/prev project options for routing


},{"jquery-mousewheel":1,"number-to-words":2}]},{},[3]);
