// extract url to get a downloadable link
const cheerio = require('cheerio');
const url = require('url');
const fs = require('fs');
const colors = require('colors');
const helper = require('./helper');
const got = require('got');

let resultUrl={
    v:'1'
}
async function down_zippydamn(urls,cb) {

    if (helper.isValidUrl(urls) && helper.isZippyShareUrl(urls)) {
        
            let response = await got(urls)
            if (response.statusCode != 200) {
                resultUrl.msg="Link not found or link expired!"
            } else {
                let $ = cheerio.load(response.body);
                let elementPosition = []
                $('script').each((pos, res) => {
                    let links = $(res).html().search(/dlbutton/g)
                    elementPosition.push(links)
                })

                if (!elementPosition.every(x => x < 0)) {
                    $('script').each((pos, res) => {
                        let links = $(res).html().search(/dlbutton/g)
                        if (links >= 0){
                            let tagScript = $(res).html()
                            let divider = tagScript.split(';')[0]
                            let decrypt = divider.split("document.getElementById('dlbutton').href = ")[1]
                            let result = `${url.parse(urls).hostname}${eval(decrypt)}`
                            resultUrl.msg=result
                            resultUrl.success=true
                        }
                    })
                }else{
                    resultUrl.msg="Link not found or link expired!"
                }

                return resultUrl

            }


    } else {
        resultUrl.msg=`Invalid link!`

        return resultUrl
    }


}
module.exports = down_zippydamn