async function getMajorIndexesApiResponse() {
    const apiUrl = `https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com/api/v3/quotes/index`;
    const response = await fetch(apiUrl);
    const data = await response.json();
    for (i in data) {
        console.log(data[i].symbol.slice(1,));
        console.log(data[i].change);
    }
    createMarqueeText (data);
}


function createMarqueeText (data) {
    const marqueeParentEl = document.querySelector('#marqueeText');
    for (i in data) {
        let newSymbolEl = document.createElement("div");
        newSymbolEl.classList.add("smallFont", "mr-1");
        newSymbolEl.innerText = `${data[i].symbol.slice(1,)} `
        marqueeParentEl.appendChild(newSymbolEl);
        
        let newChangeEl = document.createElement("div");
        newChangeEl.classList.add("smallFont", "mr-3");
        newChangeEl.innerText = `${data[i].change}  `
        if (data[i].change < 0) {
            newChangeEl.classList.add("negativeRedFont");
        } else {
            newChangeEl.classList.add("posOrEqualGreenFont");    
        }
        marqueeParentEl.appendChild(newChangeEl);
    }
}

getMajorIndexesApiResponse()