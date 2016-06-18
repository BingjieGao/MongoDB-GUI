/**
 * Created by davide on 24/12/15.
 */

var assert = require('assert');
var chai = require('chai');
var supertest = require('supertest');
var express = require('express');
var superagent = supertest('http://localhost:3000');
var should = require('should');
var expect = chai.expect;

var app = require('../app');

describe('First page', function () {
    it('should respond to ' + 'GET /get', function (done) {
        supertest(app)
            .get('/')
            .expect(200,done)
    })
});

describe('Main list of all database ', function () {
    it('should respond to ' + 'GET /list', function (done) {
        supertest(app)
            .get('/list')
            .expect(200,done)
    })
});

describe('Create a new database ', function() {
    it('post /list ', function (done) {
        supertest(app)
            .post('/list')
            .send({data:"new_database"})
            .expect(200,done)
    })
});

describe('Collection list of testdb', function() {
    it('GET /list/new_database', function (done) {
        supertest(app)
            .get('/list/new_database')
            .expect(200,done)
            .expect('Content-Type', /json/)
    })
});

describe('delete', function() {
    it('DELETE /list/new_database', function (done) {
        supertest(app)
            .delete('/list/new_database')
            .expect(200,done)
            .expect('Content-Type', /json/)
    })
});

describe('Create a new collection', function() {
    it('POST /list/new_database', function (done) {
        supertest(app)
            .post('/list/new_database/')
            .send({data:"new_collection"})
            .expect(200,done)
            .expect('Content-Type', /json/)
    })
});


describe('GET all collections', function() {
    it('GET /list/new_database/new_collection', function (done) {
        supertest(app)
            .get('/list/testdb/userdbs')
            .expect(200,done)
            .expect('Content-Type', /json/)
    })
});

describe('Rename a collection', function() {
    it('PUT /list/new_database/new_collection', function (done) {
        supertest(app)
            .put('/list/new_database/new_collection')
            .send({text:"renamed_collection"})
            .expect(200,done)
            .expect('Content-Type', /json/)
    })
});



describe('CREATE a document', function() {
    var doc = '[{"username": "original","useremail": "davide1@gmail.com","password": "daide1","date": "2016-01-10T20:30:34.871Z","usertype": 1,"timestamp": "2016-01-10T20:29:23.222Z","__v": 0}]';
    try{
        var doc2 = JSON.parse(doc);
    }catch(e){
        console.log('wrong');
    }
    it('POST /list/new_database/new_collection', function (done) {
        supertest(app)
            .post('/list/new_database/renamed_collection')
            .send({data:doc})
            .expect(200,done)
            .expect('Content-Type', /json/)
    })
});

describe('GET a document', function() {
    it('GET /list/new_database/new_collection/1', function (done) {
        supertest(app)
            .get('/list/new_database/renamed_collection/1')
            .expect(200,done)
            .expect('Content-Type', /json/)
    })
});

describe('UPDATE a document', function() {
    var doc = '[{"username": "changed","useremail": "davide1@gmail.com","password": "daide1","date": "2016-01-10T20:30:34.871Z","usertype": 1,"timestamp": "2016-01-10T20:29:23.222Z","__v": 0}]';
    try{
        var doc2 = JSON.parse(doc);
    }catch(e){
        console.log('wrong');
    }
    it('PUT /list/new_database/new_collection/1', function (done) {
        supertest(app)
            .put('/list/new_database/renamed_collection/1')
            .send({data:doc})
            .expect(200,done)
            .expect('Content-Type', /json/)
    })
});


describe('DELETE a document', function() {
    it('PUT /list/new_database/new_collection/1', function (done) {
        supertest(app)
            .delete('/list/new_database/renamed_collection/1')
            .expect(200,done)
            .expect('Content-Type', /json/)
    })
});


describe('DELETE a collection', function() {
    it('DELETE /list/new_database/new_collection', function (done) {
        supertest(app)
            .delete('/list/new_database/renamed_collection')
            .expect(200,done)
            .expect('Content-Type', /json/)
    })
});

describe('Profiling infomation', function() {
    it('GET /info/profiling/testdb', function (done) {
        supertest(app)
            .get('/info/profiling/testdb')
            .expect(200,done)
            .expect('Content-Type', /json/)
    })
});
describe('Set profile level', function() {
    it('POST /info/profiling/new_database', function (done) {
        supertest(app)
            .post('/info/profiling/new_database')
            .send({data:1})
            .expect(200,done)
            .expect('Content-Type', /json/)
    })
});