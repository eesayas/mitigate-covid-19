const https = require('https');
const axios = require('axios');
const { processCountry, processCountryTotalData } = require('./process');

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
    },

    // This will get the total case data of a country
    getCountryTotalData(req, res, next){
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
                let countryData = processCountryTotalData(dataList);
                
                //send data as a service
                res.send(countryData);
            });
        });

        httpsRequest.on('error', (error) => console.log(error));
        httpsRequest.end();
    },

    //get initial data for first load of '/curve'
    async getCountriesTotalData(req, res, next){

        //make multiple get request
        const responseData = await axios.all([
            axios.get('https://api.covid19api.com/total/dayone/country/canada'),
            axios.get('https://api.covid19api.com/total/dayone/country/united-states'),
            axios.get('https://api.covid19api.com/total/dayone/country/south-korea'),
            axios.get('https://api.covid19api.com/total/dayone/country/germany'),
            axios.get('https://api.covid19api.com/total/dayone/country/philippines'),
            axios.get('https://api.covid19api.com/total/dayone/country/spain'),
            axios.get('https://api.covid19api.com/total/dayone/country/italy')
        ]);

        // console.log(responseData);
        var countryDataList = [];

        //process data list
        responseData.forEach((element) => {
            let countryData = {
                name: element.data[0].Country,
                data: processCountryTotalData(element.data)
            }

            countryDataList.push(countryData);
        });

        res.send(countryDataList);
    }
}