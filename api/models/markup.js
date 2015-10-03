'use strict';

/**
 * Module dependencies.
 */
var nconf = require('nconf')
nconf.argv().env().file({file:'config.json'});


var mongoose = require('mongoose'),
Schema = mongoose.Schema,
meta_options = Schema.MetaoptionsSchema;

/**
 * Markup Schema
 */

// generate _id
//http://stackoverflow.com/questions/11604928/is-there-a-way-to-auto-generate-objectid-when-a-mongoose-model-is-newed
var ObjectIdSchema = Schema.ObjectId;
var ObjectId = mongoose.Types.ObjectId;

var MarkupSchema = new Schema({
    _id:  {type:String, default: function () { return new ObjectId()} },
    created: {
        type: Date,
        default: Date.now
    },
    updated: {
        type: Date,
        default: Date.now
    },
    user_id: {
        type: Schema.ObjectId,
         trim: true,
        ref: 'User'
    },
    username : {
        type: String,
        default: '-',
        trim: true
    },
    doc_id:{
          type: Schema.ObjectId,
          trim: true,
          ref: 'Document'
    },
    start: {
        type: Number,
        default: '',
        trim: true
    },
    end: {
        type: Number,
        default: '',
        trim: true
    },
    metadata: {
        type: String,
        default: '',
        trim: true
    },
    type: {
        type: String,
        default: '',
        trim: true
    },
    subtype: {
        type: String,
        default: '',
        trim: true
    },
    status: {
        type: String,
        default: 'pending',
        trim: true
    },
    position: {
        type: String,
        default: 'left',
        trim: true
    },
    depth: {
        type: Number,
        default: 1,
        trim: true
    },
    markup_options: [meta_options]
});

/*
MarkupSchema.virtual('metadata')
  .set(function() {
    this.padsss= 'password';
    this.salt = 'this.makeSalt()';
    this.hashed_password = 'this.encryptPassword(password)';
  })
  .get(function() { return this.salt; });

*/


mongoose.model('Markup', MarkupSchema);
module.exports.Schema = MarkupSchema;