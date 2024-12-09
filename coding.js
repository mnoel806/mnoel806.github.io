document.addEventListener("DOMContentLoaded",  () => {
    // All the code to go here

    const seasons = [2020, 2021, 2022, 2023];
    
    
    // const urlCircuits = `https://www.randyconnolly.com/funwebdev/3rd/api/f1/circuits.php`;
    // const urlConstructors = `https://www.randyconnolly.com/funwebdev/3rd/api/f1/constructors.php`;
    // const urlDrivers = `https://www.randyconnolly.com/funwebdev/3rd/api/f1/drivers.php`;
    
    // I really only need these
    // const urlResults = `https://www.randyconnolly.com/funwebdev/3rd/api/f1/results.php`;
    // const urlQualify = `https://www.randyconnolly.com/funwebdev/3rd/api/f1/qualifying.php`;
    // const urlRaces = `https://www.randyconnolly.com/funwebdev/3rd/api/f1/races.php`; 


    // console.log("Seasons array:", seasons);

    //populate seasons
    populateSeasons(seasons);
    // populateRaces(races);

    document.querySelector("#season-select").addEventListener('change', async (e) => {
        const selSeason = e.target.value;
    
        if (selSeason) {
            console.log(`Selected season: ${selSeason}`);

            const races = await fetchRaceData(selSeason);
            // You can now fetch race data for the selected season or update the view
            populateRaces(races);
        } else {
            console.log('No season selected');
        }
    });

    // This section is to handle race selection change
    document.querySelector('#race-select').addEventListener('change', async (event) => {
        const selRaceId = event.target.value;

        if (selRaceId) {
            console.log(`Fetching details for race ID: ${selRaceId}`);
            
            // Fetch the race details (qualifying and results)
            const raceDetails = await fetchRaceDetails(selRaceId);

            // Display the race details
            displayRaceDetails(raceDetails);
        }
    });

    document.querySelector('#close-driver-popup').addEventListener('click', () => {
        const driverPopup = document.querySelector('#driver-popup');
        driverPopup.close();
    });
    document.querySelector('#close-constructor-popup').addEventListener('click', () => {
        const constructorPopup = document.querySelector('#constructor-popup');
        constructorPopup.close();
    });
    document.querySelector('#close-circuit-popup').addEventListener('click', () => {
        const circuitPopup = document.querySelector('#circuit-popup');
        circuitPopup.close();
    });
    
}); // This is the end of the DOM load. Should always be });



//Fucntions called AFTER DOM stuff
//They should get used in order 
function populateSeasons(seasons) {
    const seasonSelect = document.querySelector('#season-select');

    seasonSelect.innerHTML = '<option value="">--Choose a Season--</option>';
    //adding each season as an option
    seasons.forEach((season) => {
        const opt = document.createElement('option');
        opt.value = season;
        opt.textContent = season;
        seasonSelect.appendChild(opt);
    });
    // console.dir(seasonSelect);
}

//this checks it see if data in LS, then uses LS, or fetches from API then saves to LS
async function fetchRaceData(season){
    const storedData = localStorage.getItem(`races_${season}`);
// console.dir(storedData);
    if (storedData) {
        console.log(`Using the data cache for season ${season}`);
        return JSON.parse(storedData); //here be a list of races
    }
    try {
        console.log(`Fetching data for season ${season}`);
        const response = await fetch(`https://www.randyconnolly.com/funwebdev/3rd/api/f1/races.php?season=${season}`);
        const raceData = await response.json();
        localStorage.setItem(`races_${season}`, JSON.stringify(raceData));
        return raceData;
    } catch (e) {
        console.error(`Failed to fetch data for season ${season}:`, e);
        return [];
    }
}


async function populateRaces(races) {
    const raceSelect = document.querySelector("#race-select");

    // unhide and clear old info
    raceSelect.disabled = false;
    raceSelect.textContent = '<option value="">--Choose a Race--</option>';
    //then display the data
    races.forEach((race) => {
        const option = document.createElement('option');
        option.value = race.id;
        option.textContent = race.name;
        raceSelect.appendChild(option);
    });
}

async function fetchRaceDetails(raceId) {
    try {
        const qualifyingResponse = await fetch(`https://www.randyconnolly.com/funwebdev/3rd/api/f1/qualifying.php?race=${raceId}`);
        const resultsResponse = await fetch(`https://www.randyconnolly.com/funwebdev/3rd/api/f1/results.php?race=${raceId}`);
        
        const qualifyingData = await qualifyingResponse.json();
        const raceResultsData = await resultsResponse.json();

        return {
            qualifying: qualifyingData,
            raceResults: raceResultsData
        };
    } catch (e) {
        console.log('Error fetching race\'s details:', e);
        return null;
    }
}

function displayRaceDetails(raceDetails) {
    // const qualifyingList = document.querySelector('#qualifying-list');
    const qualifyingList = document.querySelector('#qualifying-results-table');
    const raceResultsList = document.querySelector('#race-results-table');
    // const raceNameBox = document.querySelector('#selectedRaceName');

    // Clears previous content
    qualifyingList.innerHTML = '';
    raceResultsList.innerHTML = '';
    // raceNameBox.innerHTML = '';

    console.log(raceDetails);
    if (raceDetails) {

        //v1 with Li elements
        // Display Qualifying Results
        // raceDetails.qualifying.forEach(q => {
        //     const li = document.createElement('li');
        //     li.classList.add("driver-name");
        //     li.value = q.driver.id;
        //     li.textContent = `${q.position}. ${q.driver.forename} ${q.driver.surname} (${q.constructor.name}) - [Q1: ${q.q1} - Q2: ${q.q2} - Q3: ${q.q3}]`;
        //     qualifyingList.appendChild(li);
        // });

        //v2 This time as a table
        raceDetails.qualifying.forEach(q => {
            const rowq = document.createElement('tr');
            //This make it so when click on driver name, open driver modal, and display that driver's details
            rowq.innerHTML = `
                <td>${q.position}</td>
                <td class="driver-name" data-driver-id="${q.driver.id}">${q.driver.forename} ${q.driver.surname}</td>
                <td>${q.constructor.name}</td>
                <td>${q.q1}</td>
                <td>${q.q2}</td>
                <td>${q.q3}</td>
            `;
            qualifyingList.appendChild(rowq);
        });

        raceDetails.raceResults.forEach(r => {
            const rowr = document.createElement('tr');
            //This make it so when click on driver name, open driver modal, and display that driver's details
            rowr.innerHTML = `
                <td>${r.position}</td>
                <td class="driver-name" data-driver-id="${r.driver.id}">${r.driver.forename} ${r.driver.surname}</td>
                <td>${r.constructor.name}</td>
                <td>${r.laps}</td>
                <td>${r.points}</td>
            `;
            raceResultsList.appendChild(rowr);
        });

        document.querySelectorAll('.driver-name').forEach(driveElement => {
            driveElement.addEventListener('click', async (e) => {
                console.log(driveElement);
                const driveId = e.target.id;

                // Fetch and display driver details
                const driveData = await fetchDriverDetails(driveId);
                populateDriverModal(driveData);
            });
        });

    } else {
        qualifyingList.innerHTML = '<li>No qualifying results available.</li>';
        raceResultsList.innerHTML = '<li>No race results available.</li>';
    }
}

/////////////////////////////////////////////////////////////////////
//Making the Modals Work
    // `https://www.randyconnolly.com/funwebdev/3rd/api/f1/drivers.php`

    //Something to go get the driver's information
    async function fetchDriverDetails(driveId) {
        //Check storage for data
        const storedDriveData = localStorage.getItem(`driver_${driveId}`);
        if (storedDriveData) {
            return JSON.parse(storedDriveData);
        }

        else { //else go get it
            try {
                const driveResp = await fetch(`https://www.randyconnolly.com/funwebdev/3rd/api/f1/drivers.php?id=${driveId}`);
            
                const driveData = await driveResp.json();
                localStorage.setItem(`driver_${driveId}`, JSON.stringify(driveData));

                return driveData; // Returns the driver's detailed info
            } catch (e) {
                console.error('Error fetching driver\'s details:', e);
                return null;
            }
        }
    }

    //load the driver data into the modal and display it
    function populateDriverModal(driveData){
        const driverTable = document.querySelector('#driver-details-table');
        driverTable.innerHTML = ''; //Empties it all
        console.log(driveData);

        if (driveData) {
            driveData.forEach( d  => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${d.forename} ${d.surname}</td>
                    <td>${d.dob}</td>
                    <td>${d.code}</td>
                    <td>${d.nationality}</td>
                    <td>${d.url}</td>
                `;
            //     row.innerHTML = `
            //         <td>${key}</td>
            //         <td>${value}</td>
            // `;
                driverTable.appendChild(row);
            });
            // Show the modal
            const driverPopup = document.querySelector('#driver-popup');
            driverPopup.showModal();
        }
    }


    //Something to go get the constructor's information
    async function fetchConstructorDetails(constructorId) {
        try {
            const constructorResp = await fetch(`https://www.randyconnolly.com/funwebdev/3rd/api/f1/constructors.php?id=${constructorId}`);
        
            const constructorData = await constructorResp.json();
            return constructorData; // Returns the constructor's detailed info
        } catch (e) {
            console.error('Error fetching constructor\'s details:', e);
            return null;
        }
    }

    function populateConstructorModal(constructorData){
        const constructorTable = document.querySelector('#constructor-details-table');
        constructorTable.innerHTML = ''; //Empties it all
        console.log(constructorData);
    }

    //Something to go get the circuit's information
    async function fetchCircuitDetails(circuitId) {
        try {
            const circuitResp = await fetch(`https://www.randyconnolly.com/funwebdev/3rd/api/f1/constructors.php?id=${circuitId}`);
        
            const circuitData = await circuitResp.json();
            return circuitData; // Returns the circuit's detailed info
        } catch (e) {
            console.error('Error fetching circuit\'s details:', e);
            return null;
        }
    }   
    function populateCircuitModal(circuitData){
        const circuitTable = document.querySelector('#circuit-details-table');
        circuitTable.innerHTML = ''; //Empties it all
        console.log(circuitData);
    }


/////////////////////////////////////////////////////////////


// All the other attempts and code and what not,
//  It was better to pause and start with a plan
// //Everything to load and display selected races
// function displayRaceList(races) {
//     const raceDataBox = document.querySelector('#race-list');

//     // This empties the previous content
//     raceDataBox.innerHTML = '';

//     //mostly for troubleshooting purposes
//     if (races.length === 0) {
//         raceDataBox.textContent = 'No races found for this season.';
//         return;
//     }
//     //using .map for the race stats
//     const raceElements = races.map((race) => {
//         return `<div>
//             <h3>${race.name}</h3>
//             <p>Round: ${race.round}</p>
//             <p>Date: ${race.date}</p>
//         </div>`;
//     });

//     // Adds these race elements to the DOM
//     raceDataBox.innerHTML = raceElements.join('');
// }

// async function loadRaceDetails(raceId) {
//     const season = document.querySelector('#season-select').value;
//     const races = await fetchRaceData(season);
//     const selectedRace = races.find((race) => race.raceId == raceId);

//     if (selectedRace) {
//         displayRaceDetails(selectedRace);
//     }
// }

// function displayRaceDetails(race) {
//     const raceDetailsBox = document.querySelector('#race-details');
//     raceDetailsBox.textContent = `
//         <h2>${race.raceName}</h2>
//         <p><strong>Round:</strong> ${race.round}</p>
//         <p><strong>Date:</strong> ${race.date}</p>
//         <p><strong>Circuit:</strong> ${race.Circuit.circuitName}</p>
//         <p><strong>Location:</strong> ${race.Circuit.Location.locality}, ${race.Circuit.Location.country}</p>
//         <p><strong>Lap Count:</strong> ${race.laps}</p>
//     `;
// }

// A Promise.all Version
// function getSeasonData(season){
//     let prom1 = fetch(urlRaces+season).then(resp=>resp.json())
//     let prom2 = fetch(urlResults+season).then(resp=>resp.json())
//     let prom3 = fetch(urlQualify+season).then(resp=>resp.json())
//     return Promise.all(prom1, prom2, prom3);
// }
// let resultsData;
// let qualifyingData;
// let raceData3 = localStorage.getItem("races");
// if(!raceData3){
//     getSeasonData().then(data =>{
//         displayRaces(data[0]);
//         resultsData = data[1];
//         qualifyingData = data[2];
//         //save in localStorage
//         localStorage.setItem("races",JSON.stringify(data[0]));
//         localStorage.setItem("results", JSON.stringify(data[1]));
//         localStorage.setItem("qualifying",JSON.stringify(data[2]));
//     })
// } else {
//     resultsData = JSON.parse(localStorage("results"));
//     qualifyingData = JSON.parse(localStorage("qualifying"));
//     displayRaces(JSON.parse(data));
// }