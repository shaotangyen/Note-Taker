const noted = require("express").Router();
const path = require('path');
const uuid = require("../helpers/uuid");
const { readFromFile, readAndAppend, writeToFile } = require("../helpers/fsUtilities");

// GET Route to retrive notes
noted.get("/", (req, res) => {
    readFromFile("./db/db.json").then((data) => res.json(JSON.parse(data)));
});

// GET Route to restrive a note by an id
noted.get("/:id", (req, res) => {
    const noteId = req.params.id;
    readFromFile("./db/db.json")
        .then((data) => JSON.parse(data))
        .then((json) => {
            console.log(json);
            const result = json.filter((note) => note.id === noteId);
            return result.length > 0
                ? res.json(result)
                : res.json("No note with that ID");
        });
});

// POST Route for a new note
noted.post("/", (req, res) => {
    console.log(req.body);
    const { title, text } = req.body;
    if (req.body) {
        const newNote = {
            id: uuid(),
            title,
            text,
        };
        readAndAppend(newNote, "./db/db.json");
        res.json(`Note added.`);
    } else {
        res.error("Error to add a note.");
    }
});

// DELETE Route for a specific note
noted.delete("/:id", (req, res) => {
    const noteId = req.params.id;
    readFromFile("./db/db.json")
        .then((data) => JSON.parse(data))
        .then((json) => {
            // Make a new array of all notes except the one with the ID provided in the URL
            const result = json.filter((note) => note.id !== noteId);
            // Save that array to the filesystem
            writeToFile("./db/db.json", result);
            // Respond to the DELETE request
            res.json(`Note id: ${noteId} is deleted`);
        });
});

module.exports = noted;