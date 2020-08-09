const express = require('express');
const cors = require('cors');
const app = express();

const whitelist = ['http://localhost:3000', 'https://localhost:3443'];


var corsOptionsDelegate = (req, callback) => {  //check if the incoming request exists in the white liste
    var corsOptions;
    console.log(req.header('Origin'));
    if(whitelist.indexOf(req.header('Origin')) !== -1) {
        corsOptions = { origin: true };  // reply back with access control allowOrigin with the origin of the request 
    }
    else {
        corsOptions = { origin: false };
    }
    callback(null, corsOptions);
};

exports.cors = cors(); //if we didn't configure anything so send access control allowOrigin directly 
exports.corsWithOptions = cors(corsOptionsDelegate);