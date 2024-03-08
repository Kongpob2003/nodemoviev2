import express from "express";
import { router as movie } from "./api/movie";
import { router as person } from "./api/person";
import { router as stars } from "./api/star";
import { router as creators } from "./api/creator";
import { router as searchmovie } from "./api/search";
import bodyParser from "body-parser";
import cors from "cors";
export const app = express();
app.use(
    cors({
      origin: "*",
    })
  );
app.use(bodyParser.text());
app.use(bodyParser.json());

app.use("/movie", movie);
app.use("/person", person);
app.use("/star", stars);
app.use("/creator", creators);
app.use("/searchmovie", searchmovie);