const async = require('async');
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


