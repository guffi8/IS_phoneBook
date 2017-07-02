var mongoose = require('mongoose');
var PhoneBookSchema = require("./PhoneBookSchema");
var PhoneBookRecord = require("./PhoneBookRecord");


module.exports = class Handler {
    constructor() {
        //this.db = new PhoneBookSchema();
    }

    add(data, callback) {
        var db = new PhoneBookSchema();
        db.name = data.name;
        db.token = data.token;
        db.created = data.created;
        db.phone = data.phone;
        db.save(callback);
    }

    getByToken(token, callback){
        console.log(mongoose.connection.readyState, 'getByToken::mongoose state');
        console.log(token, 'getByToken::token');

        PhoneBookSchema.find({'token' : token}).limit(1).exec(function (err, phoneRecord) {
            if(!err ){
                console.log(phoneRecord,'getByToken-record');
                phoneRecord = phoneRecord[0];
                var record = new PhoneBookRecord(phoneRecord.name, phoneRecord.phone);
                record.setToken(phoneRecord.token);
                return callback(null, record);
            }
            return callback(err);
        });
    }

    deleteByToken(token, callback){
        console.log(mongoose.connection.readyState, 'getByToken::mongoose state');

        PhoneBookSchema.remove({'token' : token}).limit(1).exec(function (err) {
            if(!err){

                return callback(null);
            }
            return callback(err);
        });
    }
    getAll(callback){
        console.log(mongoose.connection.readyState, 'getAll::mongoose state');

        PhoneBookSchema.find({}).sort('name').exec(function (err, phoneRecords) {
            if(!err){
                var records = [];
                for(var i=0; i< phoneRecords.length; i++){
                    var record = new PhoneBookRecord(phoneRecords[i].name, phoneRecords[i].phone);
                    record.setToken(phoneRecords[i].token);
                    records.push(record);
                }
                //console.log(records, 'Handler::records')
                return callback(null, records);
            }
            return callback(err);
        });
    }

    search(toSearch, callback){
        console.log(mongoose.connection.readyState, 'search::mongoose state');

        //PhoneBookSchema.find({name :  {'$regex': toSearch}}).sort('name').exec(function(err, phoneRecords){
        PhoneBookSchema.find({ $or:[ {'name': {'$regex': toSearch}},  {'phone': {'$regex': toSearch}}]}).sort('name').exec(function(err, phoneRecords){
            if(!err){
                var records = [];
                for(var i=0; i< phoneRecords.length; i++){
                    var record = new PhoneBookRecord(phoneRecords[i].name, phoneRecords[i].phone);
                    records.push(record);
                }
                return callback(null, records);
            }
            return callback(err);
        });
    }

    edit(data, callback){
        PhoneBookSchema.update({ token : data.token }, { $set: { name: data.name, phone: data.phone }}).exec(function(err, cb){
            if(!err){
                return callback(null, cb);
            }
            return callback(err);
        });
    }




}