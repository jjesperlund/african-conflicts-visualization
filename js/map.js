
function Map(data, world_map_json) {

    //console.log(data)

    var div = "#map";

    //Scale map correctly on window resize
    d3.select(window).on("resize", sizeChange);
    
    //Sets the colormap
    var colors = colorbrewer.Set3[10];

    var filterdData = data;    
    
    //initialize zoom
    var zoom = d3.zoom()
        .scaleExtent([1, 20])
        .on('zoom', move);

    //initialize tooltip
    var tooltip = d3.select(div).append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    var projection = d3.geoMercator()
        .center([10, 30])
        .scale(650);

    var path = d3.geoPath()
        .projection(projection);

    var svg = d3.select(div).append("svg")
        .attr("width", "100%")
        .attr("height", "100%")
        .attr("id", "map-vis")
        .call(zoom);

    var g = svg.append("g");

    //Formats the data in a feature collection trougth geoFormat()
    var geoData = {type: "FeatureCollection", features: geoFormat(data)};

    var countries_features = topojson.feature(world_map_json,
            world_map_json.objects.countries).features;

        //console.log(topojson.feature(world_map_json,
         //   world_map_json.objects.countries).features)

            /*
        countries_features = countries_features.filter(function(d){
            return d.properties.name == "Australia"
        })
        */

    var countries = g.selectAll(".country").data(countries_features);

    draw(countries);
    drawPoints()

    function draw(countries){

        countries.enter()
            .insert("path")
            .attr("class", "country")
            .attr("d", path)
            .attr("id", function(d){ return d.id })
            .on("mousemove", function (d) {
                d3.select(this)
                .style("fill", 'red');                
            })
            .on('mouseout',function(d){
                d3.select(this)
                .style("fill", '#66b3ff');

            });

    }

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
                "location": d.location 
            });
        });

        return data;
    }

    //Draws the map and the points
    function drawPoints(){
        
        var point = g.selectAll(".point").data(geoData.features);

        point.enter().append("path")
            .attr("class", "point")
            .attr("d", path)
            .attr("d", path.pointRadius(function (d) {
                //return d.fatalities;
                return 4;
            }))
            .style("fill", "red")
            .style("opacity", "0.3")
            .on("mousemove", function (d) {
                //var cur_mag = d3.select("#slider").property("value");
                d3.select(this)
                .style('opacity',1)
                .style("stroke", 'red');
                
            })
            .on('mouseout',function(d){
                d3.select(this)
                .style('opacity', 0.3)
                .style("stroke", 'none');

            });

    }

    function move() {
        g.style("stroke-width", 1.5 / d3.event.transform.k + "px");
        g.attr("transform", d3.event.transform);
    }

    function sizeChange() {
	    d3.select("g").attr("transform", "scale(" + $("#container").width()/1700 + ")");
	    $("svg").height($("#container").width()*0.618);
	}

}