import {populateTableOfTeams, populateYearDropdownTeams} from './functionHelpers.js'

console.log('TEAMS PAGE');

async function init() {
    populateTableOfTeams();
    populateYearDropdownTeams();
}

init();
