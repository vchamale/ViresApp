const baseApi = {
  // vires: 'http://137.184.216.113:3000'
  vires: 'http://localhost:3000'
};

export const api = {
  vires: {
    auth: `${baseApi.vires}/api/auth`,
    shiptment: `${baseApi.vires}/api/shipments`,
    destination: `${baseApi.vires}/api/destinations`,
    origin: `${baseApi.vires}/api/origins`,
    truck: `${baseApi.vires}/api/trucks`,
    client: `${baseApi.vires}/api/clients`,
    currency: `${baseApi.vires}/api/currencies`,
    driver: `${baseApi.vires}/api/drivers`,
    container: `${baseApi.vires}/api/containers`
  }
};
