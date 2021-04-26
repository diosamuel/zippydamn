//search file name
const got = require('got');
const url = require('url');
const fs = require('fs');
const colors = require('colors');
require('dotenv').config()

async function search_zippydamn(question,cb) {

    let urls = `https://www.googleapis.com/customsearch/v1?key=${process.env.GOOGLE_CSE_KEY}&cx=partner-pub-2958868595034693:9969718365&q=${question}`
        try{
        let res = await got(urls)

        let response = JSON.parse(res.body)
        if (!!response.items) {

            let obj = []
            for (i = 0; i < response.items.length; i++) {

                let raw = response.items[i];
                let desc = raw.snippet.search(/size/i) < 0 ? raw.snippet : 'Size ' + raw.snippet.split(/size/i)[1].split(/addthis/i)[0]
                let result = {
                    id:i,
                    title:raw.pagemap.metatags[0]["twitter:title"],
                    link:raw.link,
                    desc
                }
                obj.push(result)
            }
            return obj
        } else {
            return "Try with another keyword!"
        }
    } catch (error) {
        if(error.response){
            return JSON.parse(error.response.body).error.message
        }else{
            throw error.message
        }
    }

}

module.exports = search_zippydamn