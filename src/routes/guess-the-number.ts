import { configDotenv } from "dotenv";
import { Router } from "express";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import z from "zod";
import checkRateLimit, { updateRateLimit } from "../db/checkRateLimit.js";

const guessTheNumberRouter = Router();
const bodySchema = z.object({
  idToken: z.string(),
  number: z.number(),
});
configDotenv();
const minNumber = parseInt(process.env.MIN_NUMBER);
const maxNumber = parseInt(process.env.MAX_NUMBER);

guessTheNumberRouter.post("/guess-the-number", async (req, res) => {
  if (!bodySchema.safeParse(req.body).success) {
    res.status(400).json({ message: "Invalid JSON payload passed." });
    return;
  }
  const idToken = bodySchema.safeParse(req.body).data.idToken;
  const number = bodySchema.safeParse(req.body).data.number;
  if (number <= minNumber || number >= maxNumber) {
    res.status(400).json({ message: "NUMBER_OUT_OF_RANGE" });
    return;
  }

  try {
    const auth = getAuth();
    // const tokenRes = await auth.verifyIdToken(idToken);
    // const userId = tokenRes.uid;
    const userId = req.body.idToken;


    // initialize transaction
    if (!(await checkRateLimit(userId))) {
      res.status(429).json({ message: "TOO_MANY_REQUEST" });
      return;
    }
    const db = getFirestore();

    const tRes = await db.runTransaction(async (t) => {
      const docRef = db.collection("gng-score-board").doc("score");

      try {
        const doc = await t.get(docRef);
        if (!doc.exists) {
          return "GAME_END";
        }
        if (doc.data().currentNumber == number) {
          //create winner collection if not exists abd add user ID to it
          const winnerCollection = db.collection("gng-winners");
          await winnerCollection.add({
            userId: userId,
            number: number,
            timestamp: Date.now(),
          });
          // change the number to new one
          const newNumber = Math.random() * (maxNumber - minNumber) + minNumber;

          await t.update(docRef, {
            currentNumber: newNumber,
          });

          return "You own the game soon you will receive an email from our side...";
        }
        // if not own the game the update the score
        const oldScore = doc.data().currentNumber;

        if (
          (oldScore >= minNumber && oldScore <= minNumber + 10) ||
          (oldScore >= maxNumber - 10 && oldScore <= maxNumber)
        ) {
          await t.update(docRef, {
            currentNumber: Math.random() * (maxNumber - minNumber) + minNumber,
          });
          return "seriously bro!! it the number was just " + oldScore;
        }
        const score = Math.round((oldScore + number) / 2);

        await t.update(docRef, {
          currentNumber: score,
        });
        return "seriously bro! you can't guess a number...";
      } catch (error) {
        throw error;
      }
    });

    // now update the request limiter

    await updateRateLimit(userId);

    res.status(200).json({ message: tRes });
    return;
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
    return;
  }
});

export default guessTheNumberRouter;
