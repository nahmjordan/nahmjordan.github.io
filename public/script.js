var numWord = require('number-to-words');
require('jquery-mousewheel')($);

$(document).ready(function () {

    $("li").on('click', '.close', function () {//close 'x'

        var t=$(this).parent();
        t.hide(300, function() {
            t.remove();
        });
    });

    $("div.mySlides").ready(function () {

        $("div.mySlides").first().css("display", "block");

    });

    $("a.cat-link-text").mouseover(function () {

        $("a.cat-link-text").animate({backgroundColor: "#080708", color: "#fafafa"}, 200);
        
        $("div#nav").animate({opacity: "0"}, 50);
        $("div.home-button").animate({opacity: "0"}, 50);

        document.body.style.backgroundRepeat = "no-repeat";//no tiling
        document.body.style.backgroundPosition = "cover";
        document.body.style.backgroundSize = "100%";
        document.body.style.backgroundPosition = "top center";

        //var bkgdImg = document.getElementById("bkgd");

        if(window.location.pathname.includes("industrial")) {
           var teaserImages = ["bamboo-open.png", "honeycomb-combo-1.jpg", "mech2020-front.jpg", "monarch-buttons.jpg"];
        }
        else if (window.location.pathname.includes("graphic")) {
           var teaserImages = ["mech2020-banner.png", "avro-banner.png", "spotify-logo-banner.png", "playlists-banner.png", "accent-banner.png", "No1.jpg", "ninepce-banner.png"];
        }
        else if (window.location.pathname.includes("ui-ux")) {
            var teaserImages = ["spotify-track-mockup.png", "weather.png"];
        }

        document.body.style.backgroundImage = "url('./public/style/projects/" + teaserImages[$(this).attr('id')] + "')";
        //bkgdImg.src = "./public/style/projects/" + teaserImages[$(this).attr('id')];


    }).mouseout(function () {
        document.body.style.background = "#fafafa";
        //bkgdImg.src = " ";
        $("div#nav").animate({opacity: "1"}, 100);

        $("a.cat-link-text").animate({backgroundColor: "transparent", color: "#080708"}, 100);

    });

    /*$("a.cat-link-text").click(function () {
        var linkNum = $(this).attr('id');
        localStorage.setItem('projNum', 'linkNum');
        //console.log(linkNum);
    });*/

});

function clearPageSelectors () {

    //$("img.page-select").attr('src', './style/page-scroller-neutral.jpg');

    var selectorCount = document.getElementsByClassName("page-select").length;//index starts at 0

    for(var i = 0; i < selectorCount; i++)
    { 
        $("img.page-select").eq(`${i}`).attr('src', './public/style/page-scroller-neutral2.jpg');
    }
};

$(function() {//change bkgd and logo colour

   //$('#logo').attr('src', "public/style/jn1000.jpg");

   var isScrolled = false;

   $("div").scroll(function () {

      if ($(this).scrollLeft() > 10 && isScrolled === false) 
      {
        $('body').addClass('changeColour');
        //$('#logo').fadeOut(100);
        //$('#logo').attr('src', "public/style/jn1000-white.jpg");
        //$('#dateblock').css('background-color', '#221f1f');
        //$('#logo').fadeIn(400);
        $('#date').fadeOut(100);
        $('#date').addClass('changeColourText');
        $('#date').fadeIn(400);
        isScrolled = !isScrolled;
      }
      if ($(this).scrollLeft() < 10) 
      {
        $('body').removeClass('changeColour');
        //$('#logo').attr('src', "public/style/jn1000.jpg");
        //$('#dateblock').css('background-color', '#4c4cff');
        //$('#date').removeClass('changeColourText');
        isScrolled = false;
      }
   });
});
/*
$(".page-select").mouseover(function () {//page selector hover

    if($(this).attr('src') == './public/style/page-scroller-neutral2.jpg')
    {   
        $(this).attr('src', './public/style/page-scroller-hover2.jpg');
    }
}).mouseout(function () {

    if($(this).attr('src') == './public/style/page-scroller-hover2.jpg')
    {
        $(this).attr('src', './public/style/page-scroller-neutral2.jpg');
    }
});
*/
$("img.prev, img.next, img#back-button").mouseover(function () {

    if($(this).attr('src') == '../../public/style/small-right-arrow.png')
    {
        $(this).attr('src', '../../public/style/active-small-right-arrow.png');
    }
    else if($(this).attr('src') == '../../public/style/small-left-arrow.png')
    {   
        $(this).attr('src', '../../public/style/active-small-left-arrow.png');
    }
}).mouseout(function () {

    if($(this).attr('src') == '../../public/style/active-small-right-arrow.png')
    {
        $(this).attr('src', '../../public/style/small-right-arrow.png');
    } else if($(this).attr('src') == '../../public/style/active-small-left-arrow.png')
    {   
        $(this).attr('src', '../../public/style/small-left-arrow.png');
    }
});

$(function() {//get today's numerical date

    var d = new Date();
    var daynum = d.getDate ();
    //document.getElementById("date").innerHTML = "today feels like " + daynum + ".";//One more than yesterday, (randomly generated)
});

window.onload = () => {//load screen
    var pathname = window.location.pathname; 
    var onContact = pathname.includes("contact");
    var onAbout = pathname.includes("about");
    var onIndust = pathname.includes("industrial");
    var onUiux = pathname.includes("ui-ux");
    var onGraphic = pathname.includes("graphic");
    var onProject = pathname.includes("project");
    var onSketch = pathname.includes("sketch");

    if(onProject) {
        $("#nav").animate({background: "#fafafa"}, 100);
    }

    if(onIndust || onGraphic || onUiux || onSketch) {
        
        $("div#title").animate({color: "#080708"}, 50);
        $("div#title").animate({bottom: "-12%"});

        if(onIndust) {
            //$("div#indust").css("color", "#fafafa");  
            $("div#indust").css("fontFamily", "montserratmedium_italic");  
            $("div#indust").css("background", "#080708");
            $("div#indust").css("color", "#fafafa");
        } else if(onUiux) {
            //$("div#uiux").css("color", "#fafafa");    
            $("div#uiux").css("fontFamily", "montserratmedium_italic");  
            $("div#uiux").css("background", "#080708");
            $("div#uiux").css("color", "#fafafa");
        } else if(onGraphic) {
            // $("div#graphic").css("color", "#fafafa"); 
            $("div#graphic").css("fontFamily", "montserratmedium_italic"); 
            $("div#graphic").css("background", "#080708");
            $("div#graphic").css("color", "#fafafa");    
        } else if(onSketch) {
            // $("div#graphic").css("color", "#fafafa"); 
            $("div#sketch").css("fontFamily", "montserratmedium_italic"); 
            $("div#sketch").css("background", "#080708");
            $("div#sketch").css("color", "#fafafa");    
        }
    }
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
            $('img.page-select').eq(0).attr('src', './public/style/page-scroller-active2.jpg');
        }
        else if(i != 0)
        {
            if(scrollDist > (pageWidth * i - 200) /*&& scrollDist < (pageWidth * (i + 1 - 200))*/)
            {
                clearPageSelectors();
                $('img.page-select').eq(i).attr('src', './public/style/page-scroller-active2.jpg');
            }
        }
    }
});
/*
$("img.slide-arrow").click(function() {
    var enterDist = "500px";
    var navslideDist = "-=100%";
    var navslideTime = "500";

    $("div.nav-slide").animate({left: navslideDist}, "slow", function () {
        $("about").css("opacity", "1");
    });
});
*/

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
            $(this).attr('src', './public/style/page-scroller-active2.jpg');
        }
        else//correct
        {
            $("img.page-select").eq(`${i}`).attr('src', './public/style/page-scroller-neutral2.jpg');
        }
    }
    

});

/*$("div.linklist li > a").click(function (e) {//dropdown of a project
    
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
    proj.css("background-color", "#AD343E");
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



});*/

/*
$("img.prev, img.next") {
    if(this.attr("class") = "prev") {

    }
}*/

$("div.home-button").mouseenter(function () {//contact hover

    $(this).animate({backgroundColor: "#fbec5d"}, 100, () => {
            $(this).css("color", "#080708");
            $(this).css("font-family", "montserratmedium_italic");
    });

}).mouseout(function () {

    $(this).animate({backgroundColor: "#080708"}, 50, () => {
            $(this).css("color", "#fafafa");
            $(this).css("font-family", "montserratregular");
    });

});

$("a.cat-link-text").click(function () {

    var pathname = window.location.pathname; 
    var inIndust = pathname.includes("indust/");
    var inUiux = pathname.includes("u/");
    var inGraphic = pathname.includes("graph/");
    var industText = ["This concept was inspired by the modular lunchboxes widely used in some East Asian cultures, and the system of pockets used in the structure of bamboo. Sections are magnetic pull-aparts on curved teeth.",
        "An untraditional take on the classic Grad-year sweater. These designs have long existed in engineering tradition as gears and machine parts and a grad year. This design revitalized the concept while paying respect to the gradiated nature of the mechanical engineering discipline.",
        "A concept for a foldable portable speaker system which uses the geometry of a butterfly to allow a wider spread of audio transmission in a more transportable and classy device.", 
        "A study on the maximized geometry of honeycomb cells and how to effectively use it's spatial and modular advantages in residential planning."];
    var graphText = ["", 
        "A redesign of the Spotify logo inspired by 1920s art deco typefaces such as those of A.M. Cassandre. The commercial coming-of-age for radio communication occured throughtout the 20s and 30s, which is where this influence was derived from.",
        "A collection of graphics for playlists I make in my spare time. Each playlist follows the mood of whatever was going on in my life at the time.",
        "For my first attempt at designing a typeface I chose to try modernizing the style of typical slab serifs. Accent has geometric linework and a sizeable x height to suit large exclamatory messages.",
        "",
        "An identity for a local producer.",
        "An assignment completed to practice body layout and page organization."];
    
    var linkid = $(this).attr('id');

    if(inIndust) {
        var category = "indust";
        $("div.nav").animate({background: "#fafa"});
    } else if(inUiux) {
        var category = "uiux";
        $("div.nav").animate({background: "#fafa"});
    } else if (inGraphic) {
        var category = "graph";
        $("div.nav").animate({background: "#fafa"});
    }

    /*
    var fs = require("fs");
    var text = fs.readFileSync("./" + category + ".txt");
    var textByLine = text.split("\n");
    */

    var description = textByLine[linkid];

    console.log(description);

     window.localStorage.setItem('projInfo', 'description');

});

