
function MyClass(session, manager, allPlayers, allPlayersSorted) {

    var newRowContent = "";
    var newPlayersPosition;
    let playersBoughtTemp = {};

    var self = this;


    $(document).ready(function () {

        $('#createNewSessionDropdown').click(function(e) {
            e.preventDefault();
            // $("#pageContainer").load("html/newSession.html");
            $.get("html/modals/newSessionModal.html", function (data) {
                $("#modalContainer").html(data);
                $("#modalContainer").modal('show');
            });

        });
        $('#saveSessionDropdown').click( function(e) {
            e.preventDefault();
            if($(e.currentTarget).hasClass("disabled")) return;
            self.saveSession();
        });
        $('#loadSessionDropdown').click( function(e) {
            e.preventDefault();
            self.loadSession();
        });
        $('#createNewPlayerDropdown').click( function(e) {
            e.preventDefault();
            $("#pageContainer").load("html/newPlayer.html");
        });

        $('#buyPlayerDropdown').click( function(e) {
            e.preventDefault();
            $("#pageContainer").load("html/transferMarket.html", function () {
                self.showPlayersOfType("Tor");
            });
        });

        $("#aufstellungDropdown").click(function (e) {
            e.preventDefault();

            $("#pageContainer").load("html/team.html", function () {
                $.each(manager.players, function (i, id) {
                    var player = allPlayers[id];
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
            });
        });

        $(".nav .nav-link").on("click", function(){
            $(".nav").find(".active").removeClass("active");
            $(this).addClass("active");
        });

        $("#trainingDropdown").click(function (e) {
            e.preventDefault();
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


    function buyPlayersTemp(selectedPlayerRow) {

        $(selectedPlayerRow).toggleClass("table-primary tempSelected");

        var playerId = $(selectedPlayerRow).attr('id');
        var player = allPlayers[playerId];

        if($(selectedPlayerRow).hasClass("tempSelected")){
            decreaseBankBalance(player.marketValue);
            playersBoughtTemp[player._id] = player;
        }else{
            increaseBankBalance(player.marketValue)
            delete playersBoughtTemp[player._id];
        }
    }
    function sellPlayersTemp(selectedPlayerRow) {
        $(selectedPlayerRow).toggleClass("table-primary tempSelected");

        var playerId = $(selectedPlayerRow).attr('id');
        var player = allPlayers[playerId];

        if($(selectedPlayerRow).hasClass("tempSelected")){
            increaseBankBalance(player.marketValue)
            playersBoughtTemp[player._id] = player;
        }else{
            decreaseBankBalance(player.marketValue)
            delete playersBoughtTemp[player._id];
        }
    }



    function setPlayerPosition(value) {
        newPlayersPosition = value;
    }
    function increaseBankBalance(value){
        manager.bankBalance += value;
        setBalanceDisplay();
    }
    function decreaseBankBalance(value){
        manager.bankBalance -= value;
        setBalanceDisplay();
    }
    function setBalanceDisplay() {
        var financialValue = Number(manager.bankBalance).toLocaleString('de') + " \u20AC";
        $("footer .balanceDisplay").text(financialValue);
    }
    function numberToMoney(number) {
        return Number(number).toLocaleString('de') + " \u20AC"
    }



    //--------------Public Methods--------------//
    this.buyPlayersFix = function() {

        if(Object.keys(playersBoughtTemp).length){
            $.each(playersBoughtTemp, function(i, player){
                manager.players.push(player._id);
                $("#" + player._id).addClass("disabledPlayerRow")
                    .removeClass("table-primary tempSelected");
            });
            playersBoughtTemp = {}
        }



    };

    this.sellPlayersFix = function () {
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


    this.showPlayersOfType = function(position){

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

    this.saveSession = function(){
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
    this.loadSession = function () {
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
                    $.get("http://localhost:3000/api/managers/" + sessionArray[index].manager, function (data) {
                        console.log(data.data);
                        manager = data.data;
                        session = sessionArray[index];
                        setBalanceDisplay();
                    });
                })
            })
        });
    }

}