const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const PORT = 3000;
const ejs = require('ejs');
const path = require('path');
const userModel = require("./models/index")

app.set("view engine",'ejs');
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/',(req,res)=>{
    res.render("home");
})


app.post("/create",async (req,res)=>{
    let {name , email, image} = req.body;
    let userCreated = await userModel.create({
        name :name,
        email :email,
        image :image
    })
    res.redirect("/users");
})


app.get("/users",async (req,res)=>{
    let allusers = await userModel.find();
    console.log(allusers);
    res.render("users",{allusers})
})

app.listen(PORT,()=>{
    console.log("running");
})