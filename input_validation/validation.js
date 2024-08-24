const express = require("express");
const zod = require("zod");
const app = express();
const PORT = 3000;


app.use(express.json());
const mySchema = zod.array(zod.number());

app.get("/", (req, res) => {
  res.send("Everything fine ");
});


// app.get("/kidneys", (req, res) => {
//   const kidneyNumber = req.query.kidneyNumber;
//   const response = mySchema.safeParse(kidneyNumber);
//   res.send(response);
// });


app.post("/kidneys", (req, res) => {
    console.log("kidney is running man !!");
  const kidneyNumber = req.body.kidneyNumber;
  const response = mySchema.safeParse(kidneyNumber);
  res.send({
    response
    });
});

app.listen(PORT,()=>{
    console.log(`server running at port ${PORT}`);
});
