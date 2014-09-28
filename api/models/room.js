'use strict';

/**
 * Module dependencies.
 */

var mongoose = require('mongoose'),
    Schema = mongoose.Schema
    , meta_options = Schema.MetaoptionsSchema;

 

/**
 * Room Schema
 */

var RoomSchema = new Schema({
    name: String,
    owner_email: {
        type: String
    },
    slug: {
        type: String,
        unique: true
    }
    ,room_options: [meta_options]
});

mongoose.model('Room', RoomSchema);


