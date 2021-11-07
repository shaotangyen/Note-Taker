const express = require( "express" );
const notesRouter = require("./notes");

const app = express();

// call the notesRouter when access to /notes
app.use( "/notes", notesRouter );

module.exports = app;