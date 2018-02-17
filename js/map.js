
function Map(data, world_map_json) {

    //console.log(data);   

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
        .center([10, 20])
        .scale(650);

    var path = d3.geoPath()
        .projection(projection);

    var svg = d3.select(div).append("svg")
        .attr("width", "100%")
        .attr("height", "100%")
        .attr("id", "map-vis")
        .call(zoom);

    var g = svg.append("g");

    $('#cancel-selection').on('click', cancelSelection);

    //Formats the data in a feature collection trougth geoFormat()
    var geoData = {type: "FeatureCollection", features: geoFormat(data)};

    var countries_features = topojson.feature(world_map_json,
            world_map_json.objects.countries).features;

    var countries = g.selectAll(".country").data(countries_features);

    draw(countries);
    drawPoints()

    function draw(countries){

        countries.enter()
            .insert("path")
            .attr("class", "country")
            .attr("d", path)
            .attr("id", function(d){ 
                d.properties.name = checkCountry(d.properties.name);
                return d.properties.name })
            /*
            .on("mousemove", function (d) {
                d3.select(this)
                .style("fill", '#4485c4');                
            })
            .on('mouseout',function(d){
                d3.select(this)
                .style("fill", '#66b3ff');

            })
            */
            .on('click', function(d){
                
                cancelSelection();
                document.getElementById('country-name').innerHTML = d.properties.name;
                d3.select(this) 
                    .style("stroke", "black")
                    .style("stroke-width", "2")
                    .style("fill", '#4485c4'); 

                createCharts( this.id );
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

    //Draws the map and the points
    function drawPoints(){
        
        var point = g.selectAll(".point").data(geoData.features);

        point.enter().append("path")
            .attr("class", "point")
            .attr("id", function(d){ return d.country })
            .attr("d", path)
            .attr("d", path.pointRadius(function (d) {

                //Mapping radius values to 5 to 13
                return 5 + ( ( (d.fatalities - 0)*(13-5) ) /
                (15 - 0));;

            }))
            .style("fill", "red")
            .style("opacity", "0.3")
            .style("stroke", "none")
            .on("mousemove", function (d) {
                //d3.select(this)
                //.style('opacity',1);               
            })
            .on('mouseout',function(d){

                //d3.select(this)
                   // .style('opacity', 0.3)
                    //.style("stroke", 'none');

            })
            .on('click', function(d){

                cancelSelection();
                printInfo(d);                

                d3.select(this)
                    .style('opacity', 1)
                    .style('fill', '#37cc43')
                    .style("stroke", 'black')
                    .style("stroke-width", "3");

            });

    }

    function createCharts( country ) {

        var filterdData = [];

        var dd = d3.selectAll(".point[id='" + country + "']")
            .style("opacity", function(d){
                filterdData.push(d);
                return "1";
            });
        


        //Create barchart with selected country data
        charts.createBarchart( filterdData );
        charts.createPiechart( filterdData );

    }

    function move() {
        g.style("stroke-width", 1.5 / d3.event.transform.k + "px");
        g.attr("transform", d3.event.transform);
    }

    function sizeChange() {
	    d3.select("g").attr("transform", "scale(" + $("#container").width()/1700 + ")");
	    $("svg").height($("#container").width()*0.618);
    }
    
    function cancelSelection() {
        d3.selectAll('.point')
            .style('opacity', 0.3)
            .style('fill', 'red')
            .style("stroke", 'none');

        d3.selectAll('.country')
            .style("fill", "#66b3ff")
            .style("stroke-width", "0.5");

        document.getElementById('info').innerHTML = ""; 
        document.getElementById('country-name').innerHTML = ""; 

    }

    function printInfo(d) {
                
        document.getElementById('info').innerHTML = 
            "<p><b>Location:</b> " + d.location + ", " + d.country  + ". </p>" +
            "<p><b>Date: </b>" + d.date.toString().substr(0,16) + "</p>"
            + "<p><b>Conflict Type:</b> " + d.event_type + "</p>" +
            "<p><b>Fatalities:</b> " + d.fatalities + "</br></p>" 
            + "<p>" + d.description + "</p>";

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

}
