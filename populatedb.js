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
          franchises.push(franchise);
          cb(null, franchise);
        });
      },
      function (franchise, cb) {
        logdetail = {
          type: "Created",
          model: "Franchise",
            references: franchise._id,
        };

        let log = new Log(logdetail);
        log.save(function (err) {
          if (err) {
            cb(err, null);
            return;
          }
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
          characters.push(character);
          cb(null, character);
        });
      },
      function (character, cb) {
        logdetail = {
          type: "Created",
          model: "Character",
            references: character._id,
        };
        let log = new Log(logdetail);
        log.save(function (err) {
          if (err) {
            cb(err, null);
            return;
          }
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
      callback(null, results);
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
          figures.push(figure);
          cb(null, figure);
        });
      },
      function (figure, cb) {
        logdetail = {
          type: "Created",
          model: "Figure",
            references: figure._id,
        };
        let log = new Log(logdetail);
        log.save(function (err) {
          if (err) {
            cb(err, null);
            return;
          }
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

function createFranchises(cb) {
  async.parallel(
    [
      function (callback) {
        franchiseCreate(
          "Ore no Imoto ga Konna ni Kawaii Wake ga Nai",
          "My little sister can't be this cute",
          callback
        );
      },
      function (callback) {
        franchiseCreate(
          "Otonari no Tenshi-sama ni Itsunomanika Dame Ningen ni Sareteita Ken",
          "The Angel Next Door Spoils Me Rotten",
          callback
        );
      },
    ],
    function (err, results) {
      if (err) {
        cb(err, null);
        return;
      }
      cb(null, results);
    }
  );
}

function createCharacters(cb) {
  async.parallel(
    [
      function (callback) {
        characterCreate("Kuroneko (Ruri Gokou)", franchises[0], callback);
      },
      function (callback) {
        characterCreate("Kirino Kosaka", franchises[0], callback);
      },
      function (callback) {
        characterCreate("Mahiru Shiina", franchises[1], callback);
      },
    ],
    function (err, results) {
      if (err) {
        cb(err, null);
        return;
      }
      cb(null, results);
    }
  );
}

function createFigures(cb) {
  async.parallel(
    [
      function (callback) {
        figureCreate(
          "Kuroneko Osuwari ver",
          characters[0],
          "Wave",
          "Good quality",
          "Cute",
          200,
          "https://solarisjapan.com/products/oreimo-kuroneko-osuwari-ver-1?oid=107838&qid=ab8dbb0241707251b3dc26df6c07194f#",
          10,
          callback
        );
      },
      function (callback) {
        figureCreate(
          "Kirino Casual Clothes ver",
          characters[1],
          "Kaitendo",
          "ABS, PVC/BASE",
          "Stand",
          120,
          "https://solarisjapan.com/products/oreimo-kirino-kousaka-casual-clothes-ver-1-8?oid=107644&qid=6ca2e78b2bb38363949f7f7845133dd6#",
          60,
          callback
        );
      },
      function (callback) {
        figureCreate(
          "Shiina Mahiru Umbrella ver",
          characters[2],
          "FuRyu",
          "1/7 in scale",
          "Removable umbrella",
          250,
          "https://solarisjapan.com/products/otonari-no-tenshi-sama-ni-itsunomanika-dame-ningen-ni-sareteita-ken-shiina-mahiru-f-nex-1-7-furyu-shop-exclusive?oid=168308&qid=214f07d8ada20796dc7126149c096bb2",
          22.5,
          callback
        );
      },
    ],
    function (err, results) {
      if (err) {
        cb(err, null);
        return;
      }
      cb(null, results);
    }
  );
}

async.series(
  [createFranchises, createCharacters, createFigures],
  function (err, results) {
    if (err) {
      console.log("ERR: " + err);
    } else {
      console.log("FINISHED SUCCESSFULLY");
    }
    mongoose.connection.close();
  }
);
