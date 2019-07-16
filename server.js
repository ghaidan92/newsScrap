var express = require("express");
var app = express();
var axios = require("axios");
var cheerio = require("cheerio");
var mongoose = require('mongoose');
var Article = require("./models/article");
// var db = require("./models");

var PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

var exphbs = require('express-handlebars');
app.engine("handlebars", exphbs({
    defaultLayout: "main"
}));


app.set("view engine", "handlebars");

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/webScrape', { useNewUrlParser: true });

// create a scrape route
app.get("/scrape", function (req, res) {
    axios
        .get("https://www.aljazeera.com")
        .then(function (response) {
            var $ = cheerio.load(response.data);
            $("p.top-sec-label").each(function (i, element) {
                var result = {};
                result.title = $(this).children().text();
                result.link = ("www.aljazeera.com" + $(this).find("a").attr("href"));
                Article.create(result)
                .then(function(dbArticle) {
                  // View the added result in the console
                  console.log(dbArticle);
                })
                .catch(function(err) {
                    // If an error occurred, log it
                    console.log(err);
                  })

            res.json("ok");
        });
});
});

// create a route to get Article data
app.get("/all", function (req, res) {
    Article
        .find()
        .then(function (data) {
            res.json(data);
        });
});

app.get("/saved", function (req, res) {
    Article
        .find({"saved": true})
        // .populate("notes")
        .then(function (data) {
           var aljObject = {
                article: data
           }
           res.render("saved", aljObject)
        });
});

app.delete("/all", function (req, res) {
    Article
        .remove();
});

app.listen(PORT, function () {
    console.log(`App is listening on http://localhost:${PORT}`);
});