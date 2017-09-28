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
    document.getElementById("date").innerHTML = "today feels like " + daynum + ".";//One more than yesterday, (randomly generated)
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
    "Inspired by the awareness of air quality differences and their inevitable long-term impacts.",
    "Concept developed around the modular lunchboxes of some East Asian cultures. Sections are magnetic pull-aparts on twisted teeth.",
    "The first attempt at designing a trainer which does not use traditional laces. This design attempts wrapping elments of the shoe body and reattaching to secure tightness.",
    "A study on the maximized geometry of honeycomb and how to effectively use it's spatial advantage in residential planning.",
    "Part of a series covering the origins of playing cards. The term “ace” comes from the lowest valued latin coin in the Roman Empire. Upon this coin, the Romans stamped Janus the god of beginnings and ends. Egyptians valued scarabs and dung beetles with the same esteem for the diminutive task of rolling dung. Hence the native rose chafer beetle was the perfect specimen for a card of both great and small value.",
    "Comissioned asset formulated from the recognizable appearance of UV resistant prescription bottles.",];

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

