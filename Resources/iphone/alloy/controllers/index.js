function __processArg(obj, key) {
    var arg = null;
    if (obj) {
        arg = obj[key] || null;
        delete obj[key];
    }
    return arg;
}

function Controller() {
    function getCurrentTimeObj() {
        var currentTime = new Date(), meridian = "A", currentHours = currentTime.getHours(), currentMinutes = currentTime.getMinutes();
        10 > currentMinutes && (currentMinutes = "0" + currentMinutes);
        if (currentHours > 12) {
            currentHours -= 12;
            meridian = "P";
        } else 0 === currentHours && (currentHours = 12);
        return {
            fullString: currentHours + "" + currentMinutes + meridian,
            string: currentHours + "" + currentMinutes,
            hours: currentHours,
            mintues: currentMinutes,
            meridian: meridian
        };
    }
    function startCountdown(nextDeparture) {
        var interval = setInterval(function() {
            var currentTime = new Date();
            var hours = nextDeparture.hours - currentTime.getHours();
            var minutes = nextDeparture.minutes - currentTime.getMinutes();
            if (currentTime.getHours() != nextDeparture.hours) {
                hours--;
                minutes += 60;
            }
            var seconds = 60 - currentTime.getSeconds();
            var currentTimeString = getCurrentTimeObj().string;
            10 > seconds && (seconds = "0" + seconds);
            10 > minutes && (minutes = "0" + minutes);
            $.nextHours.setText(hours);
            $.nextMinutes.setText(minutes);
            $.nextSeconds.setText(seconds);
            if (currentTimeString > nextDeparture.string) {
                clearInterval(interval);
                interval = null;
                getNextDeparture();
            }
        }, 1e3);
    }
    function getNextDeparture() {
        var lastDeparture, nextDeparture, departures = selectedStation.departures, currentTimeObj = getCurrentTimeObj();
        $.currentTimeString.setText(currentTimeObj.fullString);
        nextDeparture = departures[departures.length - 1];
        for (i = 0; i < departures.length; i++) {
            lastDeparture = nextDeparture;
            nextDeparture = {
                fullString: departures[i],
                string: departures[i].substr(0, departures[i].length - 1),
                meridian: departures[i].substr(departures[i].length - 1),
                hours: departures[i].substr(0, departures[i].length - 3),
                minutes: departures[i].substr(departures[i].length - 3, 2)
            };
            if (currentTimeObj.string < nextDeparture.string) {
                $.nextTimeString.setText(nextDeparture.fullString);
                $.lastTimeString.setText(lastDeparture.fullString);
                startCountdown(nextDeparture);
                return {
                    last: lastDeparture,
                    next: nextDeparture
                };
            }
        }
        $.lastTimeString.setText("Error");
        $.nextTimeString.setText("Error");
    }
    function loadStationData() {
        $.stationName.setText(selectedStation.name);
        getNextDeparture();
    }
    function findClosestStation() {
        selectedStation = stationData[0];
    }
    function init() {
        $.index.open();
        closestStation = findClosestStation();
        loadStationData(closestStation);
    }
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "index";
    this.args = arguments[0] || {};
    if (arguments[0]) {
        {
            __processArg(arguments[0], "__parentSymbol");
        }
        {
            __processArg(arguments[0], "$model");
        }
        {
            __processArg(arguments[0], "__itemTemplate");
        }
    }
    var $ = this;
    var exports = {};
    $.__views.index = Ti.UI.createWindow({
        backgroundColor: "white",
        id: "index"
    });
    $.__views.index && $.addTopLevelView($.__views.index);
    $.__views.stationName = Ti.UI.createLabel({
        top: 40,
        id: "stationName"
    });
    $.__views.index.add($.__views.stationName);
    $.__views.currentString = Ti.UI.createLabel({
        top: 80,
        left: 0,
        text: "Current:",
        id: "currentString"
    });
    $.__views.index.add($.__views.currentString);
    $.__views.currentTimeString = Ti.UI.createLabel({
        top: 80,
        left: 80,
        id: "currentTimeString"
    });
    $.__views.index.add($.__views.currentTimeString);
    $.__views.nextString = Ti.UI.createLabel({
        top: 120,
        left: 0,
        text: "Next:",
        id: "nextString"
    });
    $.__views.index.add($.__views.nextString);
    $.__views.nextTimeString = Ti.UI.createLabel({
        top: 120,
        left: 80,
        id: "nextTimeString"
    });
    $.__views.index.add($.__views.nextTimeString);
    $.__views.nextHours = Ti.UI.createLabel({
        top: 120,
        left: 200,
        width: Ti.UI.SIZE,
        height: Ti.UI.SIZE,
        color: "#000",
        id: "nextHours"
    });
    $.__views.index.add($.__views.nextHours);
    $.__views.nextHMColon = Ti.UI.createLabel({
        top: 120,
        left: 220,
        width: Ti.UI.SIZE,
        height: Ti.UI.SIZE,
        color: "#000",
        text: ":",
        id: "nextHMColon"
    });
    $.__views.index.add($.__views.nextHMColon);
    $.__views.nextMinutes = Ti.UI.createLabel({
        top: 120,
        left: 240,
        width: Ti.UI.SIZE,
        height: Ti.UI.SIZE,
        color: "#000",
        id: "nextMinutes"
    });
    $.__views.index.add($.__views.nextMinutes);
    $.__views.nextMSColon = Ti.UI.createLabel({
        top: 120,
        left: 280,
        width: Ti.UI.SIZE,
        height: Ti.UI.SIZE,
        color: "#000",
        text: ":",
        id: "nextMSColon"
    });
    $.__views.index.add($.__views.nextMSColon);
    $.__views.nextSeconds = Ti.UI.createLabel({
        top: 120,
        left: 300,
        width: Ti.UI.SIZE,
        height: Ti.UI.SIZE,
        color: "#000",
        id: "nextSeconds"
    });
    $.__views.index.add($.__views.nextSeconds);
    $.__views.lastString = Ti.UI.createLabel({
        top: 160,
        left: 0,
        text: "Last:",
        id: "lastString"
    });
    $.__views.index.add($.__views.lastString);
    $.__views.lastTimeString = Ti.UI.createLabel({
        top: 160,
        left: 80,
        id: "lastTimeString"
    });
    $.__views.index.add($.__views.lastTimeString);
    exports.destroy = function() {};
    _.extend($, $.__views);
    var stationData = [ {
        name: "Boulder Transit Center (14th St - Walnut St)",
        departures: [ "111A", "506A", "601A", "701A", "801A", "831A", "901A", "931A", "1001A", "1031A", "1101A", "1131A", "1201P", "1231P", "101P", "131P", "201P", "231P", "301P", "331P", "401P", "431P", "501P", "531P", "601P", "631P", "701P", "732P", "802P", "832P", "907P", "1007P", "1107P", "1207A", "115A" ]
    }, {
        name: "Broadway - 16th St (University of Colorado)",
        departures: [ "117A", "510A", "607A", "707A", "807A", "837A", "907A", "937A", "1007A", "1037A", "1107A", "1137A", "1207P", "1237P", "107P", "137P", "207P", "237P", "307P", "337P", "407P", "437P", "507P", "537P", "607P", "637P", "707P", "738P", "808P", "838P", "913P", "1013P", "1113P", "1213A", "121A" ]
    }, {
        name: "Broadway - 27th Way (Dept of Commerce)",
        departures: [ "120A", "512A", "610A", "710A", "810A", "840A", "910A", "940A", "1010A", "1040A", "1110A", "1140A", "1210P", "1240P", "110P", "140P", "210P", "240P", "310P", "340P", "410P", "440P", "510P", "540P", "610P", "640P", "710P", "741P", "811P", "841P", "916P", "1016P", "1116P", "1216A", "124A" ]
    }, {
        name: "US 36 & Table Mesa Park-n-Ride - Gate A ",
        departures: [ "125A", "516A", "616A", "716A", "816A", "846A", "916A", "946A", "1016A", "1046A", "1116A", "1146A", "1216P", "1246P", "116P", "146P", "216P", "246P", "316P", "346P", "416P", "446P", "516P", "546P", "616P", "646P", "716P", "747P", "816P", "846P", "921P", "1021P", "1121P", "1221A", "129A" ]
    }, {
        name: "US 36 & McCaslin Park-n-Ride",
        departures: [ "131A", "522A", "622A", "722A", "822A", "852A", "922A", "952A", "1022A", "1052A", "1122A", "1152A", "1222P", "1252P", "122P", "152P", "222P", "252P", "322P", "352P", "422P", "452P", "522P", "552P", "622P", "652P", "722P", "753P", "822P", "852P", "927P", "1027P", "1127P", "1227A", "135A" ]
    }, {
        name: "US 36 & FlatIron Circle East Park-n-Ride",
        departures: [ "135A", "526A", "626A", "726A", "826A", "856A", "926A", "956A", "1026A", "1056A", "1126A", "1156A", "1226P", "1256P", "126P", "156P", "226P", "256P", "326P", "356P", "426P", "456P", "526P", "556P", "626P", "656P", "726P", "757P", "826P", "856P", "931P", "1031P", "1131P", "1231A", "139A" ]
    }, {
        name: "US 36 & Broomfield Park-n-Ride - Gate K [Arrive]",
        departures: [ "138A", "529A", "629A", "729A", "829A", "859A", "929A", "959A", "1029A", "1059A", "1129A", "1159A", "1229P", "1259P", "129P", "159P", "229P", "259P", "329P", "359P", "429P", "459P", "529P", "559P", "629P", "659P", "729P", "800P", "829P", "859P", "934P", "1034P", "1134P", "1234A", "142A" ]
    }, {
        name: "US 36 & Broomfield Park-n-Ride - Gate K [Leave]",
        departures: [ "138A", "530A", "630A", "730A", "830A", "900A", "930A", "1000A", "1030A", "1100A", "1130A", "1200P", "1230P", "100P", "130P", "200P", "230P", "300P", "330P", "400P", "430P", "500P", "530P", "600P", "630P", "700P", "730P", "801P", "830P", "900P", "935P", "1035P", "1135P", "1235A", "142A" ]
    }, {
        name: "US 36 & Church Ranch Park-n-Ride",
        departures: [ "140A", "532A", "632A", "732A", "832A", "902A", "932A", "1002A", "1032A", "1102A", "1132A", "1202P", "1232P", "102P", "132P", "202P", "232P", "302P", "332P", "402P", "432P", "502P", "532P", "602P", "632P", "702P", "732P", "803P", "832P", "902P", "937P", "1037P", "1137P", "1237A", "144A" ]
    }, {
        name: "US 36 & Westminster Center Park-n-Ride (Sheridan Blvd - W 88th Ave)",
        departures: [ "146A", "538A", "638A", "738A", "838A", "908A", "938A", "1008A", "1038A", "1108A", "1138A", "1208P", "1238P", "108P", "138P", "208P", "238P", "308P", "338P", "408P", "438P", "508P", "538P", "608P", "638P", "708P", "738P", "809P", "838P", "908P", "943P", "1043P", "1143P", "1243A", "150A" ]
    }, {
        name: "Wewatta St - 21st St",
        departures: [ "158A", "551A", "651A", "751A", "851A", "921A", "951A", "1021A", "1051A", "1121A", "1151A", "1221P", "1251P", "121P", "151P", "221P", "251P", "321P", "351P", "421P", "451P", "521P", "551P", "621P", "651P", "721P", "751P", "822P", "851P", "921P", "956P", "1056", "1156", "1256", "203A" ]
    }, {
        name: "Union Station Underground Bus Concourse (Wewatta St - 17th St)",
        departures: [ "202A", "555A", "655A", "755A", "855A", "925A", "955A", "1025A", "1055A", "1125A", "1155A", "1225P", "1255P", "125P", "155P", "225P", "255P", "325P", "355P", "425P", "455P", "525P", "555P", "625P", "655P", "725P", "755P", "826P", "855P", "925P", "1000P", "1100P", "1200A", "100A", "207A" ]
    } ];
    var selectedStation;
    init();
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;