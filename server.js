const express = require('express');
const path = require('path');
const fs = require('fs');

const db = require('./db/db.json');
const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'))
});
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/notes.html'))
});
app.get('/api/notes', (req, res) => {
    res.json(db)
});

app.post("/api/notes", (req, res) => {
    console.info(`${req.method} request received to add a note`);
    const newNote = req.body;
    newNote.id = Date.now().toString();
    db.push(newNote);
    fs.writeFile('./db/db.json', JSON.stringify(db), (err) => {
      if (err) {
        console.log(err);
        res.sendStatus(500);
      } else {
        const response = {
          status: "success",
          body: newNote,
        };
        console.log(response);
        res.status(201).json(response);
      }
    });
  });


app.get("*", (req, res) => {
    let indexPath = path.join(__dirname, "public", "index.html");
    let reqPath = path.join(__dirname, "public", req.path);
    if (fs.existsSync(reqPath)) {
      res.sendFile(reqPath);
    } else {
      res.sendFile(indexPath);
    }
  });


app.listen(PORT, () => {
    console.log(`Server listening on PORT ${PORT}`);
});