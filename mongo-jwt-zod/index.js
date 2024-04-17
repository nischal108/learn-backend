//complete authentication system made using zod jwt and mongodb , mongoose.




const express = require('express');
const jwt = require('jsonwebtoken');
const zod = require('zod');
const userModel = require('./db');
const PORT = 3000;
const jwtPassword = "980432"; 

const app = express();

const userSchema = zod.object({
    username: zod.string(),
    password: zod.string(),
    age: zod.number(),
});

app.use(express.json());

// Signup route
app.post('/signup', async (req, res) => {
    try {
        const validatedData = userSchema.parse(req.body);
        const { username, password, age } = validatedData;

        // Check if username already exists
        const existingUser = await userModel.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ error: "Username already exists" });
        }

        // Generate JWT token
        const token = jwt.sign({ username }, jwtPassword);

        // Create new user in database
        const createdUser = await userModel.create({
            username,
            password,
            age
        });

        res.json({
            message: "Successfully created user",
            token:token
        });
    } catch (error) {
        // Handle validation error
        res.status(400).json({ error: error.errors });
    }
});

// Signin route
app.post("/signin", async (req, res) => {
    try {
        const { username, password } = req.body;

        // Find user by username and password
        const user = await userModel.findOne({ username, password });

        if (!user) {
            return res.status(401).json({ error: "Invalid username or password" });
        }

        // Generate JWT token
        const token = jwt.sign({ username }, jwtPassword);

        res.json({
            message: "Successfully signed in",
            username:username
        });
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});

// Route to get all users
app.get("/users", async (req, res) => {
    try {
        const users = await userModel.find();
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});

app.listen(PORT, () => {
    console.log(`Server running at port ${PORT}`);
});
