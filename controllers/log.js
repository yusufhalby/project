const Log = require('../models/log');
const Device = require('../models/device');
const Land = require('../models/land');


// super admin only
exports.getAllLogs = (req, res, next) => {
    const currentPage = req.query.page || 1;
    const perPage = 10;
    let totalItems;
    Log.find()
    .countDocuments()
    .then(count => {
        totalItems = count; 
        return Log.find({userId})
        .skip((currentPage - 1) * perPage)
        .limit(perPage);
    })
    .then(logs => {
        if(!logs){
            const error = new Error('Could not find logs.');
            error.statusCode = 404;
            throw error;
        }
        res.status(200).json({message: 'logs fetched.', logs, totalItems});
    })
    .catch(err=>{
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    });
};


exports.getLogs = (req, res, next) => {
    const currentPage = req.query.page || 1;
    const perPage = 10;
    let totalItems;
    const userId= req.userId;
    Log.find({userId})
    .countDocuments()
    .then(count => {
        totalItems = count; 
        return Log.find({userId})
        .skip((currentPage - 1) * perPage)
        .limit(perPage);
    })
    .then(logs => {
        if(!logs){
            const error = new Error('Could not find logs.');
            error.statusCode = 404;
            throw error;
        }
        res.status(200).json({message: 'logs fetched.', logs, totalItems});
    })
    .catch(err=>{
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    });
};


exports.getLog = (req, res, next) => {
    const logId = req.params.logId;
    const userId = req.userId;
    Log.findById(logId)
    .then(log => {
        if(!log){
            const error = new Error('Could not find log.');
            error.statusCode = 404;
            throw error; 
        }
        if(log.userId != userId){
            const error = new Error('Not Authorized.');
            error.statusCode = 401;
            throw error;
        }
        res.status(200).json({message: 'log fetched.', log});
    })
    .catch(err=>{
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    });
};


exports.postLog = (req, res, next) => {
    // console.log(req);
    const n = req.body.n;
    const p = req.body.p;
    const k = req.body.k;
    const temp = req.body.temp;
    const humidity = req.body.humidity;
    const ph = req.body.ph;
    const rainfall = req.body.rainfall;
    const deviceId = req.body.deviceId;
    let landId;
    let label;
    let userId;
    let log;

    Device
    .findById(deviceId)
    .then(device =>{
        if(!device){
            const error = new Error('Device not found.');
            error.statusCode = 404;
            throw error;
        }
        landId = device.landId;
        userId = device.userId;
        return Land.findById(landId);
    })
    .then(land => {
        if(!land){
            const error = new Error('land not found.');
            error.statusCode = 404;
            throw error;
        }
        label = land.plantLabel;
        log = new Log({
            n,
            p,
            k,
            temp,
            humidity,
            ph,
            rainfall,
            label,
            landId,
            deviceId,
            userId
        });
        return log.save()
    })
    .then(result =>{
        res.status(201).json({
            message: 'created successfully',
            log
        });
    })
    .catch(err => {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    });
};


exports.deleteLog = (req, res, next) => {
    const userId = req.userId;
    const logId = req.params.logId;
    Log.findById(logId)
    .then(log => {
        if(!log){
            const error = new Error('Could not find log.');
            error.statusCode = 404;
            throw error; //throw the error to catch block
        }
        if(log.userId != userId){
            const error = new Error('Not Authorized.');
            error.statusCode = 401;
            throw error;
        }
        return Log.deleteOne({_id: logId});
    })
    .then(result=>{
        res.status(200).json({message: 'log deleted.'});
    })
    .catch(err=>{
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    });
};


exports.getLandLogs = (req, res, next) => {
    const landId = req.params.landId;
    const userId = req.userId;
    const currentPage = req.query.page || 1;
    const perPage = 10;
    let totalItems;

    Land.findById(landId)
    .then(land => {
        if(!land){
            const error = new Error('Could not find land.');
            error.statusCode = 404;
            throw error; 
        }
        if(land.userId != userId){
            const error = new Error('Not Authorized.');
            error.statusCode = 401;
            throw error;
        }
        return Log.find({landId, userId}).countDocuments()
    })
    .then(count => {
        totalItems = count; 
        return Log.find({landId, userId})
        .skip((currentPage - 1) * perPage)
        .limit(perPage);
    })
    .then(logs => {
        if(!logs){
            const error = new Error('Could not find logs.');
            error.statusCode = 404;
            throw error; 
        }
        res.status(200).json({message: 'logs fetched.', logs, totalItems});
    })
    .catch(err=>{
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    });
};