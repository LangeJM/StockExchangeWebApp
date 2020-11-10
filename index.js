const spinner = document.querySelector('#spinner');
const searchButton = document.querySelector('#searchButton');
const searchBox = document.querySelector('#searchBox');
let searchUrl;

// let searchUrlHarcoded = `https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com/api/v3/search?query=${searchInput}&limit=10&exchange=NASDAQ`;
// 'https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com/api/v3/search?query=AA&limit=10&exchange=NASDAQ'
let resultsListParent = document.querySelector("#searchResultsParent");

function showSpinner() {
    spinner.classList.remove("spinner");
}
function hideSpinner() {
    spinner.classList.add("spinner");
}

// searchBox.addEventListener('input', () => {
//     searchInput = searchBox.value;
//     console.log(searchInput);
//     return searchInput
// });



// function resultsToHtmlList(data) {
//     resultsListParent.innerHTML = "";
//     for(let x = 0; x < data.length; x++) {
//         let itemName = data[x].name;
//         let itemSymbol = data[x].symbol;
//         let newItem = document.createElement("div");
//         newItem.textContent = ` ${itemName} (${itemSymbol}) `;
//         resultsListParent.appendChild(newItem);
//         newItem.className = "pl-1 bold-text";
//         hideSpinner();
//     }
// }


function resultsToHtmlList(data) {
    resultsListParent.innerHTML = "";
    for(let x = 0; x < data.length; x++) {
        let itemName = data[x].name;
        let itemSymbol = data[x].symbol;
        let newItem = document.createElement("div");
        let aTag = document.createElement("a");
        aTag.setAttribute('href','./company.html?symbol=' + itemSymbol);
        aTag.textContent = ` ${itemName} (${itemSymbol}) `;
        newItem.appendChild(aTag);
        resultsListParent.appendChild(newItem);
        newItem.className = "pl-1 bold-text";
        hideSpinner();
    }
}


async function getApiResponse() {
    showSpinner();
    let searchInput = searchBox.value;
    const searchUrl = `https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com/api/v3/search?query=${searchInput}&limit=10&exchange=NASDAQ`;
    const response = await fetch(searchUrl);
    const data = await response.json();
    resultsToHtmlList(data);
}

// Both click event handlers do not work, no idea why not. I can start the getApiResponse manually from the console without problem though.
// searchButton.addEventListener('click', async() => {
//     getApiResponse();
// });
// searchButton.onclick = getApiResponse();


