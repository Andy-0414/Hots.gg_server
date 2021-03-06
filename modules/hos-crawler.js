const axios = require("axios")
const cheerio = require("cheerio")
// 인벤 크롤링해와야함
class HosCrawler {
    constructor() {
        this.heroDataList = []
        this.invenDataList = []
        this.update()
    }
    update() {
        return Promise.all([
            new Promise((resolve, reject) => {
                axios.get("https://heroesofthestorm.com/ko-kr/heroes/")
                    .then(html => {
                        var $ = cheerio.load(html.data)
                        var str = $("script").get()[9].children[0].data

                        this.heroDataList = JSON.parse(str.split(/(window.blizzard.hgs.*) =/g)[2].replace(";", ""))
                        resolve(true)
                    })
                    .catch(err => [
                        reject(err)
                    ])
            }),
            new Promise((resolve, reject) => {
                axios.get("http://hos.inven.co.kr/dataninfo/hero/")
                    .then(html => {
                        var $ = cheerio.load(html.data)
                        var heroCodeList = $(".hosDbCommonHeroList").children()
                        this.invenDataList = []
                        var promiseList = []
                        heroCodeList.each((i, e) => {
                            if (i == 0) return
                            var name = heroCodeList[i].children[1].children[0].data
                            var code = e.attribs.href.split('=')[1]
                            this.invenDataList.push({
                                name,
                                code,
                                ability: []
                            })
                            promiseList.push(new Promise(resolve => {
                                axios.get(`http://hos.inven.co.kr/dataninfo/hero/detail.php?code=${code}`)
                                    .then(html => {
                                        var $ = cheerio.load(html.data)
                                        var Ability = $(".talentLevel0>dd")
                                        var Ability_TMP = []
                                        Ability.children().each((i, e) => {
                                            var current = $(e).find("p.name")
                                            Ability_TMP.push({
                                                name: current.text(),
                                                text: current.next().text(),
                                                tier: e.attribs["data-talent-tier"]
                                            })
                                            this.invenDataList[this.invenDataList.findIndex(x => x.name == name)].ability = Ability_TMP
                                        })
                                        resolve(html.data)
                                    })
                            }))

                        })
                        Promise.all(promiseList)
                            .then(data => {
                                resolve(true)
                            })
                            .catch(err => {
                                reject(err)
                            })
                    })
            })
        ])
            .then(() => {
                console.log("OK")
                this.invenDataList.forEach(x => {
                    var i = this.heroDataList.findIndex(y => {
                        return x.name.replace(/ /gi, "").indexOf(y.name.replace(/ /gi, "")) != -1 ||
                            y.name.replace(/ /gi, "").indexOf(x.name.replace(/ /gi, "")) != -1
                    })
                    if (i == -1) console.log("ERR", x.name)
                    else {
                        console.log("OK", x.name)
                        this.heroDataList[i].characteristic = x.ability
                        this.heroDataList[i].winRate = 40 + (Math.random() * 20 + 1) // 40%~60%
                        this.heroDataList[i].pickRate = (Math.random() * 10 + 1) // 1%~10%
                    }
                })
                console.log(this.heroDataList.length, this.invenDataList.length) // 안두인 없음
            })
            .catch(err => {
                console.log("FAIL:RESTART")
                this.update()
            })

    }
    getHeroData(key) {
        return this.heroDataList.find(x => {
            x.name == key
        })
    }
    getHeroDataList() {
        return this.heroDataList
    }
    isHeroDataLoad(){
        return !!this.heroDataList
    }
}

module.exports = new HosCrawler();