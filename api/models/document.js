'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema

, meta_options = Schema.MetaoptionsSchema;




var ObjectIdSchema = Schema.ObjectId;
var ObjectId = mongoose.Types.ObjectId;


/**
 * Document Schema
 */


// generate _id
//http://stackoverflow.com/questions/11604928/is-there-a-way-to-auto-generate-objectid-when-a-mongoose-model-is-newed


/*
var DocOptionsSchema = new Schema({
    _id:  {type:ObjectIdSchema, default: function () { return new ObjectId()} },
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
});
*/




var MarkupSchema = new Schema({
    _id:  {type:ObjectIdSchema, default: function () { return new ObjectId()} },
    created: {
        type: Date,
        default: Date.now
    },
    updated: {
        type: Date,
        default: Date.now
    },
    user_id: {
        type: Number,
        default: 0,
        trim: true
    },
    username : {
        type: String,
        default: 'anon',
        trim: true
    },
    doc_id: {
        type: Number,
        default: '',
        trim: true
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
        default: '',
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

var DocumentSchema = new Schema({
    created: {
        type: Date,
        default: Date.now
    },
    updated: {
        type: Date,
        default: Date.now
    },
    title: {
        type: String,
        default: 'Yout title',
        trim: true
    },
    subtitle: {
        type: String,
        default: '',
        trim: true
    },
    content: {
        type: String,
        default: 'Your content..',
        trim: true
    },
    markups: [MarkupSchema], 
    doc_options: [meta_options], 

    published:{
        type: Boolean,
        default: false
    },
    user: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    username : {
        type: String,
        default: 'anon',
        trim: true
    },
    room: {
        type: Schema.ObjectId,
        ref: 'Room'
    },
    roomname : {
        type: String,
        default: 'anon-newsroom',
        trim: true
    }
});


DocumentSchema.path('title').validate(function(title) {
    return title.length;
}, 'Title cannot be blank');


DocumentSchema.statics.load = function(title, cb) {
    this.findOne({
        title: title
    }).populate('user', 'name username').populate('room').exec(cb);

};


mongoose.model('Document', DocumentSchema);
