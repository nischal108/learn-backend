/**
  You need to create an express HTTP server in Node.js which will handle the logic of a file server.
  The expected API endpoints are defined below,
  1. GET /files - Returns a list of files present in `./files/` directory
    Response: 200 OK with an array of file names in JSON format.
    Example: GET http://localhost:3000/files
  2. GET /file/:filename - Returns content of given file by name
     Description: Use the filename from the request path parameter to read the file from `./files/` directory
     Response: 200 OK with the file content as the response body if found, or 404 Not Found if not found. Should return `File not found` as text if file is not found
     Example: GET http://localhost:3000/file/example.txt
    - For any other route not defined in the server return 404
 */
    const express = require('express');
    const fs = require('fs');
    const path = require('path');
    const app = express();
    const PORT = 4000;



    
    app.get('/', (req, res) => {
        res.send("running, everything is fine");
    });
    
    app.get('/files', (req, res) => {
        fs.readdir('./files', (err, files) => {
            if (err) {
                return res.status(500).send("Error reading directory");
            }
            res.status(200).json(files);
        });
    });
    
    app.get('/files/:filename', (req, res) => {
        const filename = req.params.filename;
        const filePath = path.join(__dirname, 'files', filename);
        
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                if (err.code === 'ENOENT') {
                    return res.status(404).send("File not found");
                } else {
                    return res.status(500).send("Error reading file");
                }
            }
            res.setHeader('Content-Type', 'text/plain');
            res.status(200).send(data);
        });
    });




    // 404 handler
    app.use((req, res) => {
      res.status(404).send("404 Not Found");
    });

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
