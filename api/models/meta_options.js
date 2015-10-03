'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema

/**
    * MetaOptions Schema
    * Used to add option key/value to other schemas like documents, markups, users or rooms
*/

var ObjectIdSchema = Schema.ObjectId;
var ObjectId = mongoose.Types.ObjectId;





var MetaoptionsSchema = new Schema({
    _id:  {
        type:String, 
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