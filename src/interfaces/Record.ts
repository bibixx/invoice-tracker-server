import { ISellerModel } from "../Seller/seller.model";

export interface IRecord {
  productName: string;
  place: ISellerModel;
  seller: ISellerModel;
  dateOfPurchase: Date;
  warrantyLength: number;
  notes: string;
  files: string[];
}
