import express from "express";
import {conn, mysql, queryAsync} from "../dbconn";
import { StarsGet } from "../model/star-model";
export const router = express.Router();

router.get("/",(req,res)=>{
    conn.query('select * from star',(err,result,fields)=>{
        if(result && result.length > 0){
            res.json(result);
        }
        else{
            res.json({
                success : false,
                Error : "Incorrect Select Stars."
            });
        }
    });
});

router.post("/insert", async (req, res) => {
    let person: StarsGet = req.body;
    let pids : number;
    let sql = mysql.format("select personid from person where name = ?",[person.personname])
    let result = await queryAsync(sql);
    let jsonStr =  JSON.stringify(result);
    let jsonobj = JSON.parse(jsonStr);
    let rowData = jsonobj;
    pids = rowData[0].personid;

    let mids : number;
    sql = mysql.format("select movieid from movie where title = ?",[person.moviename])
     result = await queryAsync(sql);
     jsonStr =  JSON.stringify(result);
     jsonobj = JSON.parse(jsonStr);
    rowData = jsonobj;
    mids = rowData[0].movieid;


    sql = "INSERT INTO `star`(`movieids`, `personids`) VALUES (?,?)";
    sql = mysql.format(sql, [
        mids,
        pids,
    ]);
    conn.query(sql, (err, result) => {
      if (err) throw err;
      res
        .status(201)
        .json({ affected_row: result.affectedRows, last_idx: result.insertId });
    });
  });

  router.delete("/delete/:person/:movie", async (req, res) => {
    const person = req.params.person;
    const movie = req.params.movie;

    let pids : number;
    let sql = mysql.format("select personid from person where name = ?",[person])
    let result = await queryAsync(sql);
    let jsonStr =  JSON.stringify(result);
    let jsonobj = JSON.parse(jsonStr);
    let rowData = jsonobj;
    pids = rowData[0].personid;

    let mids : number;
    sql = mysql.format("select movieid from movie where title = ?",[movie])
    result = await queryAsync(sql);
    jsonStr =  JSON.stringify(result);
    jsonobj = JSON.parse(jsonStr);
    rowData = jsonobj;
    mids = rowData[0].movieid;

    conn.query("delete from star where movieids = ? and personids = ?", [mids,pids], (err, result) => {
        if (err) throw err;
        res
          .status(200)
          .json({ affected_row: result.affectedRows });
     });
  });

  router.delete("/deletebyid/:pid/:mid", (req, res) => {
    let pid = +req.params.pid;
    let mid = +req.params.mid;
    conn.query("delete from star where movieids = ? and personids = ?", [mid,pid], (err, result) => {
       if (err) throw err;
       res
         .status(200)
         .json({ affected_row: result.affectedRows });
    });
  });