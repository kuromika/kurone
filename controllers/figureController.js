const async = require('async');
const Character = require('..models/character.js');
const Figure = require('../models/figure.js');
const Log = require('../models/log.js');
const {body, validationResult} = require('express-validator');

exports.figureList = (req, res, next) => {
    Figure.find({}).sort({name: 1}).populate('character').
    exec(function(err, results){
        if (err){
            return next(err);
        }
        res.render('figureList', {
            title: 'Figures',
            figures: results,
        })
    });
}

exports.getFigure = (req, res, next) => {
    Figure.findById(req.params.id).populate({path:'character', populate: [{path: 'franchise'}]}).
        exec(function(err, result){
            if (err){
                return next(err)
            } 
            res.render('figureDetail', {
                figure: result,
                title: 'Figure Details',
            })
        });
}

exports.getCreateFigure = (req, res, next) => {
    Character.find({}).exec(function(err, result){
        if (err){
            return next(err);
        }
        res.render('createFigure', {
            characters: result,
        })
    })
}
