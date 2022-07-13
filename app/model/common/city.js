const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  cityData: {
    type: Object,
    trim: true,
    require: true,
  }
})

module.exports = mongoose.model('city', UserSchema, 'city');
