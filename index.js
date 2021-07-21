#!/usr/bin/env node

const {
    Command
} = require('commander')
const fs = require('fs')
const color = require('colors')
const got = require('got')
const path = require('path')
const program = new Command();

console.log(`
███████╗██╗██████╗ ██████╗ ██╗   ██╗██████╗  █████╗            ███╗   ██╗██╗
╚══███╔╝██║██╔══██╗██╔══██╗╚██╗ ██╔╝██╔══██╗██   ██╗████╗ ████║████╗  ██║██║
  ███╔╝ ██║██████╔╝██████╔╝ ╚████╔╝ ██║  ██║███████║██╔████╔██║██╔██╗ ██║██║
 ███╔╝  ██║██╔═══╝ ██╔═══╝   ╚██╔╝  ██║  ██║██   ██║██║╚██╔╝██║██║╚██╗██║╚═╝
███████╗██║██║     ██║        ██║   ██████╔╝██   ██║██║ ╚═╝ ██║██║ ╚████║██
╚══════╝╚═╝╚═╝     ╚═╝        ╚═╝   ╚═════╝      ╚═╝        ╚═╝  ╚══╝╚═╝    
`.brightCyan)


const zippydamn={
    extract:require('./src/extract'),
    extractv2:require('./src/extractv2'),
    dl:require('./src/downloadFile'),
    info:require('./src/getInfo'),
    infov2:require('./src/getInfov2'),
    expire:require('./src/checkExpires'),
    search:require('./src/search'),
}

program
    .name("zippydamn")
    .usage("[global options] command")
    .option('-s, --search <query...>', 'search file on zippyshare')
    .option('-d, --download <link>', 'only extract url and give you downloadable url')
    .option('-dl, --downloadFile <link...>', 'extract and download file from zippyshare url')
program.addHelpText('after', `
Example command:
  $ zippydamn -s song
  $ zippydamn -d https://www19.zippyshare.com/v/lKeHaNxX/file.html
  $ zippydamn -m list.txt result.txt
  $ zippydamn -dl https://www19.zippyshare.com/v/lKeHaNxX/file.html C:\\Users\\Music
  `);

program.parse(process.argv);

(async ()=>{

    const options = program.opts();
    if (options.download) {
        console.log('Wait...')
        let opt = {
            ext:await zippydamn.extract(options.download),
            info:await zippydamn.info(options.download),
        }
 
        let resultUrl = opt.ext.success ? opt.ext : await zippydamn.extractv2(options.download)
        let infoUrl = opt.info.success ? opt.info : await zippydamn.infov2(options.download)

        if(!!resultUrl.success){
            let pesan = `Title : ${infoUrl.title}\n`.cyan
                pesan += `Size : ${infoUrl.size}\n`.cyan
                pesan += `Url : \n${resultUrl.msg}\n`.brightCyan
            console.log(pesan)
        }else{
            console.log(resultUrl.msg)
        }

    }else if (options.downloadFile) {
        let opt = {
            ext:await zippydamn.extract(options.downloadFile[0]),
            info:await zippydamn.info(options.downloadFile[0]),
        }

        let resultUrl = opt.ext.success ? opt.ext : await zippydamn.extractv2(options.downloadFile[0])
        let infoUrl = opt.info.success ? opt.info : await zippydamn.infov2(options.downloadFile[0])
        let toPath = options.downloadFile[1]
        if(toPath){
            toPath = toPath.endsWith('\\')?toPath:`${toPath}\\`
        }else{
            toPath = ''
        }

        console.log('[DOWNLOAD]'.cyan)
        console.log(`Title : ${infoUrl.title}`.brightCyan)
        console.log(`Size : ${infoUrl.size}`.brightCyan)
        if(toPath){
            console.log(`Path : ${toPath}`.brightCyan)
        }
        await zippydamn.dl(`https://${resultUrl.msg}`, `${toPath}${infoUrl.title}${infoUrl.filetype}`)
    
    } else if (options.search) {
        console.log(`[?] Search "${options.search.join(' ')}"`.bgBlue)

        let result = await zippydamn.search(options.search.join(' '))

        if(typeof result!="object"){
            console.log(result)
        }else{
            result.forEach((x,i)=>{
                let pesan = "\n".rainbow
                    pesan += `Title : ${x.title}\n`
                    pesan += `Link : ${x.link}\n`
                    pesan += `Desc : ${x.desc}\n`
                    pesan += "======================".rainbow                
                console.log(pesan)
            })
        }


    
    } else {
        console.log('type "zippydamn -h" for help')
    }


})()
