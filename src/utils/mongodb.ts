import { Config } from "@/config";
import mongoose from "mongoose";

const connection: {connected?:number } = {};

export const dbConnect = async () => {
    if(connection.connected){
        return;
    }
    const db = await mongoose.connect(Config.MONGODB_URI);
    connection.connected = db.connections[0].readyState; 
}
