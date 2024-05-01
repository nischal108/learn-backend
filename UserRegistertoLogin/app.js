const express = require('express');
const app = express();

const secretKey = "HELLO";
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const path = require('path');
const ejs = require('ejs');
const userModel = require("./models/user");
const postModel = require("./models/post");

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

// Registration
app.get("/", (req, res) => {
    res.render("register");
});

app.post("/register", async (req, res) => {
    const { username, name, password, age } = req.body;
    bcrypt.genSalt(10, function (err, salt) {
        bcrypt.hash(password, salt, async function (err, hash) {
            let createdUser = await userModel.create({
                username,
                name,
                password: hash,
                age
            });
            res.send(createdUser);
        });
    });
});

// User login
app.get("/login", (req, res) => {
    res.render("login");
});

app.post("/login", async (req, res) => {
    const { username, password } = req.body;
    const foundUser = await userModel.findOne({ username });
    if (foundUser) {
        bcrypt.compare(password, foundUser.password, (err, result) => {
            if (result) {
                const token = jwt.sign({ token: foundUser._id }, secretKey);
                res.cookie("token", token);
                console.log("Token set:", token); // Log the token value
                res.send("logged in successfully");
            } else {
                res.send("Either password or username was wrong");
            }
        });
    } else {
        res.send("Either password or username was wrong");
    }
});

// Creating post
app.get("/post/create", (req, res) => {
    const token = req.cookies.token;
    if (!token) {
        return res.redirect("/login");
    }
    res.render("createpost");
});

app.post("/createpost", async (req, res) => {
    const { title, description } = req.body;
    const token = req.cookies.token;
    console.log(token);

    if (!token) {
        return res.redirect("/login");
    }

    try {
        const decoded = jwt.verify(token, secretKey);
        const userId = decoded.token;
        console.log(userId);

        const newPost = await postModel.create({
            title,
            description,
            author: userId
        });
        
        if (!newPost._id) {
            return res.status(400).send("Failed to create post");
        }

        console.log(userId);
        const user = await userModel.findOne({ _id: userId });
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



app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
