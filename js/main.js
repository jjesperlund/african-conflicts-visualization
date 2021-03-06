
/**
 * Data from https://www.acleddata.com/data/
 */

queue()
.defer(d3.csv,'data/africa_1.csv')
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

    //Parse raw data
    data.forEach(function(d){
        filteredData.push({
            "lat": +d.latitude,
            "lon": +d.longitude,
            "actor": parseActor(d.actor2),
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

//Group actors to be able to filter by actor
function parseActor( actor ) {

    if( actor == undefined)
        return 'undefined'; 

    let actors = ['Military Forces', 'Police Forces','Militia',
                  'Protesters', 'Rioters', 'Civilians', 'United Nations'];

    let terroristGroups = ['Islamic State', 'Al Shabaab', 'Boko Haram', 'Unidentified Armed Group', 'State of Sinai'
                            , 'Hasam Movement', 'Muslim Brotherhood', 'Anti-Balaka'];
    for(let i = 0; i < terroristGroups.length; i++) {
        if( actor.includes(terroristGroups[i]) ) {
            return 'Terrorist Group';
        }
    }

    for(let i = 0; i < actors.length; i++) {
        if( actor.includes(actors[i]) ) {
            return actors[i];
        }
    }
    
    return actor;

}

//Extract the African map from a world map
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