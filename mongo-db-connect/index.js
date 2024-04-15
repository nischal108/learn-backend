const express = require("express");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const jwtSecret = "shhhhh"; 
const PORT = 3000;




//  connection with mongodb database 
// .net/userdetails here userdetails is the name of table that will be formed in the mongodb
mongoose.connect(
  "database--url(hidden)------------------/userdetails",
).then(() => {
  console.log("Database connected successfully");
}).catch(err => {
  console.error("Database connection error:", err);
});


//setting up an schema for the type of data being stored

const User = mongoose.model("User", {
  name: String,
  username: String,
  password: String,
});

const app = express();
app.use(express.json());



// Function to check if a user exists in the database
async function userExists(username, password) {
  const user = await User.findOne({ username, password }).exec();
  return !!user;
}



// creating user 
app.post('/signup', (req, res) => {
  const { name, username, password } = req.body;

  const user = new User({
    name: name,
    username: username,
    password: password
  });

  user.save()
    .then(() => {
      return res.status(201).json({ msg: "User created successfully" });
    })
    .catch((err) => {
      return res.status(500).json({ msg: "Internal server error" });
    });
});




//logging in 
app.post("/signin", async function (req, res) {
  const { username, password } = req.body;

  // Check if user exists in the database
  if (!(await userExists(username, password))) {
    return res.status(403).json({
      msg: "User doesn't exist or invalid credentials",
    });
  }

  // Generate JWT token
  const token = jwt.sign({ username: username }, jwtSecret);
  return res.json({ token });
});



//getting access after logging in 
app.get("/users", async function (req, res) {
  const token = req.headers.authorization;
  try {
    const decoded = jwt.verify(token, jwtSecret);
    const username = decoded.username;

    // Query the database for a list of users excluding the current user
    const users = await User.find({ username: { $ne: username } }).exec();
    return res.json(users);
  } catch (err) {
    return res.status(403).json({
      msg: "Invalid token",
    });
  }
});




app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
