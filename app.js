const express = require('express')
const app = express()

const axios = require("axios")
const cheerio = require("cheerio")

var heroInfomationList = []

function getHeroData() {
    return new Promise((resolve, reject) => {
        axios.get("https://heroesofthestorm.com/ko-kr/heroes/")
            .then(html => {
                var $ = cheerio.load(html.data)
                var str = $("script").get()[9].children[0].data

                heroInfomationList = JSON.parse(str.split(/(window.blizzard.hgs.*) =/g)[2].replace(";", ""))
                resolve(heroInfomationList)
            })
            .catch(err => [
                reject(err)
            ])
    })
}
getHeroData()
app.get('/',(req,res)=>{
    res.sendFile('./public/index.html')
})
app.get('/data',(req,res)=>{
    res.send(heroInfomationList)
})
app.listen(3000,()=>{
    console.log("SERVER OPEN")
})