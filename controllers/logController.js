const Log = require('../models/log.js');

exports.createLog = (options, cb) => {
    const log = new Log(
        {
            type: options.type,
            model: options.model,
            modelId: options.modelId,
            name: options.name,
            changes: options.changes,
        })
    log.save(function(err){
        if (err){
            cb(err, null)
            return;
        }
        cb(null, log);
    })
}

