const express = require('express')
    , bodyParser = require('body-parser')
    , url = require('url')
    , conf = require('../Config/serverConf')
    , PhoneBook = require('./DB/PhoneBook')
    , PhoneBookRecord = require('./DB/PhoneBookRecord')
    , mongoose = require('mongoose');;
const app = express()
var _phoneBook = new PhoneBook;

exports.run = function(){

    app.use(express.static(conf.HOME_PATH));
    app.use(bodyParser.json());
    app.get('/', function (req, res) {
        res.sendFile(conf.HOME_PATH +'App/Index.html')
    });

    app.listen(conf.PORT, function () {
        console.log('listening on port: ' + conf.PORT)
    });

    mongoose.connect(conf.DB_PATH);
    mongoose.Promise = global.Promise;

    console.log(mongoose.connection.readyState, 'mongoose state');

    app.get('/add', function (req, res, next) {
        var query = url.parse(req.url,true).query;
        console.log(query,'query');
        if(Number.isInteger(query.number)){
            console.log('phone must be numeric')
            res.sendError(406);

        }
        var record = new PhoneBookRecord(query.name, query.number);
        console.log(record, 'add::record');
        _phoneBook.add(record, function(err, callback){
            if (err) {
                res.sendError(500);
                return;
            }
            res.end();
        });
    });

    app.get('/getByToken', function(req, res, next){
        console.log('getByToken');
        var query = url.parse(req.url,true).query;
        var token = query.t;
        _phoneBook.getByToken(token, function (err, phoneRecord) {
            if (err) {
                res.sendError(500);
                return;
            }
            res.json(phoneRecord);
        })
    });

    app.get('/getAll', function(req, res, next){
        _phoneBook.getAll(function (err, phoneRecords) {
            if (err) {
                res.sendError(500);
                return;
            }

            res.json(phoneRecords);
        })
    });

    app.get('/search', function(req, res, next){
        var query = url.parse(req.url,true).query;
        console.log(query,'search::query');
        var toSearch = query.value;
        if(toSearch === ''){
            _phoneBook.getAll(function (err, phoneRecords) {
                if (err) {
                    res.sendError(500);
                    return;
                }
                res.json(phoneRecords);
            })
        } else {
            _phoneBook.search(toSearch,function (err, phoneRecords) {
                if (err) {
                    res.send(500);
                    return;
                }
                res.json(phoneRecords);
            })
        }

    });

    app.get('/delete', function(req, res, next){
        var query = url.parse(req.url,true).query;
        console.log(query,'delete::query');
        var token = query.t;
        _phoneBook.deleteByToken(token, function (err, token) {
            if (err) {
                res.sendError(500);
                return;
            }
            res.end();
        })
    });
    app.get('/edit', function(req, res, next){
        var query = url.parse(req.url,true).query;
        console.log(query, 'edit/query');
        _phoneBook.edit(query, function (err, token) {
            if (err) {
                res.sendError(500);
                return;
            }
            res.end();
        })
    });




}