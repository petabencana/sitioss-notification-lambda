import Notify from './Notify';
import response from '../../lib/response';

export default (event, context, callback) => {
  // Log statements
  console.log('\n\nLoading Notify handler\n\n');
  console.log('Incoming body: ' + JSON.stringify(event.body));

  // Create notify object
  const notify = new Notify(process.env.AWS_REGION,
    process.env.AWS_SNS_ACCOUNT_ID);

  notify.send(event.body)
    .then((result) => {
      callback(response(200, 'success!'));
    }).catch((err) => {
      callback(null, response(500, JSON.stringify({'statusCode': 500, 'message':
        'Server error: ' + err})));
    });
};
