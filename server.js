const PORT = process.env.PORT || 80
const express = require('express')
const axios = require('axios')
const cheerio = require('cheerio')
const { request } = require('express')

const app = express()

rumours = [];
sourcesDe = [];
sourcesGb = [];
sourcesEs = [];
sourcesIt = [];
sourcesFr = [];
transfers = [];

GetData();
setInterval(GetData, 30000);
//GetAllRumours();

app.get('/', (req, res) => {
    res.json('Welcome to the Rumour Mill API.');
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

app.get('/transfers', (req, res) => {
    res.json(transfers);
})

function GetAllRumours() {
    let delay = 30000;
    setInterval(GetEsRumours, delay);
    setInterval(GetDeRumours, (delay + 3000));
    setInterval(GetGbRumours, (delay + 4000));
    setInterval(GetItRumours, (delay + 5000));
    setInterval(GetFrRumours, (delay + 6000));
    setInterval(GetTransfers, 500000);

}

function GetData() {
    GetEsRumours();
    GetDeRumours();
    GetGbRumours();
    GetFrRumours();
    GetItRumours();
    GetTransfers();

}

function GetTransfers() {
    transfers.length = 0;
    axios.get('https://www.transfermarkt.com/transfers/neuestetransfers/statistik/plus/?plus=1&galerie=0&wettbewerb_id=alle&land_id=&minMarktwert=1.000.000&maxMarktwert=200.000.000')
        .then((response) => {
            const html = response.data
            const $ = cheerio.load(html)

            const data = [...$(".items .odd, .items .even")].map(e => {
                const row = [...$(e).find(".hauptlink")].map(e => $(e).text().trim());
                //currentClub = $(e).find(".zentriert a").attr('title')
                //otherRow = [...$(e).find(".zentriert a")].map(e => $(e).attr('href').trim())
                const dateOfTransfer = [...$(e).find(".zentriert")].map(e => $(e).text().trim());
                const transferValue = $(e).find(".rechts.hauptlink").text().trim();
                const marketValue = [...$(e).find(".rechts")].map(e => $(e).text().trim());
                transfers.push({
                    playerName: row[0],
                    transferFrom: row[1],
                    transferTo: row[2],
                    dateOfTransfer: dateOfTransfer[2],
                    marketValue: marketValue[0],
                    transferValue: transferValue
                    //url: otherRow[1]

                })
            });
        })
}

function GetGbRumours() {
    sourcesGb.length = 0;
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
    sourcesDe.length = 0;
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
    sourcesEs.length = 0;
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
    sourcesIt.length = 0;
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
    sourcesFr.length = 0;
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


//app.get('/gb/rumours', (req, res) => {
//    axios.get('https://www.transfermarkt.co.uk/rumour-mill/detail/forum/180')
//        .then((response) => {
//            rumours = []
//            const html = response.data
//            const $ = cheerio.load(html)

//            $('article[class="thread"]', html).each(function () {
//                const playerName = $(this).find('.spielername').text()
//                const currentClub = $(this).find('.vereinname').text()
//                const interestedClub = $(this).find('.wechsel-verein-name-kurz').text()
//                const transferValue = $(this).find('strong').text()
//                const rawUrl = $(this).attr('itemid')

//                if (playerName) {
//                    url = rawUrl.replace("transfermarkt.uk", "transfermarkt.co.uk")                    
//                    rumours.push({
//                        playerName,
//                        currentClub,
//                        interestedClub,
//                        transferValue,
//                        url
//                    })
//                }
//            })
//            res.json(rumours)
//        }).catch((err) => console.log(err))

//})

//app.get('/de/rumours', (req, res) => {
//    axios.get('https://www.transfermarkt.com/rumour-mill/detail/forum/500')
//        .then((response) => {
//            rumours = []
//            const html = response.data
//            const $ = cheerio.load(html)

//            $('article[class="thread"]', html).each(function () {
//                const playerName = $(this).find('.spielername').text()
//                const currentClub = $(this).find('.vereinname').text()
//                const interestedClub = $(this).find('.wechsel-verein-name-kurz').text()
//                const transferValue = $(this).find('strong').text()
//                const url = $(this).attr('itemid')

//                if (playerName) {
//                    rumours.push({
//                        playerName,
//                        currentClub,
//                        interestedClub,
//                        transferValue,
//                        url
//                    })
//                }
//            })
//            res.json(rumours)
//        }).catch((err) => console.log(err))

//})

app.listen(PORT, () => console.log(`server running on PORT ${PORT}`))