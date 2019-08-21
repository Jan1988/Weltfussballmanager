var allPlayers = null;

var playersBoughtTemp = [];

var newRowContent = "";

var id = "5d475fb84ce03d019c1160ad";
var newPlayersPosition;


$(document).ready(function () {

    init();

    $('#createNewPlayerDropdown').click( function(e) {
        e.preventDefault();

        $("#pageContainer").load("html/newPlayer.html");

        data = {
            name: "Jerome Boateng",
            age: 30,
            position: "Abwehr",
            marketValue: 25000000,
            skill: 7,
            // training: 105,
            // experience: 105,
        };
    });

    $('#buyPlayerDropdown').click( function(e) {
        e.preventDefault();
        $("#pageContainer").load("html/transferMarket.html", function () {
            showPlayersOfType("Torwart");
        });
    });


    $("#aufstellungDropdown").click(function () {
        e.preventDefault();
        $("#pageContainer").load("html/team.html");

    });


    $("#trainingDropdown").click(function () {
        e.preventDefault();
    });

    $("#addMiddf").click(function(){
        newRowContent = "<tr><th scope='row'>1</th><td>Sven Ulreich Dummys</td><td>6</td><td>100</td><td>100</td></tr>";
        $(newRowContent).appendTo($("#middfieldBody"));
    });

    var $form = $('form');
    $form.submit(function(){
        $.ajax({
            url: "http://localhost:3000/api/contacts/",
            type: "POST",
            data: $form.find("input").serialize(),
            success: function(response){
                $(".successMessage").text("Spieler " + response.data.name + " wurder erfolgreich angelegt");
            }
        }).done(function (data) {
            $form.get(0).reset();
            console.log(data, "ajax request done")
        });

        return false;
    });

});

function init() {

    $(".nav .nav-link").on("click", function(){
        $(".nav").find(".active").removeClass("active");
        $(this).addClass("active");
    });

    $.ajax({
        url: "http://localhost:3000/api/contacts/",
        type: "GET",
        success: function (data) {
            //TODO: Array of Objects anlegen
            allPlayers = data.data;

        }
    }).done(function (data) {
        console.log(data, "ajax request done")
    });

}

function showPlayersOfType(position){

    $("#defendersTMTable tbody").html("");

    $.each(allPlayers, function (index) {
        if(this.position !== position) return;


        newRowContent = "<tr class='playerRow' id='" + this._id + "'>" +
            "<th scope='row'>" + index + "</th>" +
            "<td>" + this.name + "</td>" +
            "<td>" + this.age + "</td>" +
            "<td>" + this.skill + "</td>" +
            "<td>" + Number(this.marketValue).toLocaleString('de') + " \u20AC"  + "</td>" +
            "<td>" +
                "<div class=\"btn-group btn-group-toggle\" data-toggle=\"buttons\">" +
                    "<label class=\"btn btn-outline-dark\">" +
                        "<input type=\"checkbox\" checked autocomplete=\"off\">Buy" +
                    "</label>" +
                "</div>"+
            "</td>" +
            "</tr>";
        $(newRowContent).appendTo($("#defendersTMTable tbody"));
    });

    $(".btn-group.btn-group-toggle").on("click", function(){
        debugger
        $(this).closest(".playerRow").attr('id');
        // playersBoughtTemp

    });

}
