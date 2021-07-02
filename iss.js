const request = require('request');
/**
 * Makes a single API request to retrieve the user's IP address.
 * Input:
 *   - A callback (to pass back an error or the IP string)
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The IP address as a string (null if error). Example: "162.245.144.188"
 */
const fetchMyIP = (callback) => {
  // use request to fetch IP address from JSON API
  request('https://api.ipify.org?format=json', (err, resp, body) => {
    // if general error
    if (err) {
      callback(err, null);
      return;
    }

    // if request came back but with a non-200 status, assume server error
    if (resp.statusCode !== 200) {
      const msg = `Status Code ${resp.statusCode} when fetching IP. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }

    // all went well
    fetchCoordsByIP(JSON.parse(body).ip, null);
  });
};

const fetchCoordsByIP = (ip, callback) => {
  // use request to fetch IP address from JSON API
  request(`https://freegeoip.app/json/${ip}`, (err, resp, body) => {
    // if general error
    if (err) {
      callback(err, null);
      return;
    }

    // if request came back but with a non-200 status, assume server error
    if (resp.statusCode !== 200) {
      const msg = `Status Code ${resp.statusCode} when fetching IP. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }

    // all went well
    const { latitude, longitude } = JSON.parse(body);

    fetchISSFlyOverTimes({ latitude, longitude }, null);
  });
};

/**
 * Makes a single API request to retrieve upcoming ISS fly over times the for the given lat/lng coordinates.
 * Input:
 *   - An object with keys `latitude` and `longitude`
 *   - A callback (to pass back an error or the array of resulting data)
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The fly over times as an array of objects (null if error). Example:
 *     [ { risetime: 134564234, duration: 600 }, ... ]
 */
const fetchISSFlyOverTimes = function (coords, callback) {
  // use request to fetch IP address from JSON API
  request(`http://api.open-notify.org/iss/v1/?lat=${coords.latitude}&lon=${coords.longitude}`, (err, resp, body) => {
    // if general error
    if (err) {
      callback(err, null);
      return;
    }

    // if request came back but with a non-200 status, assume server error
    if (resp.statusCode !== 200) {
      const msg = `Status Code ${resp.statusCode} when fetching IP. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }

    // all went well

    const { response } = JSON.parse(body);
    // callback(response);
    console.log(response[0].risetime);
    response.forEach((el) => {
      console.log(`Next pass at ${Date(el.risetime).toLocaleString('en-US', { timeZone: 'PST' })} for ${el.duration} seconds!`);
    });
    // const { response } = JSON.parse(body);

    // callback(null, { latitude, longitude });
  });
};

module.exports = { fetchMyIP, fetchCoordsByIP, fetchISSFlyOverTimes };
