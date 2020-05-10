if(!$.cookie('reports')){
    $('#reports-cont').html('<div id="message">There are no currently stored reports</div>'); 

} else{ //there are reports
    
    //get reports
    let reports = $.parseJSON($.cookie('reports'));
    console.log(reports);
    //loop reports
    reports.forEach((element) => {
        $('#reports-cont').append(`
            <div class="report-content">
                <a href="/report?country=${element.country}&start=${element.start}&end=${element.end}">
                    <div class="ui card">

                        <div class="time">
                            <div class="start">
                                ${element.start}
                            </div>
                            <div>to</div>
                            <div class="end">
                                ${element.end}
                            </div>
                        </div>
                        
                        <div class="country">
                            ${element.country}
                        </div>

                    </div>
                </a>
            </div>
        `)
    });
}

console.log(!$.cookie('reports'));