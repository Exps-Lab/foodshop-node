const DB = require('../../mongoDB/index')
const mongoose = require('mongoose')
let AutoIncModel = null

initTransModel();

// 创建一个collection存储自增的字段
function initTransModel () {
  try {
    AutoIncModel = DB.model('autoInc');
  } catch (err) {
    if (err.name === 'MissingSchemaError') {
      // Create new counter schema.
      const AutoIncSchema = new mongoose.Schema({
        model: { type: String, require: true },
        field: { type: String, require: true },
        count: { type: Number, default: 0 }
      });

      // Create a unique index using the "field" and "model" fields.
      AutoIncSchema.index({ field: 1, model: 1 }, { unique: true, required: true, index: -1 });

      // Create model using new schema.
      AutoIncModel = DB.model('autoInc', AutoIncSchema, 'autoInc');
    }
    else
      throw err;
  }
}

// 自定义plugin函数
function autoEnhanceIndexPlugin (schema, options) {
  if (!AutoIncModel) {
    throw new Error("mongoose-auto-increment has not been initialized");
  }
  if (options.model && typeof options.model !== 'string') {
    throw new Error("we need model name to configure the inc for");
  }

  const settings = {
    model: options.model,
    field: options.field || 'id',
    start: options.start || 1,
    incBy: options.incBy || 1
  }

  // // 定义schema中要自增的字段
  const temp = {};
  temp[settings.field] = {
    type: Number,
    require: true,
    unique: true
  };
  schema.add(temp);

  AutoIncModel.findOne({
    model: settings.model,
    field: settings.field
  }).then(data => {
    if (!data) {
      // If no counter exists then create one and save it.
      AutoIncModel.create({
        model: settings.model,
        field: settings.field,
        count: settings.start - settings.incBy
      });
    }
  });

  schema.pre('save', function(next) {
    if (this[settings.field] === undefined) {
      AutoIncModel.findOneAndUpdate(
        { model: settings.model, field: settings.field },
        { $inc: { count: settings.incBy } },
        { new: true },
        (err, data) => {
          if (err) return next(err);
          this[settings.field] = data.count;
          next();
        });
    } else {
      next();
    }
  })
}

module.exports = exports = autoEnhanceIndexPlugin;

