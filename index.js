const METHOD = "GET";
const PORT = 3000;
const WAITING_TIME = 6000;
const URL_NEWS = 'http://slowpoke.desigens.com/json/1/7000';
const URL_PHRASES = 'http://slowpoke.desigens.com/json/2/3000';

var Data = {
    news:null,
    phrases:null,
    send:false
}
const hbs = require('hbs');

hbs.registerHelper("getStartTr", function(index) {    
    if (index % 2 == 0) {    
        return new hbs.SafeString("<tr>")
    }
});

hbs.registerHelper("getEndTr", function(index) {    
    if (index % 2 !== 0) {
        return new hbs.SafeString("</tr>")
    }
});

const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const express = require('express');
const app = express();
var timeId;

app.set("view engine", "hbs");

app.use((req, res, next)=>{
    Data.news = null;
    Data.phrases = null;
    Data.send = false;

    timeId = setTimeout(()=>{
        console.log("News timeout ...");
    }, WAITING_TIME);

    RequestNews(Data, res);
    RequestPhrases(Data, res);
    next();
});

app.get("/", (req,res)=>{
    console.log("start request GET");
});

app.listen(PORT, ()=>{
    console.log("Server start on port " + PORT);
})


function RequestNews(data, response){
    let xhr = new XMLHttpRequest();
    xhr.open(METHOD, URL_NEWS, true);
    xhr.onload = function(){
        clearTimeout(timeId);
        data.news = JSON.parse(this.responseText);
        if (data.phrases == null){
            console.log("Phrases timeout ...");            
        } else {
            if (!data.send) {
                data.send = true;
                response.render("index.hbs", {news: data.news, phrases: data.phrases})
            }
        }

    };
    xhr.send();
}

function RequestPhrases(data, response){
    let xhr = new XMLHttpRequest();
    xhr.open(METHOD, URL_PHRASES, true);
    xhr.onload = function(){        
        data.phrases = JSON.parse(this.responseText);
        if (!data.send && data.news !== null) {
            data.send = true;
            response.render("index.hbs", {news: data.news, phrases: data.phrases})
        }
    };
    xhr.send();
}