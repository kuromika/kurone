const async = require('async');
const logController = require('./logController.js');
const Franchise = require('../models/franchise.js');
const Character = require('../models/character.js');
const {body, validationResult} = require('express-validator');

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

exports.getFranchiseCreate = (req, res, next) => {
    res.render('createFranchise')
}   

exports.postFranchiseCreate = [
    body('name', 'Name must not be empty').trim().isLength({min:1}).escape(),
    body('description', 'Description must not be empty').trim().isLength({min:1}).escape(),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()){
            res.render('createFranchise', {
                franchise: req.body,
                errors: errors.array(),
            })
            return;
        }
        const franchise = new Franchise(
            {
                name: req.body.name,
                description: req.body.description,
            }
        )
        async.parallel(
            {
                saveFranchise(cb){
                    franchise.save(cb);
                },
                saveLog(cb){
                    logController.createLog(
                        {
                            type: 'Created',
                            model: 'Franchise',
                            references: franchise._id,
                        }, cb)
                }
            }, (err, results) => {
                if (err){
                    return next(err);
                }
                res.redirect(franchise.url);
            }
        )
    }
]
