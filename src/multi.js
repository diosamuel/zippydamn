const got = require('got');
const cheerio = require('cheerio');
const url = require('url');
const fs = require('fs');
const colors = require('colors');
const helper = require('./helper');

function multi_zippydamn(pathURLFile, pathSavedFile = 'result.txt') {

    if (helper.isExistFile(pathURLFile) && helper.isEmptyFile(pathURLFile)) {
        console.log('source file : '.green + pathURLFile)
        console.log('save to : '.green + pathSavedFile)
        q = fs.readFileSync(pathURLFile, 'utf8').split(/\n/);
    } else {
        console.log('\n')
        console.log(`File ${pathURLFile} doesnt exists or empty file!`.bgRed);
        q = []
    }

    let downloadLink = [];
    (async () => {
        for (i = 0; i < q.length; i++) {

            try {
                if (!helper.isZippyShareUrl(q[i])) {
                    console.log(`[FAIL] ${q[i]}`.red)
                } else {
                    const response = await got(q[i]);

                    let $ = await cheerio.load(response.body);
                    let elementPosition = []
                    $('script').each((pos, res) => {
                        let links = $(res).html().search(/dlbutton/g)
                        elementPosition.push(links)
                    })

                    if (elementPosition.every(x => x < 0)) {
                        console.log(`[INVALID/EXPIRED] ${q[i]}`.bgRed)
                    } else {
                        console.log(`[OK] ${q[i]}`.bgGreen)
                        $('script').each((pos, res) => {
                            let links = $(res).html().search(/dlbutton/g)
                            if (links >= 0) {
                                let tagScript = $(res).html()
                                let divider = tagScript.split(';')[0]
                                let decrypt = divider.split("document.getElementById('dlbutton').href = ")[1]
                                let result = `${url.parse(q[i]).hostname}${eval(decrypt)}`
                                downloadLink.push(result)
                            }
                        })
                    }
                }

            } catch (error) {
                console.log(error);
            } finally {
                fs.writeFileSync(pathSavedFile, downloadLink.join('\n'))
            }

        }

    })();

}

module.exports = multi_zippydamn