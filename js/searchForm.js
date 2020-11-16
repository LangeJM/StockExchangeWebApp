class SearchForm {
    
    constructor(searchParent) {
        this.searchParent = searchParent;
    }

    static async getApiResponse(searchInput) { // I don't understand why it only works with static and what can be working alternatives..
        SearchForm.showSpinner();
        const searchUrl = `https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com/api/v3/search?query=${searchInput}&limit=10&exchange=NASDAQ`;
        const response = await fetch(searchUrl);
        const data = await response.json();
        
        let companyObject = []; 
        for(let x = 0; x < data.length; x++) {
            companyObject[x] = {};
            let symbol = data[x].symbol;
            companyObject[x]['symbol'] = symbol;
    
            try {
                const companyEndpoint = 'https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com/api/v3/company/profile/'
                const compResponse = await fetch(companyEndpoint+symbol);
                const compData = await compResponse.json();
                companyObject[x]['companyName'] = compData.profile.companyName;
                companyObject[x]['image'] = compData.profile.image;
                companyObject[x]['changes'] = compData.profile.changes;
            }
            catch(err) {
                console.error(`There is a problem accessing the data for company symbol "${symbol}" with >> ${err}`);
                companyObject[x]['companyName'] = 'Not available';
                companyObject[x]['image'] = "./images/bearbull_favicon.png";
                companyObject[x]['changes'] = 'Not available';
                continue   
            }
        }
        SearchResult.resultsToHtmlList(companyObject)
    }

    static showSpinner() {
        spinnerSmall.classList.remove("spinnerSmall");
    }
    static hideSpinner() {
        spinnerSmall.classList.add("spinnerSmall");
    }

    getSearchTerm() {
        this.createHtml()
        const searchButton = document.querySelector('#searchButton');
        const search = document.querySelector('#searchBox');

        const debounce = (func, delay) => { 
            let debounceTimer;
            return function() { 
                const context = this
                const args = arguments
                clearTimeout(debounceTimer)
                debounceTimer = setTimeout(() => func.apply(context, args), delay)
                // this.getApiResponse(searchInput)
            } 
        }
        
        searchButton.addEventListener('click', () => {
            const searchInput = search.value;
            SearchForm.getApiResponse(searchInput)
        });
        
        search.addEventListener('input', debounce(function() {
            const searchInput = search.value;
            SearchForm.getApiResponse(searchInput)
        },1000));
        //debounce function taken from: https://www.geeksforgeeks.org/debouncing-in-javascript/#:~:text=Debouncing%20in%20JavaScript%20is%20a,is%20a%20single%20threaded%20language. 
    }

    createHtml() {
        this.searchParent.classList.add("d-flex", "justify-content-center");
        
        const columnEl = document.createElement("div");
        columnEl.classList.add("col-2");

        const columnEl2 = document.createElement("div");
        columnEl2.classList.add("col-2");
        
        const searchBox = document.createElement("input");
        searchBox.classList.add("form-control", "mr-sm-2", "col-6");
        searchBox.setAttribute("type", "text");
        searchBox.setAttribute("aria-label", "Search");
        searchBox.setAttribute("placeholder", "Search Input");
        searchBox.setAttribute("id", "searchBox");

        const button = document.createElement("button");
        button.classList.add("btn", "btn-primary", "btn-rounded", "my-0", "border", "col-1");
        button.setAttribute("style", "min-width: 4.5rem");
        button.setAttribute("type", "submit");
        button.textContent = "Search";
        button.setAttribute("id", "searchButton");

        const spinnerSmall = document.createElement("button");
        spinnerSmall.classList.add("ml-3", "spinnerSmall", "spinner-border", "align-self-center");
        spinnerSmall.setAttribute("style", "width: 1.75rem; height: 1.75rem; min-width: 1.75rem;");
        spinnerSmall.setAttribute("role", "status");
        spinnerSmall.setAttribute("id", "spinnerSmall");

        this.searchParent.appendChild(columnEl);
        this.searchParent.appendChild(searchBox);
        this.searchParent.appendChild(button);
        this.searchParent.appendChild(spinnerSmall);
        this.searchParent.appendChild(columnEl2);
    }
}

