// Import necessary packages and modules
const express = require ('express');
const app = express();

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const path = require('path');
const userModel = require("./models/users")
const PORT = 3000;
const secretKey = "Nischal";

// Set view engine to EJS
app.set("view engine","ejs");

// Middleware for parsing cookies and JSON bodies
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended:true}));

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname,'public')));




// Middleware to verify JWT token from cookie
const verifyToken = (req, res, next) => {
    const token = req.cookies.token;
    if (token) {
        jwt.verify(token, secretKey, (err, decoded) => {
            if (err) {
                res.clearCookie("token");  // Clear invalid token
                console.log("cookie cleared"); 
                next(); 
            } else {
                req.user = decoded; 
                console.log("cookie user found");   
                next(); 
            }
        });
    } else {
        next();
    }
};


// Use the token verification middleware for all routes
app.use(verifyToken);

// Route for automatic login if a valid token exists
app.get('/autologin', (req, res) => {
    if (req.user) {
        res.send("You are automatically logged in as " + req.user.email);
    } else {
        res.redirect('/login');
    }
});


// Route for signup page
app.get('/',(req,res)=>{
    res.render("signup");
})

// Route for login page
app.get('/login',(req,res)=>{
    res.render("login");
})


// Route for handling user login
app.post("/login",async (req,res)=>{
    let {email, password } = req.body;
    let foundUser = await userModel.findOne({email});
    if(foundUser){
        bcrypt.compare(password, foundUser.password, function(err, result) {
            if(result){
                let jwtgeneratedtoken = jwt.sign({email},secretKey);
                res.cookie("token",jwtgeneratedtoken);
                res.send("You are a valid user and your details are " + foundUser);
            }
            else{
                res.send("Either email or password was wrong");
            }
    });
}
else {
    res.send("Either email or password was wrong");
}

})


// Route for user logout
app.get("/logout",(req,res)=>{
    res.clearCookie("token");
    res.send("logged out successfully");
})


// Route for user signup
app.post("/signup", (req,res)=>{
    let {username, email, password, age} = req.body;

    bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash(password, salt, async function(err, hash) {
        let createdUser = await userModel.create({
        username,
        email,
        password : hash,
        age
    })
      res.send(createdUser);
    });
  
});
    
})



app.listen(PORT);
