import mongoose from "mongoose";

const connectToDatabase = async () => {
  try {
    const MONGODB_URL = `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@sandbox.6dy7r.mongodb.net/${process.env.MONGODB_DATABASE}?retryWrites=true&w=majority`;
    //    mongodb+srv://shbhm6496:<password>@cluster0.sofci.mongodb.net/myFirstDatabase               ?retryWrites=true&w=majority

    const { connection } = await mongoose.connect(MONGODB_URL, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    });
    console.log(`Connected with the database: ${connection.host}`.cyan.bold);
  } catch (err) {
    console.error("Failed to connect with database".red.bold);
    console.error(`Error: ${err.message}`.red);
    process.exit(1);
  }
};

export default connectToDatabase;
