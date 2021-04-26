const got = require('got');
const cheerio = require('cheerio');

const helper = require('./helper');

async function getInfo_zippydamn(urls, cb){

    const response = await got(urls)
	let $ = cheerio.load(response.body);
    try{
	let temp = []
    $('.center').each((pos, res) => {
    	reg=/<.+?>/gi
    	res=$(res).html().split(reg)
		temp.push(res.filter(x=>!x.trim().length<1))

    })
    
    let filetype = $('title').text().match(/\.[0-9a-z]+$/i)[0]
    
    temp=temp[0]
    let info = {
        v:'2',
        title:temp[2]?temp[2]:false,
        size:temp[4]?temp[4]:false,
        upload:temp[6]?temp[6]:false,
        last:temp[8]?temp[8]:false,
        filetype,
        success:temp[6].search(/\d{1,}/)<0?false:true
    }
    return info
}catch(err){
    return err
}

}

module.exports = getInfo_zippydamn