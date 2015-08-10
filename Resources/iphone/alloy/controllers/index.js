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
        var currentTime = new Date(), meridian = "A", currentHours = currentTime.getHours(), currentMinutes = currentTime.getMinutes(), currentSeconds = currentTime.getSeconds();
        10 > currentMinutes && (currentMinutes = "0" + currentMinutes);
        if (currentHours > 12) {
            currentHours -= 12;
            meridian = "P";
        } else 0 === currentHours && (currentHours = 12);
        return {
            fullString: currentHours + "" + currentMinutes + meridian,
            string: currentHours + "" + currentMinutes,
            milString: currentTime.getHours() + "" + currentMinutes,
            hours: currentHours,
            minutes: currentMinutes,
            seconds: currentSeconds,
            meridian: meridian
        };
    }
    function startCountdown(nextDeparture) {
        var interval = setInterval(function() {
            var currentTime = getCurrentTimeObj();
            var hours = nextDeparture.hours - currentTime.hours;
            var minutes = nextDeparture.minutes - currentTime.minutes - 1;
            var seconds = 60 - currentTime.seconds;
            if (currentTime.hours < nextDeparture.hours && currentTime.minutes > nextDeparture.minutes) {
                hours--;
                minutes += 60;
            }
            10 > seconds && (seconds = "0" + seconds);
            10 > minutes && (minutes = "0" + minutes);
            $.nextHours.setText(hours);
            $.nextMinutes.setText(minutes);
            $.nextSeconds.setText(seconds);
            if (currentTime.milString > nextDeparture.milString) {
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
                milString: departures[i].substr(0, departures[i].length - 1),
                meridian: departures[i].substr(departures[i].length - 1),
                hours: departures[i].substr(0, departures[i].length - 3),
                minutes: departures[i].substr(departures[i].length - 3, 2)
            };
            "P" === nextDeparture.meridian && (nextDeparture.milString = parseInt(nextDeparture.milString) + 1200);
            if (parseInt(currentTimeObj.string) < parseInt(nextDeparture.string)) break;
        }
        startCountdown(nextDeparture);
        $.nextTimeString.setText(nextDeparture.fullString);
        $.lastTimeString.setText(lastDeparture.fullString);
    }
    function loadStationData() {
        Titanium.Geolocation.accuracy = Titanium.Geolocation.ACCURACY_BEST;
        Titanium.Geolocation.distanceFilter = 10;
        Titanium.Geolocation.getCurrentPosition(function(e) {
            if (e.error) {
                alert("HFL cannot get your current location");
                return;
            }
            var longitude = e.coords.longitude;
            var latitude = e.coords.latitude;
            $.latitude.setText("Lat:  " + latitude);
            $.longitude.setText("Long: " + longitude);
        });
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
        left: 230,
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
        left: 270,
        width: Ti.UI.SIZE,
        height: Ti.UI.SIZE,
        color: "#000",
        text: ":",
        id: "nextMSColon"
    });
    $.__views.index.add($.__views.nextMSColon);
    $.__views.nextSeconds = Ti.UI.createLabel({
        top: 120,
        left: 280,
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
    $.__views.refresh = Ti.UI.createButton({
        bottom: 80,
        title: "Refresh",
        id: "refresh"
    });
    $.__views.index.add($.__views.refresh);
    $.__views.latitude = Ti.UI.createLabel({
        left: 10,
        bottom: 40,
        id: "latitude"
    });
    $.__views.index.add($.__views.latitude);
    $.__views.longitude = Ti.UI.createLabel({
        left: 10,
        bottom: 20,
        id: "longitude"
    });
    $.__views.index.add($.__views.longitude);
    exports.destroy = function() {};
    _.extend($, $.__views);
    var stationData = [ {
        name: "US 36 & McCaslin Park-n-Ride",
        departures: [ "545A", "609A", "622A", "637A", "701A", "713A", "723A", "733A", "743A", "756A", "812A", "822A", "824A", "837A", "847A", "857A", "907A", "922A", "938A", "946A" ]
    } ];
    var selectedStation;
    $.refresh.addEventListener("click", loadStationData);
    init();
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;