const dotenv = require("dotenv");
dotenv.config({ path: "./.env" });

const mongoose = require("mongoose");
const app = require("./app");

const databaseConfig = {
  "<username>": process.env.USER,
  "<password>": process.env.DATABASE_PASSWORD
};

const DB = process.env.DATABASE.replace(
  /<username>|<password>/gi,
  (matched) => {
    return databaseConfig[matched];
  }
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    serverSelectionTimeoutMS: 60000,
    socketTimeoutMS: 75000,
    connectTimeoutMS: 60000,
    maxPoolSize: 10,
    retryWrites: true,
    family: 4, // Force IPv4
    directConnection: false,
    maxIdleTimeMS: 30000,
    heartbeatFrequencyMS: 10000,
    ssl: true,
    sslValidate: false,
    tlsAllowInvalidCertificates: true,
    tlsAllowInvalidHostnames: true
  })
  .then(() => {
    console.log("Database connected successfully");
  })
  .catch((error) => {
    console.error("Database connection failed:", error.message);
    console.log("Attempting to use local MongoDB fallback...");
    
    // Fallback to local MongoDB
    mongoose
      .connect("mongodb://localhost:27017/zetflixtv", {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
        useFindAndModify: false
      })
      .then(() => {
        console.log("Connected to local MongoDB successfully");
      })
      .catch((localError) => {
        console.error("Local MongoDB connection also failed:", localError.message);
        console.log("Server will continue without database connection");
      });
  });

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`server started on port ${PORT}`);
});
