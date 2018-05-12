const express   = require('express');
const app       = express();
const cookieParser = require('cookie-parser');
const router    = require('./routes/routes');
const mongo     = require("./database/mongoPool").initPool();
const settings = require("./config/config.json");

app.use(cookieParser());
app.use('/', router);

app.listen(settings.port);
