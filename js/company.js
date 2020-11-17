let urlParams = new URLSearchParams(window.location.search);
let companySymbol = urlParams.toString().split('=')[1];
const companyEndpoint = 'https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com/api/v3/company/profile/'
let companyRequestUrl = companyEndpoint+companySymbol;
let stocksHistoryEndpoint = `https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com/api/v3/historical-price-full/${companySymbol}?serietype=line`;

const presentCompanyInfo = document.querySelector('#companyInfo');
const companyStocksHistory = document.getElementById('companyStocksHistory').getContext('2d');
const companyLabel = document.querySelector('#companyLabel');
const companyStockPrice = document.querySelector('#companyStockPrice');
const companyStockPriceChange = document.querySelector('#companyStockPriceChange');
const companyDescription = document.querySelector('#companyDescription');
const elementsToHide = document.getElementsByClassName('elementsToHide');
const spinnerLarge = document.querySelector('#spinnerLarge');
const superContainer = document.querySelector('#superContainer');


function showSpinnerLarge() {
    spinnerLarge.classList.remove("spinnerLarge");
    superContainer.classList.add("vh-100", "vw-100", "d-flex", "justify-content-center", "m0");
    for (let i = 0; i < elementsToHide.length; i++) {
        elementsToHide[i].classList.add('hideElements');
    }
}
function hideSpinnerLarge() {
    for (let i = 0; i < elementsToHide.length; i++) {
        elementsToHide[i].classList.remove('hideElements');
    }
    spinnerLarge.classList.add("spinnerLarge");
    superContainer.classList.remove("vh-100", "vw-100", "d-flex", "justify-content-center", "m0");
}

async function getCompany() {
    const response = await fetch(companyRequestUrl);
    const data = await response.json();
    companyToHtml(data);
}

function companyToHtml(data) {
    companyLabel.src = data.profile.image;
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

async function getStocksHistory() {
    
    const response = await fetch(stocksHistoryEndpoint);
    const dataRaw = await response.json();
    const data = dataRaw.historical;

    let changedKeys = JSON.parse(JSON.stringify(data).split("date").join("x"));
    changedKeys = JSON.parse(JSON.stringify(changedKeys).split("close").join("y"));
    
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
    hideSpinnerLarge();
}

window.onload = (event) => {
    showSpinnerLarge();
    if (companyRequestUrl) {
        getCompany(companyRequestUrl);
    } else {alert('no url found')}
    getStocksHistory();
  };



