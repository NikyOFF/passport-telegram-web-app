import { DataInterface } from "./data.interface";

export interface DataFromRequestFunction {
  (request: any): DataInterface | null;
}
