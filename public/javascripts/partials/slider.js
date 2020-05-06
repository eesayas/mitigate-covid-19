$("#flat-slider")
    .slider({
        max: 10050,
        min: 10000,
        range: true,
        values: [10000, 10050],
        slide: function(event, ui){
            $('.ui-slider-pip').each(function(index){
                if($(this).hasClass('ui-slider-pip-selected-1')){
                    console.log(index);
                    $('.ui-slider-label').eq(`${index}`).attr('style', 'display: block !important');
                    $('.ui-slider-label').not( $('.ui-slider-label').eq(`${index}`) ).attr('style', 'display: none !important');
                }

                if($(this).hasClass('ui-slider-pip-selected-2')){
                    $('.ui-slider-label').eq(`${index}`).attr('style', 'display: block !important');
                }
            });

        }
    })
    .slider("pips", {
        // first: "pip",
        // last: "pip",
        rest: "label",
    });

// $('.ui-slider-pip').each(function(index)){

// }

