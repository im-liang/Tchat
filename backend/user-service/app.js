const express   = require('express');
const app       = express();
const router    = require('./routes/routes');
const mongo     = require("./database/mongoPool").initPool();

app.use('/', router);

app.listen(3000);
