export default async function FetchJson(bcode) {
  const api_url = 'https://api.nal.usda.gov/fdc/v1/foods/search?query=' + bcode + '&pageSize=2&api_key=HG9UBjDgOgF9lbCdLLLJwo5jUBMQUg9RDBADsRf1';
  const response = await fetch(api_url);
  const data = await response.json();
  return data;
}
