
//Formats the data in a feature collection
function geoFormat(array) {
    var data = [];

    array.map(function (d, i) {
        data.push({
            "id": d.id,
            "type": "Feature",
            "geometry": {
                "coordinates": [d.lon, d.lat], 
                "type": "Point",
            },
            "fatalities": d.fatalities,
            "location": d.location,
            "country": d.country,
            "date": d.date,
            "description": d.description,
            "event_type": d.event_type,
            "actor": d.actor
        });
    });
    
    return data;
}

function sizeChange() {
    d3.select("g").attr("transform", "scale(" + $("#container").width()/1700 + ")");
    $("svg").height($("#container").width()*0.618);
}

function resetGUI(){
    document.getElementById("actors").value = 'Default';
}

function printInfo(d) {

    //document.getElementById('info-header').innerHTML = "Information about this specific conflict"; 
            
    document.getElementById('info').innerHTML = 
        "<p><b>Location:</b> " + d.location + ", " + d.country  + ". </p>" +
        "<p><b>Date: </b>" + d.date.toString().substr(0,16) + "</p>"
        + "<p><b>Conflict Type:</b> " + d.event_type + "</p>" +
        "<p><b>Fatalities:</b> " + d.fatalities + "</br></p>" 
        + "<p>" + d.description + "</p>";

}

function clearCharts() {
    let bar = document.getElementById('barchart'),
        pie = document.getElementById('piechart');

    if( bar != null && pie != null) {
        bar.remove();  
        pie.remove();  
    }
    
}

function cancelSelection() {
    d3.selectAll('.point')
        .style('opacity', 0.3)
        .style('fill', '#c12424')
        .style("stroke", 'none');

    d3.selectAll('.country')
        .style("fill", "#66b3ff")
        .style("stroke-width", "0.5");

    document.getElementById('info').innerHTML = ""; 
    //document.getElementById('info-header').innerHTML = ""; 
    document.getElementById('country-name').innerHTML = ""; 

}

function checkCountry(country){  
    switch(country){
        case 'Congo, the Democratic Republic of the' : 
            country = 'Democratic Republic of Congo';
            break;
        case 'Tanzania, United Republic of' : 
            country = 'Tanzania';
            break;
        case "Côte d'Ivoire" :
            country = 'Ivory Coast';
            break;
             
        default: break;
    }
    return country;
}