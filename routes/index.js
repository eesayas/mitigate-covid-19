const express = require('express');
const router = express.Router();
const https = require('https');

router.get('/', (req, res, next) => {

    res.render('index', { title: 'MITIGATE COVID-19' });
});



router.get('/:filter', (req, res, next) => {

    //configure options
    var options = {
        hostname: 'api.covid19api.com',
        port: 443,
        path: `/webhook`,
        method: 'GET'
    }

    if(req.params.filter == 'world'){
        let date = new Date();
        date.setDate(date.getDate() - 1); //get the day before for accurate data
        
        let month = (date.getMonth() + 1).toString();
        let day = date.getDate().toString(); 
        let year = date.getFullYear().toString();
        
        if(month.length < 2){
            month = '0' + month;
        }
        if(day.length < 2){
            day = '0' + day;
        }

        options.path = '/all';
        console.log(options);

        let request = https.request(options, response => {
            console.log(`statusCode: ${res.statusCode}`);
            let rawData = "";

            response.on('data', chunk => {
                rawData += chunk;
            });
            
            response.on('end', () =>{
                // rawData = JSON.parse(rawData);
                console.log(rawData);
                // let data = processWorldData(rawData);
            });
        });


        request.on('error', error => {
            console.error(error);
        });

        request.end();
    
    } else {
        options.path = `/dayone/country/${req.params.filter}`;
        let rawData = [];

        var request = https.request(options, response => {
            console.log(`statusCode: ${res.statusCode}`);

            response.on('data', d => {
                rawData.push(d);
            });
        });

        request.on('error', error => {
            console.error(error);
        });

        request.end();

        data = processData(rawData);
    }

    // console.log(dsata);
    res.render('index', { title: 'MITIGATE COVID-19', data: data })
});

//helper functions
const processData = (data) => {
    let processedDataList = [];

    data.forEach((element, index) => {
        if(index == 0){
            let processedData = {
                date: Date(element.Date),
                newCases: element.Confirmed,
                newDeaths: element.Deaths,
                newRecovered: element.Recovered
            };
            processedDataList.push(processedData);
        } else{
            let processedData = {
                date: Date(element.Date),
                newCases: element.Confirmed - data[index-1].Confirmed,
                newDeaths: element.Deaths - data[index-1].Confirmed,
                newRecovered: element.Recovered - data[index-1].Confirmed
            }
            processedDataList.push(processedData);
        }
    });

    return processedDataList;
};

const processWorldData = (data) => {

};

module.exports = router;
