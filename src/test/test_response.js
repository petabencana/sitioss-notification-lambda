import * as test from 'unit.js';

// Import the class to test
import response from '../lib/response';
/**
 * testResponse - testing harness for the Response function
 * @function testNotify
 */
export default function() {
  // Test harness
  describe('Response function testing', function() {
    // Validate instance
    it('Returns expected response', function() {
      const res = response(200, 'body');
      test.value(res.statusCode).is(200);
      test.value(res.body).is(JSON.stringify('body'));
    });
  });
}
