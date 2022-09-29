const express = require('express')
const mongoose = require('mongoose')    //We connect to our database. 'Mongoose' creates a connection between node js and mongodb
const ShortURL = require('./models/shortURL')
const app = express()

mongoose.connect('mongodb://localhost/URLShortener',{
    useNewUrlParser: true, useUnifiedTopology: true
})

app.set('view engine','ejs');
app.use(express.urlencoded({extended: false}))

app.get('/',async (req,res)=>{
    const shorturl = await ShortURL.find()
    res.render('index',{shorturl: shorturl})
})

app.post('/shortURL',async(req,res)=>{
    await ShortURL.create({full: req.body.fullUrl})   //req.body.fullUrl gives the access to the form 
})

app.get('/:shortURL',async (req,res)=>{
    const shortURL = await ShortURL.findOne({short: req.params.shortURL})
    //if anyone passes url that doesn't exist
    if(shortURL==null)
    {
        return res.sendStatus(404)
    }
    shortURL.clicks++;
    shortURL.save();    //updates short URL click value
    res.redirect(shortURL.full)
})

app.listen(process.env.PORT || 5100);