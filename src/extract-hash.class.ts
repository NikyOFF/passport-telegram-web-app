export class ExtractHash {
  public static fromHeaders(request: any): string | null {
    const hash = request.headers["tg-web-app-hash"];

    if (!hash) {
      return null;
    }

    return hash as string;
  }
}
