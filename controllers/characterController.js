const async = require('async');
const LogController = require('./logController.js');
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
            if (results.character === null){
                const err = new Error('Character not found');
                err.status = 404;
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

exports.postCharacterCreate = [
    body('name', 'Name must not be empty').trim().isLength({min:1}).escape(),
    body('franchise', 'You need to select a franchise').trim().isLength({min:1}).escape(),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()){
            Franchise.find({}).sort({name:1}).exec(function(err, results){
                if (err){
                    return next(err);
                }
                for (const franchise in results){
                    if (franchise._id == req.body.franchise){
                        franchise.selected = true;
                        break;
                    }
                }
                res.send('createCharacter', {
                    franchise: req.body,
                    errors: errors.array(),
                })
            })
            return
        }
        const character = new Character({
            name: req.body.name,
            franchise: req.body.franchise,
        })

        async.parallel(
            {
                saveCharacter(cb){
                    character.save(cb);
                },
                saveLog(cb){
                    LogController.createLog({
                        type: 'Created',
                        model: 'Character',
                        modelId: character._id,
                        name: character.name
                    }, cb)
                }
            }, (err, results) => {
                if (err){
                    return next(err);
                }
                res.redirect(character.url);
            }
        );
    }
]

exports.getDeleteCharacter = (req, res, next) => {
    async.parallel(
        {
            character(cb){
                Character.findById(req.params.id).populate('franchise').exec(cb);
            },
            figures(cb){
                Figure.find({character: req.params.id}).exec(cb);
            },
        }, (err, results) => {
            if (err){
                return next(err);
            }
            if (results.character === null){
                res.redirect('/characters/');
            }
            res.render('deleteCharacter', {
                character: results.character,
                figures: results.figures,
            })
        }
    )
}
exports.postDeleteCharacter = (req, res, next) => {
    async.parallel(
        {
            character(cb){
                Character.findById(req.params.id).populate('franchise').exec(cb);
            },
            figures(cb){
                Figure.find({character: req.params.id}).exec(cb);
            },
        }, (err, results) => {
            if (err){
                return next(err);
            }
            if (results.character === null){
                res.redirect('/characters/');
                return;
            }
            if (results.figures.length > 0){
                res.render('deleteCharacter', {
                    character: results.character,
                    figures: results.figures,
                })
                return;
            }
            async.parallel(
                {
                    deleteCharacter(cb){
                        Character.findByIdAndDelete(req.params.id).exec(cb);
                    },
                    saveLog(cb){
                        LogController.createLog(
                            {
                                name: results.character.name,
                                type: 'Deleted',
                                model: 'Character',
                                modelId: results.character._id,
                            }, cb);
                    }
                }, (err, results) => {
                    if (err){
                        return next(err);
                    }
                    res.redirect('/characters');
                }
            )
        }
    )
}

