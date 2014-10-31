'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema


/**
 * Document Schema
 */

var ObjectIdSchema = Schema.ObjectId;
var ObjectId = mongoose.Types.ObjectId;


/**
* Used to add option key/value to other schemas like documents, users or rooms


*/


var MetaoptionsSchema = new Schema({
    _id:  {
        type:ObjectIdSchema, 
        default: function () { return new ObjectId()} },
    created: {
        type: Date,
        default: Date.now
    },
    updated: {
        type: Date,
        default: Date.now
    },
    option_name : {
        type: String,
        default: '',
        trim: true
    },
    option_value : {
        type: String,
        default: '',
        trim: true
    },
    option_type : {
        type: String,
        default: '',
        trim: true
    },
    option_object: {
        type: String,
        default: '',
        trim: true
    }
});
mongoose.model('Metaoptions', MetaoptionsSchema);
module.exports.Schema = MetaoptionsSchema;