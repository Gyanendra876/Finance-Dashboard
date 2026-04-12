const express = require('express');
require('dotenv').config();

const app = express();

app.get("/", (req, res) => {
  res.send("Server Running...");
});

app.get("/ping", (req, res) => {
  res.send("ok");
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});