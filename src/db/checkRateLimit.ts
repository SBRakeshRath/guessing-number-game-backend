import { getFirestore, Timestamp } from "firebase-admin/firestore";

async function checkRateLimit(userId: string) {
  const db = getFirestore();
  const collection = db.collection("gng-request-limiter");
  //minimum time between two requests is 5 seconds
  const latency = 5000;

  try {
    const doc = await collection.where("userId", "==", userId).get();
    if (doc.empty) return true;
    const data = doc.docs[0].data();
    const lastRequestTime = data["last-request"].toMillis();


    if (Date.now() - lastRequestTime < latency) return false;
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}

export async function updateRateLimit(userId: string) {
  const db = getFirestore();
  const collection = db.collection("gng-request-limiter");
  try {
    const doc = await collection.where("userId", "==", userId).get();
    if (doc.empty) {
      collection.add({
        "last-request": Timestamp.now(),
        userId: userId,
      });
      return;
    }
    collection.doc(doc.docs[0].id).update({
      "last-request": Timestamp.now(),
      userId: userId,
    });
  } catch (error) {
    console.log("Error in updating rate limit");
    throw error;
  }
}
export default checkRateLimit;
