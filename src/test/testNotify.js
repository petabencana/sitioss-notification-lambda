import * as test from 'unit.js';

// Import the class to test
import Notify from '../functions/notify/Notify';

export default function(config) {
  // Test harness
  describe('Notify Class Testing', function() {
    // Text objects
    const notify = new Notify('arn', 'region', '123');
    const params = {instanceRegionCode: 'city', lang: 'lang', network: 'net',
      reportId: 1, username: 'user'};
    const oldSNS = notify.sns;

    // Mock SNS method
    before(function() {
      let mockSNS = function(params, callback) {
        callback(null, params);
      };
      notify.sns = {publish: mockSNS};
    });

    // Validate instance
    it('Creates a new instance', function() {
      test.value(notify instanceof Notify).is(true);
    });

    // Set topic
    it('Can set topic', function() {
      test.value(notify._setTopicName('facebook')).is('Facebook');
      test.value(notify._setTopicName('twitter')).is('Twitter');
      test.value(notify._setTopicName('telegram')).is('Telegram');
      test.value(notify._setTopicName('spam')).is(null);
    });

    // Network name
    it('Catches bad network name', function(done) {
      notify.send(params)
        .then((data) => {
          done(new Error('Joi check failed'));
        })
        .catch((err) => {
          test.value(err.message).is('No SNS topic for the provided network');
          done();
        });
    });

    // Ouput
    it('Sends correct request to SNS', function(done) {
      let expected = {Message: '{"language":"lang","username":"user","implementation_area":"city","report_id":1}',
  TopicArn: 'arn:aws:sns:region:123:Facebook'};

      const params = {instanceRegionCode: 'city', lang: 'lang', network: 'facebook',
        reportId: 1, username: 'user'};

      notify.send(params)
        .then((data) => {
          test.value(data).is(expected);
          done();
        })
        .catch((err) => done(err));
    });

    // Restore mocks
    after(function() {
      notify.sns = oldSNS;
    });
  });
}
