# telegram-web-app-passport

A [Passport](https://www.passportjs.org/) strategy for [telegram web app (bots)](https://core.telegram.org/bots/webapps) authentication.

This module lets you authenticate endpoints using a [telegram WebAppInitData](https://core.telegram.org/bots/webapps#webappinitdata).

---

## Install
```bash
$ npm install passport-telegram-web-app
```

## Usage
### Configure Strategy
```ts
new JwtStrategy(options, verify)
```

`options` is an object literal containing options to control how extracted data and hash from request and how is all of it checked

* `token` (*required*) is a string containing the telegram bot token
* `expiration` (*optional*) is a time in seconds to check if the token expires
    - default: `0`
* `passRequestToCallback` (*optional*) is a boolean for cases when you need pass request object to verify callback
    - default: `false`
* `dataFromRequest` (*optional*) function for extract data from request
    - default: `ExtractData.fromHeaders`
    - interface:
        ```ts
        interface DataFromRequestFunction {
            (req: Request): Data | null;
        }
        ```
* `hashFromRequest` (*optional*) function for extract hash from request
    - default: `ExtractHash.fromHeaders`
    - interface:
        ```ts
        interface HashFromRequestFunction {
            (req: Request): string | null;
        }
        ```
* `dataToCheckString` (*optional*) function to make check string from data
    - default: `Utils.dataToCheckString`
    - interface:
        ```ts
        interface DataToCheckStringFunction {
            (data: Data): string;
        }
        ```
* `hashVerifier` (*optional*) function for verify hash
    - default: `Utils.hashVerifier`
    - interface:
        ```ts
        interface HashVerifierFunction {
            (token: string, dataCheckString: string, hash: string, callback: HashVerifierCallbackFunction): void | Promise<void>;
        }
        ```
        - HashVerifierCallbackFunction
        ```ts
        interface HashVerifierCallbackFunction {
            (error: Error): void | Promise<void>;
        }
        ```

`verify` is a callback function

* `request` (*optional* only if passRequestToCallback is true) is a request object
* `payload` is an object literal containing [web app user](https://core.telegram.org/bots/webapps#webappuser)
* `done` is a passport error first callback accepting arguments done(error, user, info)

## Extracting data from request
To be able to save flexible solutions, a special callback is used that pulls Data from the request. This callback is passed during configuration and is called `dataFromRequest`. This callback, from now on referred to as an extractor, accepts a request object as an argument and returns the encoded JWT string or null.

### Included extractors
* `fromHeaders`
    - `auth_date` header called `tg-web-app-auth-date`
    - `query_id` header called `tg-web-app-query-id`
    - `user` header called `tg-web-app-user` (pass as json)


## Extracting hash from request
Essentially the same but for hash from [web app init data](https://core.telegram.org/bots/webapps#webappinitdata). This callback is passed during configuration and is called `hashFromRequest`.

### Included extractors
* `fromHeaders`
    - `hash` header called `tg-web-app-hash`

### Other things (dataToCheckString, hashVerifier)
For understanding read [how validate data received via the Web App](https://core.telegram.org/bots/webapps#validating-data-received-via-the-web-app).

## Authenticate requests
Use passport.authenticate() specifying 'telegram-web-app' as the strategy.

### Express
```ts
app.post('/ping', passport.authenticate('telegram-web-app', { session: false }), (request, response) => {
    response.send('pong!');
});
```

### NestJS
#### telegram-web-app.strategy.ts
```ts
import { Inject, Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, WebAppUser } from "passport-telegram-web-app";

@Injectable()
export class TelegramWebAppStrategy extends PassportStrategy(Strategy) {
    public constructor() {
        super({
            token: "your telegram bot token",
        });
    }

    async validate(webAppUser: WebAppUser): Promise<any> {
        return webAppUser;
    }
}
```

#### telegram-web-app.auth-guard.ts
```ts
import { Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { STRATEGY_NAME } from "passport-telegram-web-app";

@Injectable()
export class TelegramWebAppAuthGuard extends AuthGuard(STRATEGY_NAME) {}
```