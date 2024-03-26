// Get and process geojson data 
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then(function (data) {
    // Write two functions to color and scale each earthquake and put them into styleInfo
    function styleInfo(feature) {
        return {
            opacity: 1,
            fillOpacity: 1,
            fillColor: getColor(feature.geometry.coordinates[2]),
            color: "#000000",
            radius: getRadius(feature.properties.mag),
            stroke: true,
            weight: 0.5
        };
    }

    // Color marker based on the depth of the earthquake
    function getColor(depth) {
        switch (true) {
            case depth > 90:
                return "#ea2c2c";
            case depth > 70:
                return "#ea822c";
            case depth > 50:
                return "#ee9c00";
            case depth > 30:
                return "#eecc00";
            case depth > 10:
                return "#d4ee00";
            default:
                return "#98ee00";
        }
    }

    // Set radius based on magnitude. Change 0 to 1.
    function getRadius(magnitude) {
        if (magnitude === 0) {
            return 1;
        }
        return magnitude * 4;
    }

    // Process geojson data here
    L.geoJson(data, {
        // Turn each feature into a marker
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng);
        },
        // Style using styleInfo function created above
        style: styleInfo,
        // Create popups for each marker. Display the magnitude and location of the earthquake.
        onEachFeature: function (feature, layer) {
            layer.bindPopup(
                "Magnitude: " +
                feature.properties.mag +
                "<br>Depth: " +
                feature.geometry.coordinates[2] +
                "<br>Location: " +
                feature.properties.place
            );
        }
    }).addTo(map);

    // Create a legend control object
    let legend = L.control({
        position: "bottomright"
    });

    // Add the details for the legend, setting color for each range.
    legend.onAdd = function () {
        let div = L.DomUtil.create("div", "info legend");
        let grades = [-10, 10, 30, 50, 70, 90];
        let colors = [
            "#98ee00",
            "#d4ee00",
            "#eecc00",
            "#ee9c00",
            "#ea822c",
            "#ea2c2c"
        ];

        // Looping through to generate a label with a colored box for each interval
        for (let i = 0; i < grades.length; i++) {
            div.innerHTML += "<i style='background: " + colors[i] + "'></i> " +
                grades[i] + (grades[i + 1] ? "&ndash;" + grades[i + 1] + "<br>" : "+");
        }
        return div;
    };

    // Add legend to the map
    legend.addTo(map);
});
