(function () {
    var myConnector = tableau.makeConnector();

    myConnector.getSchema = function (schemaCallback) {
        var cols = [{
            id: "icao24",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "longitude",
            alias: "longitude",
            dataType: tableau.dataTypeEnum.float
        }, {
            id: "latitude",
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
                tableData.push({
                    "id": feat[i].id,
                    "mag": feat[i].properties.mag,
                    "title": feat[i].properties.title
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