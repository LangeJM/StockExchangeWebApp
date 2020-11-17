class SearchResult { // I don't succeed to make this work with two different files... I tried but simply have a hard time to fully grasp the mechanisms of it all...
    // constructor(searchResultsParent) {
    //     this.searchResultsParent = searchResultsParent;
    // } 
    //Constructor not accesible from static.. so I have to hardcode it inside the static method.
    static companies;

    static async resultsToHtmlList(companyObject, searchInput) { //I don't know how I can have an async method of class SearchForm access this methoid other than making both static... 
        const searchResultsParent = document.querySelector('#searchResultsParent');
        searchResultsParent.innerHTML = "";
    
        for(let x = 0; x < companyObject.length; x++) {
            
            let companyName = companyObject[x].companyName;
            if (companyName.length > 40) companyName =  companyName.substr(0, 40) + "...";
        
            const symbol = companyObject[x].symbol;
            const image = companyObject[x].image;
            const changes = companyObject[x].changes;

            let childParent = document.createElement("div");
            childParent.classList.add("row", "align-items-center", "py-2", "w-100", "pl-5");
            searchResultsParent.appendChild(childParent);

            edgeColumnEl(childParent)
            labelEl(image, childParent)
            nameEl(companyName, childParent)
            symbolEl(symbol, childParent)
            stockChangesEl(changes, childParent)
            // edgeColumnEl(childParent)
            compareButtonEl(childParent,x)

            let dividerEl = document.createElement("div");
            dividerEl.classList.add("border-bottom", "dividerWidth");
            searchResultsParent.appendChild(dividerEl);
        }


        function edgeColumnEl(childParent) {
            const columnEl = document.createElement("div");
            columnEl.classList.add("col-2");
            childParent.appendChild(columnEl)
        }

        function nameEl(companyName, childParent, symbol) {
            let nameEl = document.createElement("div");
            let aTag = document.createElement("a");
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
        }

        function labelEl(image, childParent) {
            let labelEl = document.createElement("div");
            let imgTag = document.createElement("img");
            imgTag.classList.add("img-fluid", "imgResizeSmall");
            imgTag.src = image;
            imgTag.setAttribute("onerror", "SearchResult.brokenImageToDefault(this)");
            labelEl.appendChild(imgTag);
            childParent.appendChild(labelEl);
        }
        
        function symbolEl(symbol, childParent) {
            let symbolEl = document.createElement("div");
            symbolEl.classList.add("smallFont");
            symbolEl.textContent = `(${symbol})`;
            childParent.appendChild(symbolEl);
        }
        
        function stockChangesEl(changes, childParent) {
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
            childParent.appendChild(stockChangesEl);
        }

        function compareButtonEl(childParent,x) {
            let compareButtonEl = document.createElement("button");
            compareButtonEl.setAttribute("type", "button");
            compareButtonEl.setAttribute("onclick", "SearchResult.getButtoninfo(event)");
            compareButtonEl.classList.add("btn", "btn-outline-info", "btn-sm", "ml-auto", "mr-4", `indexRelCompanyObject${x}`);
            compareButtonEl.textContent = "Compare";
            childParent.appendChild(compareButtonEl)
        }

        
        SearchForm.hideSpinner();
        // SearchResult.highlightSearchTerm(searchInput, searchResultsParent);
        SearchResult.performMark(searchInput, SearchResult.markInstance);
    }

    static brokenImageToDefault(image) {
        const defaultImage = './images/bearbull_favicon.png';
        image.src = defaultImage;
    }

    // static highlightSearchTerm(searchInput, searchResultsParent) {
    //     const regEx = new RegExp("(?<!=.)(?<!=.{2})(?<!=.{3})(?<!=.{4})abc(?![A-Za-z0-9_]{0,}.jpg)(?![A-Za-z0-9_]{0,}.png)(?![A-Za-z0-9_]{0,}.jpeg)", "ig"); // I need to find a regex that only matches those searchInput strings that are not preceeded (range of pos) by "=" or followed by image file endings. This prevents links within the innerHTML from being modified and thus broken. Still looking fo a good solution for the first part. Until then using library.
    //     const modifiedText =  searchResultsParent.innerHTML.replaceAll(regEx, '<span class="highlighter">$&</span>');
    //     searchResultsParent.innerHTML = modifiedText;
    // }

    static markInstance = new Mark(searchResultsParent)
    static performMark(searchInput, markInstance) {
        markInstance.unmark({
            done: function(){
            markInstance.mark(searchInput)
            }
        })
    }

    static getButtoninfo(event) {
        let target = event.target;
        const relIndexCompanies = parseInt(target.className.split('indexRelCompanyObject')[1]); //I was looking for a direct way to get the parent-parent NodeIndex, but so far didn't succeed.
        console.log(this.companies[relIndexCompanies]);
    }



}