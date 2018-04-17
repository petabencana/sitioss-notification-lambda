import Notify from './Notify';

const response = function(statusCode, body) {
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

export default (event, context, callback) => {
  // Log statements
  console.log('\n\nLoading Notify handler\n\n');
  console.log('Incoming body: ' + event.body);

  // Parse params
  const params = JSON.parse(event.body);

  // Create notify object
  const notify = new Notify(process.env.AWS_REGION,
    process.env.AWS_SNS_ACCOUNT_ID);

  // Request notification
  notify.send(params)
    .then((result) => {
      console.log('result: ', result);
      const res = response(200, 'success');
      console.log(res);
      callback(res);
    }).catch((err) => {
      console.log('here is the error:' + err);
      let res = JSON.stringify({'statusCode': 500,
        'message': err.message});
      console.log('here is the response: ' + res);
      callback(null, response(500, res));
    });
};
