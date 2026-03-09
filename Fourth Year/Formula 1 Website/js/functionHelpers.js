import * as api from './apiHelper.js';

export function clearLocalStorage(){
    localStorage.clear();
    console.log("CACHE CLEARED!!!!");
}
export function seeCachedDataSize(){
    var _lsTotal = 0,
    _xLen, _x;
    console.log();
    console.log("CACHED DATA:");
    for (_x in localStorage) {
        if (!localStorage.hasOwnProperty(_x)) {
            continue;
        }
        _xLen = ((localStorage[_x].length + _x.length) * 2);
        _lsTotal += _xLen;
        console.log(_x.substr(0, 50) + " = " + (_xLen / 1024).toFixed(2) + " KB")
    };
    console.log("Total = " + (_lsTotal / 1024).toFixed(2) + " KB");
}
/*

    ---------------- INDEX HTML FUNCTIONS ----------------
    
*/
export async function populateRaceTable() {
    const tableBody = document.querySelector('.tableSchedule tbody');
    while (tableBody.firstChild) {
        tableBody.removeChild(tableBody.firstChild);
    }

    const data = await api.getRaceSched();
    console.log(data);
    const races = data.MRData.RaceTable.Races;
    const currentDate = new Date();

    races.forEach((race) => {
        const newRow = document.createElement('tr');
        const roundCell = document.createElement('td');
        roundCell.textContent = race.round;
        newRow.appendChild(roundCell);
        const raceDate = new Date(race.date);
        const options = { month: 'short', day: 'numeric' };
        const formattedDate = `${raceDate.toLocaleDateString('default', options)} - ${raceDate.getDate() + 2}`;

        const dateCell = document.createElement('td');
        dateCell.textContent = formattedDate;
        newRow.appendChild(dateCell);

        const raceNameCell = document.createElement('td');
        const raceLink = document.createElement('a');
        raceLink.textContent = race.raceName;
        raceLink.href = race.url;
        // console.log(api.getWikiData(race.url));
        raceLink.target = '_blank';
        raceNameCell.appendChild(raceLink);
        newRow.appendChild(raceNameCell);

        const venueCell = document.createElement('td');
        venueCell.textContent = race.Circuit.circuitName;
        newRow.appendChild(venueCell);

        const statusCell = document.createElement('td');

        if (raceDate > currentDate) {
            statusCell.textContent = 'Upcoming';
        } else {
            statusCell.textContent = 'Completed';
        }

        newRow.appendChild(statusCell);
        tableBody.appendChild(newRow);
    });
}

export async function updateRaceTimer() {
    const nowTime = new Date();
    console.log("UPDATE RACE TIMER CALLED: "+nowTime.getHours()+":"+nowTime.getMinutes());
    const data = await api.getRaceSched();
    const races = data.MRData.RaceTable.Races;

    const nextRaceTag = document.getElementById("nextEvent");
    const nextRaceTym = document.getElementById("dateGP");
    const nextRaceLink = document.getElementById("mainTitleLink");

    let now = new Date();
    //GET NEXT RACE
    let nextRace = races.find(race => new Date(race.date + "T" + race.time) > now);

    if (nextRace) {
        let timeToNextRace = timeDifference(new Date(nextRace.date + "T" + nextRace.time));
        updateTimer(timeToNextRace);

        let raceName = nextRace.raceName;
        let raceUrl = nextRace.url;
        let raceDate = nextRace.date;
        let raceTime = nextRace.time;
        const date = new Date(raceDate);
        const formattedDate = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        console.log(formattedDate);

        console.log(`Next Race: ${raceName}, Date: ${raceDate}, Time: ${raceTime}, URL: ${raceUrl}`);

        nextRaceLink.href = raceUrl;
        nextRaceTag.innerHTML = raceName;
        nextRaceTym.innerHTML = formattedDate;

    }
}


//this function will get the time 2day (using local lamang because fuck it)
//and compare with the time in the arg
//and return array of difference fo the days hours and minutes
function timeDifference(endDate) {
    let now = new Date();
    let diff = endDate.getTime() - now.getTime(); 

    if (diff <= 0) return null;

    let days = Math.floor(diff / (1000 * 60 * 60 * 24));
    let hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    let minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    return { days, hours, minutes };
}

function updateTimer(time) {
    if (!time) return;

    document.querySelector('.number.days').textContent = String(time.days).padStart(2, '0');
    document.querySelector('.number.hours').textContent = String(time.hours).padStart(2, '0');
    document.querySelector('.number.minutes').textContent = String(time.minutes).padStart(2, '0');
}

/*

    ---------------- STANDINGS HTML FUNCTIONS ----------------

*/

export async function populateDriverStandingsTable(){
    const tableBody = document.querySelector('.drivers tbody');

    // Removing placeholder values
    while (tableBody.firstChild) {
        tableBody.removeChild(tableBody.firstChild);
    }

    // Fetching standings data
    const data = await api.getDriverStandings(2023);
    const standingsList = data.MRData.StandingsTable.StandingsLists[0].DriverStandings;

    standingsList.forEach(driver => {
        const row = tableBody.insertRow();

        const positionCell = row.insertCell(0);
        positionCell.textContent = driver.position;

        const driverNameCell = row.insertCell(1);
        driverNameCell.innerHTML = `<div class="driverImgContainer"><img src="../assets/driver_num/${driver.Driver.code}.png" alt="driverNum"></div>${driver.Driver.givenName} ${driver.Driver.familyName}`;

        const teamNameCell = row.insertCell(2);
        teamNameCell.innerHTML = `<div class="teamImgContainer"><img src="../assets/constructor_logo/${driver.Constructors[0].constructorId}.png" alt="constructorLogo" class="logo"></div>${driver.Constructors[0].name}`;

        const racesWonCell = row.insertCell(3);
        racesWonCell.textContent = driver.wins;

        const pointsCell = row.insertCell(4);
        pointsCell.textContent = driver.points;
    });
}

let sortState = {
    driver: 'asc',
    team: 'asc',
    position: 'asc'
};

export function sortTable(sortBy) {
    const tableBody = document.querySelector('.drivers tbody');
    const rows = Array.from(tableBody.querySelectorAll('tr'));

    rows.sort((a, b) => {
        let cellA, cellB;
        switch (sortBy) {
            case 'driver':
                cellA = a.cells[1].textContent.trim().toLowerCase();
                cellB = b.cells[1].textContent.trim().toLowerCase();
                break;
            case 'team':
                cellA = a.cells[2].textContent.trim().toLowerCase();
                cellB = b.cells[2].textContent.trim().toLowerCase();
                break;
            case 'position':
                cellA = Number(a.cells[0].textContent.trim());
                cellB = Number(b.cells[0].textContent.trim());
                break;
        }

        if (sortState[sortBy] === 'asc') {
            return cellA > cellB ? 1 : -1;
        } else {
            return cellA < cellB ? 1 : -1;
        }
    });

    sortState[sortBy] = sortState[sortBy] === 'asc' ? 'desc' : 'asc';

    while (tableBody.firstChild) {
        tableBody.removeChild(tableBody.firstChild);
    }

    rows.forEach(row => tableBody.appendChild(row));
}
export async function populateConstructorStandingsTable(){
    const tableBody = document.querySelector('.constructors tbody');

    // Removing placeholder values
    while (tableBody.firstChild) {
        tableBody.removeChild(tableBody.firstChild);
    }

    // Fetching standings data
    const data = await api.getConstructorStandings(2023);
    const standingsList = data.MRData.StandingsTable.StandingsLists[0].ConstructorStandings;

    standingsList.forEach(constructor => {
        const row = tableBody.insertRow();

        const positionCell = row.insertCell(0);
        positionCell.textContent = constructor.position;

        const teamNameCell = row.insertCell(1);
        teamNameCell.innerHTML = `<div class="teamImgContainer"><img src="../assets/constructor_logo/${constructor.Constructor.constructorId}.png" alt="constructorLogo" class="logo"></div>${constructor.Constructor.name}`;

        const winsCell = row.insertCell(2);
        winsCell.textContent = constructor.wins;

        const pointsCell = row.insertCell(3);
        pointsCell.textContent = constructor.points;
    });
}

export function sortConstructorTable(sortBy) {
    const tableBody = document.querySelector('.constructors tbody');
    const rows = Array.from(tableBody.querySelectorAll('tr'));

    rows.sort((a, b) => {
        let cellA, cellB;
        switch (sortBy) {
            case 'team':
                cellA = a.cells[1].textContent.trim().toLowerCase();
                cellB = b.cells[1].textContent.trim().toLowerCase();
                break;
            case 'position':
                cellA = Number(a.cells[0].textContent.trim());
                cellB = Number(b.cells[0].textContent.trim());
                break;
            case 'wins':
                cellA = Number(a.cells[2].textContent.trim());
                cellB = Number(b.cells[2].textContent.trim());
                break;
        }

        if (sortState[sortBy] === 'asc') {
            return cellA > cellB ? 1 : -1;
        } else {
            return cellA < cellB ? 1 : -1;
        }
    });

    sortState[sortBy] = sortState[sortBy] === 'asc' ? 'desc' : 'asc';

    while (tableBody.firstChild) {
        tableBody.removeChild(tableBody.firstChild);
    }

    rows.forEach(row => tableBody.appendChild(row));
}

/*

    ---------------- DRIVERS HTML FUNCTIONS ----------------
    
*/
export async function populateDriversTable(year = new Date().getFullYear()) {
    console.log("YEAR READ: "+year);
    const tableBody = document.querySelector('.tableDrivers tbody');
    while (tableBody.firstChild) {
        tableBody.removeChild(tableBody.firstChild);
    }

    const data = await api.getDriversInfo(year);
    const drivers = data.MRData.DriverTable.Drivers;

    drivers.forEach((driver) => {
        const newRow = document.createElement('tr');

        const driverIdCell = document.createElement('td');
        if(driver.code){
            driverIdCell.textContent = driver.code;
        }
        else{
            driverIdCell.textContent = "N/A";
        }
        newRow.appendChild(driverIdCell);

        const driverNameCell = document.createElement('td');
        const driverLink = document.createElement('a');
        driverLink.textContent = `${driver.givenName} ${driver.familyName}`;
        driverLink.href = driver.url;
        // console.log(wikipediaUrlToApi(driver.url));
        driverLink.target = '_blank';
        driverNameCell.appendChild(driverLink);
        newRow.appendChild(driverNameCell);

        const nationalityCell = document.createElement('td');
        nationalityCell.textContent = driver.nationality;
        newRow.appendChild(nationalityCell);
        tableBody.appendChild(newRow);
    });
}

// Populate the year dropdown and set the event listener
export function populateYearDropdown() {
    const currentYear = new Date().getFullYear();
    const yearSelector = document.getElementById("driversSelector");
    const infoBox = document.getElementById("aboutSeasonSection");
    api.getWikiData(api.yearToF1WikiApiUrl(currentYear))
        .then(data => {
            infoBox.innerHTML = data; 
        })

    for(let i = 1950; i <= 2023; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = i;
        yearSelector.appendChild(option);
    }

    yearSelector.addEventListener('change', function() {
        console.log("YEAR CHOSEn: "+this.value);
        populateDriversTable(this.value);

        //todo enclose this in a method in apiHelper.js inaantok na ako valorant tym
        api.getWikiData(api.yearToF1WikiApiUrl(this.value))
        .then(data => {
            infoBox.innerHTML = data; 
        })
    });

    yearSelector.value = currentYear;
}

/*

    ---------------- TEAMS HTML FUNCTIONS ----------------

*/

export async function populateTableOfTeams(year = new Date().getFullYear()) {
    console.log("YEAR READ: " + year);
    const tableBody = document.querySelector('.tableTeams tbody');
    while (tableBody.firstChild) {
        tableBody.removeChild(tableBody.firstChild);
    }

    const data = await api.getConstructorsInfo(year);
    const constructors = data.MRData.ConstructorTable.Constructors;

    constructors.forEach((constructor) => {
        const newRow = document.createElement('tr');

        const teamNameCell = document.createElement('td');
        const teamLink = document.createElement('a');
        teamLink.textContent = constructor.name;
        teamLink.href = constructor.url;
        teamLink.target = '_blank';
        teamNameCell.appendChild(teamLink)
        newRow.appendChild(teamNameCell);

        const nationalityCell = document.createElement('td');
        nationalityCell.textContent = constructor.nationality;
        newRow.appendChild(nationalityCell);

        tableBody.appendChild(newRow);
    });
}

// Populate the year dropdown and set the event listener
export function populateYearDropdownTeams() {
    const currentYear = new Date().getFullYear();
    const yearSelector = document.getElementById("teamsSelector");

    for(let i = 1950; i <= 2023; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = i;
        yearSelector.appendChild(option);
    }

    yearSelector.addEventListener('change', function() {
        console.log("YEAR CHOSEN: "+this.value);
        populateTableOfTeams(this.value);
    });

    yearSelector.value = currentYear;
}
/*

    ---------------- CIRCUITS HTML FUNCTIONS ----------------

*/
export async function populateCircuitsTable(year = new Date().getFullYear()){
    const tableBody = document.querySelector('.circuits tbody');
    while (tableBody.firstChild) {
        tableBody.removeChild(tableBody.firstChild);
    }

    console.log("HELLOOOOO: "+year);

    
    const data = await api.getCircuitsInfo(year);
    console.log(data);
    const CircuitList = data.MRData.CircuitTable.Circuits;

    CircuitList.forEach((circuits) => {
        const newRow = document.createElement('tr');

        const teamNameCell = document.createElement('td');
        const teamLink = document.createElement('a');
        teamLink.textContent = circuits.circuitName;
        teamLink.href = circuits.url;
        teamLink.target = '_blank';
        teamNameCell.appendChild(teamLink)
        newRow.appendChild(teamNameCell);

        const localityCell = document.createElement('td');
        localityCell.textContent = circuits.Location.locality;
        newRow.appendChild(localityCell);

        const countryCell = document.createElement('td');
        countryCell.textContent = circuits.Location.country;
        newRow.appendChild(countryCell);

        const mapsCell = document.createElement('td');
        const mapLink = document.createElement('a');
        mapLink.classList.add("mapLink");
        mapLink.target = '_blank'
        let lat = circuits.Location.lat;
        let long = circuits.Location.long;
        mapLink.href = `https://maps.google.com/?q=${lat},${long}`
        mapLink.textContent = "view";
        mapsCell.appendChild(mapLink);
        newRow.appendChild(mapsCell);
        
        tableBody.appendChild(newRow);
    });
}
// Populate the year dropdown and set the event listener
export function populateYearDropdownCircuits() {
    const currentYear = new Date().getFullYear();
    const yearSelector = document.getElementById("circuitSelector");

    for(let i = 1950; i <= currentYear; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = i;
        yearSelector.appendChild(option);
    }

    yearSelector.addEventListener('change', function() {
        console.log("YEAR CHOSEN: "+this.value);
        populateCircuitsTable(this.value);
    });

    yearSelector.value = currentYear;
}
/*

    ---------------- ITAGO NIYO TO KAY MAAM ----------------

*/
export async function populateNews(){
    const data = await api.getNews();
    
    console.log(data);

    let newsHead1 = data[0].title;
    let newsSource1 = data[0].source;
    let newsURL1 = data[0].url;

    let newsHead2 = data[1].title;
    let newsSource2 = data[1].source;
    let newsURL2 = data[1].url;

    document.getElementById('newsTitle1').innerHTML = newsHead1;
    document.getElementById('newsTitle2').innerHTML = newsHead2;

    document.getElementById('news1').href = newsURL1;
    document.getElementById('news2').href = newsURL2;

    document.getElementById('newsDesc1').innerHTML = "Source: "+newsSource1;
    document.getElementById('newsDesc2').innerHTML = "Source: "+newsSource2;

}