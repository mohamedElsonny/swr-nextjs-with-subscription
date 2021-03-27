const GRAPHQL_ENDPOINT = "http://localhost:8005/v1/graphql";

const headers = { "Content-Type": "application/json" };

const _fetch = async (...args: any[]) => {
  const options = {
    headers: headers,
    method: "POST",
    body: JSON.stringify(args[0]),
  };
  const res = await fetch(GRAPHQL_ENDPOINT, options);
  const res_json = await res.json();
  if (res_json.errors) {
    throw JSON.stringify(res_json.errors);
  }
  return res_json.data;
};

export default _fetch;
