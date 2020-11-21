class CompanyInfo {
    constructor (superContainer, symbol){
        this.superContainer = superContainer;
        this.symbol = symbol;
        // this.createHtml();
        // this.createElVars();
        // this.showSpinnerLarge();
    }

    createHtml() {
        this.superContainer.innerHTML = `
        <div id="spinnerLarge" class="ml-3 spinner-border align-self-center spinnerLarge" style="width: 4rem; height: 4rem" role="status"></div>
    
        <div class="container elementsToHide p-3 justify-content-center border rounded mt-3">
          <div class="row h4">
            <div class="col-2 align-self-center"><img id="companyLabel" src="" class="img-fluid imgResizeNormal"></div>
            <div id="companyNameSymbolLink" class="align-self-center col-10"><a href=""></a></div>
          </div>
          <div class="row pt-3">
            <div class="col-2 align-self-center" id="companyStockPrice"></div>
            <div id="companyStockPriceChange" class="align-self-center col-10" style="color: rgb(237, 41, 38);"></div>
          </div>
          <div class="row pt-3">
            <div class="col-9 align-self-center small" id="companyDescription"></div>
            <div id="" class="align-self-center col-10"></div>
          </div>
          <div class="row pt-3">
          </div>
        </div>
        <div class="container elementsToHide p-3 justify-content-center border rounded mt-3"><div class="chartjs-size-monitor"><div class="chartjs-size-monitor-expand"><div class=""></div></div><div class="chartjs-size-monitor-shrink"><div class=""></div></div></div>
          <canvas id="companyStocksHistory" style="display: block; height: 447px; width: 895px;" height="491" width="984" class="chartjs-render-monitor"></canvas>
        </div>`;
    } 
    createElVars() {
        this.presentCompanyInfo = document.querySelector('#companyInfo');
        this.companyStocksHistory = document.getElementById('companyStocksHistory').getContext('2d');
        this.companyLabel = document.querySelector('#companyLabel');
        this.companyStockPrice = document.querySelector('#companyStockPrice');
        this.companyStockPriceChange = document.querySelector('#companyStockPriceChange');
        this.companyDescription = document.querySelector('#companyDescription');
        this.elementsToHide = document.getElementsByClassName('elementsToHide');
        this.spinnerLarge = document.querySelector('#spinnerLarge');
        this.companyEndpoint = 'https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com/api/v3/company/profile/'
        this.companyRequestUrl = this.companyEndpoint + this.symbol;
    }

    showSpinnerLarge() {
        this.spinnerLarge.classList.remove("spinnerLarge");
        this.superContainer.classList.add("vh-100", "vw-100", "d-flex", "justify-content-center", "m0");
        for (let i = 0; i < this.elementsToHide.length; i++) {
            this.elementsToHide[i].classList.add('hideElements');
        }
    }
    hideSpinnerLarge() {
        for (let i = 0; i < this.elementsToHide.length; i++) {
            this.elementsToHide[i].classList.remove('hideElements');
        }
        this.spinnerLarge.classList.add("spinnerLarge");
        this.superContainer.classList.remove("vh-100", "vw-100", "d-flex", "justify-content-center", "m0");
    }

    async getCompany() {
        const response = await fetch(this.companyRequestUrl);
        const data = await response.json();
        this.companyToHtml(data);
    }

    static brokenImageToDefault() {
        const defaultImage = './images/bearbull_favicon.png';
        companyLabel.src = defaultImage;
    }

    companyToHtml(data) {
        companyLabel.src = data.profile.image;
        companyLabel.setAttribute("onerror", "CompanyInfo.brokenImageToDefault(companyLabel)");
        companyLabel.classList.add("img-fluid", "imgResizeNormal");
        let aTag = document.createElement("a");
        aTag.setAttribute('href',data.profile.website);
        aTag.textContent = ` ${data.profile.companyName} (${data.profile.sector}) `;
        companyNameSymbolLink.appendChild(aTag);

        companyStockPrice.textContent = ` Stock price: $${data.profile.price} `;
        if (data.profile.changes < 0) {
            companyStockPriceChange.textContent = `(${data.profile.changes}%)`;
            companyStockPriceChange.style.color = "#ed2926";
        } else {
            companyStockPriceChange.textContent = '+'.concat(`(${data.profile.changes}%)`);
            companyStockPriceChange.style.color = "#27e359";
        }
        companyDescription.textContent = data.profile.description;
    }

    async getStocksHistory() {
        this.stocksHistoryEndpoint = `https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com/api/v3/historical-price-full/${this.symbol}?serietype=line`;
        const response = await fetch(this.stocksHistoryEndpoint);
        const dataRaw = await response.json();
        const data = dataRaw.historical;

        let changedKeys = JSON.parse(JSON.stringify(data).split("date").join("x"));
        changedKeys = JSON.parse(JSON.stringify(changedKeys).split("close").join("y"));
        console.log(changedKeys)
        
        const stocksHistory = {
        label: 'Stock Price History (in USD)',
        borderColor: '#0056B3',
        data: changedKeys
        };

        new Chart(companyStocksHistory, {
            type: 'line',
            data:  { datasets: [stocksHistory,] },
            options: {
                scales: {
                    xAxes: [{
                        type: 'time'
                    }]
                }
            }
        });
        this.hideSpinnerLarge();
    }

}