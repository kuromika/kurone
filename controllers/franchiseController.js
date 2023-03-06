const async = require('async');
const Franchise = require('../models/franchise.js');
const Character = require('../models/character.js');

exports.franchiseList = (req, res, next) => {
    Franchise.find({}).sort({name: 1}).
        exec(function(err, results){
            if (err){
                return next(err);
            }
            res.render('franchiseList', {
                title: 'Franchises',
                franchises: results,
            })
        })
}

exports.getFranchise = (req, res, next) => {
    async.parallel(
        {
            franchise: function(cb){
                Franchise.findById(req.params.id).exec(cb)
            },
            characters: function(cb){
                Character.find({franchise: req.params.id}).sort({name: 1}).
                    exec(cb);
            },
        }, (err, results) => {
            if (err){
                return next(err);
            }
            res.render('franchiseDetail', {
                franchise: results.franchise,
                characters: results.characters,
            })
        }
    )
}

