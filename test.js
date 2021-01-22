const cheerio = require('cheerio');
const url = require('url');
const fs = require('fs');
const colors = require('colors');
const helper = require('./Helper');
const got = require('got');

let urls = process.argv[2]

console.log('url : '.brightCyan+urls)
if(helper.isValidUrl(urls) && helper.isZippyShareUrl(urls)){
	startScrape(urls)
}
else{
 	console.log("\n======== FAILED =======".bgRed)
	console.log('Sorry, seems like not a valid / not a zippyshare url')
}

async function startScrape(urls){

try{
const response = await got(urls)

if(response.statusCode!=200){
	console.log("\n======== FAILED =======".bgRed)
	console.log("Link not found or link expired!")
}else{
   let $ = cheerio.load(response.body);
   let elementPosition = []
 	$('script').each((pos, res)=>{
 		let links = $(res).html().search(/dlbutton/g)
 		elementPosition.push(links)
 	})
 	
 	if(!elementPosition.every(x=>x<0)){
		$('script').each((pos, res)=>{
 			let links = $(res).html().search(/dlbutton/g)
 			if(links >= 0){
 		  		let tagScript = $(res).html()
 		  		let divider = tagScript.split(';')[0]
 		  		let decrypt = divider.split("document.getElementById('dlbutton').href = ")[1]
 		  		let result = `${url.parse(urls).hostname}${eval(decrypt)}` 		 	
 		  		console.log("\n======== SUCCESS =======\n".green)
 		  		console.log(result)
 		  		console.log('\ncopy & paste it to browser'.brightCyan)
 			}
 		})
	}else{
 		console.log("\n======== FAILED =======".bgRed)
 		console.log("Link not found or link expired!")
	}
}

}catch(err){
	if(err.name=='HTTPError'){
 		console.log("\n======== FAILED =======".bgRed)
 		console.log(err.name)
 		console.log("Link not found or link expired!")
	}
}

}
