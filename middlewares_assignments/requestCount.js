// You have been given an express server which has a few endpoints.
// Your task is to create a global middleware (app.use) which will
// maintain a count of the number of requests made to the server in the global
// requestCount variable

const express = require('express');
const app = express();
const PORT = 3000;

let counter = 0;
function requestCounter(req,res,next){
    counter++;
    console.log(`This was ${counter} request`);
    next();
}

app.use(requestCounter);


app.get('/',(req,res)=>{
    res.send("The page is active");
})



app.get('/home',(req,res)=>{
    res.send("The home page is active");
})






app.listen(PORT,()=>{
    console.log(`Server running at port ${PORT}`);
})