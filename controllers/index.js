const https = require('https');
const { processCountries, processTotals, processRates, processLatest, processWorldTotal } = require('./process');
const moment = require('moment');

module.exports = {

    /* 
    This is responsible for rendering a view that will get the 
    country of the visitor and redirect them to the appropriate
    data view. Example: If canada, ==> '/canada'
    */
    landingPage(req, res, next){
        res.render('landing', { title : 'MITIGATE COVID-19' });
    },

    /*
    This renders the homepage while 
    */
    homePage(req, res, next){
        if(!req.query.country) return res.redirect('/home?country=canada');
        
        //configure header
        let header = {
            hostname: 'api.covid19api.com',
            port: 443,
            path: '/world/total',
            method: 'GET'
        }

        //make get request to get world total
        let httpsRequest = https.request(header, (httpsResponse) => {
            console.log(`https request status code: ${httpsResponse.statusCode}`);
            let dataList = "";

            //build data
            httpsResponse.on('data', (dataChunk) => {
                dataList += dataChunk;
            });

            httpsResponse.on('end', () => {
                dataList = JSON.parse(dataList);

                let worldData = processWorldTotal(dataList);
                let country = req.query.country.split('-').join(' ');

                //if country is detected
                if(req.query.country){
                    httpRequestCountryData(res, worldData, req.query.country);
                } else{
                    res.render('home', { title: 'MITIGATE COVID-19', worldData: worldData, localData: null, country });
                }
            });
        });

        httpsRequest.on('error', (error) => console.log(error));
        httpsRequest.end();
    },

    /*
    This retrieves data from https://covid19api.com/ based on country
    provided in the req.params
    */
    timelinePage(req, res, next){
        let country = req.query.country;
        
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
    
                let countryData = getCurrentCountryData(country, countryList);
           
                // if(countryData == null) res.redirect('/canada'); //if country has no COVID data
    
                res.render('index', { title: 'MITIGATE COVID-19', countryData, countryList }); //render view
            });
        });

        httpsRequest.on('error', (error) => console.log(error));
        httpsRequest.end();
    },

    //this shows report for timeline
    report(req, res, next){

        console.log(req.query.start, req.query.end);

        let start = moment(req.query.start).subtract(1, "days").format('YYYY-MM-DD'); //get previous day also

        //configure header;
        let header = {
            hostname: 'api.covid19api.com',
            port: 443,
            path: `/country/${req.params.country}?from=${start}T00:00:00Z&to=${req.query.end}T00:00:00Z`,
            method: 'GET'
        }

        let httpsRequest = https.request(header, (httpsResponse) => {
            console.log(`https request status code: ${httpsResponse.statusCode}`);
            let dataList = "";

            //build data
            httpsResponse.on('data', (dataChunk) => {
                dataList += dataChunk;
            });

            //process countries data
            httpsResponse.on('end', () => {
                console.log(dataList);
                dataList = JSON.parse(dataList);
                let totals = processTotals(dataList); //get totals for active, dead, recovered during timeline
                let rates = processRates(dataList); //get fatality rate, recovery rate, case rate
    
                res.render('report', { title: 'MITIGATE COVID-19', totals, rates }); //render view
            });

        });
        
        httpsRequest.on('error', (error) => console.log(error));
        httpsRequest.end();
    }

}

//This will find country data from countryList
const getCurrentCountryData = (country, countryList) => {
    let found = countryList.find((element) => element.slug === country);

    if(found) return found; 
    else return null;
}

//This will make an http request to get the country data from the api
const httpRequestCountryData = (res, worldData, slug) => {
    let country = slug.split('-').join(' ');

    //configure header;
    let header = {
        hostname: 'api.covid19api.com',
        port: 443,
        path: `/total/dayone/country/${slug}`,
        method: 'GET'
    }

    let httpsRequest = https.request(header, (httpsResponse) => {
        console.log(`https request status code: ${httpsResponse.statusCode}`);
        let dataList = "";

        //build data
        httpsResponse.on('data', (dataChunk) => {
            dataList += dataChunk;
        });

        //process countries data
        httpsResponse.on('end', () => {
            dataList = JSON.parse(dataList);
            let latestData = processLatest(dataList);
            res.render('home', { title: 'MITIGATE COVID-19', worldData: worldData, localData: latestData, country }); //render view
        });

    });

    httpsRequest.on('error', (error) => console.log(error));
    httpsRequest.end();
}