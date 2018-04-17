/**
 * response - Construct HTTP response for Lambda
 * @function response
 * @param {number} statusCode HTTP status code for response
 * @param {string} body Body for HTTP response
 * @return {Object} response object
 */
export default (statusCode, body) => {
  const headers = {
    'Access-Control-Allow-Origin': '*', // Required for CORS support to work
    'Access-Control-Allow-Credentials': true,
      // Required for cookies, authorization headers with HTTPS
  };

  const response = {
    statusCode: statusCode,
    headers: headers,
    body: body,
  };

  return (response);
};
