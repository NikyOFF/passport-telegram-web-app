import { HashVerifierCallbackFunction } from "./hash-verifier-callback.function";

export interface HashVerifierFunction {
  (token: string, dataCheckString: string, hash: string, callback: HashVerifierCallbackFunction): void | Promise<void>;
}
