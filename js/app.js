$(document).ready(function() {});

Parse.initialize("CV2OVLEFon4TB7rmTO2ShsZXC4zwQYCzk08sEBM9", "0PPGajgc2VwZmeQNf0UaQo7EldzTEQsFCFxGm0eR");

angular.module('myProfessorsApp', ["angularParse"])
    .controller('mainCtrl', function($scope, parseQuery) {
        $scope.oneAtATime = true;

        $scope.status = {
            isCustomHeaderOpen: false,
            isFirstOpen: true,
            isFirstDisabled: false
        };

        var regExForTimes = /[: ]+/;
        var regExForDays = /[, ]+/;

        var isInOffice = function(days, starts, ends) {
            var inOffice = true;
            var currentTime = Date.parse("9:15");

            if(days.length==0||starts.length==0||ends.length==0){inOffice=false;}

            $.each(days, function(idx, val) {
                $.each(val.split(), function(idxInner, valInner) {
                    if (valInner.indexOf("M") < 0) {
                        inOffice = false;
                    }
                });
            });

            $.each(starts, function(idx, val) {
                if(currentTime < Date.parse(val)){
                // if(currentTime < Date.parse(val)){
                    inOffice = false;
                }
            });

            $.each(ends, function(idx, val) {
                if(currentTime > Date.parse(val)){
                // if(currentTime > Date.parse(val)){
                    inOffice = false;
                }
            });
            return inOffice;
        }

        $scope.init = function() {
            var department = Parse.Object.extend("Department");
            var query = new Parse.Query(department);
            query.equalTo("university", "California State University, Sacramento");
            query.addAscending("department");
            parseQuery.find(query).then(function(results) {
                $.each(results, function(index, object) {
                    $('#departmentMenu').append(new Option(object.get("department"), object.get("department")));
                });
            });
        }

        $scope.find = function() {
            $scope.professors = [];
            var TestObject = Parse.Object.extend("Professor1");
            var query = new Parse.Query(TestObject);

            query.equalTo("department", $scope.department);
            query.notEqualTo("active", false);
            query.ascending("lastName");

            parseQuery.find(query).then(function(results) {
                $.each(results, function(idx, val) {
                    temp = val.toJSON();
                    // console.log(temp.days)
                    temp.inOffice = isInOffice(temp.days, temp.startHours, temp.endHours);
                    $scope.professors.push(temp);
                });
            });
        }

        var getWeekday = function() {
            var d = new Date();
            var weekday = new Array(7);
            weekday[0] = "Su";
            weekday[1] = "M";
            weekday[2] = "T";
            weekday[3] = "W";
            weekday[4] = "Th";
            weekday[5] = "F";
            weekday[6] = "S";

            return weekday[d.getDay()];
        }
    });
