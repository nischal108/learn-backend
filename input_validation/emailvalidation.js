const express = require('express');
const zod = require('zod');
const PORT = 3000;


const app=express();
app.use(express.json());


const userSchema = zod.object({
    email :zod.string().email(),
    password : zod.string().min(8),
    username:zod.string(),
    country:zod.literal("NP").or(zod.literal("US"))
})

app.get('/',(req,res)=>{
    res.send('The server is running perfectly fine');
})

app.post('/credentials',(req,res)=>{
    // const username = req.body.username;
    // const email = user.body.email;
    // const password = user.body.password;
    // const country = user.body.country; 
    const userdetails = req.body.userdetails;
    const response = userSchema.safeParse(userdetails);
    res.json({ response });
})




app.listen(PORT,()=>{
    console.log(`server running at port ${PORT}`);
})