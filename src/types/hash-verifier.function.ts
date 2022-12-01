import { HashVerifierCallbackFunction } from "./hash-verifier-callback.function";

export type HashVerifierFunction = (token: string, dataCheckString: string, hash: string, callback: HashVerifierCallbackFunction) => void | Promise<void>;
