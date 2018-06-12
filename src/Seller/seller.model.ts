import { Schema, Document, Model, model } from "mongoose";
import { ISeller } from "../Seller/seller.interface";

export interface ISellerModel extends ISeller, Document {}

const sellerSchema: Schema = new Schema({
  owner: {
    type: Schema.Types.ObjectId,
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

const Seller: Model<ISellerModel> = model<ISellerModel>("Seller", sellerSchema);
export default Seller;
