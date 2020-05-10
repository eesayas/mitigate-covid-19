const https = require('https');
const axios = require('axios');
const { processCountries, processTotals, processRates, processLatest, processWorldTotal, processNewsFeed } = require('./process');
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
            if(httpsResponse.statusCode === 429) return res.send('try again');

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
            if(httpsResponse.statusCode === 429) return res.send('try again');
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
    async reportPage(req, res, next){

        //declare variables for later use
        let country = req.query.country;

        //aux function
        let getCountryNews = () => {

            //format for query
            let myCountry = country.split('-').join('+');
            let myCountryTitle = country.split('-').join(' ').toLowerCase().split(' ').map((s) => s.charAt(0).toUpperCase() + s.substring(1)).join(' ').split(' ').join('%20');
            let myStart = moment(req.query.start).format('YYYYMMDD');
            let myEnd = moment(req.query.end).format('YYYYMMDD');

            if(req.query.country === 'united-states'){
                return `https://api.nytimes.com/svc/search/v2/articlesearch.json?q=coronavirus+${myCountry}+covid&begin_date=${myStart}&end_date=${myEnd}&fq=news_desk:("U.S.")%20AND%20glocations:("${myCountryTitle}")&sort=relevance&api-key=bHUqggqFRZDGCCN9GI26WYkjc7O5h456`;
            } else{
                return `https://api.nytimes.com/svc/search/v2/articlesearch.json?q=coronavirus+${myCountry}+covid&begin_date=${myStart}&end_date=${myEnd}&fq=news_desk:("World"%20"Health"%20"Foreign")%20AND%20glocations:("${myCountryTitle}")&sort=relevance&api-key=bHUqggqFRZDGCCN9GI26WYkjc7O5h456`;
            }
        };

        //make two request: first for data, second for news
        let countryNews = getCountryNews();

        const responseData = await axios.all([
            axios.get(`https://api.covid19api.com/total/dayone/country/canada`),
            axios.get(countryNews)
        ]);

        //aux function filter data
        let filterDataByDate = (dataList) => {
            
            //define indexes where you will slice dataList
            let start;
            let end;

            dataList.forEach((element, index) => {
                if(element.Date === (req.query.start + 'T00:00:00Z')){
                    start = index;
                }
                
                if(element.Date === (req.query.end + 'T00:00:00Z')){
                    end = index;
                }
            });

            return dataList.slice(start, end);
        }

        let dataList = filterDataByDate(responseData[0].data);

        //get stats data
        let totals = processTotals(dataList);
        let rates = processRates(dataList);
        let latest = processLatest(dataList);

        //get news data
        let hits = responseData[1].data.response.meta.hits;
        let newsFeed = (hits > 0) ? processNewsFeed(responseData[1].data) : null;

        //get formatted text data
        let countryTitle = country.split('-').map((s) => s.charAt(0).toUpperCase() + s.substring(1)).join(' ');
        let startPoint = moment(req.query.start).format('MMMM DD, YYYY');
        let endPoint = moment(req.query.end).format('MMMM DD, YYYY');

        res.render('report', {
            title: 'MITIGATE COVID-19',
            newsFeed: newsFeed, 
            country: countryTitle, 
            start: startPoint, 
            end: endPoint, 
            totals: totals, 
            rates : rates, 
            latest: latest
        });
    },

    //This is the curve page that shows a chart in comparison with the other countries
    curvePage(req, res, next){
              
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
            if(httpsResponse.statusCode === 429) return res.send('try again');
            let dataList = "";

            //build data
            httpsResponse.on('data', (dataChunk) => {
                dataList += dataChunk;
            });

            //process countries data
            httpsResponse.on('end', () => {
                dataList = JSON.parse(dataList);
                let countryList = processCountries(dataList);
    
                res.render('curve', { title: 'MITIGATE COVID-19', countryList }); //render view
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
        if(httpsResponse.statusCode === 429) return res.redirect('/report');

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
};