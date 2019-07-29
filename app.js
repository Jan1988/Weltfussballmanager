/**
 * Created by Külse on 21.07.2019.
 */
const express = require('express');
const app = express();


const mongoose = require('mongoose');
require('dotenv/config');
//
//
//
// //Import Routes
// const postsRoute = require('./routes/posts');
//
// //Middlewares
// app.use('/posts', postsRoute);
//
//
//ROUTES
app.get('/', (req, res) =>{
   res.send('We are on home');
});
//
//

//Connect to DB
mongoose.connect(
    process.env.DB_CONNECTION,
    { useNewUrlParser: true },
    function () {
    console.log('connected to DB!');
    }
);


app.listen(3000);