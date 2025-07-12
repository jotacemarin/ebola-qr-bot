import { ContentfulStatusCode } from "hono/utils/http-status";

export class BadRequest extends Error {
  public statusCode: ContentfulStatusCode = 400;

  constructor(msg: string) {
    super(msg);
  }
}
