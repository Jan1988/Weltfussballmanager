var goalies = 3;
var defs = 5;
var mids = 3;
var striks = 4;

var displayedContainer = "#startContainer";

var newRowContent = "";

var id = "5d475fb84ce03d019c1160ad";


$(document).ready(function () {

    $('#createNewPlayerDropdown').click( function(e) {

        e.preventDefault();
        $(displayedContainer).hide();
        $(this.parentElement.parentElement).find(".nav-link").addClass("active")

        data = {
            name: "Jerome Boateng",
            age: 30,
            position: "Torwart",
            marketValue: 25000000,
            skill: 7,
            // training: 105,
            // experience: 105,
        };

        $.ajax({
            url: "http://localhost:3000/api/contacts/",
            type: "POST",
            data: data
        }).done(function (data) {
            console.log(data, "ajax request done")
        });
    });



    $('#buyPlayerDropdown').click( function(e) {
        e.preventDefault();
        $(displayedContainer).hide();
        $("#kaufenContainer").show();
        $(this.parentElement.parentElement).find(".nav-link").addClass("active");


    });


    $("#aufstellungDropdown").click(function () {

        $(displayedContainer).hide();
        $("#aufstellungContainer").show();
        $(this.parentElement.parentElement).find(".nav-link").addClass("active")

        $.ajax({
            url: "/send_save",
            type: "POST",
            dataType: "json",
            data: {
                "id": id
            },
            contentType: "application/json",
            cache: false,
            timeout: 5000,
            complete: function() {
                //called when complete
                console.log('process complete');
            },

            success: function(data) {
                console.log(data);
                console.log('process sucess');
            },

            error: function() {
                console.log('process error');
            },
        });


        for (var i = 1; i <= goalies; i++) {

            newRowContent = "<tr><th scope='row'>" + i + "</th><td>Sven Ulreich Dummys</td><td>6</td><td>100</td><td>100</td></tr>";
            $(newRowContent).appendTo($("#goalBody"));
        }

        for (i; i <= defs + goalies; i++) {
            newRowContent = "<tr><th scope='row'>" + i + "</th><td>Hummels Dummys</td><td>6</td><td>100</td><td>100</td></tr>";
            $(newRowContent).appendTo($("#defenceBody"));
        }

        for (i; i <= defs + goalies + mids; i++) {
            newRowContent = "<tr><th scope='row'>" + i + "</th><td>Kroos Dummy</td><td>6</td><td>100</td><td>100</td></tr>";
            $(newRowContent).appendTo($("#middfieldBody"));
        }

        for (i; i <= defs + goalies + mids +striks; i++) {
            newRowContent = "<tr><th scope='row'>" + i + "</th><td>Müller Dummys</td><td>6</td><td>100</td><td>100</td></tr>";
            $(newRowContent).appendTo($("#strikerBody"));
        }

        displayedContainer = "#aufstellungContainer";

    });

    $("#trainingDropdown").click(function () {
        $(displayedContainer).hide();
        $(trainingContainer).show();
        $(this.parentElement.parentElement).find(".nav-link").addClass("active")

        displayedContainer = "#trainingContainer";
        console.log("geht rein");
        console.log(this);
    });



});

    $("#addMiddf").click(function(){
        newRowContent = "<tr><th scope='row'>1</th><td>Sven Ulreich Dummys</td><td>6</td><td>100</td><td>100</td></tr>";
        $(newRowContent).appendTo($("#middfieldBody"));
    });


function showAllGoalkeeper(){
    $.ajax({
        url: "http://localhost:3000/api/contacts/",
        type: "GET",
        success: function (data) {

            $.each(data.data, function (index) {


                newRowContent = "<tr>" +
                    "<th scope='row'>" + index + "</th>" +
                    "<td>" + this.name + "</td>" +
                    "<td>" + this.age + "</td>" +
                    "<td>" + this.skill + "</td>" +
                    "<td>" + this.marketValue + "</td>" +
                    "</tr>";
                $(newRowContent).appendTo($("#defendersTMTable tbody"));
            });
        }
    }).done(function () {
        console.log("ajax request done")
    });
}
