const express = require("express");
const app = express();
const PORT = 4000;

app.use(express.json());

// Store user data in an object
let users = [{
    name: "John",
    kidneys: [{
            healthy: false
        },
        {
            healthy: true
        }
    ]
}];

// Function to count healthy kidneys
function countHealthyKidneys(kidneys) {
    return kidneys.filter(kidney => kidney.healthy).length;
}


//function to see if there is atleast one unhealthy kidney or not 
function isThereunhealthykidney (users){
    let unHealthykidneys = users[0].kidneys.filter(kidney => !kidney.healthy)
    if(unHealthykidneys.length ==0 )
    return true;
    else
    return false;
}

//users can check how many kidneys they have and their conditions 
app.get("/", (req, res) => {
    const JohnKidneys = users[0].kidneys;
    const healthyKidneyCount = countHealthyKidneys(JohnKidneys);
    const totalKidneys = JohnKidneys.length;
    const unhealthyKidneyCount = totalKidneys - healthyKidneyCount;
    
    // Send JSON response
    res.json({
        totalKidneys,
        healthyKidneyCount,
        unhealthyKidneyCount
    });
});

// get request can  recerive data from query parameter 
// but for post request sending in body is better and prefereed


//users can add new kidneys healthy as well as unhealthy
app.post("/", (req,res) => {
    const isHealthy = req.body.isHealthy;
    users[0].kidneys.push({
        healthy : isHealthy ,
    })
    res.json({
        msg: "done !"
    })
})


// users can turn all unhealthry kidney into healthy kidney like surgery that fixes
app.put("/",(req,res)=>{
    if(isThereunhealthykidney(users)){
        res.status(411).json({
            msg : "You  have no unhealthy kidneys"
        })
    }
    else {users[0].kidneys.map((value)=>{
        value.healthy = true;
    })
    res.send();
    }
})


//removes all unhealthy kidney
app.delete("/",(req,res)=>{
     
    if(isThereunhealthykidney(users)){
        res.status(411).json({
            msg : "You  have no unhealthy kidneys"
        })
    }
    else {users[0].kidneys = users[0].kidneys.filter(kidney => kidney.healthy);
    res.json({
        msg: "Unhealthy kidneys removed successfully."
    }); 
    }
})




app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
