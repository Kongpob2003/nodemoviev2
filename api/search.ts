import express from "express";
import {conn, mysql, queryAsync} from "../dbconn";
export const router = express.Router();

router.get("/", (req, res) => {
    const title = `%${req.query.title}%`;
    const sql = `
    SELECT  movie.movieid,
    movie.title AS movie_title,
    movie.plot AS movie_plot,
    movie.rating AS movie_rating,
    movie.year AS movie_year,
    movie.genre AS movie_genre,
    star.personids AS star_id,
    stars.name AS star_name,
    stars.born AS star_born,
    stars.biography AS star_bio,
    creator.personidc AS creators_id,
    creators.name AS creators_name,
    creators.born AS creatosrs_born,
    creators.biography AS creators_bio
    FROM movie , star , person AS stars , creator, person  AS creators 
    WHERE movie.movieid = star.movieids
    AND star.personids = stars.personid
    AND movie.movieid = creator.movieidc
    AND creator.personidc = creators.personid
    AND movie.title LIKE ?
    `;
    
    conn.query(sql, [title], (err, results: any[], fields) => {
        if (err) throw err;

        
        const moviesMap = new Map<number, any>();

        results.forEach((row: any) => {
            const movieId = row.mid;

            if (!moviesMap.has(movieId)) {
                moviesMap.set(movieId, {
                    movie_id: row.mid,
                    movie_title: row.movie_title,
                    movies_plot : row.movie_plot,
                    movies_rating : row.movie_rating,
                    movies_year : row.movie_year,
                    movies_genre : row.movie_genre,
                    actors: [],
                    creators: [],
                });
            }

            const movie = moviesMap.get(movieId);

            const star = {
                star_id: row.star_id,
                star_name: row.star_name,
                star_born: row.starr_born,
                star_bio: row.star_bio,
            };

            const creator = {
                creator_id: row.creator_id,
                creator_name: row.creator_name,
                creator_born: row.creator_born,
                creator_bio: row.creator_bio,
            };

            // เพิ่มเช็คว่านักแสดงหรือผู้กำกับซ้ำหรือไม่
            if (!movie.actors.find((a: any) => a.star_id === star.star_id)) {
                movie.actors.push(star);
            }

            if (!movie.creators.find((c: any) => c.creator_id === creator.creator_id)) {
                movie.creators.push(creator);
            }
        });

        const jsonData =  { movie :  Array.from(moviesMap.values())};
        res.json(jsonData);
    });
});