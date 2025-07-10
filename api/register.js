const { MongoClient } = require("mongodb");

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);
let db = null;

async function connectDB() {
  if (!db) {
    await client.connect();
    db = client.db("registrationDB");
  }
  return db;
}

module.exports = async (req, res) => {
  // Add CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*"); // You can restrict this to a specific domain later
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Handle preflight OPTIONS request
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const db = await connectDB();
    const existing = await db.collection("users").findOne({ email });

    if (existing) {
      return res.status(409).json({ message: "Email already registered" });
    }

    await db.collection("users").insertOne({
      name,
      email,
      password,
      createdAt: new Date(),
    });

    res.status(200).json({ message: "Registration successful" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
