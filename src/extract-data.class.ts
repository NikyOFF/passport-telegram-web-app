import { DataInterface } from "./interfaces/data.interface";

export class ExtractData {
  public static fromHeaders(request: any): DataInterface | null {
    const authDate = request.headers["tg-web-app-auth-date"];
    const queryId = request.headers["tg-web-app-query-id"];
    const userRaw = request.headers["tg-web-app-user"];

    if (!(authDate && queryId && userRaw)) {
      return null;
    }

    return {
      authDate: authDate as string,
      queryId: queryId as string,
      user: JSON.parse(userRaw as string),
    };
  }
}
