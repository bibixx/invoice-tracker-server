import mongoose from "mongoose";

import { ISeller } from "../interfaces/Seller";

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
  }
});

const Seller = mongoose.model("Seller", sellerSchema);
export default Seller;