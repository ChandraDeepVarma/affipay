import mongoose from "mongoose";

const PartnerSchema = new mongoose.Schema({
    partnername: { type:String, required: true, unique: true},
    rating: {type: Number, required:true },
    image: { type: String } 
},{timestamps:true }
);
export default mongoose.models.Partners || mongoose.model("Partners", PartnerSchema);