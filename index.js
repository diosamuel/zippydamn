#!/usr/bin/env node
const { Command } = require('commander');
const program = new Command();

const ZippyDamn = {
  down:require('./down'),
  multi:require('./multi'),
  search:require('./search')
}

console.log(`
███████╗██╗██████╗ ██████╗ ██╗   ██╗██████╗  █████╗            ███╗   ██╗██╗
╚══███╔╝██║██╔══██╗██╔══██╗╚██╗ ██╔╝██╔══██╗██   ██╗████╗ ████║████╗  ██║██║
  ███╔╝ ██║██████╔╝██████╔╝ ╚████╔╝ ██║  ██║███████║██╔████╔██║██╔██╗ ██║██║
 ███╔╝  ██║██╔═══╝ ██╔═══╝   ╚██╔╝  ██║  ██║██   ██║██║╚██╔╝██║██║╚██╗██║╚═╝
███████╗██║██║     ██║        ██║   ██████╔╝██   ██║██║ ╚═╝ ██║██║ ╚████║██
╚══════╝╚═╝╚═╝     ╚═╝        ╚═╝   ╚═════╝      ╚═╝        ╚═╝  ╚══╝╚═╝    
by @diosamuel
`)

program
  .name("zippydamn")
  .usage("[global options] command")
  .option('-s, --search <query...>', 'search file on zippyshare')
  .option('-d, --download <link>', 'download just one link')
  .option('-m, --multi <source...>', 'download multiple link from files');
program.addHelpText('after', `
Example command:
  $ zippydamn -s song
  $ zippydamn -d https://www19.zippyshare.com/v/lKeHaNxX/file.html
  $ zippydamn -m file.txt result.txt
  `);

program.parse(process.argv);

const options = program.opts();

if(options.download){
	ZippyDamn.down(options.download)
}else if(options.multi){
	ZippyDamn.multi(options.multi[0],options.multi[1])
}else if(options.search){
	ZippyDamn.search(options.search.join(' '))
}else{
	console.log('type "zippydamn -h" for help')
}