const express = require('express')
const app = express()

const hosCrawler = require('./modules/hos-crawler')

app.use(express.static("public"))

app.get('/', (req, res) => {
    res.sendFile('./public/index.html')
})
app.get('/getHeroData', (req, res) => {
    res.send(hosCrawler.getHeroDataList())
})
app.listen(3000, () => {
    console.log("SERVER OPEN")
})