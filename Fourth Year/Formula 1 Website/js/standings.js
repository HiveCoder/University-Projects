import {populateDriverStandingsTable, populateConstructorStandingsTable, sortTable, sortConstructorTable} from './functionHelpers.js'

console.log('standings page');

async function init() {
    await populateDriverStandingsTable();
    await populateConstructorStandingsTable();

    //ADD SORT FUNCTIONS FOR DRIVER TABLE
    document.getElementById('sortPos').addEventListener('click', () => {
        sortTable('position');
    });

    document.getElementById('sortDriv').addEventListener('click', () => {
        sortTable('driver');
    });

    document.getElementById('sortTeam').addEventListener('click', () => {
        sortTable('team');
    });

    //ADD SORT FUNCTIONS FOR CONSTRUCTORS TABLE
    document.getElementById('teamSortPos').addEventListener('click', () => {
        sortConstructorTable('position');
    });

    document.getElementById('teamSortTeam').addEventListener('click', () => {
        sortConstructorTable('driver');
    });

    document.getElementById('teamSortW').addEventListener('click', () => {
        sortConstructorTable('position');
    });

    document.getElementById('teamSortP').addEventListener('click', () => {
        sortConstructorTable('position');
    });
    


}

init();
