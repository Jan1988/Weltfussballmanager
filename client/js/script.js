var session;
var team;


var allPlayers = {};
var allPlayersSorted = [];
var playersBoughtTemp = {};

var myClass;

init();


function init() {

    $.ajax({
        url: "http://localhost:3000/api/players/",
        type: "GET",
        success: function (data) {
            //TODO: Array of Objects anlegen
            $.each(data.data, function (index, player) {
                allPlayers[player._id] = player;
                insertSort(player);
            });

            $.ajax({
                url: "http://localhost:3000/api/sessions/",
                type: "GET",
                success: function (data) {
                    if (data.data.length) {
                        console.log("erste Session wird genommen");
                        session = data.data[0];

                        $.ajax({
                            url: "http://localhost:3000/api/teams/" + session.team,
                            type: "GET",
                            success: function (data) {

                                team = data.data;
                                myClass = new MyClass(session, team, allPlayers, allPlayersSorted);
                            }
                        });

                    } else {
                        $("#pageContainer").load("html/newSession.html");
                    }
                }
            });

        }
    });
}

function insertSort(player) {
    // console.log("insertSort");
    for (var i = 0; i < allPlayersSorted.length; i++){

        if(player.skill > allPlayersSorted[i].skill){
            //TODO: insert an der Stelle
            allPlayersSorted.splice(i, 0, player);
            return;
        }
    }
    allPlayersSorted.push(player);
}

function onSubmitNewSession() {
    var $form = $("#newSessionForm");
    var serializedArray = $form.find("input").serializeArray();
    var formObject = {};
    $.each(serializedArray, function (i, field) {
        formObject[field.name] = field.value;
    });
    //Erst wird ein neues Team erstellt, dann eine neue Session die auf das erstellte Team referenziert
    $.ajax({
        url: "http://localhost:3000/api/teams/",
        type: "POST",
        data: {
            name: formObject.teamName
        },
        success: function (response) {

        }
    }).done(function (data) {
        $.ajax({
            url: "http://localhost:3000/api/sessions/",
            type: "POST",
            data: {
                managerName: formObject.managerName,
                bankBalance: formObject.bankBalance,
                team: data.data._id
            },
            success: function (response) {

            }
        }).done(function (data) {
            $form.get(0).reset();
            console.log(data, "ajax request done")
        });
        console.log(data, "ajax request done")
        // $form.get(0).reset();
    });
};