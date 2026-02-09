const { default: mongoose } = require("mongoose");


const connectDB = async () => {
  try {
    if (mongoose.connections[0].readyState) return;
    await mongoose.connect(
      process.env.MONGODB_URI
    );
  } catch (err) {
    console.log("❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌❌MongoDB error:",err.message);
  }
};
export default connectDB;