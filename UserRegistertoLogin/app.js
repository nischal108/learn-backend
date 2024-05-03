const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const path = require('path');
const ejs = require('ejs');
const userModel = require("./models/user");
const postModel = require("./models/post");

const app = express();
const secretKey = process.env.SECRET_KEY || "HELLO";

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

// Middleware to check if user is logged in
async function isLoggedIn(req, res, next) {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.redirect("/login");
        }
        const decoded = jwt.verify(token, secretKey);
        req.userId = decoded.token;
        next();
    } catch (error) {
        console.error("Error verifying token:", error);
        res.status(401).send("Unauthorized");
    }
}

// Homepage route
app.get("/", async (req, res) => {
    try {
        const allPosts = await postModel.find({}).populate('author');
        if (!allPosts || allPosts.length === 0) {
            return res.redirect('/register');
        }
        
        const token = req.cookies.token;
        let userId = null;
        if (token) {
            try {
                const decoded = jwt.verify(token, secretKey);
                userId = decoded.token;
            } catch (error) {
                console.error('Error verifying token:', error);
            }
        }
        
        const postArray = allPosts.map(post => post.toObject());
        
        res.render("homepage", { posts: postArray, userId: userId });
    } catch (error) {
        console.error('Error occurred while retrieving posts:', error);
        res.status(500).send("Internal server error");
    }
});

// Registration routes
app.get("/register", (req, res) => {
    res.render("register");
});

app.post("/register", async (req, res) => {
    try {
        const { username, name, password, age } = req.body;
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);
        await userModel.create({ username, name, password: hash, age });
        res.redirect('/login');
    } catch (error) {
        console.error("Error registering user:", error);
        res.status(500).send("Internal server error");
    }
});

// Login routes
app.get("/login", (req, res) => {
    res.render("login");
});

app.post("/login", async (req, res) => {
    try {
        const { username, password } = req.body;
        const foundUser = await userModel.findOne({ username });
        if (foundUser) {
            const match = await bcrypt.compare(password, foundUser.password);
            if (match) {
                const token = jwt.sign({ token: foundUser._id }, secretKey);
                res.cookie("token", token, { httpOnly: true });
                res.redirect('/profile');
            } else {
                res.status(401).send("Invalid username or password");
            }
        } else {
            res.status(401).send("Invalid username or password");
        }
    } catch (error) {
        console.error("Error logging in:", error);
        res.status(500).send("Internal server error");
    }
});

// Profile route
app.get("/profile", isLoggedIn, async (req, res) => {
    try {
        const user = await userModel.findById(req.userId);
        if (!user) {
            return res.status(404).send("User not found");
        }
        await user.populate('posts');
        res.render("profile", { user });
    } catch (error) {
        console.error("Error fetching user profile:", error);
        res.status(500).send("Internal server error");
    }
});

// Creating post routes
app.get("/post/create", isLoggedIn, (req, res) => {
    res.render("createpost");
});

app.post("/createpost", isLoggedIn, async (req, res) => {
    try {
        const { title, description } = req.body;
        const newPost = await postModel.create({ title, description, author: req.userId });
        const user = await userModel.findById(req.userId);
        if (!user) {
            return res.status(404).send("User not found");
        }
        user.posts.push(newPost._id);
        await user.save();
        res.status(201).send("Post created successfully");
    } catch (error) {
        console.error("Error creating post:", error);
        res.status(500).send("Internal server error");
    }
});

// Logout route
app.get('/logout', (req, res) => {
    res.clearCookie("token");
    res.redirect('/login');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
