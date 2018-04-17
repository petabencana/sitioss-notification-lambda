const AWS = require('aws-sdk');
const Joi = require('joi');

// paramSchema for validation
const paramSchema = Joi.object().keys({
  instanceRegionCode: Joi.string().required(),
  language: Joi.string().required(),
  network: Joi.string().required(),
  reportId: Joi.number().required(),
  username: Joi.string().required(),
});

/**
 * Creates a new notify object
 * @class Notify
 */
 export default class Notify {
   /**
    * constructor new Notify()
    * @param {string} awsRegion - AWS SNS Region
    * @param {string} accountID - AWS SNS Account ID
    */
  constructor(awsRegion, accountID) {
    // AWS stuff
    this.awsRegion = awsRegion;
    this.accountID = accountID;

    AWS.config.update({region: this.awsRegion});
    this.sns = new AWS.SNS();
  }

  /**
   * Sets SNS Topic Name based on Network
   * @method _setTopicName
   * @private
   * @param {string} network Social channel
   * @return {string} Topic name
   */
  _setTopicName(network) {
    switch (network) {
      case `facebook`:
        return (`Facebook`);
      case `twitter`:
        return (`Twitter`);
      case `telegram`:
        return (`Telegram`);
      default:
        return (null);
    }
  }

  /**
   * Sends a new notification to SNS topic
   * @method notify
   * @param {Object} params Parameters for notification
   * @param {string} params.instanceRegionCode CogniCity Instance Region Code
   * @param {string} params.language Language code
   * @param {string} params.network Social channel
   * @param {number} params.reportId Report ID
   * @param {string} params.username User social handle or unique identifier
   * @return {Promise} Promise that SNS topic published
   */
  send(params) {
    return new Promise((resolve, reject) => {
      // validate params
      Joi.validate(params, paramSchema, function(err, value) {
        if (err) reject(err);
      });

      // create message
      let message = {
        language: params.language,
        username: params.username,
        implementation_area: params.instanceRegionCode,
        report_id: params.reportId,
      };

      // get topic
      console.log(params);
      console.log(params.network);
      let topicName = this._setTopicName(params.network);
      console.log(topicName);
      if (topicName === null) {
        console.log('Invalid SNS topic, will exit.');
        reject(new Error(`No SNS topic for the provided network`));
        return;
        }
      // Construct message payload
      let payload = {
        Message: JSON.stringify(message),
        TopicArn: `arn:aws:sns:` + this.awsRegion + `:` + this.accountID + `:`
          + topicName,
      };
      console.log(payload);
      console.log(`Publishing to ` + topicName);
      this.sns.publish(payload, function(err, data) {
        console.log(err);
        console.log(data);
        resolve(data);
        /* if (err) reject(err);
        resolve(data);*/
      });
    });
  }
}
