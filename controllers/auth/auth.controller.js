const express = require('express')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { User } = require('./auth.model')

exports.authController = express();

exports.authController.post('/signup', async (req, res, next) => {
    try {
        console.log(req.body)
        req.body.password = await bcrypt.hash(req.body.password, 10);
        const user = new User(req.body);
        await user.save();
        res.status(201).json({ message: 'Nouvel utilisateur créé.' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Erreur lors de la création de l\'utilisateur.', error: error });
    }
});

exports.authController.post('/login', async (req, res, next) => {
    try {
        console.log(req.body)
        const user = await User.findOne({ email: req.body.email });
        console.log(user);
        if (!user) res.status(401).json({ message: 'Utilisateur introuvable.' })
        const isValid = await bcrypt.compare(req.body.password, user.password)
        isValid ? res.status(200).json({
            userId: user._id,
            token: jwt.sign(
                { userId: user._id },
                process.env.SECRET_JWT,
                { expiresIn: '24h' })
        }) : res.status(401).json({ message: 'Mot de passe incorrect.' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Erreur lors de la tentative de connexion.', error: error });
    }
});
