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
