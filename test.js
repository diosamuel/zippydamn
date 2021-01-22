const ZippyDamn = {
  down:require('./down'),
  multi:require('./multi'),
  search:require('./search')
}

//generate downloadable url
ZippyDamn.down('https://www72.zippyshare.com/v/87OpBCJo/file.html')
//search
ZippyDamn.search('anime')
//multiple link
ZippyDamn.multi('list.txt','res.txt')