const express = require("express");
const path = require("path");

app= express();

app.use(express.json());
app.use(express.urlencoded({extended :true}));
app.set("view engine", "ejs");


app.use(express.static(path.join(__dirname, "public")));


app.get("/",(req,res)=>{
    res.render("index");
})









app.listen(3000);
