import {populateCircuitsTable, populateYearDropdownCircuits} from './functionHelpers.js'

async function init() {
    populateCircuitsTable();
    populateYearDropdownCircuits();
}

init();
