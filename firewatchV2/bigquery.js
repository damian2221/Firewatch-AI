const {BigQuery} = require('@google-cloud/bigquery');
const bigquery = new BigQuery({projectId: "pennapps-xxi-289302", keyFilename: "PennApps XXI-3035d5512ca6.json"});

module.exports = async (modelName, precip, tmp, wind) => {
  const query = "SELECT * FROM ML.PREDICT(MODEL " +
    "`pennapps-xxi-289302.wildfire." + modelName + "`, (SELECT " +
    "@precip AS precip, @tmp AS tmp, @wind AS wind FROM `pennapps-xxi-289302.wildfire.states` LIMIT 1));";

  // For all options, see https://cloud.google.com/bigquery/docs/reference/rest/v2/jobs/query
  const options = {
    query: query,
    location: 'US',
    params: { precip, tmp, wind }
  };

  const [job] = await bigquery.createQueryJob(options);
  console.log(`Job ${job.id} started.`);

  const [rows] = await job.getQueryResults();
  return rows[0];
};