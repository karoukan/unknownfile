var express = require('express');
var app = express();
var multer = require('multer')
var cors = require('cors');
var fs = require('fs')
var https = require('https');
app.use(cors())

let path;
let fi;

var options = {
    key: fs.readFileSync('./mydomain.key'),
    cert: fs.readFileSync('./mydomain.crt'),
};
var storage = multer.diskStorage({

    destination: function (req, file, cb) {
    path = `C:/wamp64/www/u/${(new Date()).getTime().toString(36) + Math.random().toString(36).slice(2)}`
    fs.mkdirSync(path, { recursive: true })
    cb(null, path)
    //cb(null, 'C:\\wamp64\\www\\public')
  },
  filename: function (req, file, cb) {
/*
    let extArray = file.originalname.split(".");
    let extension = extArray[extArray.length - 1];
    ff = ((new Date()).getTime().toString(36) + Math.random().toString(36).slice(2)+'_'+ '.' +extension)*/
    fi = file.originalname
    cb(null, file.originalname)
  }
})

var upload = multer({ storage: storage }).single('fileNeedUpload')
app.get('/',function(req, res) {
    return res.send("Unknown file Storage Node")
})
app.post('/upload',function(req, res) {
     
    upload(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            console.log(err)
            return res.status(500).json(err)
        } else if (err) {
            console.log(err)
            return res.status(500).json(err)
        }
        //var path = req.file.path;
        let extArray = path.split("/");
        let extension = extArray[extArray.length - 1];
        console.log("Fichier Uploaded: "+extension+'/'+fi)
        let okUrl = extension+'/'+fi
        return res.status(200).send(okUrl)

    })

});
//var server = https.createServer(options, app).listen(port, function(){
https.createServer(options, app).listen(8000, function() {

    console.log('App running on port 8000');

});