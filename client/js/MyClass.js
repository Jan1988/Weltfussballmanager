
function MyClass(session, team, allPlayers, allPlayersSorted) {

    var newRowContent = "";
    var newPlayersPosition;

    var self = this;


    $(document).ready(function () {

        $('#createNewSessionDropdown').click( function(e) {
            e.preventDefault();
            $("#pageContainer").load("html/newSession.html");
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
                $.each(team.players, function (i, id) {
                    var player = allPlayers[team.players[i]];
                    newRowContent = "<tr class='playerRow' id='" + player.id + "'>" +
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


        $("#trainingDropdown").click(function () {
            e.preventDefault();
        });
    });


    function buyPlayersTemp(selectedPlayerRow) {

        var playerId = $(selectedPlayerRow).attr('id');
        var player = allPlayers[playerId];

        var isInTeam = team.players.find(function (id) {
            return id === playerId;
        });

        if(isInTeam){
            session.bankBalance += player.marketValue;
            // delete playersBoughtTemp[player.id];
            const index = team.players.indexOf(player.id);
            if (index > -1) {
                team.players.splice(index, 1);
            }
        }else{
            session.bankBalance -= player.marketValue;
            // playersBoughtTemp[player.id] = player;
            team.players.push(playerId);
        }
        $(selectedPlayerRow).toggleClass("table-primary");

        updateBalanceDisplay();
    }



    function setPlayerPosition(value) {
        newPlayersPosition = value;
    }
    function updateBalanceDisplay() {
        $("footer .balanceDisplay").text(Number(session.bankBalance).toLocaleString('de') + " \u20AC");
    }




    //--------------Public Methods--------------//
    this.buyPlayersFix = function() {

        // var buyPlayersFixArr = [];
        // $.each(playersBoughtTemp, function (i, player) {
        //     buyPlayersFixArr.push(player.id)
        // });


        $.ajax({
            url: "http://localhost:3000/api/teams/" + team._id,
            type: "PATCH",
            data: team,
            success: function(response){
                // var successMessageString = "Spieler " + response.data.name + " wurde erfolgreich dem Team hinzugefügt";
                // var successMessageHtml = "<div class='row'>"+
                //     "<div class='col'>"+
                //     "<span>" + successMessageString + "</span>"+
                //     "</div>"+
                //     "</div>";
                // $("#pageContainer").append(successMessageHtml);
                // $(".successMessage").text();
            }
        }).done(function (data) {
            $.each(team.players, function (i, id) {
                $("#"+id).addClass("disabledPlayerRow")
                    .removeClass("table-primary");
            });
        });

        playersBoughtTemp = {};
    };
    this.showPlayersOfType = function(position){
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
                "<td>" + Number(player.marketValue).toLocaleString('de') + " \u20AC"  + "</td>" +
                "</tr>";
        // console.log(i, rowNumber);
            rowNumber < 16 ? $(newRowContent).appendTo($("#playersTMTable1 tbody")) : $(newRowContent).appendTo($("#playersTMTable2 tbody"));

            rowNumber++;
        });

        $.each(team.players, function (i, id) {
            $("#"+id).addClass("disabledPlayerRow");
        });

        $(".playerRow").click(function(){
            buyPlayersTemp(this);
        });

    };
}