var fs = require('fs');
const path = require('path');

const PATH_OVERRIDE='./app/override';
const PATH_NODEMODULES='./node_modules';

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

var _getAllFilesFromFolder = function(dir) {


    var results = [];

    fs.readdirSync(dir).forEach(function(file) {

        file = dir+'/'+file;
        var stat = fs.statSync(file);

        if (stat && stat.isDirectory()) {
            results = results.concat(_getAllFilesFromFolder(file))
        } else results.push(file);

    });

    return results;
};


const res = _getAllFilesFromFolder(PATH_OVERRIDE);
res.map((data) => {
    var FILE = data;
    var FILE_DEST = FILE.replace(PATH_OVERRIDE,PATH_NODEMODULES);
    var FILE_OLD = FILE_DEST+ ".old";
    console.log(FILE, FILE_DEST, FILE_OLD);
    var fileReplaced = path.resolve(FILE_OLD);
    var filetoReplace = path.resolve(FILE_DEST);
    var file = path.resolve(FILE);
    fs.exists(fileReplaced, function (exists) {
        if (!exists) {
            console.log("REPLACE OLD");
            copyFileSync(filetoReplace,fileReplaced)
        }

        console.log("REPLACE", file, filetoReplace);
        copyFileSync(file,filetoReplace)
    });
});
