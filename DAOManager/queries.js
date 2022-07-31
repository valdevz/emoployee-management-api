let saveData = (model, data) => {
  return new model(data).save();
}

let getData = (model, query, projection, options) => {
  return model.find(query, projection, options);
}

let findOne = (model, query, projection, options) => {
  return model.findOne(query, projection, options);
}

let findAndUpdate = (model, conditions, update, options) => {
  return model.find(conditions, update, options);
}

let findAndRemove =  (model, conditions, update, options) => {
  return model.findOneAndRemove(conditions, update, options);
}

let remove = (model, condition) => {
  return model.remove(condition);
}

let deleteMany = (model, condition) => {
  return model.deleteMany(condition);
}

let count = (model, condition) => {
  return model.count(condition);
}

let insertOne = (model, data, options) => {
  return model.collection.insertOne(data, options);
}

let insertMany = (model, data, options) => {
  return model.collection.insertMany(data, options);
}

let updateOne = (model, update, options) => {
  return model.collection.updateOne(update, options);
}

let aggregate = function (model, aggregateArray, options) {

  let aggregation = model.aggregate(aggregateArray);

  if(options) aggregation.options = options;

  return aggregation.exec();
};

module.exports = {
  saveData,
  getData,
  findOne,
  findAndUpdate,
  findAndRemove,
  remove,
  deleteMany,
  count,
  insertOne,
  insertMany,
  updateOne,
  aggregate
}