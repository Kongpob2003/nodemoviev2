import express from "express";
import {conn, mysql, queryAsync} from "../dbconn";
import { PersonGet } from "../model/person-model";
export const router = express.Router();

router.get("/",(req,res)=>{
    conn.query('select * from person',(err,result,fields)=>{
        if(result && result.length > 0){
            res.json(result);
        }
        else{
            res.json({
                success : false,
                Error : "Incorrect Select Person."
            });
        }
    });
});

router.get("/:personname",(req,res)=>{
    const personname = req.params.personname;
    conn.query('select * from person where name = ?',[personname],(err,result,fields)=>{
        if(result && result.length > 0){
            res.json(result);
        }
        else{
            res.json({
                success : false,
                Error : "Incorrect Select Person."
            });
        }
    });
});

router.post("/insert", (req, res) => {
    let person: PersonGet = req.body;
    let sql =
      "INSERT INTO `person`(`name`, `born`, `image`, `biography`) VALUES (?,?,?,?)";
    sql = mysql.format(sql, [
        person.name,
        person.Born,
        person.imgp,
        person.bio,
    ]);
    conn.query(sql, (err, result) => {
      if (err) throw err;
      res
        .status(201)
        .json({ affected_row: result.affectedRows, last_idx: result.insertId });
    });
  });

  router.delete("/delete/:person", async (req, res) => {
    const person = req.params.person;
    let pid : number;
    let sql = mysql.format("select personid from person where name = ?",[person])
    let result = await queryAsync(sql);
    const jsonStr =  JSON.stringify(result);
    const jsonobj = JSON.parse(jsonStr);
    const rowData = jsonobj;
    pid = rowData[0].personid;
    conn.query("delete from person where personid = ?", [pid], (err, result) => {
        if (err) throw err;
        res
          .status(200)
          .json({ affected_row: result.affectedRows });
     });
  });

  router.delete("/deletebyid/:id", (req, res) => {
    let id = +req.params.id;
    conn.query("delete from person where personid = ?", [id], (err, result) => {
       if (err) throw err;
       res
         .status(200)
         .json({ affected_row: result.affectedRows });
    });
  });