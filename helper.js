const fs = require('fs');
const url = require('url');

class Helper {
    isValidUrl(url) {
        let regexPattern = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/
        return regexPattern.test(url)
    }
    isZippyShareUrl(link) {
        let hostName = url.parse(link).hostname

        if (this.isValidUrl(link) && /zippyshare/gi.test(hostName)) {
            return true
        } else {
            return false
        }
    }
    isExistFile(file) {
        return fs.existsSync(file)
    }
    isEmptyFile(file) {
        return !!fs.readFileSync(file, 'utf8')
    }
}


module.exports = new Helper