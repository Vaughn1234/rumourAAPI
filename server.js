const PORT = process.env.PORT || 80
const express = require('express')
const axios = require('axios')
const cheerio = require('cheerio')
const { request } = require('express')

const app = express()

rumours = []
sourcesDe = [];
sourcesGb = [];
sourcesEs = [];
sourcesIt = [];
sourcesFr = [];

app.get('/', (req, res) => {
    res.json('Welcome to the Rumour Mill API.')
    GetAllRumours();
})

app.get('/sources/DE1', (req, res) => {
    res.json(sourcesDe);
        })

app.get('/sources/GB1', (req, res) => {
    res.json(sourcesGb);
})
app.get('/sources/es1', (req, res) => {
    res.json(sourcesEs);
})

app.get('/sources/it1', (req, res) => {
    res.json(sourcesIt);
})

app.get('/sources/fr1', (req, res) => {
    res.json(sourcesFr);
})

function GetAllRumours() {
    setInterval(GetEsRumours, 30000);
    setInterval(GetDeRumours, 30000);
    setInterval(GetGbRumours, 30000);
    setInterval(GetItRumours, 30000);
    setInterval(GetFrRumours, 30000);

}

function GetGbRumours() {
    axios.get('https://www.transfermarkt.de/premier-league/geruechte/wettbewerb/GB1')
        .then((response) => {
            const html = response.data
            const $ = cheerio.load(html)

            const data = [...$(".items .odd, .items .even")].map(e => {
                const row = [...$(e).find(".hauptlink")].map(e => $(e).text().trim());
                currentClub = $(e).find(".zentriert a").attr('title')
                otherRow = [...$(e).find(".zentriert a")].map(e => $(e).attr('href').trim())
                sourcesGb.push({
                    playerName: row[0],
                    currentClub: currentClub,
                    interestedClub: row[1],
                    url: otherRow[1]

                })
            });
        })
}

function GetDeRumours() {
    sourcesDe = [];
    axios.get('https://www.transfermarkt.de/bundesliga/geruechte/wettbewerb/L1')
        .then((response) => {
            const html = response.data
            const $ = cheerio.load(html)

            const data = [...$(".items .odd, .items .even")].map(e => {
                const row = [...$(e).find(".hauptlink")].map(e => $(e).text().trim());
                currentClub = $(e).find(".zentriert a").attr('title')
                otherRow = [...$(e).find(".zentriert a")].map(e => $(e).attr('href').trim())
                sourcesDe.push({
                    playerName: row[0],
                    currentClub: currentClub,
                    interestedClub: row[1],
                    url: otherRow[1]

                })
            });
        })
}

function GetEsRumours() {
    sourcesEs = [];
    axios.get('https://www.transfermarkt.de/laliga/geruechte/wettbewerb/ES1')
        .then((response) => {
            const html = response.data
            const $ = cheerio.load(html)

            const data = [...$(".items .odd, .items .even")].map(e => {
                const row = [...$(e).find(".hauptlink")].map(e => $(e).text().trim());
                currentClub = $(e).find(".zentriert a").attr('title')
                otherRow = [...$(e).find(".zentriert a")].map(e => $(e).attr('href').trim())
                sourcesEs.push({
                    playerName: row[0],
                    currentClub: currentClub,
                    interestedClub: row[1],
                    url: otherRow[1]
                })
            });
        })
}

function GetItRumours() {
    axios.get('https://www.transfermarkt.de/serie-a/geruechte/wettbewerb/IT1')
        .then((response) => {
            const html = response.data
            const $ = cheerio.load(html)

            const data = [...$(".items .odd, .items .even")].map(e => {
                const row = [...$(e).find(".hauptlink")].map(e => $(e).text().trim());
                currentClub = $(e).find(".zentriert a").attr('title')
                otherRow = [...$(e).find(".zentriert a")].map(e => $(e).attr('href').trim())
                sourcesIt.push({
                    playerName: row[0],
                    currentClub: currentClub,
                    interestedClub: row[1],
                    url: otherRow[1]

                })
            });
        })
}

function GetFrRumours() {
    axios.get('https://www.transfermarkt.de/ligue-1/geruechte/wettbewerb/FR1')
        .then((response) => {
            const html = response.data
            const $ = cheerio.load(html)

            const data = [...$(".items .odd, .items .even")].map(e => {
                const row = [...$(e).find(".hauptlink")].map(e => $(e).text().trim());
                currentClub = $(e).find(".zentriert a").attr('title')
                otherRow = [...$(e).find(".zentriert a")].map(e => $(e).attr('href').trim())
                sourcesFr.push({
                    playerName: row[0],
                    currentClub: currentClub,
                    interestedClub: row[1],
                    url: otherRow[1]

                })
            });
        })
}


app.get('/gb/rumours', (req, res) => {
    axios.get('https://www.transfermarkt.co.uk/rumour-mill/detail/forum/180')
        .then((response) => {
            rumours = []
            const html = response.data
            const $ = cheerio.load(html)

            $('article[class="thread"]', html).each(function () {
                const playerName = $(this).find('.spielername').text()
                const currentClub = $(this).find('.vereinname').text()
                const interestedClub = $(this).find('.wechsel-verein-name-kurz').text()
                const transferValue = $(this).find('strong').text()
                const rawUrl = $(this).attr('itemid')

                if (playerName) {
                    url = rawUrl.replace("transfermarkt.uk", "transfermarkt.co.uk")                    
                    rumours.push({
                        playerName,
                        currentClub,
                        interestedClub,
                        transferValue,
                        url
                    })
                }
            })
            res.json(rumours)
        }).catch((err) => console.log(err))

})

app.get('/de/rumours', (req, res) => {
    axios.get('https://www.transfermarkt.com/rumour-mill/detail/forum/500')
        .then((response) => {
            rumours = []
            const html = response.data
            const $ = cheerio.load(html)

            $('article[class="thread"]', html).each(function () {
                const playerName = $(this).find('.spielername').text()
                const currentClub = $(this).find('.vereinname').text()
                const interestedClub = $(this).find('.wechsel-verein-name-kurz').text()
                const transferValue = $(this).find('strong').text()
                const url = $(this).attr('itemid')

                if (playerName) {
                    rumours.push({
                        playerName,
                        currentClub,
                        interestedClub,
                        transferValue,
                        url
                    })
                }
            })
            res.json(rumours)
        }).catch((err) => console.log(err))

})

app.listen(PORT, () => console.log(`server running on PORT ${PORT}`))