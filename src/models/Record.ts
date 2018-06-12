import { Schema, Document, Model, model } from "mongoose";
import { ISeller } from "../Seller/seller.interface";

export interface IRecordModel extends ISeller, Document {}

const recordSchema: Schema = new Schema({
  productName: {
    type: String,
    required: true,
  },
  place: {
    type: Schema.Types.ObjectId,
    ref: "Seller",
    required: true,
  },
  seller: {
    type: Schema.Types.ObjectId,
    ref: "Seller",
    required: true,
  },
  dateOfPurchase: {
    type: Date,
    required: true,
  },
  warrantyLength: {
    type: Number,
    required: true,
  },
  notes: {
    type: String,
    required: true,
  },
  files: {
    type: [String],
    required: true,
  },
});

const Record: Model<IRecordModel> = model<IRecordModel>("Record", recordSchema);
export default Record;
