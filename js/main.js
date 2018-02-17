
/**
 * Data from https://www.acleddata.com/data/
 */

queue()
.defer(d3.csv,'data/africa_2018.csv')
.defer(d3.csv, 'data/africa_countries.csv')
.defer(d3.json,'data/world-topo.json')
.await(render);

var charts, map;

function render(error, data, africa_countries, world_map_json) {

    if(error)
        throw error;
    
    world_map_json.objects.countries.geometries = filterTopoJson(world_map_json.objects.countries.geometries, africa_countries);

    //Create new geo visualization 
    map = new Map( parseData(data), world_map_json );
    charts = new Charts();

}

function parseData(data){

    var filteredData = [];

    //Parse dates
    var format = d3.timeParse("%Y-%m-%d");

    //Parse some data parameters
    data.forEach(function(d){
        filteredData.push({
            "lat": +d.latitude,
            "lon": +d.longitude,
            "actor": d.actor1,
            "country": d.country,
            "id": +d.data_id,
            "date": format(d.event_date),
            "event_type": d.event_type,
            "fatalities": +d.fatalities,
            "location": d.location,
            "description": d.notes,
            "region": d.region        
        });
    });

    return filteredData;
}

function filterTopoJson( map, africa_countries ) {

    var selected_countries = [];

    //Manually filtering TopoJSON file by african countries
    for(let i = 0; i < map.length; i++) {

        africa_countries.forEach(function(c){
            if(map[i].properties.name == c.Country) {
                selected_countries.push(map[i]);
                return;
            }
        });
    }

    return selected_countries;

}