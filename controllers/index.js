const https = require('https');
const axios = require('axios');
const { processCountryList, processTotals, processRates, processCountryData, processWorldData, processNewsFeed } = require('./process');
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
    async homePage(req, res, next){
        if(!req.query.country) return res.redirect('/home?country=canada');

        //get world data from api
        let [worldData, countryData] = await axios.all([
            axios.get('https://api.covid19api.com/world/total'),
            axios.get(`https://api.covid19api.com/total/dayone/country/${req.query.country}`)
        ]);
        
        //process world data
        worldData = processWorldData(worldData.data);

        //process country data
        countryData = processCountryData(countryData.data);

        //country name
        let country = req.query.country.split('-').map((s) => s.charAt(0).toUpperCase() + s.substring(1)).join(' ');
        res.render('home', { title: 'MITIGATE COVID-19', worldData: worldData, localData: countryData, country, origin: req.query.country });
    },

    /*
    This retrieves data from https://covid19api.com/ based on country
    provided in the req.params
    */
    async timelinePage(req, res, next){

        //get listed countries from api and process it
        let countryList = await axios.get('https://api.covid19api.com/countries');
        if(countryList.status == 429) return res.send('go back and try again');
        countryList = processCountryList(countryList.data);
        
        //get countryData
        let countryData = countryList.find((element) => element.slug === req.query.country);

        //render view
        res.render('index', { title: 'MITIGATE COVID-19', countryData, countryList, origin: req.query.country });
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
            axios.get(`https://api.covid19api.com/total/dayone/country/${country}`),
            axios.get(countryNews)
        ]);

        //aux function filter data
        let filterDataByDate = (dataList) => {
            
            //define indexes where you will slice dataList
            let start;
            let end;

            //format dates - 1 day
            let startDate = moment(req.query.start).subtract(1, "days").format('YYYY-MM-DD');
            let endDate = moment(req.query.end).subtract(1, "days").format('YYYY-MM-DD');

            dataList.forEach((element, index) => {
                if(element.Date === (startDate + 'T00:00:00Z')){
                    if(index === 0){
                        start = index;
                    } else {
                        start = index - 1;
                    }
                }
                
                if(element.Date === (endDate + 'T00:00:00Z')){
                    end = index + 1;
                }
            });

            return dataList.slice(start, end);
        }

        let dataList = filterDataByDate(responseData[0].data);

        //get stats data
        let totals = processTotals(dataList);
        let rates = processRates(dataList);
        let latest = processCountryData(dataList);

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
            latest: latest,
            origin: req.query.country
        });
    },

    //This is the curve page that shows a chart in comparison with the other countries
    async curvePage(req, res, next){

        //get country list from api
        let countryList = await axios.get('https://api.covid19api.com/countries');
        countryList = processCountryList(countryList.data);

        //render view
        res.render('curve', { title: 'MITIGATE COVID-19', countryList, origin: req.query.country });
    },

    indexReports(req, res, next){
        res.render('reports/index', { title: 'MITIGATE COVID-19', origin: req.query.country });
    }
}