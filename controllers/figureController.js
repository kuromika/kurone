const async = require('async');
const Character = require('../models/character.js');
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
    Character.find({}).sort({name:1}).exec(function(err, result){
        if (err){
            return next(err);
        }
        res.render('createFigure', {
            characters: result,
        })
    })
}

exports.postCreateFigure = [
    body('name', 'Name must not be empty').trim().isLength({min:1}).escape(),
    body('character', 'Author must not be empty').trim().isLength({min:1}).escape(),
    body('manufacturer').optional({checkFalsy:true}).escape(),
    body('specs').optional({checkFalsy:true}).escape(),
    body('includes').optional({checkFalsy:true}).escape(),
    body('store', 'Invalid store URL').optional({checkFalsy:true}).isURL(),
    body('height', 'Invalid height').optional({checkFalsy:true}).trim().isNumeric().isLength({min:1}),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()){
            Character.find({}).sort({name:1}).exec(function(err, results){
                if (err){
                    return next(err)
                }
                for (const character of results){
                    if (character.id.toString() === req.body.character){
                        character.selected = true;
                        break;
                    }
                }
                res.render("createFigure", {
                    figure: req.body,
                    characters: results,
                    errors: errors.array(),
                })
            })
            return;
        }
        const figure = new Figure({
            name: req.body.name,
            character: req.body.character,
            manufacturer: req.body.manufacturer,
            specs: req.body.specs,
            includes: req.body.includes,
            store: req.body.store,
            height: req.body.height
        })

        figure.save((err) => {
            if (err){
                return next(err);
            }
            res.redirect(figure.url);
        })
    }
]

