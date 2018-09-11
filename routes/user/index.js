var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var url = process.env.MONGOLAB_URI;
// var url = 'mongodb://localhost:27017/myproject';
const path = require('path');
var fs = require('fs');
const aws = require('aws-sdk');
var multer = require('multer');


/*
 * Configure the AWS region of the target bucket.
 * Remember to change this to the relevant region.
 */
aws.config.region = 'eu-west-1';

aws.config.update({ accessKeyId: process.env.ACCESS_KEY_ID, secretAccessKey: process.env.SECRET_ACCESS_KEY });

const s3 = new aws.S3();

 /*
  * Configure the AWS region of the target bucket.
  * Remember to change this to the relevant region.
  */
 aws.config.region = 'eu-west-1';

 /*
  * Load the S3 information from the environment variables.
  */
const S3_BUCKET = process.env.S3_BUCKET || "gallaryspark";


var storage = multer.diskStorage({
    destination: (req, file, cb) => {
      try {
  fs.mkdirSync(path.join(__dirname, '/public/images/uploads/'))
} catch (err) {
console.log(err);
}
      cb(null, 'public/images/uploads')
    },
    filename: (req, file, cb) => {
      cb(null, file.fieldname + '-' + Date.now() +  path.extname(file.originalname));
    }
});
var upload = multer({storage: storage});



router.post('/fileUpload', upload.single('image'), (req, res, next) => {
   console.log("open database");



  const fileName = req.file.originalname;
  const fileType = req.file.type;

  var filePath = "public/images/uploads/" + req.file.filename /*+  path.extname(req.file.originalname)*/;
console.log("path  " + filePath);
  fs.readFile(filePath, function (err, data) {

       if (!err) {
         // console.log("File readed");
         // console.log("data");
         const s3Params = {
           Bucket: S3_BUCKET,
           Key: req.file.filename,
           Expires: 60,
           ContentType: fileType,
           ACL: 'public-read',
           Body: data
         };

         s3.upload(s3Params, function (err, data) {
          if (err) {
           console.log('error in callback');
           console.log(err);
          }
          console.log('success');
          // console.log(data);
          console.log(data.Location);
          MongoClient.connect(url,{ useNewUrlParser: true }, (err, db) => {
            let database = db.db('myproject');
                assert.equal(null, err);
                insertDocuments(database, data.Location, (result) => {
                    db.close();
                    console.log(result);
                    res.json(result);
                });
            });

         });
       } else{
         console.log(err);
       }
   });


});


router.get('/files', function (req, res) {
  MongoClient.connect(url,{ useNewUrlParser: true }, (err, db) => {
    let database = db.db('myproject');
      assert.equal(null, err);
      getDocuments(database, (result) => {
          db.close();
          res.json(result);
      });
  });
});


module.exports = router;

var insertDocuments = function(db, filePath, callback) {
    var collection = db.collection('user');
    collection.insertOne({'imagePath' : filePath }, (err, result) => {
        if(err) {
     console.log('Error occurred while inserting');
     assert.equal(err, null);
    // return
 } else {
    console.log('inserted record', result.ops[0]);
   // return
   callback(result.ops[0]);

 }
    });

    // collection.all
};


var getDocuments = function(db, callback) {
  var collection = db.collection('user');

  collection.find({}).toArray(function(err, result) {
  //if (err) throw err;
  console.log(result);
  assert.equal(err, null);
  callback(result);
});
    collection.all
};
