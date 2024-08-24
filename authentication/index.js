// POST /signin
// Body - {
// username: string
// password: string
// }
// Returns a json web token with username encrypted


// GET /users
// Headers -
// Authorization header
// Returns an array of all users if user is signed in (token is correct)
// Returns 403 status code if not 


const express = require('express');
const jwt = require("jsonwebtoken");
const jwtPassword = "123456";

const app = express();
const PORT = 3000;

app.use(express.json());


const ALL_USERS = [
  {
    username: "harkirat@gmail.com",
    password: "123",
    name: "harkirat singh",
  },
  {
    username: "raman@gmail.com",
    password: "123321",
    name: "Raman singh",
  },
  {
    username: "priya@gmail.com",
    password: "123321",
    name: "Priya kumari",
  },
];


function userExists(username, password) {
    let userFound = false;
    ALL_USERS.forEach((elem)=>{
        if(elem.username==username && elem.password ==password)
        userFound = true;
    })
    return userFound;
}

app.post("/signin", function (req, res) {
  const username = req.body.username;
  const password = req.body.password;

  if (!userExists(username, password)) {
    return res.status(403).json({
      msg: "User doesnt exist in our in memory db",
    });
  }

  var token = jwt.sign({ username: username }, jwtPassword);
  return res.json({
    token,
  });
});

app.get("/users", function (req, res) {
  const token = req.headers.authorization;
  console.log(token);



  // send the other userdetails except the one whose username is received in JWT format
  try {
    const decoded = jwt.verify(token, jwtPassword);
    const username = decoded.username;
        const otherUsers = ALL_USERS.filter((elem) => {
      return username !== elem.username;
    });
    res.send(otherUsers);
  } catch (err) {
    return res.status(403).json({
      msg: "Invalid token",
    });
  }
});



app.get('/',(req,res)=>{
    res.send('The page is running');
})



app.listen(PORT, ()=>{
    console.log(`port active at ${PORT}`);
})