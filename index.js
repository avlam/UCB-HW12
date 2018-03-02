var filteredData = dataSet;
var pageLimit = 10;
var currentPage = 1;
var filters = [
    {'name' : 'shape',
    'active' : true,
    'handle' : matchShape},
    {'name' : 'city',
    'active' : true,
    'handle' : matchCity},
    {'name' : 'state',
    'active' : true,
    'handle' : matchState},
    {'name' : 'country',
    'active' : true,
    'handle' : matchCountry},
    {'name' : 'minDate',
    'active' : true,
    'handle' : minDate},
    {'name' : 'shape',
    'active' : true,
    'handle' : maxDate}
]
populateTable();
createTableNav();

// DOM elements
var $search = document.getElementById('search');
var $shapeMenu = document.getElementById('shapeMenu');
var $shapeReset = document.getElementById('shapeReset');
var $shapeQuery = document.getElementById('shapeQuery');

// event listeners
$search.addEventListener('click',filterSightings);
$shapeReset.addEventListener('click',function(){
    $shapeQuery.innerText = 'Shape';
})

var shapes = {};
for(m=0;m<dataSet.length;m++){
    if(shapes[dataSet[m].shape]==undefined){
        shapes[dataSet[m].shape] = 1;
    }
    else{shapes[dataSet[m].shape] += 1;}
}

for(n=0;n<Object.keys(shapes).length;n++){
    var $menuItem = document.createElement('a');
    $menuItem.setAttribute('class','dropdown-item');
    $menuItem.setAttribute('href','#');
    $menuItem.innerText = Object.keys(shapes)[n];
    $menuItem.addEventListener('click',function(){
        console.log('Set shapeQuery to: ' + this.innerText);
        $shapeQuery.innerText = this.innerText;
    })
    $shapeMenu.appendChild($menuItem);
    console.log(Object.entries(shapes)[n])
}

function filterSightings(){
    clearTable();
    applyFilters();
    populateTable();
    clearTableNav();
    createTableNav();
}

// Filters
function applyFilters(){
    //filteredData = dataSet.filter(matchCity).filter(matchState).filter(matchCountry).filter(minDate).filter(maxDate);
    filteredData = dataSet;
    for(n = 0;n<filters.length;n++){
        if(filters[n]['active']){filteredData = filteredData.filter(filters[n]['handle'])}
    }
    // reset current page when changing filters
    currentPage = 1;
}

function matchCity(sighting){
    var $city = document.getElementById('city');
    var query = $city.value.toLowerCase()
    if(query === ''){return true}
    return sighting.city.toLowerCase() == query;
}

function matchShape(sighting){
    var query = $shapeQuery.innerText;
    if(query === 'Shape'){return true}
    return sighting.shape.toLowerCase() == query;
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

function populateTable(pageNumber){
    if(pageNumber === undefined){pageNumber = 1;}
    console.log('Current PageNumber: ' + pageNumber);
    var $tbody = document.querySelector('tbody');
    var rows = calculatePageBounds(pageNumber);
    console.log('Populating from ' + rows[0] + ' to ' + rows[rows.length-1])
    for(i = rows[0]; i < Math.min(rows[rows.length-1], filteredData.length); i++){
        var sighting = filteredData[i];
        var $row = $tbody.insertRow(i-rows[0]);
        for(j = 0; j < Object.keys(sighting).length; j++){
            var $cell = $row.insertCell(j);
            $cell.innerText = sighting[Object.keys(sighting)[j]];
        }
    }
}

// Pagination
function createTableNav(){
    // if(currentPage === undefined){
    //     currentPage = 1;
    // }
    var nPages = Math.ceil(filteredData.length/pageLimit);
    createPage(null,'previous');
    // if(nPages === 1){createPage(1);}
    if(nPages <= 6){
        for(n = 1; n <= nPages; n++){
            createPage(n);
        }
    }
    else{
        for(n = 1; n <= Math.min(3, nPages); n++){
            createPage(n);
        }
        if(currentPage > 3 && currentPage < nPages - 2){
            createPage('...',true);
            createPage(currentPage);
        }
        createPage('...',true);
        for(n = nPages-2; n <= nPages; n++){
            createPage(n);
        }
    }
    createPage(null,'next');
    // disable 'previous' or 'next' buttons if on first or last page
    if(currentPage === 1){
        appendAttribute(document.getElementById('previous'),'class','disabled');
    }
    if(currentPage === nPages){
        appendAttribute(document.getElementById('next'),'class','disabled');
    }
}

function clearTableNav(){
    var $tableNav = document.getElementById('tableNav');
    $tableNav.innerHTML = '';
}

function createPage(value,special){
    var specialValues = {
        'previous' : {'text' : '&laquo;', 'target': currentPage-1},
        'next' : {'text' : '&raquo;', 'target': currentPage+1}
    }
    var $tableNav = document.getElementById('tableNav');
    var $pageButton = document.createElement('li');
    $pageButton.setAttribute('class','page-item');
    var $pageLink = document.createElement('a');
    $pageLink.setAttribute('class','page-link');
    $pageLink.setAttribute('href','#');
    if(special === 'previous' || special === 'next'){
        $pageLink.setAttribute('aria-label', special);
        $pageButton.setAttribute('id', special);
        $pageLink.innerHTML = '<span aria-hidden="true">' + specialValues[special]['text'] + '</span>\
            <span class="sr-only">' + special + '</span>';
        $pageLink.addEventListener('click',function(){goToPage(specialValues[special]['target']);})
    }
    else if(special){
        // other special cases
        appendAttribute($pageButton,'class','disabled');
        $pageLink.innerText = value;}
    else{
        $pageLink.innerText = value;
        if(currentPage === value){
            $pageButton.setAttribute('id','currentPage');
            appendAttribute($pageButton,'class','active');
        }
        else{$pageLink.addEventListener('click',function(){goToPage(value);})}
    }
    $pageButton.appendChild($pageLink);
    $tableNav.appendChild($pageButton)
}

function goToPage(targetPage){
    currentPage = targetPage;
    clearTable();
    populateTable(targetPage);
    clearTableNav();
    createTableNav(targetPage);

}

// Utilities
function appendAttribute(variable,attribute,value){
    var current = variable.getAttribute(attribute);
    variable.setAttribute(attribute, current + ' ' + value);
}

function calculatePageBounds(pageNumber){
    firstRow = (pageNumber - 1) * pageLimit;
    lastRow = pageNumber * pageLimit;
    return [firstRow, lastRow];
}

// not used
function getCurrentPage(){
    var $currentPage = document.getElementById('currentPage')
    return $currentPage.value
} 

