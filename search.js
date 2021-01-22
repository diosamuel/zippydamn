const got = require('got');
const url = require('url');
const fs = require('fs');
const colors = require('colors');

function search_zippydamn(question) {

    let urls = `https://www.googleapis.com/customsearch/v1?key=AIzaSyBcc2lVOR22UynczYF00m0ORykae1RE5OI&cx=partner-pub-2958868595034693:9969718365&q=${question}`
    ;(async () => {

        console.log(`SEARCHING FOR "${question}"`.bgBlue)
        let res = await got(urls)

        let response = JSON.parse(res.body)
        if (!!response.items) {

            for (i = 0; i < response.items.length; i++) {

                let res = response.items[i];
                let desc = res.snippet.search(/size/i) < 0 ? res.snippet : 'Size ' + res.snippet.split(/size/i)[1].split(/addthis/i)[0]

                console.log('\n', i + 1)
                console.log(' ================================'.rainbow)
                console.log(` ${res.title}`)
                console.log(` ${res.link}`.green)
                console.log(` ${desc}`)
                console.log(' ================================'.rainbow)
            }

        } else {
            console.log(`Error, "${question}" not found!`)
        }
    })()

}

module.exports = search_zippydamn