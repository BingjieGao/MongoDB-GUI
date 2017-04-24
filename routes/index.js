var express = require('express');
var router = express.Router();

var mongodb = require('mongodb');
var mongoose = require('mongoose');

var MongoClient = require('mongodb').MongoClient;
var test = require('assert');
var objectid = mongodb.ObjectID;

var MochaVar = 0;


router.get('/', function (req, res, next) {
    res.render('index', {title: 'Express'});
});
    MongoClient.connect('mongodb://localhost', function (err, db) {
        /* GET home page. */
        test.equal(err, null, err);


//list 一个collection中的全部的数据

        router.get('/list/:database/:collection', function (req, res, next) {

            var dbname = req.params.database;
            var collectionname = req.params.collection;

            var testdb = db.db(dbname);
            var adminDB = testdb.admin();
            var collection = testdb.collection(collectionname);

            collection.find().toArray(function (err, doc) {
                test.equal(err, null, err);
                res.send({CollectionData: doc});
                //console.log(JSON.stringify(doc));
            })
        });

        router.delete('/list/:database/:collection/:id', function (req, res, next) {

            var dbname = req.params.database;
            var collectionname = req.params.collection;

            var testdb = db.db(dbname);
            var adminDB = testdb.admin();
            var collection = testdb.collection(collectionname);

            var id = req.params.id;
            if(objectid.isValid(id)){
                var objid = mongodb.ObjectID(id);
                collection.findOneAndDelete({_id: objid}, function (err, doc) {
                    console.log(doc);
                });
            }
            else{
                console.log('delete id is = >'+id);
                collection.findOneAndDelete({_id: id}, function (err, doc) {
                    console.log(doc);
                });
            }
            collection.find().toArray(function (err, doc) {
                res.send({CollectionData: doc});
                //console.log(JSON.stringify(doc));
            })
        });


        router.get('/list/:database/:collection/:id', function (req, res, next) {

            var dbname = req.params.database;
            var collectionname = req.params.collection;

            var testdb = db.db(dbname);
            var adminDB = testdb.admin();
            var collection = testdb.collection(collectionname);

            var currentdata = ""
            var id = req.params.id;
            console.log(objectid.isValid(id));
            if(objectid.isValid(id)){
                var objid = mongodb.ObjectID(id)
                collection.find({_id:objid},{_id:0}).toArray(function(err,doc){
                    test.equal(err,null,err);
                    res.send({CurrentData:doc});
                })
            }
            else{
                collection.find({_id:id},{id:0}).toArray(function(err,doc) {
                    test.equal(err, null, err);
                    res.send({CurrentData:doc});
                })
            }
        });


        router.put('/list/:database/:collection/:id', function (req, res, next) {
            var document = req.body.data;
            console.log(document);
            document = JSON.parse(document);
            console.log(document);
            console.log('parse' + document[0]);

            var dbname = req.params.database;
            var collectionname = req.params.collection;

            var testdb = db.db(dbname);
            var collection = testdb.collection(collectionname);

            var id = req.params.id;
            if (objectid.isValid(id)) {
                var objid = mongodb.ObjectID(id)

                collection.updateOne({_id: objid}, {$set: document[0]}, function (err, doc) {
                    console.log(err);
                    test.equal(err,null,err);
                    collection.find().toArray(function (err, doc) {
                        //console.log(doc);
                        res.send({CollectionData: doc});
                    });
                })
            }
            else{
                collection.updateOne({_id: id}, {$set: document[0]}, function (err, doc) {
                    console.log(err);
                    test.equal(err,null,err);
                    collection.find().toArray(function (err, doc) {
                        //console.log(doc);
                        res.send({CollectionData: doc});
                    });
                })
            }
        });

        router.post('/list/:database/:collection', function (req, res, next) {
            var document = req.body.data;
            console.log(document);
            document = JSON.parse(document);
            console.log('parse' + document[0]);
            var dbname = req.params.database;
            var collectionname = req.params.collection;

            var testdb = db.db(dbname);
            var collection = testdb.collection(collectionname);
            collection.insertOne(document[0], function (err, doc) {
                console.log('starting inserting... ..')
                test.equal(null, err);
                test.equal(1, doc.insertedCount);
                collection.find().toArray(function (err, doc) {
                    res.send({CollectionData: doc});
                    console.log('sent');
                })
            });

        });
//Collection Operations-------------------------------------------------------------------------
        router.get('/list/:database/', function (req, res, next) {
            var dbname = req.params.database;
            console.log(dbname);
            var testdb = db.db(dbname);
            ListCollection(testdb, function (col) {
                res.send({CollectionList: col});
                MochaTest(2);
                console.log(MochaVar);
            })
        });

        router.post('/list/:database/', function (req, res, next) {
            var dbname = req.params.database;
            var testdb = db.db(dbname);
            var new_collection_name = req.body.data;
            console.log(new_collection_name);
            testdb.createCollection(new_collection_name, function (err, collection) {
                test.equal(null, err, 'creation err');
                ListCollection(testdb, function (col) {
                    res.send({CollectionList: col});
                });
            });
        });
        router.put('/list/:database/:collection', function (req, res, next) {
            console.log('rename the collection');
            var dbname = req.params.database;
            var collectionname = req.params.collection;
            var new_collection_name = req.body.text;
            console.log(new_collection_name);
            var testdb = db.db(dbname);
            testdb.renameCollection(collectionname, new_collection_name, function (err, new_collection) {
                test.equal(null, err, err);
                ListCollection(testdb, function (col) {
                    res.send({CollectionList: col});
                })
            })

        })

        router.delete('/list/:database/:collection', function (req, res, next) {
            console.log('Droping the collection......');
            var dbname = req.params.database;
            var testdb = db.db(dbname);
            var collectionname = req.params.collection;
            console.log(collectionname);
            testdb.dropCollection(collectionname, function (err, ressult) {
                test.equal(null, err, err);
                ListCollection(testdb, function (col) {
                    res.send({CollectionList: col});
                })
            })
        })
//------------------------------------------------------------------------------------------------


//全部的数据库名字
        router.get('/list', function (req, res, next) {
            db.admin().listDatabases(function (err, dbs) {
                test.equal(null, err);
                test.ok(dbs.databases.length > 0);
                Datalist = dbs.databases;
                res.render('list', {
                    title: 'Admin UI',
                    Datalist: JSON.stringify(Datalist)
                });
                MochaTest(1);
                console.log(MochaVar);
            })
        })

        router.post('/list', function (req, res, next) {
            var dbname = req.body.data;
            console.log(dbname);
            var testdb = db.db(dbname);
            testdb.createCollection('new_collection', function (err, collection) {
                test.equal(null, err, 'creation err');

                testdb.dropCollection('new_collection', function (err, result) {
                    test.equal(err, null, 'drop collection err');
                })
                db.admin().listDatabases(function (err, dbs) {
                    test.equal(err, null, 'list database name failed' + err);
                    res.send({Db: dbs.databases});
                })
            });
        })

        router.delete('/list/:database', function (req, res, next) {
            var dbname = req.params.database;
            var testdb = db.db(dbname);
            testdb.dropDatabase(function (err, result) {
                test.equal(err, null, 'drop database failed');
                db.admin().listDatabases(function (err, dbs) {
                    test.equal(err, null, 'list database name failed' + err);
                    res.send({Db: dbs.databases});
                })
            })
        })

        router.put('/list/:database', function (req, res, next) {
            db.runCommand(db.copyDatabase('testdb', 'testdb4'), function (err, result) {
                test.equal(err, null, err);
            })
        })

        router.get('/info/profiling/:database', function (req, res, next) {
            var dbname = req.params.database;
            console.log('get');
            var testdb = db.db(dbname);
            var adminDB = testdb.admin();
            adminDB.profilingLevel(function (err, info) {
                test.equal(err, null, err);
                console.log(info);
                res.send({Info: info});
            })
        })

        router.post('/info/profiling/:database', function (req, res, next) {
            var set_level;
            var dbname = req.params.database;
            var level = req.body.data;
            console.log(level);

            if (level == 1)
                set_level = 'slow_only';
            else
                set_level = 'all';

            console.log('set profile');
            var testdb = db.db(dbname);
            var adminDB = testdb.admin();
            adminDB.setProfilingLevel(set_level, function (err, level) {
                test.equal(err, null, err);
                console.log(level);
                res.send({profiledata: level});
            })
        })

        router.get('/dashboard',function(req,res,next){
            var adminDB = db.db("crunchbase");
            var profile = adminDB.collection('system.profile');
            var date_now = new Date(2016,01,01,20,20,00,00);

            console.log(date_now);
            profile.find({}).toArray(function(err,perform){
                console.log(perform);
                res.render("dashboard",{perform:perform});
            })
            //profile.aggregate([
            //
            //    {$match:{
            //        ts:{$gt:new Date('2016-01-24T16:43:19.197Z'),$lt:new Date('2016-05-24T23:43:19.197Z')}
            //    }}
            //    //{$group:{
            //    //    "_id":"$ns",
            //    //    "avg time":{$avg:"$millis"}
            //    //}}
            //]).toArray(function(err,perform){
            //    res.send(perform);
            //    console.log(perform);
            //})
        })
    })

var ListCollection = function (db,callback){
    db.listCollections().toArray(function (err, collection) {
        // test.equal(1,collection.length);
        test.ok(collection.length >= 1, "get collections");
        console.log(collection);
        callback(collection);
    });
}

var FindWithObj = function(collection,Objid,callback){
    collection.find({_id:Objid},{_id:0}).toArray(function(err,doc){
        test.equal(err,null,err);
        callback(doc);
    })
}
var MochaTest = function(value){
    MochaVar = 0;
    return MochaVar+value;
}



module.exports = router;
module.exports.MochaVar = MochaVar;
module.exports.MochaTest = MochaTest;

