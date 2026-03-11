import {populateDriversTable, populateYearDropdown} from './functionHelpers.js'

async function init() {
    populateDriversTable();
    populateYearDropdown();
}

init();
