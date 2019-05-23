const axios = require("axios");
const cheerio = require("cheerio");
const getHeroData = () => {
    return axios.get("https://api.hotslogs.com/Public/Data/Heroes")
}
const getOneHeroFullPage = (key) => {
    return axios.get(`https://heroesofthestorm.com/ko-kr/heroes/${key}/`)
}
const getHeroListPage = () => {
    return axios.get("https://heroesofthestorm.com/ko-kr/heroes/")
}
getHeroListPage()
    .then(html => {
        const $ = cheerio.load(html.data)
        const str = $("script").get()[9].children[0].data
        console.log(JSON.parse(str.split(/(window.blizzard.hgs.*) =/g)[2].replace(";", ""))[0])
    })
// getHeroData()
//     .then(data => {
//         data.data.forEach(x => {
//             getOneHeroFullPage(x.Translations.split(",")[0].toLowerCase())
//                 .then(html => {
//                     const $ = cheerio.load(html.data)
//                     var text = $('.hero-identity').find(".hero-identity__name").text()
//                     console.log(text)
//                 })
//                 .catch(err=>{
//                     console.log(x.Translations.split(",")[0], "ERR")
//                 })
//         })
//     })