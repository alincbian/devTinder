const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://ali:Ali3221@namastenode.uco7x.mongodb.net/devTinder"
  );
};

module.exports = connectDB;
