const mongoose = require('mongoose');
const { Schema } = mongoose;

const locationSchema = new Schema({
    placeId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    formatted_address: { type: String, required: true },
    location: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    }
});

// locationSchema.index({ location: '2dsphere' }); // Index for geospatial queries

const GeoLocation = mongoose.model('GeoLocation', locationSchema);

module.exports = {GeoLocation};
