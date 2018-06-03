import { ISellerModel } from "../models/Seller";

export interface IRecord {
  productName: string;
  place: ISellerModel;
  seller: ISellerModel;
  dateOfPurchase: Date;
  warrantyLength: number;
  notes: string;
  files: string[];
}
