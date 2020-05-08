const moment = require('moment');

module.exports = {

    //This will process countries dataList from https://covid19api.com/ to suit this app's purpose
    processCountries( dataList ){
        let countryList = [];
        
        dataList.forEach((element) => {
            let country = [];
            country.push(element.Country.toLowerCase()); //push country name
            country.push(element.ISO2.toLowerCase()); // push country's ISO code

            countryList.push(country); //push tuple-like array
        });

        return countryList; //return finalized data list
    },

    /*
    This will process data from a given country data list
    Example: https://api.covid19api.com/total/dayone/country/south-africa
    */
    processCountry(dataList){
        let tempList = [];

        dataList.forEach((element, index) => {
            let temp;
            if(index == 0){ //if first data
                temp = {
                    date: moment(element.Date).format('MMM DD YYYY'),
                    cases: element.Confirmed,
                    deaths: element.Deaths,
                    recovered: element.Recovered
                };
                tempList.push(temp);
            
            } else {
                temp = {
                    date: moment(element.Date).format('MMM DD YYYY'),
                    cases: Math.abs(element.Confirmed - dataList[index-1].Confirmed), //to get new cases not total
                    deaths: Math.abs(element.Deaths - dataList[index-1].Deaths),
                    recovered: Math.abs(element.Recovered - dataList[index-1].Recovered)
                }
                tempList.push(temp);
            }
        });

        const dateList = getDates(tempList);
        const caseList = getCases(tempList);
        const deathList = getDeaths(tempList);
        const recoveredList = getRecovered(tempList);

        return { dateList, caseList, deathList, recoveredList };
    }
}

/*======================================================
    Helper functions
======================================================*/

// This will get all dates from data and return them as a list (X-axes)
const getDates = (data) => {
    let dates = [];
    data.forEach((element) => dates.push(element.date));
    return dates;
}

//This will get all cases from data and return them as a list (Y-axes)
const getCases = (data) => {
    let cases = [];
    data.forEach((element) => cases.push(element.cases));
    return cases;
}

//This will get all deaths from data and return them as a list (Y-axes)
const getDeaths = (data) => {
    let deaths = [];
    data.forEach((element) => deaths.push(element.deaths));
    return deaths;
}

//This will get all recovered from data and return them as a list (Y-axes)
const getRecovered = (data) => {
    let recovered = [];
    data.forEach((element) => recovered.push(element.recovered));
    return recovered;
}