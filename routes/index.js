const Franchise = require("../models/franchise");
const Character = require("../models/character");
const Figure = require("../models/figure");
const Log = require("../models/log");
var express = require("express");
var router = express.Router();
const async = require("async");

router.get("/", (req, res) => {
  async.parallel(
    {
      character_count(cb) {
        Character.countDocuments({}, cb);
      },
      franchise_count(cb) {
        Franchise.countDocuments({}, cb);
      },
      figure_count(cb) {
        Figure.countDocuments({}, cb);
      },
      logs(cb) {
        Log.find({}).sort({ date: -1 }).populate('references').exec(cb);
      },
    },
    (err, results) => {
      res.render("index", {
        title: "Kurone Figures",
        error: err,
        data: results,
        page: 0,
      });
    }
  );
});

router.get('/about', function(req, res){
    res.render('about')
});

module.exports = router;
