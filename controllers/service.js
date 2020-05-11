const https = require('https');
const axios = require('axios');
const { processCountry, processCountryTotalData } = require('./process');

module.exports = {
    async getCountryData(req, res, next){
        let countryList = await axios.get(`https://api.covid19api.com/total/dayone/country/${req.params.country}`);
        if(countryList.status == 429) return res.send('go back and try again');
    
        countryList = processCountry(countryList.data);
        res.send(countryList); //send processed data
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
    },

    // for adding a country to the curve
    async getCountryCurveData(req, res, next){
        let responseData = await axios.get(`https://api.covid19api.com/total/dayone/country/${req.query.country}`);
        if(responseData.status == 429) return res.send('go back and try again');
        
        let country = responseData.data[0].Country;
        responseData = processCountryTotalData(responseData.data);

        let countryData = {
            name: country,
            data: responseData
        }

        res.send(countryData);
    }
}