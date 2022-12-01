import { VerifiedCallback } from "./verified-callback.function";

export interface VerifyCallback {
  (payload: any, done: VerifiedCallback): void;
}
