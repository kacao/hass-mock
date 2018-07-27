const
  path = require('path'),
  fs = require('fs');

/*
 * recursively search a dir for `ext`
 * [https://stackoverflow.com/questions/25460574/find-files-by-extension-html-under-a-folder-in-nodejs]
 */
var fromDir = exports.fromDir = (startPath, ext, func) => {
    if (!fs.existsSync(startPath)){
        console.log("dir not found", startPath);
        return;
    }

    var files = fs.readdirSync(startPath);
    for(var i=0; i<files.length; i++){
        var name = path.join(startPath, files[i]);
        var stat = fs.lstatSync(name);
        if (stat.isDirectory()){
            fromDir(name, ext, func);
        }
        else if (name.endsWith(ext)) {
          func(files[i], name);
        };
    };
};

module.exports = exports;
