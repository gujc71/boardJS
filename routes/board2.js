var express = require('express');
var router = express.Router();

//   MySQL 로드
var pool = require('./mysqlConn');

router.get('/', function(req, res, next) {
    res.redirect('/board2/list');
});

router.get('/list', function(req,res,next){
    pool.getConnection(function (err, connection) {
        var sql = "SELECT BRDNO, BRDTITLE, BRDWRITER, DATE_FORMAT(BRDDATE,'%Y-%m-%d') BRDDATE" +
                   " FROM TBL_BOARD";
        connection.query(sql, function (err, rows) {
            if (err) console.error("err : " + err);
//            console.log("rows : " + JSON.stringify(rows));

            res.render('board2/list', {rows: rows});
            connection.release();
        });
    }); 
});

router.get('/read', function(req,res,next){
    pool.getConnection(function (err, connection) {
        var sql = "SELECT BRDNO, BRDTITLE, BRDMEMO, BRDWRITER, DATE_FORMAT(BRDDATE,'%Y-%m-%d') BRDDATE"+
                   " FROM TBL_BOARD" +
                  " WHERE BRDNO=" + req.query.brdno;
            console.log("rows : " + sql);
        connection.query(sql, function (err, rows) {
            if (err) console.error("err : " + err);
            console.log("rows : " + JSON.stringify(rows));

            res.render('board2/read', {row: rows[0]});
            connection.release();
        });
    }); 
});

router.get('/form', function(req,res,next){
    if (!req.query.brdno) {
        res.render('board2/form', {row: ""});
        return;
    }
    pool.getConnection(function (err, connection) {
        var sql = "SELECT BRDNO, BRDTITLE, BRDMEMO, BRDWRITER, DATE_FORMAT(BRDDATE,'%Y-%m-%d') BRDDATE" + 
                   " FROM TBL_BOARD" +
                  " WHERE BRDNO=" + req.query.brdno;
        connection.query(sql, function (err, rows) {
            if (err) console.error("err : " + err);

            res.render('board2/form', {row: rows[0]});
            connection.release();
        });
    }); 
});

router.post('/save', function(req,res,next){
    var data = [req.body.brdtitle, req.body.brdmemo, req.body.brdwriter, req.body.brdno];
console.log("rows : " + data);

    pool.getConnection(function (err, connection) {
        var sql = "";
        if (req.body.brdno) {
            sql = "UPDATE TBL_BOARD" +
                       " SET BRDTITLE=?, BRDMEMO=?, BRDWRITER=?" +
                  " WHERE BRDNO=?";
        } else {
            sql = "INSERT INTO TBL_BOARD(BRDTITLE, BRDMEMO, BRDWRITER, BRDDATE) VALUES(?,?,?, NOW())";
        }
        connection.query(sql, data, function (err, rows) {
            if (err) console.error("err : " + err);

            res.redirect('/board2/list');
            connection.release();
        });
    }); 
});

router.get('/delete', function(req,res,next){
    pool.getConnection(function (err, connection) {
        var sql = "DELETE FROM TBL_BOARD" +
                  " WHERE BRDNO=" + req.query.brdno;
        connection.query(sql, function (err, rows) {
            if (err) console.error("err : " + err);

            res.redirect('/board2/list');
            connection.release();
        });
    }); 
});

module.exports = router;
