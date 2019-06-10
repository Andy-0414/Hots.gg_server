const express = require('express')
const app = express()

const hosCrawler = require('./modules/hos-crawler')

app.use(express.static("public")) // ./public 정적 파일 제공

app.get('/', (req, res) => { // DEBUG 페이지
    res.sendFile('./public/index.html')
})
app.get('/getHeroData', (req, res) => { // 영웅 정보 불러오기
    res.send(hosCrawler.getHeroDataList())
})
app.listen(3000, () => { // 3000포트
    console.log("SERVER OPEN")
})