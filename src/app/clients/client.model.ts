export class Client {
  constructor(
    public id: number,
    public firstName: string,
    public lastName: string,
    public email: string,
    public createdAt: string,
    public updatedAt: string,
    public photo: string,
    public region: Region
  ) {}
}

export class ClientData {
  constructor(public message: string, public client: Client) {}
}

export class Region {
  constructor(public id: number, public name: string) {}
}
