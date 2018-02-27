var filteredData = dataSet;
populateTable();

// DOM elements
var $search = document.getElementById('search');

// event listeners
$search.addEventListener('click',filterSightings);

function filterSightings(){
    console.log('search received');
    clearTable();
    applyFilters();
    console.log('filters applied');
    populateTable();
}

// Filters
function applyFilters(){
    // var intermediateDataSet = dataSet;
    // var $date = document.getElementById('date');
    // var $city = document.getElementById('city');
    // var $state = document.getElementById('state');
    // var $country = document.getElementById('country');  
    
    // var searches = {
    //     'datetime' : $date.value,
    //     'city' : $city.value,
    //     'state' : $state.value,
    //     'country' : $country.value
    // }  
    // for(k = 0; k < Object.keys(searches); k++){
    //     var searchField = Object.keys(searches)[k];
    //     intermediateDataSet = intermediateDataSet.filter(function(){
    //         matchQuery(address,searchField, searches[searchField])
    //     });
    //     console.log('# entries: ' + intermediateDataSet.length)
    // }
    filteredData = dataSet.filter(matchCity).filter(matchState);
}

// function matchQuery(sighting,field,query){
//     // query should be a string received from DOM inputs
//     // field should be one of 'datetime','city','state','country'
//     if(query.toLowerCase() === ''){
//         return true;
//     }
//     console.log(sighting.field.toLowerCase())
//     return sighting.field.toLowerCase() === query.toLowerCase()
// }

function matchCity(sighting){
    var $city = document.getElementById('city');
    var query = $city.value.toLowerCase()
    if(query === ''){return true}
    return sighting.city.toLowerCase() == query;
}

function matchState(sighting){
    var $state = document.getElementById('state');
    var query = $state.value.toLowerCase()
    if(query === ''){return true}
    return sighting.state.toLowerCase() == query;
}

// Table modification
function clearTable(){
    var $tbody = document.querySelector('tbody');
    $tbody.innerHTML='';
    console.log('table Cleared');
}

function populateTable(){
    console.log('populateTable called.');
    var pageLimit = 50;
    var $tbody = document.querySelector('tbody');
    for(i = 0; i < Math.min(pageLimit, filteredData.length); i++){
        var sighting = filteredData[i];
        var $row = $tbody.insertRow(i);
        for(j = 0; j < Object.keys(sighting).length; j++){
            var $cell = $row.insertCell(j);
            $cell.innerText = sighting[Object.keys(sighting)[j]];
        }
    }
    console.log('populateTable completed.');
}
