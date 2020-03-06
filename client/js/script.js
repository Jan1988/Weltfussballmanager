var session;
var manager;

var allPlayers = {};
var allPlayersSorted = [];

var newRowContent = "";
let playersBoughtTemp = {};

let defenceSkill = 0;
let offenseSkill = 0;

let formationArr = [0,0,0,0];

function toggleStarters(selectedPlayerRow) {
    let playerId = $(selectedPlayerRow).attr('id');
    let player = allPlayers[playerId];

    const index = manager.starters.indexOf(playerId);
    if (index > -1) {
        manager.starters.splice(index, 1);
    }else{
        if(manager.starters.length >= 11) return;
        debugger
        //TODO: maximale Anzahl Stümer, TOr, Abwehr, ... abfangen
        manager.starters.push(playerId);
    }
    $(selectedPlayerRow).toggleClass("table-primary");

    calculateStarterSkills();
    setFormationBadges();
}

function calculateStarterSkills(){
    defenceSkill = 0;
    offenseSkill = 0;
    formationArr = [0,0,0,0];

    $.each(manager.starters, function (i, playerId) {
        let player = allPlayers[playerId];

        switch (player.position) {
            case "Tor":
                defenceSkill += player.skill;
                formationArr[0]++;
                break;
            case "Abwehr":
                defenceSkill += player.skill * 0.75;
                offenseSkill += player.skill * 0.25;
                formationArr[1]++;
                break;
            case "Mittelfeld":
                defenceSkill += player.skill * 0.5;
                offenseSkill += player.skill * 0.5;
                formationArr[2]++;
                break;
            case "Sturm":
                offenseSkill += player.skill;
                formationArr[3]++;
                break;
            default:
                return;
        }
    });

    $("#defenceSkillSpan").text(defenceSkill);
    $("#offenseSkillSpan").text(offenseSkill);
    $("#startersCountDefence").text(formationArr[1]);
    $("#startersCountMidfield").text(formationArr[2]);
    $("#startersCountOffence").text(formationArr[3]);

}
function setFormationBadges() {
    $.each(manager.starters, function (index, player) {

    });
}


function buyPlayersTemp(selectedPlayerRow) {

    $(selectedPlayerRow).toggleClass("table-primary tempSelected");

    let playerId = $(selectedPlayerRow).attr('id');
    let player = allPlayers[playerId];

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
function increaseBankBalance(value){
    manager.bankBalance += value;
    setBalanceDisplay();
}
function decreaseBankBalance(value){
    manager.bankBalance -= value;
    setBalanceDisplay();
}
function setBalanceDisplay() {
    let financialValue;
    if(manager.bankBalance){
        financialValue = Number(manager.bankBalance).toLocaleString('de') + " \u20AC";
    }else{
        financialValue = " - ";
    }
    $("footer .balanceDisplay").text(financialValue);
}
function numberToMoney(number) {
    return Number(number).toLocaleString('de') + " \u20AC"
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

function enableMenuItems() {
    $("#navbarNavDropdown").find(".nav-link").removeClass("disabled");
    $("#saveSessionDropdown").removeClass("disabled");
    $("#exitSessionDropdown").removeClass("disabled");
}
function disabledMenuItems() {
    $("#navbarNavDropdown").find(".navbar-nav > :not(:first-child) > a").addClass("disabled");
    $("#saveSessionDropdown").addClass("disabled");
    $("#exitSessionDropdown").addClass("disabled");

}

function loadSession(index) {
    $.get("http://localhost:3000/api/sessions/", function (data) {
        session = data.data[index];
        loadManager(session.manager);
    });

}
function loadManager(managerId) {
    $.get("http://localhost:3000/api/managers/" + managerId, function (data) {
        console.log(data.data);
        manager = data.data;
        loadPlayers();
        enableMenuItems();
        setBalanceDisplay();
        $("#pageContainer").html("Session " + session.name + " wurde geladen");
    });

}
function loadPlayers() {
    allPlayers = {};
    allPlayersSorted = [];
    $.get("http://localhost:3000/api/players/", function (data) {
        // TODO: Array of Objects anlegen
        $.each(data.data, function (index, player) {
            allPlayers[player._id] = player;
            insertSort(player);
        });
    });
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

