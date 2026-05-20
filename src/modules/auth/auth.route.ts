import Router from "express";
import { atuhController } from "./auth.controller";
const router = Router();



router.post("/signup", atuhController.createUser);


export const authRoute =  router