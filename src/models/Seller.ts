import mongoose from "mongoose";
import { ISeller } from "../interfaces/Seller";

export interface ISellerModel extends ISeller, mongoose.Document {}

const sellerSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  nip: {
    type: String,
    required: true,
    unique: true,
  },
  city: {
    type: String,
    required: true,
  },
  street: {
    type: String,
    required: true,
  },
  zip: {
    type: String,
    required: true,
  },
  seller: {
    type: Boolean,
    required: true,
  },
  place: {
    type: Boolean,
    required: true,
  },
});

const Seller = mongoose.model<ISellerModel>("Seller", sellerSchema);
export default Seller;
