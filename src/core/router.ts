import { Router } from "express";
import guessTheNumberRouter from "../routes/guess-the-number.js";

const router = Router();
router.use(guessTheNumberRouter);

export default router;
