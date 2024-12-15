import express from "express";
import { Queue } from "bullmq"
import { addUserToCourseQuery } from "./utils/course";
require('dotenv').config();
import { mockSendEmail } from "./utils/email";

const app = express();
const PORT = process.env.PORT ?? 8000;

const emailQueue = new Queue('email-queue', {
  connection: {
    host: "caching-3a2b61d1-mossawer786-7bd5.f.aivencloud.com",
    port: 16147,
    username: "default",
    password: process.env.AVIEN_PASSWORD
  }
})

app.get("/", (req, res) => {
  return res.json({ status: "success", message: "Hello from Express Server" });
});

app.post("/add-user-to-course", async (req, res) => {
  console.log("Adding user to course");
  // Critical
  await addUserToCourseQuery();

  // Non-Critical
  await emailQueue.add(`${Date.now()}`, {
    from: "mossawer.dev@gmail.com",
    to: "student@gmail.com",
    subject: "Congrats on enrolling in Twitter Course",
    body: "Dear Student, You have been enrolled to Twitter Clone Course.",
  })
  return res.json({ status: "success", data: { message: "Enrolled Success" } });
});

app.listen(PORT, () => console.log(`Express Server Started on PORT:${PORT}`));
