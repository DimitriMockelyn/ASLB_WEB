var fs = require('fs');
const path = require('path');

const FILE_REPLACED='../node_modules/focus-components/src/search/facet-box/facet.js';
const FILE_TO_REPLACE='../node_modules/focus-components/src/search/facet-box/facet.js';
const FILE='../app/components/facet.js';
//if [ -f $FILE ]; then
	//echo "FILE EXISTS"
//else 
//	echo "File does not exist." 
//	cp ../node_modules/focus-components/search/facet-box/facet.js ../node_modules/focus-components/search/facet-box/facet.js
//fi;
//cp ../app/components/facet.js ../node_modules/focus-components/search/facet-box/facet.js

function copyFileSync(srcFile, destFile) {
    try {
        var BUF_LENGTH, buff, bytesRead, fdr, fdw, pos;
        BUF_LENGTH = 64 * 1024;
        buff = new Buffer(BUF_LENGTH);
        fdr = fs.openSync(srcFile, 'r');
        fdw = fs.openSync(destFile, 'w');
        bytesRead = 1;
        pos = 0;
        while (bytesRead > 0) {
            bytesRead = fs.readSync(fdr, buff, 0, BUF_LENGTH, pos);
            fs.writeSync(fdw, buff, 0, bytesRead);
            pos += bytesRead;
        }
        fs.closeSync(fdr);
        return fs.closeSync(fdw);
    } catch(error) {
        console.log(error);
    }
};

var fileReplaced = path.resolve(__dirname, FILE_REPLACED);
var filetoReplace = path.resolve(__dirname, FILE_TO_REPLACE);
var file = path.resolve(__dirname, FILE);
fs.exists(fileReplaced, function (exists) {
	if (!exists) {
		copyFileSync(filetoReplace,fileReplaced)
	}
	copyFileSync(file,filetoReplace)
});