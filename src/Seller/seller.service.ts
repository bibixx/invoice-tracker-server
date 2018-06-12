import { Model } from "mongoose";
import * as yup from "yup";

import { ISellerModel } from "./seller.model";
import { isObjectId } from "../util/yup";

const getSellers = Seller =>
  (userId: string) =>
    new Promise(async (resolve, reject) => {
      const schema = yup.object().shape({
        userId: yup.string().required().test(isObjectId),
      });

      try {
        await schema.validate({
          userId,
        });

        const sellers = await Seller.find(
          {
            owner: {
              $in: [userId],
            },
          },
        );

        resolve(sellers);
      } catch (err) {
        reject(err);
      }
    });

const getSellerById = Seller =>
  (userId: string, sellerId: string) =>
    new Promise(async (resolve, reject) => {
      const schema = yup.object().shape({
        userId: yup.string().required().test(isObjectId),
        sellerId: yup.string().required().test(isObjectId),
      });

      try {
        await schema.validate({
          userId,
          sellerId,
        });

        const sellers = Seller.find(
          {
            _id: sellerId,
            owner: {
              $in: [userId],
            },
          },
        );

        resolve(sellers);
      } catch (err) {
        return reject(err);
      }
    });

export default (Seller: Model<ISellerModel>) => ({
  getSellers: getSellers(Seller),
  getSellerById: getSellerById(Seller),
});
