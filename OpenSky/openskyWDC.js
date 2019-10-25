(function () {
    var myConnector = tableau.makeConnector();

    myConnector.getSchema = function (schemaCallback) {
        var cols = [{
            id: "icao24",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "long",
            alias: "longitude",
            dataType: tableau.dataTypeEnum.float
        }, {
            id: "lat",
            alias: "latitude",
            dataType: tableau.dataTypeEnum.float
        }];

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
                var temp = feat[i];
                tableData.push({
                    "icao": temp[0],
                    "long": temp[5],
                    "lat": temp[6]
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