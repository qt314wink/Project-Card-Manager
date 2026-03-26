import { Router } from "express";

const router = Router();

const subscribers: { email: string; ts: number }[] = [];

router.post("/newsletter", (req, res) => {
  const { email } = req.body as { email?: string };
  if (!email || !email.includes("@")) {
    return res.status(400).json({ error: "Invalid email" });
  }
  const already = subscribers.some(s => s.email === email);
  if (!already) {
    subscribers.push({ email, ts: Date.now() });
  }
  return res.json({ success: true, subscribed: !already });
});

router.get("/newsletter", (_req, res) => {
  return res.json({ count: subscribers.length, subscribers });
});

export default router;
