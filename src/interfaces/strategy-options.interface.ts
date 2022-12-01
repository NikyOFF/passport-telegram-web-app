import { DataFromRequestFunction } from "../types/data-from-request.function";
import { HashFromRequestFunction } from "../types/hash-from-request.function";
import { DataToCheckStringFunction } from "../types/data-to-check-string.function";
import { HashVerifierFunction } from "../types/hash-verifier.function";

export interface StrategyOptions {
  token: string;
  expiration?: number;
  passRequestToCallback?: boolean;
  dataFromRequest?: DataFromRequestFunction;
  hashFromRequest?: HashFromRequestFunction;
  dataToCheckString?: DataToCheckStringFunction;
  hashVerifier?: HashVerifierFunction;
}
