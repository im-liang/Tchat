const express   = require('express');
const app       = express();
const cookieParser = require('cookie-parser');
const router    = require('./routes/routes');

app.use(cookieParser());
app.use('/', router);

app.listen(3003);
