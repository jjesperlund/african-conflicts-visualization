
function Charts() {
/**
 * Constructor for multple charts. Create and draw charts using chart.js
 */

    var ctx;
    Chart.defaults.global.defaultFontFamily = 'Raleway';

    this.createBarchart = function( country_data ) {

        //Init arrays for x and y data
        let event_types = [];   

        country_data.forEach(function(d, i){
            let actor_index = contains(event_types, d.event_type, 'barchart');

            if( actor_index < 0 ) {
                event_types.push({
                    "event": d.event_type,
                    "count": 1
                });             
            } else {
                event_types[actor_index].count += 1;
            }
        });

        if(country_data.length < 1) {
            console.log("No information of this country")
        }    

        //Redraw barchart if a barchart already is drawn
        if( ctx ) {
            let w = ctx.width, h = ctx.height;

            if( document.getElementById('barchart') != null)
                document.getElementById('barchart').remove();  

            ctx = document.createElement('canvas');
            ctx.id = 'barchart';
            document.getElementById('charts').appendChild(ctx);
            ctx.width = w;
            ctx.height = h;
        } else { //If it's not drawn, create a canvas to draw on
            ctx = document.createElement('canvas');
            ctx.id = 'barchart';
            document.getElementById('charts').appendChild(ctx);
            ctx.width = '400';
            ctx.height = '300';

        }

        if(event_types.length == 0) return;

        var barchart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: event_types.map(a => a.event),
                datasets: [{
                    label: 'Number of events',
                    //data: [12, 19, 3, 5, 2, 3], //Y-axis
                    data: event_types.map(a => a.count),
                    backgroundColor: [
                        'rgba(99, 255, 97, 0.4)',
                        'rgba(54, 162, 235, 0.4)',
                        'rgba(255, 206, 86, 0.4)',
                        'rgba(75, 192, 192, 0.4)',
                        'rgba(153, 102, 255, 0.4)',
                        'rgba(255, 159, 64, 0.4)'
                    ],
                    borderColor: [
                        'rgba(99, 255, 97,1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {              
                animation: {
                    duration: 1200,
                },
                legend: {
                    labels: {
                        fontColor: "white",
                        fontSize: 12
                    }
                },
                
                title:{
                    display:true,
                    text:'Different conflict types',
                    fontColor: "white",
                    fontSize: 19
                },
                scales: {                    
                    yAxes: [{
                        gridLines: {
                            color: '#4d4d4d'
                        },
                        ticks: {
                            beginAtZero:true,
                            fontColor: "white",
                            fontSize: 14,
                            stepSize: Math.floor(country_data.length/10),
                        }
                    }],
                    xAxes: [{
                        gridLines: {
                            color: '#4d4d4d'
                        },
                        ticks: {
                            fontColor: "white",
                            fontSize: 14,
                            beginAtZero: true,
                            autoSkip: false
                        }
                    }]
                }
            }
        });
    
    }

    this.createPiechart = function( country_data ) {
        //Init arrays for x and y data
        let months = [];            
        country_data.forEach(function(d, i){
            let month = d.date.toString().substring(4,8);
            let months_index = contains(months, month, 'piechart');

            if( months_index < 0 ) {
                months.push({
                    "month": month,
                    "count": 1
                });             
            } else {
                months[months_index].count += 1;
            }
        });

        if(country_data.length < 1) {
            console.log("No information of this country")
        }    

        //console.log(months)

        //Redraw barchart if a barchart already is drawn
        if( ctx ) {
            let w = ctx.width, h = ctx.height;

            if( document.getElementById('piechart') != null)
                document.getElementById('piechart').remove();  

            ctx = document.createElement('canvas');
            ctx.id = 'piechart';
            document.getElementById('charts').appendChild(ctx);
            ctx.width = w;
            ctx.height = h;
        } else
            ctx = document.getElementById("piechart");

        if(months.length == 0) return;

        var piechart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: months.map(a => a.month).reverse(),
                datasets: [{
                    data: months.map(a => a.count).reverse(),
                    backgroundColor: [
                        'rgba(255, 97, 231, 0.2)',
                    ],
                    borderColor: [
                        'rgba(255, 97, 231, 1)'
                    ],
                    borderWidth: 2
                }],
            },
            options: {  
                legend: {
                    display: false
                  },
                title:{
                    display:true,
                    text:'Number of conflicts by certain months',
                    fontColor: "white",
                    fontSize: 19
                },
                scales: {                    
                    yAxes: [{
                        gridLines: {
                            color: '#4d4d4d'
                        },
                        ticks: {
                            beginAtZero:true,
                            fontColor: "white",
                            fontSize: 14,
                            stepSize: Math.floor(country_data.length/10),
                        }
                    }],
                    xAxes: [{
                        gridLines: {
                            color: '#4d4d4d'
                        },
                        ticks: {
                            fontColor: "white",
                            fontSize: 14,
                            beginAtZero: true,
                            autoSkip: false
                        }
                    }]
                }
                }
        });
    }

    function contains(array, type, chartType) {
        let index = -1;
        array.forEach(function(d, i){
   
            if( array.length == 0 ) {
                index = -1;
                return;
            }
            if( chartType == 'barchart' ) {
                if( d.event== type) {
                    index = i;
                    return;
                }
            } else {
                if( d.month == type) {
                    index = i;
                    return;
                }
            }         
        });

        return index;
    }

}