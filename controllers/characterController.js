const async = require('async');
const Franchise = require('../models/franchise.js');
const Figure = require('../models/figure.js');
const Character = require('../models/character.js');
const Log = require('../models/log');
const {body, validationResult} = require('express-validator');

exports.characterList = (req, res, next) => {
    Character.find({}).sort({name: 1}).
        exec(function(err, results){
            if (err){
                return next(err);
            }
            res.render('characterList', {
                title: 'Characters',
                characters: results
            })
        })
}

exports.getCharacter = (req, res, next) => {
    async.parallel(
        {
            character: function(cb) {
                Character.findById(req.params.id).populate('franchise').exec(cb);
            },
            figures: function(cb){
                Figure.find({character: req.params.id}).exec(cb);
            }
        }, (err, results) => {
            if (err){
                return next(err);
            }
            res.render('characterDetail', {
                character: results.character,
                figures: results.figures,
            })
        })
}

exports.getCharacterCreate = (req, res, next) => {
    Franchise.find({}).sort({name:1}).exec(function(err, results){
        if (err){
            return next(err);
        }
        res.render('createCharacter', {
            franchises: results,
        })
    })
}
