// Import express
let express = require('express');
// Import Body parser
let bodyParser = require('body-parser');
// Import Mongoose
let mongoose = require('mongoose');
// Initialise the app
let app = express();
var path = require("path");
require('dotenv/config');



// Import routes
let apiRoutes = require("./routes/api-routes");

// Add headers
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

// Configure bodyparser to handle post requests
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());



// router.get('/',function(req,res){
//     res.sendFile(path.join(__dirname+'/views/index.html'));
//     //__dirname : It will resolve to your project folder.
// });
//
// router.get('/about',function(req,res){
//     res.sendFile(path.join(__dirname+'/views/about.html'));
// });
//
// router.get('/sitemap',function(req,res){
//     res.sendFile(path.join(__dirname+'/sitemap.html'));
// });
//
// //add the router
// app.use(express.static(__dirname + '/View'));
// //Store all HTML files in view folder.
// app.use(express.static(__dirname + '/Script'));
// //Store all JS and CSS in Scripts folder.

//Connect to DB
mongoose.connect(
    process.env.DB_CONNECTION,
    { useNewUrlParser: true},
    function () {
        console.log("DB is running");
    }
);

// Setup server port
var port = process.env.port || 3000;

// Send message for default URL
app.get('/', function(req, res){
    res.sendFile(path.join(__dirname+'/views/index.html'));
});


//add the router
app.use(express.static(__dirname + '/View'));
//Store all HTML files in view folder.
app.use(express.static(__dirname + '/Script'));
//Store all JS and CSS in Scripts folder.

// Use Api routes in the App
app.use('/api', apiRoutes);
// Launch app to listen to specified port
app.listen(port, function () {
    console.log("Running RestHub on port " + port);
});





