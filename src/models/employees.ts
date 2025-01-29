import mongoose, { Document, Schema } from "mongoose";

export interface Iemployee extends Document {
  firstname: string;
  lastname: string;
  employeename: string;
  email: string;
  password: string;
  role: string;
}

const employeeSchema: Schema = new Schema(
  {
    firstname: {
      type: String,
      required: true,
    },
    lastname: {
      type: String,
      required: true,
    },
    employeename: {
      type: String,
      unique: true,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const employee = mongoose.model<Iemployee>("employee", employeeSchema);

export default employee;
