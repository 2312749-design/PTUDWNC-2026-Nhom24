export class ApiClientError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly traceId?: string,
  ) {
    super(message);
    this.name = "ApiClientError";
  }
}
