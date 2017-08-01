class ApiResponse {
    id: number;
    jsonrpc: string;
    result: string;
    error: Error;
}

class Error {
    code: number;
    message: string;
    data: string;
}

export { ApiResponse };
