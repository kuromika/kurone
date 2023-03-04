const async = require('async');
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
