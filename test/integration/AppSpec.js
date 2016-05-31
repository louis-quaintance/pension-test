'use strict';

describe("App manager", () => {

    const App = require("../../src/App");
    const express = require("express");
    const request = require("supertest");
    var appInstance;

    beforeAll(() => {
        appInstance = new App(express);
    });

    it("should calculate date of retirement for time when age rule applies", (done) => {

      request(appInstance.getApp())
        .get('/pensionPlan?gender=M&dateOfBirth=1940-01-01')
        .end(function(err, res){
          if (err) throw err;

          expect(res.status).toEqual(200);
          expect(res.body).toEqual({ dateOfRetirement: "2005-01-01" });
          done();
        });
    });

    it("should calculate date of retirement for time when specific date applies", (done) => {

      request(appInstance.getApp())
        .get('/pensionPlan?gender=F&dateOfBirth=1950-05-06')
        .end(function(err, res){
          if (err) throw err;
          expect(res.status).toEqual(200);
          expect(res.body).toEqual({ dateOfRetirement: "2010-07-06" });
          done();
        });
    });

    it("should return 404 for date period not covered ", (done) => {

      request(appInstance.getApp())
        .get('/pensionPlan?gender=F&dateOfBirth=0050-05-06')
        .end(function(err, res){
          if (err) throw err;
          expect(res.status).toEqual(404);
          done();
        });
    });

    it("should return 400 when no params set in request", (done) => {

      request(appInstance.getApp())
        .get('/pensionPlan')
        .end(function(err, res){
          if (err) throw err;
          expect(res.status).toEqual(400);
          done();
        });
    });

});
