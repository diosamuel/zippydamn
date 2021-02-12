#!/usr/bin/env node

console.log(`
███████╗██╗██████╗ ██████╗ ██╗   ██╗██████╗  █████╗            ███╗   ██╗██╗
╚══███╔╝██║██╔══██╗██╔══██╗╚██╗ ██╔╝██╔══██╗██   ██╗████╗ ████║████╗  ██║██║
  ███╔╝ ██║██████╔╝██████╔╝ ╚████╔╝ ██║  ██║███████║██╔████╔██║██╔██╗ ██║██║
 ███╔╝  ██║██╔═══╝ ██╔═══╝   ╚██╔╝  ██║  ██║██   ██║██║╚██╔╝██║██║╚██╗██║╚═╝
███████╗██║██║     ██║        ██║   ██████╔╝██   ██║██║ ╚═╝ ██║██║ ╚████║██
╚══════╝╚═╝╚═╝     ╚═╝        ╚═╝   ╚═════╝      ╚═╝        ╚═╝  ╚══╝╚═╝    
by @diosamuel
`)

const {
    Command
} = require('commander');
const program = new Command();

const ZippyDamn = {
    down: require('./src/down'),
    downloadFile: require('./src/downloadFile'),
    multi: require('./src/multi'),
    search: require('./src/search'),
}

program
    .name("zippydamn")
    .usage("[global options] command")
    .option('-s, --search <query...>', 'search file on zippyshare')
    .option('-d, --download <link>', 'just extract url and give you downloadable url')
    .option('-dl, --downloadFile <link>', 'extract and download the file from url')
    .option('-m, --multi <source...>', 'just extract multiple url from files');
    // .option('-ml, --multiDownload <source...>', 'extracy and download multiple url from files');
program.addHelpText('after', `
Example command:
  $ zippydamn -s song
  $ zippydamn -d https://www19.zippyshare.com/v/lKeHaNxX/file.html
  $ zippydamn -m list.txt result.txt
  $ zippydamn -dl https://www19.zippyshare.com/v/lKeHaNxX/file.html
  `);

program.parse(process.argv);

const options = program.opts();

if (options.download) {
    console.log('url : '.brightCyan + options.download)      
    console.log('------------------------------------')      
    ZippyDamn.down(options.download, function(result) {
        console.log('result : '.brightGreen + result)      
    })
} else if (options.downloadFile) {

    ZippyDamn.search(options.downloadFile, (result) => {
        ZippyDamn.down(options.downloadFile, (res) => {
            ZippyDamn.downloadFile("https://" + res, result[0].title)
        })
    })

} else if (options.multi) {
    ZippyDamn.multi(options.multi[0], options.multi[1])
} else if (options.search) {
    ZippyDamn.search(options.search.join(' '), function(res) {
        console.log(`[>] Search "${options.search.join(' ')}"`.bgBlue)

        if (typeof res != "object") {
            console.log(res)
        } else {
            res.forEach(result => {

                console.log('\n', result.id + 1)
                console.log(' ================================'.rainbow)
                console.log(` ${result.title}`)
                console.log(` ${result.link}`.green)
                console.log(` ${result.desc}`)
                console.log(' ================================'.rainbow)

            })
        }

    })
} else {
    console.log('type "zippydamn -h" for help')
}