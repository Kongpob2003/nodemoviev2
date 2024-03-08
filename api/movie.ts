import express from "express";
import {conn, mysql, queryAsync} from "../dbconn";
import { MovieGet } from "../model/movie-model";
export const router = express.Router();

router.get("/",(req,res)=>{
    conn.query('select * from movie',(err,result,fields)=>{
        if(result && result.length > 0){
            res.json(result);
        }
        else{
            res.json({
                success : false,
                Error : "Incorrect Select Movie."
            });
        }
    });
});

router.get("/:moviename",(req,res)=>{
    const moviename = req.params.moviename;
    conn.query('select * from movie where title = ?',[moviename],(err,result,fields)=>{
        if(result && result.length > 0){
            res.json(result);
        }
        else{
            res.json({
                success : false,
                Error : "Incorrect Select Movie."
            });
        }
    });
});

router.post("/insert", (req, res) => {
    let movie: MovieGet = req.body;
    let sql =
      "INSERT INTO `movie`(`title`, `plot`, `rating`, `year`, `movietime`, `genre`, `poster`) VALUES (?,?,?,?,?,?,?)";
    sql = mysql.format(sql, [
        movie.title,
        movie.plot,
        movie.rating,
        movie.year,
        movie.movietime,
        movie.genre,
        movie.poster,
    ]);
    conn.query(sql, (err, result) => {
      if (err) throw err;
      res
        .status(201)
        .json({ affected_row: result.affectedRows, last_idx: result.insertId });
    });
  });

  router.delete("/delete/:movie", async (req, res) => {
    const movie = req.params.movie;
    let movieid : number;
    let sql = mysql.format("select movieid from movie where title = ?",[movie])
    let result = await queryAsync(sql);
    const jsonStr =  JSON.stringify(result);
    const jsonobj = JSON.parse(jsonStr);
    const rowData = jsonobj;
    movieid = rowData[0].movieid;
    conn.query("delete from movie where movieid = ?", [movieid], (err, result) => {
        if (err) throw err;
        res
          .status(200)
          .json({ affected_row: result.affectedRows });
     });
  });

  router.delete("/deletebyid/:id", (req, res) => {
    let id = +req.params.id;
    conn.query("delete from movie where movieid = ?", [id], (err, result) => {
       if (err) throw err;
       res
         .status(200)
         .json({ affected_row: result.affectedRows });
    });
  });