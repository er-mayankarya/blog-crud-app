import mongoose, { connect } from "mongoose";


const connectDB = async ()=>{
    try {
        mongoose.connection.on('connected',()=> console.log('Connected'))
        await mongoose.connect(`${process.env.MONGODB_URI}/blog`)

    } catch (error) {
        console.log(error.message);

    }


}

export default connectDB;