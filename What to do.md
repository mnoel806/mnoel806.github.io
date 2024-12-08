We need to write down what to do. Make a flowchart, steps to do it. You will get less lost. 
You will always be alone and need to rely on this skill to be useful. There is a limit to how many
times one can ask for help.

HOW I UNDERSTAND THE ASSIGNMENT

Needs:
1 page = index.html
    2 views - Home and Races
    3? popups - Favs / Drivers / Constructors / Circuits
Fetches API data and stores in LocalStorage
No new page loads, dynamic view swaps

Make Skeleton for html
    define containers for each view: Home and Races
    containers for popups (modals)

**Made Base html
made home view div
made races view div
made driver modal
made constructor div
made circuit div**
made a div for favs

id and test API endpoint
    urlRaces = /races.php?
    urlDrivers = /drivers.php?
    urlResults = /results.php?

Views:
    Home: select statement with years for seaosn to select
    Races: displays a select list of races sorted by round. on select, show race details
    Popups: Details for drivers, constructors, and circuits + fav button

Data Handling:
    Fetch and store API into localstorage
    using JSON.parse (to store) and JSON.stringify (to retrieve)

Then event handling and interactivity
    What happens when select(season) is clicked, then select(races), then w/e
    Event listeners work for view toggling and modals


Functions we need:

    Fetching:

        getDataAndSaveIt(url)

    showView(viewId)

    displayRaceList(raceData)

    displayRaceDetails(raceId)

    toggleFavs(itemId, type)

    sortData(dataList, index)
