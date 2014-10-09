'use strict';

/**
 * Module dependencies.
 */

var mongoose = require('mongoose'),
Schema = mongoose.Schema,
meta_options = Schema.MetaoptionsSchema;


// generate _id
//http://stackoverflow.com/questions/11604928/is-there-a-way-to-auto-generate-objectid-when-a-mongoose-model-is-newed
var ObjectIdSchema = Schema.ObjectId;
var ObjectId = mongoose.Types.ObjectId;


var RoomSchema = new Schema({
    name: String,
    owner_email: {
        type: String
    },
    owner:{
        type: Schema.ObjectId,
        ref: 'User'
    },
    slug: {
        type: String,
        unique: true
    },
    is_public: {
        type:Boolean,
        default: true,
        trim: true
    },
    status: {
        type: String,
        default: 'open',
        trim: true
    },
    secret: {type:ObjectIdSchema, default: function () { return new ObjectId()} },
    room_options: [meta_options]
});
mongoose.model('Room', RoomSchema);


