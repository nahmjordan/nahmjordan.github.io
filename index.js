var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var router = express.Router();
var app = express();

var publicDir = path.join(__dirname, 'public');// '../',

module.exports = router;

app.use(express.static("public"));

app.set('views', './views');//error
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');


//imgs array pulls all img names from folder that contain "__"

var projects = {

    avro: {
        title: "#1 Avro_."
    },

    ninepce: {
        title: "#1 ninepce_.",
        imgs:  ['/public/style/projects/ninepce-banner.jpg'],
        imgHs: ['720px'],
        imgWs: ['1280px'],
        text: "commission done for a BIG-TIME producer. ",
    },

    pause: {
        title: "#2 pause_.",
        imgs:  ['/public/style/projects/pause.jpg'],
        imgHs: ['500px'],
        imgWs: ['1000px'],
        text: "Inspired by 80s AV hardware and a ton of Japanese pop from the same period of time.",
    },

    monarch: {
        title: "#3 monarch_.",
        imgs: ["/public/style/projects/monarch-open-top.jpg", "/public/style/projects/monarch-iso.jpg", "/public/style/projects/monarch-closed.jpg", 
            "/public/style/projects/monarch-buttons.jpg", "/public/style/projects/monarch-wing-tip.jpg", "/public/style/projects/monarch-wing-detail.jpg"],
        imgHs: ['643px', '564px', '564px', '1037px', '1037px', '1037px'],
        imgWs: ['960px', '940px', '940px', '1600px', '1600px', '1600px'],
        text: "The concept for a foldable speaker system which uses the geometry of a butterfly to allow a wider spread of audio coverage.",
    },

    mech2020: {
        title: "#4 mech2020_.",
        imgs: ['/public/style/projects/mech2020-front-back.jpg', '/public/style/projects/mech2020-back.jpg', '/public/style/projects/mech2020-front.jpg'],
        imgHs: ['612px', '1500px', '1500px'],
        imgWs: ['1252px', '1500px', '1500px'],
        text: "Grad-year class sweater concept; these designs have long existed as gears and machine parts and a grad year. Shipments of orders pending.",
    },

    lungs: {
        title: "#5 lungs_.",
        imgs: ["/public/style/projects/lungs.jpg"],
        imgHs: ['1000px',],
        imgWs: ['1000px',],
        text: "Inspired by the awareness of air quality differences and their inevitable long-term impacts.",
    },

    bamboo: {
        title: "#6 Bamboo_.",
        imgs: ["/public/style/projects/bamboo-closed.jpg", "/public/style/projects/bamboo-open.jpg"],
        imgHs: ['700px', '700px'],
        imgWs: ['1210px', '1210px'],
        text: "Concept developed around the modular lunchboxes of some East Asian cultures. Sections are magnetic pull-aparts on twisted teeth.",
    },

    trainer1: {
        title: "#7 Trainer1_.",
        imgs: ["/public/style/projects/trainer-concept-1.jpg", "/public/style/projects/trainer-concept-1-1.jpg", "/public/style/projects/trainer-concept-1-2.jpg",
         "/public/style/projects/trainer-concept-1-3.jpg", "/public/style/projects/trainer-concept-1-4.jpg"],
        imgHs: ['749px', '863px', '783px', '802px', '796px'],
        imgWs: ['723px', '803px', '735px', '684px', '729px'],
        text: "The first attempt at designing a trainer which does not use traditional laces. This design attempts wrapping elments of the shoe body and reattaching to secure tightness.",
    },

    honeycomb: {
        title: "#8 Honeycomb_.",
        imgs: ["/public/style/projects/honeycomb-combo-1.jpg", "/public/style/projects/honeycomb-room-1.jpg", "/public/style/projects/honeycomb-room-2.jpg", 
        "/public/style/projects/honeycomb-single-1.jpg",],
        imgHs: ['1071px', '1362px', '1362px', '1211px'],
        imgWs: ['564px', '564px', '564px', '681px'],
        text: "A study on the maximized geometry of honeycomb and how to effectively use it's spatial advantage in residential planning.",
    },

    Ace: {
        title: "#9 Ace_.",
        imgs: ["/public/style/projects/rose-chafer.jpg"],
        imgHs: ['1000px'],
        imgWs: ['1000px'],
        text: "Part of a series covering the origins of playing cards. The lowest and highest valued card \"the Ace\" traces its origin through Roman currency and Egyptian legend around scarabs and dung. The native rose chafer beetle was the perfect specimen for a card of both great and small value.",
    },

    Bottle: {
        title: "#10 Bottle_.",
        imgs: ["/public/style/projects/bottle.jpg", "/public/style/projects/kammx.jpg",],
        imgHs: ['1000px'],
        imgWs: ['1000px'],
        text: "Design asset formulated from the recognizable appearance of UV resistant prescription bottles.",
    },



};

var findProject = function (projNum, callback) {

        var projSelect = Object.getOwnPropertyNames(projects)[projNum - 1];
        return callback(null, projects[projSelect]);

};

router.get('/', function (req, res) {//front page
    res.sendFile(path.join(publicDir, 'index'))
});

/*router.get("/project/:id", function (req, res) {
    var proj = req.params.id;

    findProject(proj, function(error, info) {
        
            return res.render('project.ejs', {project: info});//, project

    });

});*/
