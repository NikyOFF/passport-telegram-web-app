import { enc, HmacSHA256 } from "crypto-js";

import { DataInterface } from "./interfaces/data.interface";
import { HashVerifierCallbackFunction } from "./interfaces/hash-verifier-callback.function";

export class Utils {
  public static defaultDataToCheckString(data: DataInterface): string {
    return `auth_date=${data.authDate}\nquery_id=${data.queryId}\nuser=${JSON.stringify(data.user)}`;
  }

  public static defaultHashVerifier(
    token: string,
    dataCheckString: string,
    hash: string,
    callback: HashVerifierCallbackFunction,
  ): void | Promise<void> {
    const secret = HmacSHA256(token, "WebAppData");
    const signature = HmacSHA256(dataCheckString, secret);
    const hex = signature.toString(enc.Hex);

    if (hex !== hash) {
      return callback(new Error("Not valid"));
    }

    return callback(null);
  }
}
