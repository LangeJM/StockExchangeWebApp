class CompareInfo extends CompanyInfo {

    constructor(companiesFrameContainer, symbols) {
        super();
        this.companiesFrameContainer = companiesFrameContainer;
        this.symbols = symbols;
    }

    async renderCompanyComparison(symbols) {
        const companyData = [];
        const companyHistory = [];
        const chartVars = [];
        
        for (let symbol of symbols) {
            await this.getCompany(symbol, companyData);
            await this.getStocksHistory(symbol, companyHistory)
        }
        for (let i in symbols) {
            this.createCompareHtml(companiesFrameContainer, i, companyData)
            this.companyToHtml(companyData, i)
            this.renderChart(companyHistory, i, chartVars)
        }

        for (let i in symbols) { //Actually rendering the chart needs separate iteration as otherwise only the last chart will stick. 
            new Chart(document.getElementById(`companyStocksHistory${i}`).getContext('2d'), {
                type: 'line',
                data: { datasets: [chartVars[i]] },
                options: {
                    scales: {
                        xAxes: [{
                            type: 'time'
                        }]
                    }
                }
            });
        }
        
    }

    async getStocksHistory(symbol, companyHistory) {
        const stocksHistoryEndpoint = `https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com/api/v3/historical-price-full/${symbol}?serietype=line`;
        const response = await fetch(stocksHistoryEndpoint);
        const dataRaw = await response.json();
        const data = dataRaw.historical;
        let renameKeysForChart = JSON.parse(JSON.stringify(data).split("date").join("x"));
        renameKeysForChart = JSON.parse(JSON.stringify(renameKeysForChart).split("close").join("y"));
        companyHistory.push(renameKeysForChart);
    }

    async getCompany(symbol, companyData) {
        const companyEndpoint = `https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com/api/v3/company/profile/${symbol}`
        const response = await fetch(companyEndpoint);
        const data = await response.json();
        companyData.push(data)
    }
    
    createCompareHtml(companiesFrameContainer, i, companyData) {
        let colClass = '';
        if (companyData.length === 2) {
            colClass = 'col-6';
        } else if (companyData.length === 3) {
            colClass = 'col-4';
        } else if (companyData.length === 4) {
            colClass = 'col-3';
        } else {
            colClass = 'col-2';
        }
        
        this.companiesFrameContainer.innerHTML += `
        <div class="superContainer${i} ${colClass} px-3">
            <div id="spinnerLarge${i}" class="ml-3 spinner-border align-self-center spinnerLarge" style="width: 4rem; height: 4rem" role="status"></div>
            <div class="container elementsToHide p-3 justify-content-center border rounded mt-3">
            <div class="row h4">
                <div class="col-2 align-self-center"><img id="companyLabel${i}" src="" class="img-fluid imgResizeNormal"></div>
                <div id="companyNameSymbolLink${i}" class="align-self-center col-10"><a href=""></a></div>
            </div>
            <div class="row pt-3">
                <div class="col-2 align-self-center" id="companyStockPrice${i}"></div>
                <div id="companyStockPriceChange${i}" class="align-self-center col-10" style="color: rgb(237, 41, 38);"></div>
            </div>
            <div class="row pt-3">
                <div class="col-9 align-self-center small" id="companyDescription${i}"></div>
                <div id="" class="align-self-center col-10"></div>
            </div>
            <div class="row pt-3">
            </div>
            </div>
            <div class="container elementsToHide p-3 justify-content-center border rounded mt-3"><div class="chartjs-size-monitor"><div class="chartjs-size-monitor-expand"><div class=""></div></div><div class="chartjs-size-monitor-shrink"><div class=""></div></div></div>
            <canvas id="companyStocksHistory${i}" style="display: block; height: 447px; width: 895px;" height="491" width="984" class="chartjs-render-monitor"></canvas>
            </div>
        </div>`;
    }

    companyToHtml(companyData, i) {
        const companyLabel = document.querySelector(`#companyLabel${i}`);
        companyLabel.src = companyData[i].profile.image;
        // companyLabel.setAttribute("onerror", "CompanyInfo.brokenImageToDefault(companyLabel)");
        companyLabel.setAttribute("onerror", "this.src='./images/bearbull_favicon.png'");
        companyLabel.classList.add("img-fluid", "imgResizeNormal");
        
        const companyNameSymbolLink = document.querySelector(`#companyNameSymbolLink${i}`)
        const aTag = document.createElement("a");
        aTag.setAttribute('href', companyData[i].profile.website);
        aTag.textContent = ` ${companyData[i].profile.companyName} (${companyData[i].profile.sector}) `;
        companyNameSymbolLink.appendChild(aTag);

        const companyStockPrice = document.querySelector(`#companyStockPrice${i}`);
        const companyStockPriceChange = document.querySelector(`#companyStockPriceChange${i}`);
        const companyDescription = document.querySelector(`#companyDescription${i}`);
        companyStockPrice.textContent = ` Stock price: ${companyData[i].profile.price} `;
        if (companyData[i].profile.changes < 0) {
            companyStockPriceChange.textContent = `(${companyData[i].profile.changes}%)`;
            companyStockPriceChange.style.color = "#ed2926";
        } else {
            companyStockPriceChange.textContent = '+'.concat(`(${companyData[i].profile.changes}%)`);
            companyStockPriceChange.style.color = "#27e359";
        }
        companyDescription.textContent = companyData[i].profile.description;
    }

    renderChart(companyHistory, i, chartVars) {
        chartVars[i] = {
            label: 'Stock Price History (in USD)',
            borderColor: '#0056B3',
            data: companyHistory[i]
        };

        // this.hideSpinnerLarge();
    }
}
