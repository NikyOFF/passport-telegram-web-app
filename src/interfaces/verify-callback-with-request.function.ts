import { VerifiedCallback } from "./verified-callback.function";

export interface VerifyCallbackWithRequest {
  (request: Request, payload: any, done: VerifiedCallback): void;
}
