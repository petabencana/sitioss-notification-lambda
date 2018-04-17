import Notify from './Notify';
import response from '../../lib/response';

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
      const res = response(200, 'success');
      callback(null, res);

      // callback(null, JSON.stringify(res));
    }).catch((err) => {
      console.log('here is the error:' + err);
      const res = JSON.stringify({'statusCode': 500,
        'message': err.message});
      console.log('here is the response: ' + res);
      callback(null, res);
    });
};
