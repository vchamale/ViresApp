const baseApi = {
  // vires:'http://157.230.184.78:3000'
  vires: "http://192.168.1.45:3000",
};

export const api = {
  vires: {
    auth: `${baseApi.vires}/api/auth`,
    role: `${baseApi.vires}/api/roles`,
    shipment: `${baseApi.vires}/api/shipments`,
    shiptmentStatus: `${baseApi.vires}/api/shipments-status`,
    document: `${baseApi.vires}/api/documents`,
    destination: `${baseApi.vires}/api/destinations`,
    origin: `${baseApi.vires}/api/origins`,
    truck: `${baseApi.vires}/api/trucks`,
    make: `${baseApi.vires}/api/make`,
    client: `${baseApi.vires}/api/clients`,
    currency: `${baseApi.vires}/api/currencies`,
    driver: `${baseApi.vires}/api/drivers`,
    container: `${baseApi.vires}/api/containers`
  }
};
