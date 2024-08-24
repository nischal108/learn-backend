// You have been given an express server which has a few endpoints.
// Your task is to create a global middleware (app.use) which will
// rate limit the requests from a user to only 5 request per second
// If a user sends more than 5 requests in a five second, the server
// should block them with a 404.
// User will be sending in their user id in the header as 'user-id'
// You have been given a numberOfRequestsForUser object to start off with which
// clears every one second

const express = require('express');
const app = express();
const PORT = 3000;

let requestPerUser = {};

function checkUserRequestCount(req, res, next) {
    const userId = req.headers['user-id'];

    
    if (!requestPerUser[userId]) {
        requestPerUser[userId] = {
            count: 0,
            timestamp: Date.now()
        };
    }

    const userRequests = requestPerUser[userId];
    const currentTime = Date.now();
    if (currentTime - userRequests.timestamp < 5000) {
        if (userRequests.count >= 5) {
            return res.status(404).send("You have reached the limit");
        }
    } else {
        userRequests.count = 0;
        userRequests.timestamp = currentTime;
    }

    userRequests.count++;
    next();
}

setInterval(() => {
    requestPerUser = {};
}, 5000);

app.use(checkUserRequestCount);

app.get('/', (req, res) => {
    res.send("Page is running");
});

app.listen(PORT, () => {
    console.log(`Server running at PORT ${PORT}`);
});
