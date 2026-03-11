import {clearLocalStorage, seeCachedDataSize, populateNews, populateRaceTable, updateRaceTimer} from './functionHelpers.js'

async function init() {
    updateRaceTimer();
    await populateRaceTable();
    await populateNews();
    setInterval(updateRaceTimer, 60000);

    /* UNCOMMENT THIS TO SEE CACHED DATA SIZE v v v */
    //seeCachedDataSize();

    /* UNCOMMENT THIS TO CLEAR CACHE v v v */
    //clearLocalStorage();
}

init();
