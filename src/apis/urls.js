// ********************************** 'README' endpoints ************************************* //
export const readme = (mongoId) => ({
  getAll: {
    method: "GET",
    endpoint: "/readme",
  },
  post: {
    method: "POST",
    endpoint: "/readme",
  },
  put: {
    method: "PUT",
    endpoint: `/readme/${mongoId}`,
  },
  delete: {
    method: "DELETE",
    endpoint: `/readme/${mongoId}`,
  },
});
// ****************************************************************************************** //

// ********************************** 'SCHEMA' endpoints ************************************ //
export const schema = (mongoId) => ({
  getAll: {
    method: "GET",
    endpoint: "/schema",
  },
  post: {
    method: "POST",
    endpoint: "/schema",
  },
  put: {
    method: "PUT",
    endpoint: `/schema/${mongoId}`,
  },
  delete: {
    method: "DELETE",
    endpoint: `/schema/${mongoId}`,
  },
});
// ****************************************************************************************** //

// ********************************** 'API TREE' endpoints ********************************** //
export const apisTree = (mongoId) => ({
  getAll: {
    method: "GET",
    endpoint: "/apisTree",
  },
  post: {
    method: "POST",
    endpoint: "/apisTree",
  },
  put: {
    method: "PUT",
    endpoint: `/apisTree/${mongoId}`,
  },
  delete: {
    method: "DELETE",
    endpoint: `/apisTree/${mongoId}`,
  },
});
// ****************************************************************************************** //

// ********************************** 'Endpoint' endpoints ********************************** //
export const endpointUrl = (mongoId) => ({
  getAll: {
    method: "GET",
    endpoint: "/endpoint",
  },
  getById: {
    method: "GET",
    endpoint: `/endpoint/${mongoId}`,
  },
  post: {
    method: "POST",
    endpoint: "/endpoint",
  },
  put: {
    method: "PUT",
    endpoint: `/endpoint/${mongoId}`,
  },
  delete: {
    method: "DELETE",
    endpoint: `/endpoint/${mongoId}`,
  },
  deleteMultiple: {
    method: "DELETE",
    endpoint: `/endpoint/multiple`,
  },
});
// ****************************************************************************************** //

// ********************************** 'Service' endpoints *********************************** //
export const service = (mongoId) => ({
  getAll: {
    method: "GET",
    endpoint: "/service",
  },
});
// ****************************************************************************************** //

// ************************************* 'Auth' endpoints *********************************** //
export const auth = () => ({
  login: {
    method: "GET",
    endpoint: "/auth/login",
  },
  googleLogin: {
    method: "GET",
    endpoint: "/auth/google-login",
  },
  accountVerification: {
    method: "GET",
    endpoint: "/auth/account-verification",
  },
  register: {
    method: "POST",
    endpoint: "/auth/register",
  },
  setPassword: {
    method: "PATCH",
    endpoint: "/auth/set-password",
  },
  forgotPassword: {
    method: "PATCH",
    endpoint: "/auth/forgot-password",
  },
  verifyEmail: {
    method: "PATCH",
    endpoint: "/auth/verify-email",
  },
});
// ****************************************************************************************** //

// ********************************** 'User' endpoints *********************************** //
export const user = (mongoId) => ({
  getById: {
    method: "GET",
    endpoint: `/user/${mongoId}`,
  },
});
// ****************************************************************************************** //
