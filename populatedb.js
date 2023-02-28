let useArgs = process.argv.slice(2);

let async = require("async");
const Figure = require("./models/figure");
const Character = require("./models/character");
const Franchise = require("./models/franchise");
const Log = require("./models/log");

const mongoose = require("mongoose");
const mongoDB = useArgs[0];
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = global.Promise;
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

const figures = [];
const characters = [];
const franchises = [];
const logs = [];

function franchiseCreate(name, description, callback) {
  async.waterfall(
    [
      function (cb) {
        franchisedetail = {
          name: name,
          description: description,
        };
        let franchise = new Franchise(franchisedetail);
        franchise.save(function (err) {
          if (err) {
            cb(err, null);
            return;
          }
          console.log("New Franchise: " + franchise);
          franchises.push(franchise);
          cb(null, franchise);
        });
      },
      function (franchise, cb) {
        logdetail = {
          type: "Created",
          model: "Franchise",
          modelId: franchise._id,
        };

        let log = new Log(logdetail);
        log.save(function (err) {
          if (err) {
            cb(err, null);
            return;
          }
          console.log("New Log: " + log);
          logs.push(log);
          cb(null, [franchise, log]);
        });
      },
    ],
    function (err, results) {
      if (err) {
        callback(err, null);
        return;
      }
      callback(null, results);
    }
  );
}

function characterCreate(name, franchise, callback) {
  async.waterfall(
    [
      function (cb) {
        characterdetail = {
          name: name,
          franchise: franchise,
        };

        let character = new Character(characterdetail);
        character.save(function (err) {
          if (err) {
            cb(err, null);
            return;
          }
          console.log("New Character: " + character);
          characters.push(character);
          cb(null, character);
        });
      },
      function (character, cb) {
        logdetail = {
          type: "Created",
          model: "Character",
          modelId: character._id,
        };
        let log = new Log(logdetail);
        log.save(function (err) {
          if (err) {
            cb(err, null);
            return;
          }
          console.log("New Log: " + log);
          logs.push(log);
          cb(null, [character, log]);
        });
      },
    ],
    function (err, results) {
      if (err) {
        callback(err, null);
        return;
      }
      callback(results, null);
    }
  );
}

function figureCreate(
  name,
  character,
  manufacturer,
  specs,
  includes,
  price,
  store,
  height,
  callback
) {
  async.waterfall(
    [
      function (cb) {
        figuredetail = {
          name: name,
          character: character,
          manufacturer: manufacturer,
          specs: specs,
          includes: includes,
          price: price,
          store: store,
          height: height,
        };
        let figure = new Figure(figuredetail);
        figure.save(function (err) {
          if (err) {
            cb(err, null);
            return;
          }
          console.log("New Figure: " + figure);
          figures.push(figure);
          cb(null, figure);
        });
      },
      function (figure, cb) {
        logdetail = {
          type: "Created",
          model: "Figure",
          modelId: figure._id,
        };
        let log = new Log(logdetail);
        log.save(function (err) {
          if (err) {
            cb(err, null);
            return;
          }
          console.log("New Log: " + log);
          logs.push(log);
          cb(null, [figure, log]);
        });
      },
    ],
    function (err, results) {
      if (err) {
        callback(err, null);
        return;
      }
      callback(null, results);
    }
  );
}
