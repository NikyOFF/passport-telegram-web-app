import { DataFromRequestFunction } from "./data-from-request.function";
import { HashFromRequestFunction } from "./hash-from-request.function";
import { DataToCheckStringFunction } from "./data-to-check-string.function";
import { HashVerifierFunction } from "./hash-verifier.function";

export interface StrategyOptions {
  token: string;
  expiration?: number;
  passRequestToCallback?: boolean;
  dataFromRequest?: DataFromRequestFunction;
  hashFromRequest?: HashFromRequestFunction;
  dataToCheckString?: DataToCheckStringFunction;
  hashVerifier?: HashVerifierFunction;
}
