const express = require('express')
const mongoose = require('mongoose')
const { Sauce } = require('./sauce.model')
const multer = require('../../multer-config');

exports.sauceController = express();

exports.sauceController.get('/', async (req, res, next) => {
    try {
        const sauces = await Sauce.find();
        res.status(200).json(sauces);
    } catch(error) {
        console.log(error);
        res.status(500).json({ message: 'Error', error: error });
    }
});

exports.sauceController.get('/:id', async (req, res, next) => {
    try {
        const sauce = await Sauce.findOne({ _id: req.params.id });
        res.status(200).json(sauce);
    } catch(error) {
        console.log(error);
        res.status(500).json({ message: 'Error', error: error });
    }
});

exports.sauceController.post('/', multer(), async (req, res, next) => {
    try {
        const newSauceData = JSON.parse(req.body.sauce)
        const sauceObject = new Sauce({
            ...newSauceData,
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        });
        await sauceObject.save();
        res.status(201).json(sauceObject);
    } catch(error) {
        console.log(error);
        res.status(500).json({ message: 'Error', error: error });
    }
});

exports.sauceController.post('/:id/like', async (req, res, next) => {
    try {
        let updateData;
        switch(req.body.like) {
            case -1:
                updateData = await dislikeImage(req.params.id, req.body.userId);
                break;
            case 0:
                updateData = await removeVote(req.params.id, req.body.userId);
                break;
            case 1:
                updateData = await likeImage(req.params.id, req.body.userId);
                break;
        }
        const updatedSauce = await Sauce.updateOne({_id: req.params.id}, updateData);
        res.status(200).json(updatedSauce);

    } catch(error) {
        console.log(error);
        res.status(500).json({ message: 'Error', error: error });
    }
});

exports.sauceController.put('/:id', multer(), async (req, res, next) => {
    try {
        console.lp
        const updateSauceData = 
        req.file ? {
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
            ...JSON.parse(req.body.sauce)
        } : req.body;

        const updatedSauce = await Sauce.updateOne({_id: req.params.id}, updateSauceData);
        res.status(201).json(updatedSauce);
    } catch(error) {
        console.log(error);
        res.status(500).json({ message: 'Error', error: error });
    }
});

exports.sauceController.delete('/:id', async (req, res, next) => {
    try {
        const deletedSauce = await Sauce.deleteOne({_id: req.params.id });
        res.status(200).json(deletedSauce);
    } catch(error) {
        console.log(error);
        res.status(500).json({ message: 'Error', error: error });
    }
});

async function dislikeImage(idImage, idUser) {
    let updateData = await removeVote(idImage, idUser)
    updateData.dislikes += 1;
    updateData.usersDisliked.push(idUser);
    return updateData;
}

async function likeImage(idImage, idUser) {
    let updateData = await removeVote(idImage, idUser)
    updateData.likes += 1;
    updateData.usersLiked.push(idUser);
    return updateData;
}

async function removeVote(idImage, idUser) {
    let updateData = {};
    const sauce = await Sauce.findById(idImage);
    if (sauce.usersLiked.indexOf(idUser) > -1) {
        sauce.usersLiked.splice(sauce.usersLiked.indexOf(idUser), 1);
        updateData['usersLiked'] = sauce.usersLiked;
        updateData['likes'] = --sauce.likes;
        updateData['dislikes'] = sauce.dislikes;
        updateData['usersDisliked'] = sauce.usersDisliked;
    } else if (sauce.usersDisliked.indexOf(idUser) > -1) {
        sauce.usersDisliked.splice(sauce.usersDisliked.indexOf(idUser), 1);
        updateData['usersDisliked'] = sauce.usersDisliked;
        updateData['dislikes'] = --sauce.dislikes;
        updateData['likes'] = sauce.likes;
        updateData['usersLiked'] = sauce.usersLiked;
    } else {
        updateData['dislikes'] = sauce.dislikes;
        updateData['usersDisliked'] = sauce.usersDisliked;
        updateData['likes'] = sauce.likes;
        updateData['usersLiked'] = sauce.usersLiked;
    }
    return updateData;
}