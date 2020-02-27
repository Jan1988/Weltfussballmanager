var session;
var manager;

var allPlayers = {};
var allPlayersSorted = [];
// var playersBoughtTemp = {};
var sessionNumber = 0;

var myClass;

init();


function init() {
    myClass = new MyClass(session, manager, allPlayers, allPlayersSorted);
    $.get("http://localhost:3000/api/players/", function (data) {
        // TODO: Array of Objects anlegen
        $.each(data.data, function (index, player) {
            allPlayers[player._id] = player;
            insertSort(player);
        });

    })
    // $.ajax({
    //     url: "http://localhost:3000/api/players/",
    //     type: "GET",
    //     success: function (data) {
    //         // TODO: Array of Objects anlegen
    //         $.each(data.data, function (index, player) {
    //             allPlayers[player._id] = player;
    //             insertSort(player);
    //     }
    // }).done(function () {
    //
    //     $.ajax({
    //         url: "http://localhost:3000/api/sessions/",
    //         type: "GET",
    //         success: function (data) {
    //             if (data.data.length) {
    //             // if (false) {
    //
    //                 console.log("Session " + sessionNumber + " wird genommen");
    //                 session = data.data[sessionNumber];
    //
    //
    //                 $.ajax({
    //                     url: "http://localhost:3000/api/managers/" + session.manager,
    //                     type: "GET",
    //                     success: function (data) {
    //                         manager = data.data;
    //                         myClass = new MyClass(session, manager, allPlayers, allPlayersSorted);
    //                     }
    //                 });
    //
    //             } else {
    //                 $("#pageContainer").load("html/newSession.html");
    //             }
    //         }
    //     });
    //
    // });

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

function getCurrentTime() {
    var now = new Date();
    // now.toLocaleDateString("en-US", {hour:'2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric'});
    debugger
    var dateString = ("0" + now.getHours()).slice(-2) + ":" +
        ("0" + now.getMinutes()).slice(-2) + " " +
        ("0" + now.getDate()).slice(-2) + "-" +
        ("0"+(now.getMonth()+1)).slice(-2) + "-" +
        now.getFullYear();


    return dateString;
}

function onSubmitNewSession() {
    var $form = $("#newSessionForm");
    var serializedArray = $form.find("input").serializeArray();
    var formObject = {};
    $.each(serializedArray, function (i, field) {
        formObject[field.name] = field.value;
    });

    manager = {
        _id: null,
        name: formObject.managerName,
        teamName: formObject.teamName,
        bankBalance: formObject.bankBalance,
        players: []
    };

    //Erst wird ein neuer Manager erstellt, dann eine neue Session die auf das erstellte Manager referenziert
    $.ajax({
        url: "http://localhost:3000/api/managers/",
        type: "POST",
        data: manager,
        success: function (response) {
            debugger
            session = {
                _id: null,
                name: formObject.sessionName,
                lastSave: new Date(),
                manager: response.data._id
            };
            manager._id = response.data._id;
        }
    }).done(function (data) {
        $.ajax({
            url: "http://localhost:3000/api/sessions/",
            type: "POST",
            data: session,
            success: function (response) {
                session._id = response.data._id;
            }
        }).done(function (data) {

            console.log(data, "ajax request done");
            myClass = new MyClass(session, manager, allPlayers, allPlayersSorted);
        });
        console.log(data, "ajax request done")
        // $form.get(0).reset();
    });
};