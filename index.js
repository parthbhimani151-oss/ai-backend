import express from "express"
import { createClient } from "redis"

const app = express()
app.use(express.json())

const redisUrl = process.env.REDIS_URL

if (!redisUrl) {
  console.error("REDIS_URL not set")
  process.exit(1)
}

const redis = createClient({ url: redisUrl })

await redis.connect()

// health route
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  })
})

// redis test
app.get("/ping-redis", async (req, res) => {

  try {

    const pong = await redis.ping()

    res.json({
      redis: pong === "PONG" ? "ok" : "error"
    })

  } catch (err) {

    res.status(500).json({
      error: "Redis connection failed"
    })

  }

})

// store message
app.post("/message", async (req, res) => {

  const { message } = req.body

  if (!message) {
    return res.status(400).json({ error: "message required" })
  }

  await redis.lPush("messages", message)

  res.json({
    stored: message
  })

})

// get messages
app.get("/messages", async (req, res) => {

  const messages = await redis.lRange("messages", 0, 9)

  res.json({
    messages
  })

})

app.listen(3001, () => {
  console.log("Server running on port 3001")
})
