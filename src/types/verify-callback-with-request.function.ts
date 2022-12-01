import { VerifiedCallback } from "./verified-callback.function";

export type VerifyCallbackWithRequest = (request: Request, payload: any, done: VerifiedCallback) => void;
