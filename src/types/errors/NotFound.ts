import { ContentfulStatusCode } from "hono/utils/http-status";

export class NotFound extends Error {
  public statusCode: ContentfulStatusCode = 404;

  constructor(msg: string) {
    super(msg);
  }
}
