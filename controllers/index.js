const https = require('https');
const { processCountries } = require('./process');

module.exports = {

    /* 
    This is responsible for rendering a view that will get the 
    country of the visitor and redirect them to the appropriate
    data view. Example: If canada, ==> '/canada'
    */
    landing(req, res, next){
        res.render('landing', { title : 'MITIGATE COVID-19' });
    },

    /*
    This retrieves data from https://covid19api.com/ based on country
    provided in the req.params
    */
    country(req, res, next){
        let country = req.params.country;
        
        //make a api request to https://covid19api.com/ to get all countries with data

        //configure header
        let header = {
            hostname: 'api.covid19api.com',
            port: 443,
            path: '/countries',
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

            //process countries data
            httpsResponse.on('end', () => {
                dataList = JSON.parse(dataList);
                let countryList = processCountries(dataList);

                country = country.split('-').join(' ');

                res.render('index', { title: 'MITIGATE COVID-19', country, countryList }); //render view
            });
        });

        httpsRequest.on('error', (error) => console.log(error));
        httpsRequest.end();
    },

}