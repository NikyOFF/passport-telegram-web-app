import { Strategy as StrategyInterface } from "passport-strategy";

import { STRATEGY_NAME } from "./constants";
import { ExtractData } from "./extract-data.class";
import { ExtractHash } from "./extract-hash.class";
import { Utils } from "./utils";

import { DataFromRequestFunction } from "./interfaces/data-from-request.function";
import { HashFromRequestFunction } from "./interfaces/hash-from-request.function";
import { DataToCheckStringFunction } from "./interfaces/data-to-check-string.function";
import { StrategyOptions } from "./interfaces/strategy-options.interface";
import { HashVerifierFunction } from "./interfaces/hash-verifier.function";
import { VerifyCallback } from "./interfaces/verify-callback.function";
import { VerifyCallbackWithRequest } from "./interfaces/verify-callback-with-request.function";

export class Strategy extends StrategyInterface {
  public readonly name: string;
  public readonly dataFromRequest: DataFromRequestFunction;
  public readonly hashFromRequest: HashFromRequestFunction;
  public readonly dataToCheckString: DataToCheckStringFunction;
  public readonly hashVerifier: HashVerifierFunction;

  public constructor(options: StrategyOptions, verify: VerifyCallback);
  public constructor(options: StrategyOptions, verify: VerifyCallbackWithRequest);

  public constructor(public readonly options: StrategyOptions, public readonly verify: any) {
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

      if (this.options.expiration && Date.now() / 1000 - parseInt(data.authDate) > this.options.expiration) {
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
