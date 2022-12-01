import { DataInterface } from "./data.interface";

export interface DataToCheckStringFunction {
  (data: DataInterface): string;
}
