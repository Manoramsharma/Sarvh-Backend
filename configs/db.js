const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: true,
    fineOneAndUpdate: true,
  });

  console.log("mongodb connected");
};

module.exports = connectDB;
