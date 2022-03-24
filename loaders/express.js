const cors = require('cors');
const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

module.exports = function loadExpress(app) {
        const corsOptions = {
            origin: ['http://3.35.89.48:3000','http://localhost:3000','http://portfolian.site:3000','https://portfolian.site:443','https://portfolian.site','https://3.35.89.48'],
            credentials:true
        };
        app.use(cors(corsOptions));
        app.use(bodyParser.json({limit : '50mb'}));
        app.use(bodyParser.urlencoded({limit : '50mb', extended: true}));
        app.use(cookieParser());
        app.use(express.json());
};
