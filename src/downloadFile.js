// download file from given link
const got = require("got");
const { createWriteStream } = require("fs");
const cliProgress = require('cli-progress');
const bar1 = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);
const path = require('path')
const zippydamn = {
  info:require('./getInfo')
}

async function downloadFile(url, fileName){

console.log(url)
downloadStream = got.stream(url);
fileWriterStream = createWriteStream(fileName);

downloadStream
  .on("downloadProgress", ({ transferred, total, percent }) => {
    const percentage = Math.round(percent * 100);
    // console.error(`progress: ${transferred}/${total} (${percentage}%)`);
    bar1.start(total,percentage)
    bar1.update(transferred)
  })
  .on("error", (error) => {
    console.error(`[FAIL]`.bgRed);
    console.error(`[FAIL]  ${error.message}`.red);
  })

fileWriterStream
  .on("error", (error) => {
    console.error(`Could not write file to system: ${error.message}`);
  })
  .on("finish", () => {
    bar1.stop();
    console.log(`\n[SUCCESS]`.bgCyan)
    console.log(`${path.resolve(process.cwd(),fileName)}`.brightCyan)

  });

downloadStream.pipe(fileWriterStream);

}

module.exports=downloadFile