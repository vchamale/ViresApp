const baseApi = {
  // vires: 'http://137.184.216.113:3000'
  vires: 'http://localhost:3000'
};

export const api = {
  vires: {
    auth: `${baseApi.vires}/api/auth`,
    shiptment: `${baseApi.vires}/api/shipments`
  }
};
