const axios = require("axios")
const cheerio = require("cheerio")

class HosCrawler{
    constructor(){
        this.heroDataList = [];
        this.update()
    }
    update() {
        return new Promise((resolve, reject) => {
            axios.get("https://heroesofthestorm.com/ko-kr/heroes/")
                .then(html => {
                    var $ = cheerio.load(html.data)
                    var str = $("script").get()[9].children[0].data
    
                    this.heroDataList = JSON.parse(str.split(/(window.blizzard.hgs.*) =/g)[2].replace(";", ""))
                    resolve(this.heroDataList)
                })
                .catch(err => [
                    reject(err)
                ])
        })
    }
    getHeroData(key){
        return this.heroDataList.find(x=>{x.name == key})
    }
    getHeroDataList(){
        return this.heroDataList
    }
}

module.exports = new HosCrawler();