const Log = require('../models/log.js');

exports.createLog = (options, cb) => {
    const log = new Log(
        {
            type: options.type,
            model: options.model,
            references: options.references,
        })
    log.save(function(err){
        if (err){
            cb(err, null)
            return;
        }
        cb(null, log);
    })
}

