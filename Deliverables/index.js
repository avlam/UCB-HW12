var filteredData = dataSet;
var pageLimit = 50;
populateTable();
createTableNav();

// DOM elements
var $search = document.getElementById('search');

// event listeners
$search.addEventListener('click',filterSightings);

function filterSightings(){
    clearTable();
    applyFilters();
    populateTable();
}

// Filters
function applyFilters(){
    filteredData = dataSet.filter(matchCity).filter(matchState).filter(matchCountry).filter(minDate).filter(maxDate);
}

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

function matchCountry(sighting){
    var $country = document.getElementById('country');
    var query = $country.value.toLowerCase()
    if(query === ''){return true}
    return sighting.country.toLowerCase() == query;
}

function minDate(sighting){
    var $minDateFilter = document.getElementById('startDate');
    var query = $minDateFilter.value;
    if((query === '') || (new Date(query) == 'Invalid Date')){return true};
    return new Date(sighting.datetime) >= new Date(query);
}

function maxDate(sighting){
    var $maxDateFilter = document.getElementById('endDate');
    var query = $maxDateFilter.value;
    if((query === '') || (new Date(query) == 'Invalid Date')){return true};
    return new Date(sighting.datetime) <= new Date(query);
}

// Table modification
function clearTable(){
    var $tbody = document.querySelector('tbody');
    $tbody.innerHTML='';
}

function populateTable(){
    var $tbody = document.querySelector('tbody');
    for(i = 0; i < Math.min(pageLimit, filteredData.length); i++){
        var sighting = filteredData[i];
        var $row = $tbody.insertRow(i);
        for(j = 0; j < Object.keys(sighting).length; j++){
            var $cell = $row.insertCell(j);
            $cell.innerText = sighting[Object.keys(sighting)[j]];
        }
    }
}

// Pagination
function createTableNav(currentPage){
    if(currentPage === undefined){
        currentPage = 1;
    }
    var nPages = Math.ceil(filteredData.length/pageLimit);
    createPage(null,'previous');
    if(nPages === 1){createPage(1);}
    else{
        for(n = 1; n <= Math.min(6, nPages); n++){
            if(currentPage === n){
                createPage(n,'current');
            }
            else{createPage(n)}
        }
    }
    createPage(null,'next');
    if(currentPage === 1){document.getElementById('previous').class += ' disabled';}
    if(currentPage === nPages){document.getElementById('next').class += ' disabled';}
}

function createPage(value,special){
    var specialValues = {
        'previous' : '&laquo;',
        'next' : '&raquo;'
    }
    
    var $tableNav = document.getElementById('tableNav');
    var $pageButton = document.createElement('li');
    $pageButton.class = 'page-item';
    var $pageLink = document.createElement('a');
    $pageLink.setAttribute('class','page-link');
    $pageLink.setAttribute('href','#');
    if(special === 'current'){
        $pageButton.setAttribute('id','currentPage');
        $pageButton.class += ' active';
        $pageLink.innerText = value;
    }
    else if(special === 'previous' || special === 'next'){
        $pageLink.setAttribute('aria-label', special);
        $pageButton.setAttribute('id', special);
        $pageLink.innerHTML = '<span aria-hidden="true">' + specialValues[special] + '</span>\
            <span class="sr-only">' + special + '</span>';
    }
    else{$pageLink.innerText = value;}
    $pageButton.appendChild($pageLink);
    $tableNav.appendChild($pageButton)
}

function getCurrentPage(){
    var $currentPage = document.getElementById('currentPage')
    return $currentPage.value
} 

// Sample previous button
{/* <a class="page-link" href="#" aria-label="Previous">
<span aria-hidden="true">&laquo;</span>
<span class="sr-only">Previous</span>
</a> */}

{/* <li class="page-item"><a class="page-link" href="#">Previous</a></li>
<li class="page-item"><a class="page-link" href="#">1</a></li>
<li class="page-item"><a class="page-link" href="#">2</a></li>
<li class="page-item"><a class="page-link" href="#">3</a></li>
<li class="page-item"><a class="page-link" href="#">Next</a></li> */}
