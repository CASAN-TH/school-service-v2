'use strict';
var request = require('supertest'),
    assert = require('assert'),
    config = require('../../../config/config'),
    _ = require('lodash'),
    jwt = require('jsonwebtoken'),
    mongoose = require('mongoose'),
    app = require('../../../config/express'),
    School = mongoose.model('School');

var credentials,
    token,
    mockup;

describe('School CRUD routes tests', function () {

    before(function (done) {
        mockup = {
            schoolname: 'ไตรพัฒน์',
            under: 'สำนักงานคณะกรรมการส่งเสริมการศึกษาเอกชน',
            area: 'ประถมศึกษาประทุมธานีเขต 2',
            subdistric: 'บึงคำพร้อย',
            distric: 'ลำลูกกา',
            province: 'ปทุมธานี',
            registrar: 'ศิธร สิทธิชัย',
            position: 'นายทะเบียน',
            direction: 'นางสาวนันทนา เกษมโกสินทร์',
            positions: 'ผู้อำนวยการ'
            
        };
        credentials = {
            username: 'username',
            password: 'password',
            firstname: 'first name',
            lastname: 'last name',
            email: 'test@email.com',
            roles: ['user']
        };
        token = jwt.sign(_.omit(credentials, 'password'), config.jwt.secret, {
            expiresIn: 2 * 60 * 60 * 1000
        });
        done();
    });

    it('should be School get use token', (done)=>{
        request(app)
        .get('/api/schools')
        .set('Authorization', 'Bearer ' + token)
        .expect(200)
        .end((err, res)=>{
            if (err) {
                return done(err);
            }
            var resp = res.body;
            done();
        });
    });

    it('should be School get by id', function (done) {

        request(app)
            .post('/api/schools')
            .set('Authorization', 'Bearer ' + token)
            .send(mockup)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                var resp = res.body;
                request(app)
                    .get('/api/schools/' + resp.data._id)
                    .set('Authorization', 'Bearer ' + token)
                    .expect(200)
                    .end(function (err, res) {
                        if (err) {
                            return done(err);
                        }
                        var resp = res.body;
                        assert.equal(resp.status, 200);
                        assert.equal(resp.data.schoolname, mockup.schoolname);
                        assert.equal(resp.data.under, mockup.under);
                        assert.equal(resp.data.area, mockup.area);
                        assert.equal(resp.data.subdistric, mockup.subdistric);
                        assert.equal(resp.data.distric, mockup.distric);
                        assert.equal(resp.data.province, mockup.province);
                        assert.equal(resp.data.registrar, mockup.registrar);
                        assert.equal(resp.data.position, mockup.position);
                        assert.equal(resp.data.direction, mockup.direction);
                        assert.equal(resp.data.positions, mockup.positions);
                        done();
                    });
            });

    });

    it('should be School post use token', (done)=>{
        request(app)
            .post('/api/schools')
            .set('Authorization', 'Bearer ' + token)
            .send(mockup)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                var resp = res.body;
                assert.equal(resp.data.name, mockup.name);
                done();
            });
    });

    it('should be school put use token', function (done) {

        request(app)
            .post('/api/schools')
            .set('Authorization', 'Bearer ' + token)
            .send(mockup)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                var resp = res.body;
                var update = {
                    name: 'name update'
                }
                request(app)
                    .put('/api/schools/' + resp.data._id)
                    .set('Authorization', 'Bearer ' + token)
                    .send(update)
                    .expect(200)
                    .end(function (err, res) {
                        if (err) {
                            return done(err);
                        }
                        var resp = res.body;
                        
                        done();
                    });
            });

    });

    it('should be school delete use token', function (done) {

        request(app)
            .post('/api/schools')
            .set('Authorization', 'Bearer ' + token)
            .send(mockup)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                var resp = res.body;
                request(app)
                    .delete('/api/schools/' + resp.data._id)
                    .set('Authorization', 'Bearer ' + token)
                    .expect(200)
                    .end(done);
            });

    });

    it('should be school get not use token', (done)=>{
        request(app)
        .get('/api/schools')
        .expect(403)
        .expect({
            status: 403,
            message: 'User is not authorized'
        })
        .end(done);
    });

    it('should be school post not use token', function (done) {

        request(app)
            .post('/api/schools')
            .send(mockup)
            .expect(403)
            .expect({
                status: 403,
                message: 'User is not authorized'
            })
            .end(done);

    });

    it('should be school put not use token', function (done) {

        request(app)
            .post('/api/schools')
            .set('Authorization', 'Bearer ' + token)
            .send(mockup)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                var resp = res.body;
                var update = {
                    name: 'name update'
                }
                request(app)
                    .put('/api/schools/' + resp.data._id)
                    .send(update)
                    .expect(403)
                    .expect({
                        status: 403,
                        message: 'User is not authorized'
                    })
                    .end(done);
            });

    });

    it('should be school delete not use token', function (done) {

        request(app)
            .post('/api/schools')
            .set('Authorization', 'Bearer ' + token)
            .send(mockup)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                var resp = res.body;
                request(app)
                    .delete('/api/schools/' + resp.data._id)
                    .expect(403)
                    .expect({
                        status: 403,
                        message: 'User is not authorized'
                    })
                    .end(done);
            });

    });

    afterEach(function (done) {
        School.remove().exec(done);
    });

});