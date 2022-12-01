import { Strategy as StrategyInterface } from "passport-strategy";

import { STRATEGY_NAME } from "./constants";
import { ExtractData } from "./extract-data.class";
import { ExtractHash } from "./extract-hash.class";
import { Utils } from "./utils";

import { StrategyOptions } from "./interfaces/strategy-options.interface";
import { DataFromRequestFunction } from "./types/data-from-request.function";
import { HashFromRequestFunction } from "./types/hash-from-request.function";
import { DataToCheckStringFunction } from "./types/data-to-check-string.function";
import { HashVerifierFunction } from "./types/hash-verifier.function";
import { VerifyCallback } from "./types/verify-callback.function";
import { VerifyCallbackWithRequest } from "./types/verify-callback-with-request.function";

export class Strategy extends StrategyInterface {
  public readonly name: string;
  public readonly dataFromRequest: DataFromRequestFunction;
  public readonly hashFromRequest: HashFromRequestFunction;
  public readonly dataToCheckString: DataToCheckStringFunction;
  public readonly hashVerifier: HashVerifierFunction;

  public constructor(public readonly options: StrategyOptions, public readonly verify: any | VerifyCallback | VerifyCallbackWithRequest) {
    super();

    this.name = STRATEGY_NAME;
    this.dataFromRequest = options.dataFromRequest ?? ExtractData.fromHeaders;
    this.hashFromRequest = options.hashFromRequest ?? ExtractHash.fromHeaders;
    this.dataToCheckString = options.dataToCheckString ?? Utils.defaultDataToCheckString;
    this.hashVerifier = options.hashVerifier ?? Utils.defaultHashVerifier;
  }

  public authenticate(request: any, options?: any): void {
    const data = this.dataFromRequest(request);
    const hash = this.hashFromRequest(request);

    if (!data) {
      return this.fail(new Error("No data"), 401);
    }

    if (!hash) {
      return this.fail(new Error("No hash"), 401);
    }

    this.hashVerifier(this.options.token, this.dataToCheckString(data), hash, (error) => {
      if (error) {
        return this.fail(error, 401);
      }

      if (this.options.expiration && (Date.now() / 1000) - parseInt(data.authDate, 10) > this.options.expiration) {
        return this.fail(new Error("Expired"), 401);
      }

      const done = this.done.bind(this);

      try {
        if (this.options.passRequestToCallback) {
          this.verify(request, data.user, done);
        } else {
          this.verify(data.user, done);
        }
      } catch (error) {
        this.fail(error, 401);
      }
    });
  }

  protected done(error: any, user?: any, info?: any): void {
    if (error) {
      return this.error(error);
    } else if (!user) {
      return this.fail(info);
    }

    return this.success(user, info);
  }
}
