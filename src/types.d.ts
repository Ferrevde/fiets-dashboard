declare global {
  interface D1Database {
    prepare(query: string): D1PreparedStatement;
  }
  interface D1PreparedStatement {
    bind(...values: any[]): D1PreparedStatement;
    first(): Promise<any>;
    all(): Promise<{ results: any[]; success: boolean; meta: any }>;
    run(): Promise<{ success: boolean; meta: any }>;
  }
  interface Fetcher {
    fetch(request: Request): Promise<Response>;
  }
  interface ExecutionContext {
    waitUntil(promise: Promise<any>): void;
    passThroughOnException(): void;
  }
}
export {};
