// You have been given an express server which has a few endpoints.
// Your task is to
// 1. Ensure that if there is ever an exception, the end user sees a status code of 404
// 2. Maintain the errorCount variable whose value should go up every time there is an exception in any endpoint

const express = require('express');
const PORT = 3000;

const app = express();
let errorCount = 0;


//middle ware to catch errors

app.use((err, req, res, next) => {
  errorCount++;
  res.status(404).json({ error: err.message });
});



app.get('/user', function(req, res) {
  throw new Error("User not found");
});

app.post('/user', function(req, res) {
  res.status(200).json({ msg: 'created dummy user' });
});

app.get('/errorCount', function(req, res) {
  res.status(200).json({ errorCount });
});

app.listen(PORT, ()=>{
    console.log(`Server running at ${PORT}`);
})