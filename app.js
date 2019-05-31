const express = require('express')
const app = express()

const hosCrawler = require('./modules/hos-crawler')

app.use(express.static("public"))

app.get('/', (req, res) => { // 디버그 페이지
    res.sendFile('./public/index.html')
})
app.get('/getHeroData', (req, res) => { // 영웅 정보
    res.send(hosCrawler.getHeroDataList())
})
app.listen(3000, () => { // 포트 3000
    console.log("SERVER OPEN")
})