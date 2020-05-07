const express = require('express');
const router = express.Router();
const https = require('https');
const moment = require('moment');

router.get('/', (req, res, next) => {
    // var dateString = 'Mon Feb 02 2015 05:18:44 GMT+0000';
    // var date = moment(dateString).format('MM/dd/YYYY');
    // console.log(date);
    res.render('index', { title: 'MITIGATE COVID-19'});
});


router.get('/:filter', (req, res, next) => {

    // set options header
    // let options = {
    //     hostname: 'api.covid19api.com',
    //     port: 443,
    //     path: `/total/dayone/country/${req.params.filter}`,
    //     method: 'GET'
    // }

    // let httpsRequest = https.request(options, (httpsResponse) => {
    //     console.log(`https request status code:  ${httpsResponse.statusCode}`);
    //     let dataList = "";

    //     httpsResponse.on('data', (dataChunk) => {
    //         dataList += dataChunk;
    //     });

    //     httpsResponse.on('end', () => {
    //         dataList = JSON.parse(dataList);
    //         let data = processData(dataList);

    //         res.render('index', { title: 'MITIGATE COVID-19', data: data })
    //     });
    // });

    // httpsRequest.on('error', (error) => console.log(error));
    // httpsRequest.end();
});

router.get('/trajectory' ,(req, res, next) => {
    res.send('trajectory');
});

//helper functions
const processData = (dataList) => {
    let newList = [];

    dataList.forEach((data, index) => {
        if(index == 0){
            let newData = {
                date: moment(data.Date).format('MMM DD YYYY'),
                newCases: data.Confirmed,
                newDeaths: data.Deaths,
                newRecovered: data.Recovered
            };
            newList.push(newData);
        } else{
            let newData = {
                date: moment(data.Date).format('MMM DD YYYY'),
                newCases: data.Confirmed - dataList[index-1].Confirmed,
                newDeaths: data.Deaths - dataList[index-1].Deaths,
                newRecovered: data.Recovered - dataList[index-1].Recovered
            }
            newList.push(newData);
        }
    });

    return newList;
};

module.exports = router;