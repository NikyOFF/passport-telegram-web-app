export interface HashVerifierCallbackFunction {
  (error: Error | null): void | Promise<void>;
}
