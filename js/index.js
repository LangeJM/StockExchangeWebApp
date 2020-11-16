// const spinnerSmall = document.querySelector('#spinnerSmall');
// const searchButton = document.querySelector('#searchButton');
// const searchBox = document.querySelector('#searchBox');
// let searchUrl;

// const resultsListParent = document.querySelector("#searchResultsParent");

// function showSpinner() {
//     spinnerSmall.classList.remove("spinnerSmall");
// }
// function hideSpinner() {
//     spinnerSmall.classList.add("spinnerSmall");
// }
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
        childParent.classList.add("row", "align-items-center", "py-2", "searchResultsWidth", "border-bottom", "pl-3");
        let nameEl = document.createElement("div");
        let labelEl = document.createElement("div");
                
        let symbolEl = document.createElement("div");
        symbolEl.classList.add("smallFont");
        let stockChangesEl = document.createElement("div");
        stockChangesEl.classList.add("smallFont");
        if (changes < 0) {
            stockChangesEl.classList.add("negativeRedFont");
            stockChangesEl.textContent = `(${changes})`;
        } else if (changes === 'Not available') {
            stockChangesEl.classList.add("notavailableFont");
            stockChangesEl.textContent = `(${changes})`;
        } else {
            stockChangesEl.classList.add("posOrEqualGreenFont");
            stockChangesEl.textContent = `(+${changes})`;
        }

        let imgTag = document.createElement("img");
        imgTag.classList.add("img-fluid", "imgResizeSmall");
        let aTag = document.createElement("a");
        
        resultsListParent.appendChild(childParent);

        imgTag.src = image;
        imgTag.setAttribute("onerror", "brokenImageToDefault(this)");
        labelEl.appendChild(imgTag);
        childParent.appendChild(labelEl);
        
        if (companyName === 'Not available') {
            aTag.textContent = ` ${companyName} `;
            aTag.classList.add("notavailableFont");
            nameEl.appendChild(aTag);
            childParent.appendChild(nameEl);
            nameEl.className = "bold-text px-3";
            
        } else {
            aTag.setAttribute('href','./company.html?symbol=' + symbol);
            aTag.textContent = ` ${companyName} `;
            nameEl.appendChild(aTag);
            childParent.appendChild(nameEl);
            nameEl.className = "bold-text px-3";
        }

        symbolEl.textContent = `(${symbol})`;
        childParent.appendChild(symbolEl);
        childParent.appendChild(stockChangesEl);  
    }
    hideSpinner();
}

// searchButton.addEventListener('click', () => {
//     getApiResponse();
// });

// debounce version of button click event. 
// Taken from https://www.geeksforgeeks.org/debouncing-in-javascript/#:~:text=Debouncing%20in%20JavaScript%20is%20a,is%20a%20single%20threaded%20language.

// const debounce = (func, delay) => { 
//     let debounceTimer 
//     return function() { 
//         const context = this
//         const args = arguments 
//             clearTimeout(debounceTimer) 
//                 debounceTimer 
//             = setTimeout(() => func.apply(context, args), delay) 
//     } 
// } 

// searchButton.addEventListener('click', debounce(function() {
//     console.log('Fires only every second');
//     getApiResponse();
// }, 1000));


// async function getApiResponse() {
//     showSpinner();
//     let searchInput = searchBox.value;
//     const searchUrl = `https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com/api/v3/search?query=${searchInput}&limit=10&exchange=NASDAQ`;
//     const response = await fetch(searchUrl);
//     const data = await response.json();
    
//     let companyObject = []; 
//     for(let x = 0; x < data.length; x++) {
//         companyObject[x] = {};
//         let symbol = data[x].symbol;
//         companyObject[x]['symbol'] = symbol;

//         try {
//             const companyEndpoint = 'https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com/api/v3/company/profile/'
//             const compResponse = await fetch(companyEndpoint+symbol);
//             const compData = await compResponse.json();
//             companyObject[x]['companyName'] = compData.profile.companyName;
//             companyObject[x]['image'] = compData.profile.image;
//             companyObject[x]['changes'] = compData.profile.changes;
//         }
//         catch(err) {
//             console.error(`There is a problem accessing the data for company symbol "${symbol}" with >> ${err}`);
//             companyObject[x]['companyName'] = 'Not available';
//             companyObject[x]['image'] = "./images/bearbull_favicon.png";
//             companyObject[x]['changes'] = 'Not available';
//             continue   
//         }
//     }
//     resultsToHtmlList(companyObject);
// }

function brokenImageToDefault(image) {
    const defaultImage = './images/bearbull_favicon.png';
	image.src = defaultImage;
}
