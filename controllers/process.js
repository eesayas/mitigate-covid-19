const moment = require('moment');

module.exports = {

    //This will process countries dataList from https://covid19api.com/ to suit this app's purpose
    processCountries( dataList ){
        let countryList = [];
        
        dataList.forEach((element) => {
            let country = {
                name: element.Country.toLowerCase(),
                slug: element.Slug.toLowerCase(),
                iso: element.ISO2.toLowerCase()
            };
            
            countryList.push(country);
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
                    date: moment(element.Date).add(1, "days").format('MMM DD YYYY'),
                    cases: element.Confirmed,
                    deaths: element.Deaths,
                    recovered: element.Recovered
                };
                tempList.push(temp);
            
            } else {
                temp = {
                    date: moment(element.Date).add(1, "days").format('MMM DD YYYY'),
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
    },

    /*
    This will use aforementioned api to get total cases within given timeline
    */
    processTotals(dataList){
        let end = dataList.length - 1; //last index

        //calc only the numbers within the timeline
        let activeTotal = Math.abs(dataList[end].Active - dataList[1].Active);
        let deadTotal = Math.abs(dataList[end].Deaths - dataList[1].Deaths);
        let recoveredTotal = Math.abs(dataList[end].Recovered - dataList[1].Recovered);

        return { activeTotal, deadTotal, recoveredTotal };

    },

    /*
    This will return the fatality rate, recovery rate, rate of cases by using Linear Least Squares
    */
    processRates(dataList){

        let length = dataList.length - 1;
        //build x axis
        let x_values = [];

        for(var i = 0; i < length; i++){
            x_values.push(i);
        }

        //we have 3 y_values: case, death, recovery
        let reportData = processRateData(dataList);
        let case_values = reportData.caseList;
        let deaths_values = reportData.deathList;
        let recover_values = reportData.recoveredList;

        console.log(case_values);

        //find slope/rates
        let caseRate = findSlope(x_values, case_values);
        let fatalityRate = findSlope(x_values, deaths_values);
        let recoveryRate = findSlope(x_values, recover_values);

        return { caseRate, fatalityRate, recoveryRate };
    },

    //This gets the latest data ie new cases from datalist
    processLatest(dataList){
        let length = dataList.length;

        let latest = {
            newCases: formatNumber(dataList[length-1].Confirmed - dataList[length-2].Confirmed),
            totalCases: formatNumber(dataList[length-1].Confirmed),
            newDeaths: formatNumber(dataList[length-1].Deaths - dataList[length-2].Deaths),
            totalDeaths: formatNumber(dataList[length-1].Deaths),
            newRecovered: formatNumber(dataList[length-1].Recovered - dataList[length-2].Recovered),
            totalRecovered: formatNumber(dataList[length-1].Recovered)
        }

        return latest;
    },

    //reformats world total data
    processWorldTotal(dataList){
        let worldData = {
            totalCases: formatNumber(dataList.TotalConfirmed),
            totalDeaths: formatNumber(dataList.TotalDeaths),
            totalRecovered: formatNumber(dataList.TotalRecovered)
        }

        return worldData;
    }
}

/*======================================================
    Helper functions
======================================================*/

function formatNumber(num) {
  return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
}

const processRateData = (dataList) =>{
    let tempList = [];

    dataList.forEach((element, index) => {

        if(index > 0){
            let temp = {
                cases: element.Confirmed - dataList[index-1].Confirmed,
                deaths: element.Deaths - dataList[index-1].Deaths,
                recovered: element.Recovered - dataList[index-1].Recovered
            };
            tempList.push(temp);
        }
        
    });

    const caseList = getCases(tempList);
    const deathList = getDeaths(tempList);
    const recoveredList = getRecovered(tempList);

    return { caseList, deathList, recoveredList };
}

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

// This will find the slope of data by LinearByLeastSquares
// inspired by: https://medium.com/@sahirnambiar/linear-least-squares-a-javascript-implementation-and-a-definitional-question-e3fba55a6d4b
const findSlope = (x_values, y_values) => {
    // console.log(y_values);
    //set values for later use
    var x_sum = 0;
    var y_sum = 0; 
    var xy_sum = 0 
    var xx_sum = 0
    var count = 0;
    
    var x = 0;
    var y = 0;
    var length = x_values.length;

    /*
     * Calculate the sum for each of the parts necessary.
     */
    for (let i = 0; i < length; i++) {
        x = x_values[i];
        y = y_values[i];
        x_sum += x;
        y_sum += y;
        xx_sum += x*x;
        xy_sum += x*y;
        count++;

        
    }

    //calc slope
    var slope = (count*xy_sum - x_sum*y_sum) / (count*xx_sum - x_sum*x_sum);
    // console.log(slope);
    return slope;
}