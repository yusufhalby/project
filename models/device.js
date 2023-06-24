/**

device.js
This file defines the device model for the API application using Mongoose.
*/

// Import required modules
const mongoose = require('mongoose'); 

const Schema = mongoose.Schema;

// Define device schema
const deviceSchema = new Schema({
    waterPump:{ //for control
        type: Boolean,
        default: false,
        required: true,
    },
    anyPump:{ //for control
        type: Boolean,
        default: false,
        required: true,
    },
    landId:{
        type: Schema.Types.ObjectId,
        ref: 'Land',
    },
    userId:{
        type: Schema.Types.ObjectId,
        ref: 'User',
    },

});

// Export the device model
module.exports = mongoose.model('Device', deviceSchema);