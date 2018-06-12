import { TestOptions } from "yup";
import { Types } from "mongoose";

export const isObjectId: TestOptions = {
  test(v: string): boolean {
    const isValid = Types.ObjectId.isValid(v);

    if (!isValid) {
      return this.createError({
        path: this.path,
        message: `${this.path} must be a valid ObjectId`,
      });
    }

    return isValid;
  },
};
