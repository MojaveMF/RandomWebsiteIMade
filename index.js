const jimp = require('jimp')
const path = require('path')
const express = require('express')
const app = express()
const imagepath = path.join(__dirname, "1984.gif")
const fs = require('fs')
const {
    query,
    response
} = require('express')
const cache = path.join(__dirname, "cached")

var gis = require('g-i-s');
const gen = require('./modules/gengif')
app.get('/1984.gif', async function(req, rep) {
    const url = req.url
    if (url.includes(")") || url.includes('"')) {
        console.log("Looser found")
        return 
    }
    const content = await gen.generate(req.query.text,rep)
})




app.get("/search.html", function(req, rep) {
    try {
        if (req.url.includes(")") || req.url.includes('"')) {
            console.log("Looser found")
            return
        }
    } catch (err) {
        console.log(rep.url)
    }
    const searchfor = req.query.search
    gis(searchfor, function(err, results) {
        try {
            const thing = results[Math.floor(Math.random() * results.length)]
            rep.end(`<!DOCTYPE html><head><meta property="og:type" content="website"><meta name="theme-color" content="#d9db95"><meta property="og:site_name" content="Made by MojaveMF#2577"><meta property="og:title" content="Google Search"><meta property="og:description" content="Searched for ${searchfor} "><meta property="og:image" content="${thing.url}"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:site" content="@discord"></head>`)
        } catch (err) {
            console.log(err)
            rep.end(`<!DOCTYPE html><head><meta property="og:type" content="website"><meta name="theme-color" content="#e82c2c"><meta property="og:site_name" content="Made by MojaveMF#2577"><meta property="og:title" content="Uh oh"><meta property="og:description" content="${err}"><meta property="og:image" content="https://cdn0.iconfinder.com/data/icons/flat-design-basic-set-1/24/error-exclamation-512.png"><meta name="twitter:site" content="@discord"></head>`)
        }
    });
})

app.listen(80)