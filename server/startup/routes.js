const {applyRoutesByFiles} = require('../functions');
const errorHandler = require('../middleware/error')
const express = require('express');
const path = require('path');

module.exports = function(app) {
    app.use(express.json())
    applyRoutesByFiles(app);
    app.use('/assets', express.static('assets'));
    if (process.env.NODE_ENV === 'production' || true) {
        app.use(express.static(path.resolve(__dirname, '../public/')))
        app.get(/.*/, (req, res) => res.sendFile(path.resolve(__dirname, '../public/index.html')))
        // app.get(/.*/, (req, res) => res.sendFile(path.resolve(__dirname, '../public/')))
    }
    app.use(errorHandler);
    
}