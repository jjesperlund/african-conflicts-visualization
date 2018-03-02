
function Map(data, world_map_json) {


    this.div = "#map";
    var countryList = [];

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
    var tooltip = d3.select(this.div).append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    var projection = d3.geoMercator()
        .center([25, 20])
        .scale(600);

    this.path = d3.geoPath()
        .projection(projection);

    var svg = d3.select(this.div).append("svg")
        .attr("width", "100%")
        .attr("height", "100%")
        .attr("id", "map-vis")
        .call(zoom);

    var g = svg.append("g");

    //Formats the data in a feature collection trougth geoFormat()
    var geoData = {type: "FeatureCollection", features: geoFormat(data)};

    var countries_features = topojson.feature(world_map_json,
            world_map_json.objects.countries).features;

    var countries = g.selectAll(".country").data(countries_features);

    //User filtering in GUI
    this.filterData = function(){

        var filterdData = [];
        var actor_type = document.getElementById("actors").value;

        //Reset selections and charts
        cancelSelection();
        clearCharts();

        //All actors means no filtering
        if( actor_type == 'Default' ) {
            document.getElementById('cancel-selection').style.opacity = 0;
            return;
        }

        //Filter data and only show points with selected actor type
        document.getElementById('cancel-selection').style.opacity = 1;

        //Show only filtered points, hide the rest
        d3.selectAll('.point')
            .style('opacity', '0');

        d3.selectAll(".point[act='" + actor_type + "']")
            .style("fill", "#c12424")
            .style("opacity", "0.3");

        createCharts(actor_type, 'actor');

    }

    this.cluster = function(){

        //Show conflict density scale in map window
        document.getElementById('cluster-description').style.opacity = 1;
        document.getElementById('cluster-scale').style.opacity = 1;

        cancelSelection();
        clearCharts();
        resetGUI();

        let point_data = [];
        filterdData.forEach(function(d){
            point_data.push({
                x: d.lon,
                y: d.lat
            });
        });

        var dbscanner = jDBSCAN().eps(2.2).minPts(80).distance('EUCLIDEAN').data(point_data);
        var point_assignment_result = dbscanner();
        var number_of_clusters = Math.max.apply(null, point_assignment_result);

        var cluster_counts = [];
        for (var i = 0; i < point_assignment_result.length; i++) {
            let num = point_assignment_result[i];
            cluster_counts[num] = cluster_counts[num] ? cluster_counts[num] + 1 : 1;
        }


        cluster_counts = scaleCounts(cluster_counts);


        var color = d3.scaleQuantize()
        .domain([0,number_of_clusters])
        .range(["#ABDDA4", "#E6F598",
                "#FFFFBF", "#FEE08B", "#FDAE61", "#F46D43",
                "#D53E4F", "#9E0142"]);

        d3.selectAll('.point')
            .style('fill', function(d,j){
                if(point_assignment_result[j] == 0){
                    return 'rgba(0,0,0,0)';
                }
                return color((cluster_counts[point_assignment_result[j]]));
            });

        console.log("Numbers of clusters: " + number_of_clusters);
        document.getElementById('cancel-selection').style.opacity = 1;

    }


    function scaleCounts(cluster_counts){

      cluster_counts_scaled = [];
      var maxCount = Math.max.apply(null, cluster_counts);
      var minCount = Math.min.apply(null, cluster_counts);
      var a = 0;
      var b = cluster_counts.length;

        for(var k = 0; k<cluster_counts.length;k++){
            cluster_counts_scaled[k] = ((b-a)*(cluster_counts[k] - minCount))/(maxCount - minCount) + a;
        }

        return cluster_counts_scaled;
    }


    //Cancel selection button
    document.getElementById('cancel-selection').onclick = function(){

        //Reset search form
        document.getElementsByClassName('searchTerm')[0].value = "";
        document.getElementsByClassName('searchTerm')[0].placeholder = 'Search country..';

        //Hide conflict density scale in map window
        document.getElementById('cluster-description').style.opacity = 0;
        document.getElementById('cluster-scale').style.opacity = 0;

        cancelSelection();
        clearCharts();
        resetGUI();
        this.style.opacity = 0;
    }

    //Search country form on submission
    document.getElementById('country-search').onsubmit = function(e){
        e.preventDefault(); //Prevent updating page
        var val = document.forms["f"]["c"].value.toLowerCase(); //Get input value
        var c = val[0].toUpperCase() + val.substring(1);

        //Alert user if country does not exist in Africa or bad input
        if( countryList.indexOf(val) == -1) {
            alert(c + " isn't an African country! Try again.");
            return;
        }

        //Selected searched country
        cancelSelection();
        clearCharts();
        document.getElementById('cancel-selection').style.opacity = 1;
        document.getElementById('country-name').innerHTML = c;
        d3.select(".country[id='" + c + "']")
            .style("stroke", "black")
            .style("stroke-width", "2")
            .style("fill", '#4485c4');

        createCharts( c, 'country' );

    }

    this.draw = function(countries) {

        countries.enter()
            .insert("path")
            .attr("class", "country")
            .attr("d", this.path)
            .attr("id", function(d){
                d.properties.name = checkCountry(d.properties.name);
                countryList.push(d.properties.name.toLowerCase());
                return d.properties.name })
            .on('click', function(d){
                cancelSelection();
                clearCharts();
                document.getElementById('cancel-selection').style.opacity = 1;
                document.getElementById('country-name').innerHTML = d.properties.name;
                d3.select(this)
                    .style("stroke", "black")
                    .style("stroke-width", "2")
                    .style("fill", '#4485c4');

                createCharts( this.id , 'country');
            });

    }

    //Draws the map and the points
    this.drawPoints = function() {

        var point = g.selectAll(".point").data(geoData.features);

        point.enter().append("path")
            .attr("class", "point")
            .attr("id", function(d){ return d.country })
            .attr("act", function(d){ return d.actor })
            .attr("d", this.path)
            .attr("d", this.path.pointRadius(function (d) {

                //Mapping radius values to 5 to 13
                return 5 + ( ( (d.fatalities - 0)*(50-5) ) /
                (512 - 0));;

            }))
            .style("fill", "#c12424")
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
                clearCharts();
                printInfo(d);

                d3.select(this)
                    .style('opacity', 1)
                    .style('fill', '#37cc43')
                    .style("stroke", 'black')
                    .style("stroke-width", "3");

            });

    }

    this.draw(countries);
    this.drawPoints();


    function createCharts( value, type_of_value ) {

        var filterdData = [];

        if(type_of_value == 'country') {
        //Add data points only of the country
        d3.selectAll(".point[id='" + value + "']")
            .style("opacity", function(d){
                filterdData.push(d);
                return "1";
            })
            .style('fill', "#fc2d2d");


        } else if(type_of_value == 'actor') {
            d3.selectAll(".point[act='" + value + "']")
                .style('stroke', function(d){
                    filterdData.push(d);
                    return 'none';
                });
        }

        //Create barchart with selected  data
        charts.createBarchart( filterdData );
        charts.createPiechart( filterdData );

    }

    function move() {
        g.style("stroke-width", 1.5 / d3.event.transform.k + "px");
        g.attr("transform", d3.event.transform);
    }




}
