
function Charts() {
/**
 * Constructor for multple charts. Create and draw charts using chart.js
 */

    var ctx;

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
            document.getElementById('barchart').remove();  
            ctx = document.createElement('canvas');
            ctx.id = 'barchart';
            document.getElementById('charts').appendChild(ctx);
            ctx.width = w;
            ctx.height = h;
        } else
            ctx = document.getElementById("barchart");

        if(event_types.length == 0) return;

        var barchart = new Chart(ctx, {
            type: 'bar',
            data: {
                //labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"], //X-axis
                labels: event_types.map(a => a.event),
                datasets: [{
                    label: 'Number of events',
                    //data: [12, 19, 3, 5, 2, 3], //Y-axis
                    data: event_types.map(a => a.count),
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.4)',
                        'rgba(54, 162, 235, 0.4)',
                        'rgba(255, 206, 86, 0.4)',
                        'rgba(75, 192, 192, 0.4)',
                        'rgba(153, 102, 255, 0.4)',
                        'rgba(255, 159, 64, 0.4)'
                    ],
                    borderColor: [
                        'rgba(255,99,132,1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)'
                    ],
                    borderWidth: 2
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
                    text:'Conflict Types',
                    fontColor: "white",
                    fontSize: 15
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
        let actors = [];            

        country_data.forEach(function(d, i){
            let actor_index = contains(actors, d.actor, 'piechart');

            if( actor_index < 0 ) {
                actors.push({
                    "actor": d.actor,
                    "count": 1
                });             
            } else {
                actors[actor_index].count += 1;
            }
        });

        if(country_data.length < 1) {
            console.log("No information of this country")
        }    

        //console.log(actors)

        //Redraw barchart if a barchart already is drawn
        if( ctx ) {
            let w = ctx.width, h = ctx.height;
            document.getElementById('piechart').remove();  
            ctx = document.createElement('canvas');
            ctx.id = 'piechart';
            document.getElementById('charts').appendChild(ctx);
            ctx.width = w;
            ctx.height = h;
        } else
            ctx = document.getElementById("piechart");

        if(actors.length == 0) return;

        var piechart = new Chart(ctx, {
            type: 'polarArea',
            data: {
                //labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"], //X-axis
                labels: actors.map(a => a.actor),
                datasets: [{
                    label: 'Number of events',
                    //data: [12, 19, 3, 5, 2, 3], //Y-axis
                    data: actors.map(a => a.count),
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.4)',
                        'rgba(54, 162, 235, 0.4)',
                        'rgba(255, 206, 86, 0.4)',
                        'rgba(75, 192, 192, 0.4)',
                        'rgba(153, 102, 255, 0.4)',
                        'rgba(255, 159, 64, 0.4)',
                        'rgba(255,99,132,0.4)',
                        'rgba(0, 255, 0, 0.4)',
                        'rgba(0, 0, 255, 0.4)',
                        'rgba(255, 0, 0, 0.4)',
                        'rgba(200, 20, 100, 0.4)',
                        'rgba(100, 45, 64, 0.4)'
                    ],
                    borderColor: [
                        'rgba(255,99,132,1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)'
                    ],
                    borderWidth: 2
                }]
            },
            options: {  
                legend: {
                    display: false
                  } /*           
                animation: {
                    duration: 1200,
                },
                legend: {
                    labels: {
                        fontColor: "white",
                        fontSize: 12
                    }
                },
                responsive: true,
                maintainAspectRatio: true,
                title:{
                    display:true,
                    text:'Conflict Types',
                    fontColor: "white",
                    fontSize: 15
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
            */}
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
                if( d.actor== type) {
                    index = i;
                    return;
                }
            }         
        });

        return index;
    }

}