class Api {
  baseUrl: string;
  requestOptions: string;

  constructor(baseUrl: string, requestOptions: string) {
    this.baseUrl = baseUrl;
    this.requestOptions = requestOptions;
  }

  // Метод для обработки ответа сервера и ошибок
  async handleResponse(response: Response): Promise<any> {
    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`Ошибка сервера: ${response.status} - ${errorData}`);
    }
    return response.json();
  }

  // GET запрос
  async getRequest(endpoint: string): Promise<any> {
    const response = await fetch(this.baseUrl + endpoint, {
      method: 'GET',
      headers: {
        'Content-Type': this.requestOptions,
      },
    });
    return this.handleResponse(response);
  }

  // POST запрос
  async postRequest(endpoint: string, data: any): Promise<any> {
    const response = await fetch(this.baseUrl + endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': this.requestOptions,
      },
      body: JSON.stringify(data),
    });
    return this.handleResponse(response);
  }
}

export default Api;
