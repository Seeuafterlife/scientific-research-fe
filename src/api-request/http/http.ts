class HttpService {
    private baseUrl: string;

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
    }

    private async request(
        method: string,
        endpoint: string,
        body?: any,
        headers: Record<string, string> = {}
    ): Promise<Response> {
        const url = `${this.baseUrl}${endpoint}`;
        const isFormData = body instanceof FormData;

        // Lấy token từ localStorage
        const token = localStorage.getItem("token");

        // Thêm token vào headers nếu tồn tại
        if (token) {
            headers["Authorization"] = `Bearer ${token}`;
        }

        // Loại bỏ Content-Type nếu body là FormData
        if (isFormData) {
            delete headers["Content-Type"];
        }

        const options: RequestInit = {
            method,
            headers: isFormData
                ? headers // Không thêm Content-Type khi dùng FormData
                : {
                      "Content-Type": "application/json",
                      ...headers,
                  },
        };

        // Chỉ thêm body nếu cần
        if (body && (method !== "GET" && method !== "DELETE")) {
            options.body = isFormData ? body : JSON.stringify(body);
        }

        // Gửi request
        const response = await fetch(url, options);

        return response;
    }

    public get(endpoint: string, headers: Record<string, string> = {}): Promise<Response> {
        return this.request("GET", endpoint, undefined, headers);
    }

    public post(
        endpoint: string,
        body: any,
        headers: Record<string, string> = {}
    ): Promise<Response> {
        return this.request("POST", endpoint, body, headers);
    }

    public put(
        endpoint: string,
        body: any,
        headers: Record<string, string> = {}
    ): Promise<Response> {
        return this.request("PUT", endpoint, body, headers);
    }

    public delete(
        endpoint: string,
        headers: Record<string, string> = {}
    ): Promise<Response> {
        return this.request("DELETE", endpoint, undefined, headers);
    }
}

export default HttpService;
