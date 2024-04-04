const express = require("express");
const bodyParser = require("body-parser")
const port = 3000;
const app = express();

//middleware
app.use(bodyParser.json());  // required to read the body sent by the client through post since express doesn't handle it 

app.get('/',(req,res)=>{
    res.send("hello world");
});

app.listen(port,()=>{
    console.log(`example app listening at ${port}`);
})