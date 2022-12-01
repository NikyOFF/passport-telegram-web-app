import { DataInterface } from "../interfaces/data.interface";

export type DataFromRequestFunction = (request: any) => DataInterface | null
