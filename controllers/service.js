const https = require('https');
const { processCountry } = require('./process');

module.exports = {
    getCountryData(req, res, next){
        let country = req.params.country;

        //make a api request to https://covid19api.com/ to get country data

        //configure header
        let header = {
            hostname: 'api.covid19api.com',
            port: 443,
            path: `/total/dayone/country/${country}`,
            method: 'GET'
        }

        //make get request
        let httpsRequest = https.request(header, (httpsResponse) => {
            console.log(`https request status code:  ${httpsResponse.statusCode}`);
            let dataList = "";

            //build data
            httpsResponse.on('data', (dataChunk) => {
                dataList += dataChunk;
            });

            //process country data
            httpsResponse.on('end', () => {
                dataList = JSON.parse(dataList);
                let countryList = processCountry(dataList);
                
                //send data as a service
                res.send(countryList);
            });
        });

        httpsRequest.on('error', (error) => console.log(error));
        httpsRequest.end();
    }
}