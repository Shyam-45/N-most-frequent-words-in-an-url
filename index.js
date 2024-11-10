const express = require("express");
const app = express();
const port = 8080;
const path = require("path");

const axios = require("axios");
const cheerio = require("cheerio");

app.use(express.urlencoded({extended : true}));
app.use(express.json());

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));

app.use(express.static('public'));
app.use(express.static(path.join(__dirname, 'public')))

function calculateWordFrequency(content, n) {
    let words = content.toLowerCase().match(/\b\w+\b/g);   
    let frequencies = {};

    for(let word of words) {
        frequencies[word] = (frequencies[word] || 0) + 1;
    }

    let sortedWords = Object.entries(frequencies).sort((a, b) => b[1] - a[1]);

    return sortedWords.slice(0, n);
}

app.get("/", (req, res) =>  {
    res.render("index.ejs");
})

app.post("/analyze", async (req, res) => {

    let {url, nVal} = req.body;

    try {

        let urlResponse = await axios.get(url);
        let htmlData = urlResponse.data;
        let $ = cheerio.load(htmlData);
        let textContent = $('body').text();

        let mostFrequentWords = calculateWordFrequency(textContent, nVal);
        res.render('analysis.ejs', {mostFrequentWords, url, nVal});
    }
    catch(er) {
        res.render('error.ejs', {er});
    }

})

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
})