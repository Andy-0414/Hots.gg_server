const axios = require("axios")
const cheerio = require("cheerio")

class HosCrawler {
    constructor() {
        this.heroDataList = []
        this.invenDataList = []
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
            axios.get("http://hos.inven.co.kr/dataninfo/hero/")
                .then(html => {
                    var $ = cheerio.load(html.data)
                    var heroCodeList = $(".hosDbCommonHeroList").children()
                    this.invenDataList = []
                    heroCodeList.each((i, e) => {
                        if (i == 0) return
                        this.invenDataList.push({
                            name: heroCodeList[i].children[1].children[0].data,
                            code: e.attribs.href.split('=')[1],
                        })
                    })
                    console.log(this.invenDataList)
                })
        })
    }
    getHeroData(key) {
        return this.heroDataList.find(x => { x.name == key })
    }
    getHeroDataList() {
        return this.heroDataList
    }
}

module.exports = new HosCrawler();