var allPlayers = {};
var allPlayersSorted = [];

var club = {
        name: "FC Külsheim",
        balance: 100000000,
        stadiumCapacity: 10000,
    };

var playersBoughtTemp = {};
var team = {};

var newRowContent = "";

// var id = "5d475fb84ce03d019c1160ad";

var newPlayersPosition;


$(document).ready(function () {

    init();

    $('#createNewPlayerDropdown').click( function(e) {
        e.preventDefault();

        $("#pageContainer").load("html/newPlayer.html");

    });

    $('#buyPlayerDropdown').click( function(e) {
        e.preventDefault();
        $("#pageContainer").load("html/transferMarket.html", function () {
            showPlayersOfType("Tor");
        });
    });


    $("#aufstellungDropdown").click(function (e) {
        e.preventDefault();
        $("#pageContainer").load("html/team.html", function () {
            var i  = 1;
            $.each(team, function () {
            debugger
                newRowContent = "<tr class='playerRow' id='" + this.id + "'>" +
                    "<th scope='row'>" + i + "</th>" +
                    "<td>" + this.name + "</td>" +
                    "<td>" + this.age + "</td>" +
                    "<td>" + this.skill + "</td>" +
                    "<td>" + this.training + "</td>" +
                    "<td>" + this.experience + "</td>" +
                    "</tr>";
                $(newRowContent).appendTo($("#teamTable tbody.tableBody" + this.position));
                i += 1;
            });
        });

    });


    $("#trainingDropdown").click(function () {
        e.preventDefault();
    });

    // $("#addMiddf").click(function(){
    //     newRowContent = "<tr><th scope='row'>1</th><td>Sven Ulreich Dummys</td><td>6</td><td>100</td><td>100</td></tr>";
    //     $(newRowContent).appendTo($("#middfieldBody"));
    // });



});

function init() {

    $(".nav .nav-link").on("click", function(){
        $(".nav").find(".active").removeClass("active");
        $(this).addClass("active");
    });

    $.ajax({
        url: "http://localhost:3000/api/players/",
        type: "GET",
        success: function (data) {
            //TODO: Array of Objects anlegen

            var t0 = performance.now();

            $.each(data.data, function (index) {
                var player = new Player(this);
                allPlayers[player.id] = player;
                insertSort(player);

            });

            var t1 = performance.now();
            console.log("Call to doSomething took " + (t1 - t0) + " milliseconds.")


        }
    }).done(function (data) {
        console.log(data, "ajax request done");
        console.log(allPlayersSorted, "ajax request done");

    });



    updateBalanceDisplay();

}

function showPlayersOfType(position){

    $("#playersTMTable1 tbody").html("");
    $("#playersTMTable2 tbody").html("");
    var i  = 1;
    $.each(allPlayersSorted, function () {

        if(this.position !== position) return;

        newRowContent = "<tr class='playerRow' id='" + this.id + "'>" +
            "<th scope='row'>" + i + "</th>" +
            "<td>" + this.name + "</td>" +
            "<td>" + this.age + "</td>" +
            "<td>" + this.skill + "</td>" +
            "<td>" + Number(this.marketValue).toLocaleString('de') + " \u20AC"  + "</td>" +
            "</tr>";
        i < 16 ? $(newRowContent).appendTo($("#playersTMTable1 tbody")) : $(newRowContent).appendTo($("#playersTMTable2 tbody"));

        i += 1;
    });

    $(".playerRow").click(function(){
        buyPlayersTemp(this);
    });

}
function buyPlayersTemp(selectedPlayerRow) {

    var playerId = $(selectedPlayerRow).attr('id');
    var player = allPlayers[playerId];

    if($(selectedPlayerRow).hasClass("table-primary")){
        club.balance += player.marketValue;
        delete playersBoughtTemp[player.id];
    }else{
        club.balance -= player.marketValue;
        playersBoughtTemp[player.id] = player;
    }

    $(selectedPlayerRow).toggleClass("table-primary");

    updateBalanceDisplay();


}
function buyPlayersFix() {
    $.each(playersBoughtTemp, function () {
        team[this.id] = this;

        $("#"+this.id).addClass("disabledPlayerRow");
        // delete allPlayersSorted[this.id];
        // delete allPlayers[this.id];

        $.ajax({
            url: "http://localhost:3000/api/team/",
            type: "POST",
            data: this,
            success: function(response){
                $(".successMessage").text("Spieler " + response.data.name + " wurde erfolgreich dem Team hinzugefügt");
            }
        }).done(function (data) {
            console.log(data, "ajax request done")
        });

    });
    playersBoughtTemp = {};

    console.log(team);



}


function Player(params) {
    this.id = params._id;
    this.name = params.name;
    this.age = params.age;
    this.position = params.position;
    this.skill = params.skill;
    this.marketValue = params.marketValue;
    this.training = params.training;
    this.experience = params.experience;
}
function setPlayerPosition(value) {
    newPlayersPosition = value;
}
function updateBalanceDisplay() {
    $("footer .balanceDisplay").text(Number(club.balance).toLocaleString('de') + " \u20AC");
}


function insertSort2(player) {
    // var mid = allPlayersSorted.length / 2
    //
    // while(allPlayersSorted[mid] ){
    // }
}

function insertSort(player) {

    console.log(player.skill);


    for (var i = 0; i < allPlayersSorted.length; i++){

        if(player.skill > allPlayersSorted[i].skill){
            //TODO: insert an der Stelle
            allPlayersSorted.splice(i, 0, player);
            return;
        }
    }

    allPlayersSorted.push(player);
}