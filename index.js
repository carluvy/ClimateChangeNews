const PORT = process.env.PORT || 8000
import express, { response } from 'express'
import axios from 'axios'
import cheerio from 'cheerio'

const app = express()
const newspapers = [
    {
        name: 'the guardian',
        address: 'https://www.theguardian.com/environment/climate-crisis',
        base: ''
    },
    {
        name: 'bbc',
        address: 'https://www.bbc.com/news/science-environment-56837908',
        base: ''
    },
    {
        name: 'the telegraph',
        address: 'https://www.telegraph.co.uk/environment/',
        base: ''
    },
    {
        name: 'cnn',
        address: 'https://edition.cnn.com/specials/world/cnn-climate',
        base: ''
    },
    {
        name: 'standard',
        address: 'https://www.standardmedia.co.ke/',
        base: ''
    },
    {
        name: 'nation',
        address: 'https://nation.africa/kenya',
        base: ''
    },
    {
        name: 'the star',
        address: 'https://www.the-star.co.ke/',
        base: ''
    },
    {
        name: 'the newyork times',
        address: 'https://www.nytimes.com/section/climate',
        base: ''
    },
    {
        name: 'dw',
        address: 'https://www.dw.com/en/environment/s-11798',
        base: ''
    },
    {
        name: 'aljazeera',
        address: 'https://www.aljazeera.com/climate-crisis',
        base: ''
    },
    {
        name: 'nyp',
        address: 'https://nypost.com/tag/climate-change/',
        base: ''
    }

]
const articles = []
newspapers.forEach(newspaper => {
    axios.get(newspaper.address)
    .then(response => {
        const html = response.data
        const $ = cheerio.load(html)

        $('a:contains("climate")', html).each(function() {
            const title = $(this).text()
            const url = $(this).attr('href')
            
            articles.push({
                title,
                url: newspaper.base + url,
                source: newspaper.name
            })
            
        })
    })
})

app.get('/', (req, res) => {
    res.json('Welcom to my climate api')
})

app.get('/news', (req, res) => {
    res.json(articles)
})

app.get('/news/:newspaperId', (req, res) => {
    const newspaperId = req.params.newspaperId

    const newspaperAddress = newspapers.filter(newspaper => newspaper.name == newspaperId)[0].address
    const newspaperBase = newspapers.filter(newspaper => newspaper.name == newspaperId)[0].base

    axios.get(newspaperAddress)
        .then(response => {
            const html = response.data
            const $ = cheerio.load(html)
            const specificArticles = []

            $('a:contains("climate")', html).each(function () {
                const title = $(this).text()
                const url = $(this).attr('href')
                specificArticles.push({
                    title,
                    url: newspaperBase + url,
                    source: newspaperId
                })
            })
            res.json(specificArticles)
        }).catch(err => console.log(err))
})

    


app.listen(PORT, () => console.log('server running on PORT:' + PORT))

