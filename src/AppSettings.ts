export const server = "https://localhost:5011";
// export const server = "https://jimcoapi.azurewebsites.net";

export const apiBase = `${server}/api/v1`;

export const authSettings = {
  domain: "dev-x2udcgrv.us.auth0.com",
  client_id: "Y2D7L9tx1JRXw4bW1UsE2GZZ0YkyH0lI",
  redirect_uri: window.location.origin,
  scope: "openid profile JimCoAPI email",
  audience: "https://jimcoapi",
};
