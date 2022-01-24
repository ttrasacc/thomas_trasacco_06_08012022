const express = require('express');
const { authController } = require('./controllers/auth/auth.controller');
const { sauceController } = require('./controllers/sauces/sauce.controller');

exports.routes = {
    '/api/auth': authController,
    '/api/sauces': sauceController
}
