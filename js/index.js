const spinner = document.querySelector('#spinner');
const searchButton = document.querySelector('#searchButton');
const searchBox = document.querySelector('#searchBox');
let searchUrl;
const resultsListParent = document.querySelector("#searchResultsParent");

function showSpinner() {
    spinner.classList.remove("spinner");
}
function hideSpinner() {
    spinner.classList.add("spinner");
}
// Will do something with the below function for one of the next milestones
// searchBox.addEventListener('input', () => {
//     searchInput = searchBox.value;
//     console.log(searchInput);
//     return searchInput
// });

function resultsToHtmlList(companyObject) {
    resultsListParent.innerHTML = "";

    for(let x = 0; x < companyObject.length; x++) {
        
        let companyName = companyObject[x].companyName;
        if (companyName.length > 40) companyName =  companyName.substr(0, 40) + "...";
    
        const symbol = companyObject[x].symbol;
        const image = companyObject[x].image;
        const changes = companyObject[x].changes;

        let childParent = document.createElement("div");
        childParent.classList.add("row", "align-items-center", "py-2");
        let nameEl = document.createElement("div");
        let labelEl = document.createElement("div");
                
        let symbolEl = document.createElement("div");
        symbolEl.classList.add("smallFont");
        let stockChangesEl = document.createElement("div");
        stockChangesEl.classList.add("smallFont");
        if (changes < 0) stockChangesEl.classList.add("negativeRedFont")
        else stockChangesEl.classList.add("posOrEqualGreenFont");

        let imgTag = document.createElement("img");
        imgTag.classList.add("img-fluid", "imgResizeSmall");
        let aTag = document.createElement("a");
        
        resultsListParent.appendChild(childParent);

        imgTag.src = image;
        labelEl.appendChild(imgTag);
        childParent.appendChild(labelEl);
        
        aTag.setAttribute('href','./company.html?symbol=' + symbol);
        aTag.textContent = ` ${companyName} `;
        nameEl.appendChild(aTag);
        childParent.appendChild(nameEl);
        nameEl.className = "bold-text px-3";

        symbolEl.textContent = `(${symbol})`;
        childParent.appendChild(symbolEl);
        stockChangesEl.textContent = `(${changes})`;
        childParent.appendChild(stockChangesEl);  
    }
    hideSpinner();
}

searchButton.onclick = getApiResponse(); //This somehow works as on window load and doesn't wait for the search value from search box. The alternative eventlistener 'click' doesn't work for some reason. Need to look into it.

async function getApiResponse() {
    showSpinner();
    let searchInput = searchBox.value;
    alert(searchInput);
    const searchUrl = `https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com/api/v3/search?query=${searchInput}&limit=10&exchange=NASDAQ`;
    const response = await fetch(searchUrl);
    const data = await response.json();
    
    let companyObject = []; 
    for(let x = 0; x < data.length; x++) {
        companyObject[x] = {};
        let symbol = data[x].symbol;
        companyObject[x]['symbol'] = symbol;

        const companyEndpoint = 'https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com/api/v3/company/profile/'
        const compResponse = await fetch(companyEndpoint+symbol);
        const compData = await compResponse.json();

        if (typeof(compData.profile.companyName) == 'undefined' || compData.profile.companyName === null) { //This doesn't do the trick, need to further investigate
            companyObject[x]['companyName'] = 'No record available';    
        } else {
            companyObject[x]['companyName'] = compData.profile.companyName;
        }
        
        companyObject[x]['image'] = compData.profile.image;
        companyObject[x]['changes'] = compData.profile.changes;
    }
    resultsToHtmlList(companyObject);
}