
/**
 * Data from https://www.acleddata.com/data/
 */

queue()
.defer(d3.csv,'data/africa_2018.csv')
.defer(d3.csv, 'data/africa_countries.csv')
.defer(d3.json,'data/world-topo.json')
.await(render);

var map;

function render(error, data, africa_countries, world_map_json) {

    if(error)
        throw error;

    //Parse data dates
    var format = d3.timeParse("%Y-%m-%d");

    var filteredData = [],
        selected_countries = [];
    
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

    //Manually filtering TopoJSON file by african countries
    for(let i = 0; i < world_map_json.objects.countries.geometries.length; i++) {

        africa_countries.forEach(function(c){
            if(world_map_json.objects.countries.geometries[i].properties.name == c.Country) {
                selected_countries.push(world_map_json.objects.countries.geometries[i]);
                return;
            }
        });
    }

    world_map_json.objects.countries.geometries = selected_countries;

    //Create new geo visualization
    map = new Map(filteredData, world_map_json);

}