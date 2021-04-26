const got = require('got');
const cheerio = require('cheerio');

const helper = require('./helper');

async function checkExpires(urls){

    const response = await got(urls)
	let $ = cheerio.load(response.body);
	let temp = '';
    $('#lrbox').each((pos, res) => {
    	// reg=/<.+?>/gi
    	res=$(res).text()
		// temp.push(res.filter(x=>!x.trim().length<1))
        temp=res.search('expired')>0?true:false
    })

return temp

}

module.exports=checkExpires
