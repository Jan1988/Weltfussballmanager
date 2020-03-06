$(document).ready(function () {

    loadSession(0);


    $('#createNewSessionDropdown').click(function(e) {
        e.preventDefault();
        // $("#pageContainer").load("html/newSession.html");
        $.get("html/modals/newSessionModal.html", function (data) {
            $("#modalContainer").html(data);
            $("#modalContainer").modal('show');
        });

    });
    $('#saveSessionDropdown').click( function(e) {
        if($(e.currentTarget).hasClass("disabled")) return;
        e.preventDefault();
        self.saveSession();
    });
    $('#loadSessionDropdown').click( function(e) {
        e.preventDefault();
        onShowLoadSessionModal();
    });
    $('#exitSessionDropdown').click( function(e) {
        if($(e.currentTarget).hasClass("disabled")) return;
        e.preventDefault();
        disabledMenuItems();
        session = {};
        manager = {};
        allPlayers = {};
        allPlayersSorted = [];
        setBalanceDisplay();
        $("#pageContainer").html("Spiel beendet");
    });
    $('#createNewPlayerDropdown').click( function(e) {
        e.preventDefault();
        $("#pageContainer").load("html/newPlayer.html");
    });


    $("#aufstellungDropdown").click(function (e) {
        e.preventDefault();

        $("#pageContainer").load("html/team.html", function () {
            $.each(manager.players, function (i, id) {
                let player = allPlayers[id];
                newRowContent = "<tr class='playerRow' id='" + player._id + "'>" +
                    "<th scope='row'>" + (i+1) + "</th>" +
                    "<td>" + player.name + "</td>" +
                    "<td>" + player.age + "</td>" +
                    "<td>" + player.skill + "</td>" +
                    "<td>" + player.training + "</td>" +
                    "<td>" + player.experience + "</td>" +
                    "</tr>";

                $(newRowContent).appendTo($("#teamTable tbody.tableBody" + player.position));
            });

            $.each(manager.starters, function (i, id) {
                $("#"+id).addClass("table-primary");
            });

            $(".playerRow").click(function(){
                toggleStarters(this);
            });
            calculateStarterSkills();
        });
    });

    $(".nav .nav-link").on("click", function(){
        $(".nav").find(".active").removeClass("active");
        $(this).addClass("active");
    });

    $("#trainingDropdown").click(function (e) {
        e.preventDefault();
    });

    $('#buyPlayerDropdown').click( function(e) {
        e.preventDefault();
        $("#pageContainer").load("html/transferMarket.html", function () {
            showPlayersOfType("Tor");
        });
    });

    $("#verkaufenDropdown").click(function (e) {
        e.preventDefault();

        $("#pageContainer").load("html/sellTeam.html", function () {
            $.each(manager.players, function (i, id) {
                var player = allPlayers[manager.players[i]];
                newRowContent = "<tr class='playerRow' id='" + player._id + "'>" +
                    "<th scope='row'>" + (i+1) + "</th>" +
                    "<td>" + player.name + "</td>" +
                    "<td>" + player.age + "</td>" +
                    "<td>" + player.skill + "</td>" +
                    "<td>" + player.training + "</td>" +
                    "<td>" + player.experience + "</td>" +
                    "<td>" + numberToMoney(player.marketValue) + "</td>" +
                    "</tr>";

                $(newRowContent).appendTo($("#teamTable tbody.tableBody" + player.position));

            });
            $(".playerRow").click(function(){
                sellPlayersTemp(this);
            });
        });
    });
});


//--------------Public Methods--------------//
buyPlayersFix = function() {

    if(Object.keys(playersBoughtTemp).length){
        $.each(playersBoughtTemp, function(i, player){
            manager.players.push(player._id);
            $("#" + player._id).addClass("disabledPlayerRow")
                .removeClass("table-primary tempSelected");
        });
        playersBoughtTemp = {}
    }

};

sellPlayersFix = function () {
    if(Object.keys(playersBoughtTemp).length) {

        $.each(playersBoughtTemp, function (i, player) {

            const index = manager.players.indexOf(player._id);
            if (index > -1) {
                manager.players.splice(index, 1);
            }
            $("#" + player._id).remove();
            // $("#" + player._id).addClass("disabledPlayerRow")
            //     .removeClass("table-primary tempSelected");
        });
        playersBoughtTemp = {};
    }
};


showPlayersOfType = function(position){

    if(Object.keys(playersBoughtTemp).length){
        $.each(playersBoughtTemp, function(i, player){
            increaseBankBalance(player.marketValue);
        });
        playersBoughtTemp = {}
    }

    $("#playersTMTable1 tbody").html("");
    $("#playersTMTable2 tbody").html("");

    var rowNumber  = 1;
    $.each(allPlayersSorted, function (i, player) {
        if(player.position !== position) return;
        newRowContent = "<tr class='playerRow' id='" + player._id + "'>" +
            "<th scope='row'>" + rowNumber + "</th>" +
            "<td>" + player.name + "</td>" +
            "<td>" + player.age + "</td>" +
            "<td>" + player.skill + "</td>" +
            "<td>" + numberToMoney(player.marketValue) + "</td>" +
            "</tr>";
        // console.log(i, rowNumber);
        rowNumber < 16 ? $(newRowContent).appendTo($("#playersTMTable1 tbody")) : $(newRowContent).appendTo($("#playersTMTable2 tbody"));

        rowNumber++;
    });

    $.each(manager.players, function (i, id) {
        $("#"+id).addClass("disabledPlayerRow");
    });

    $(".playerRow").click(function(){
        buyPlayersTemp(this);
    });
};

saveSession = function(){
    session.lastSave = new Date();
    $.when(
        $.ajax({
            url: "http://localhost:3000/api/managers/" + manager._id,
            type: "PATCH",
            data: manager,
            success: function(response){
                console.log("manager saved", response.data);
            }
        }),
        $.ajax({
            url: "http://localhost:3000/api/sessions/" + session._id,
            type: "PATCH",
            data: session,
            success: function(response){
                console.log("session saved", response.data);
            }
        })
    ).then(function(){
        $.get("html/modals/modal.html", function (data) {
            $("#modalContainer").html(data);
            $("#modalContainer").modal('show');
        });

    });
};
onShowLoadSessionModal = function () {

    $.get("html/modals/loadSessionModal.html", function (data) {
        $("#modalContainer").html(data);
        $("#modalContainer").modal('show');

        $.get("http://localhost:3000/api/sessions/", function (data) {

            let sessionArray = data.data;
            $.each(sessionArray, function (index, session) {
                var newListItemHtml = "<a class='list-group-item list-group-item-action d-flex' data-toggle='list' href='#'>"+
                    "<div class='flex-fill'>" + session.name + "</div>" +
                    "<div><span class='badge badge-pill badge-info'>" + session.lastSave + "</span></div>" +
                    "</a>";
                $("#sessionList").append(newListItemHtml);
            });

            $("#loadSessionButton").one("click", function () {
                let activeSessionItem = $("#sessionList").find(".active");
                let index = activeSessionItem.index();
                session = sessionArray[index];
                loadManager(sessionArray[index].manager);
                // $.get("http://localhost:3000/api/managers/" + sessionArray[index].manager, function (data) {
                //     console.log(data.data);
                //     manager = data.data;
                //     loadPlayers();
                //     enableMenuItems();
                //     setBalanceDisplay();
                //     $("#pageContainer").html("Session " + session.name + " wurde geladen");
                // });
            })
        })



    });
};

onSubmitNewSession = function() {
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
