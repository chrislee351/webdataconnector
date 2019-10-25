(function () {
    var myConnector = tableau.makeConnector();

    myConnector.getSchema = function (schemaCallback) {
        var cols = [{
            id: "icao24",
            alias: "ICAO",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "callsign",
            alias: "Call Sign",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "long",
            alias: "longitude",
            dataType: tableau.dataTypeEnum.float
        }, {
            id: "lat",
            alias: "latitude",
            dataType: tableau.dataTypeEnum.float
        }, {
            id: "baro_altitude",
            alias: "Altitude",
            dataType: tableau.dataTypeEnum.float
        },];

        var tableSchema = {
            id: "openskyFeed",
            alias: "All Flights",
            columns: cols
        };
    
        schemaCallback([tableSchema]);
    };

    myConnector.getData = function (table, doneCallback) {
        $.getJSON("https://opensky-network.org/api/states/all", function(resp) {
            var feat = resp.states,
                tableData = [];
    
            // Iterate over the JSON object
            for (var i = 0, len = feat.length; i < len; i++) {
                var flight = feat[i];
                tableData.push({
                    "icao24": flight[0],
                    "callsign": flight[1],
                    "long": flight[5],
                    "lat": flight[6],
                    "baro_altitude": flight[7]
                });
            }
    
            table.appendRows(tableData);
            doneCallback();
        });
    };

    tableau.registerConnector(myConnector);

    $(document).ready(function () {
        $("#submitButton").click(function () {
            tableau.connectionName = "OpenSky Flight Feed";
            tableau.submit();
        });
    });
}) (); 