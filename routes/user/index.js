var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var url = 'mongodb://dimo.hamdy:<Dragonball2z@ds249372.mlab.com:49372/myproject';
const path = require('path');

var multer = require('multer');
var storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'public/images/uploads')
    },
    filename: (req, file, cb) => {
      cb(null, file.fieldname + '-' + Date.now() +  path.extname(file.originalname));
    }
});
var upload = multer({storage: storage});

router.post('/fileUpload', upload.single('image'), (req, res, next) => {
    MongoClient.connect(url, (err, db) => {
        assert.equal(null, err);
        var filePath = '/images/' + req.file.filename /*+  path.extname(req.file.originalname)*/;
        insertDocuments(db, filePath, (result) => {
            db.close();
            res.json(result/*{'path': filePath }*/);
        });
    });
});


router.get('/files', function (req, res) {
  MongoClient.connect(url, (err, db) => {
      assert.equal(null, err);
      getDocuments(db, (result) => {
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

    collection.all
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
