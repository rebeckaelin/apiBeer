var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const beerImg = document.querySelector(".main__beer-image");
const randomBtn = document.querySelector("#random-beer-btn");
const beerTitle = document.querySelector("#beer-title");
const beerList = document.getElementById("search-list");
const seeMoreBtn = document.getElementById("see-more-btn");
const searchBtn = document.getElementById("searchBeerBtn");
const form = document.querySelector("#main-form");
const infoBox = document.querySelector(".main__search-container");
const beerBox = document.querySelector(".main__beer-card-container");
const back = document.querySelector("#back-btn");
const backToSearch = document.querySelector("#back-to-search");
const formInput = document.querySelector(".main__form-input");
const next = document.querySelector(".next");
const previous = document.querySelector(".previous");
let page = 1;
const getRandomBeer = () => __awaiter(this, void 0, void 0, function* () {
    var _a, _b;
    infoBox.classList.add("hide");
    beerBox.classList.remove("hide");
    const response = yield fetch("https://api.punkapi.com/v2/beers/random");
    const data = yield response.json();
    console.log("random beer", data);
    console.log("random beer", data[0]);
    beerImg.src = `${(_a = data[0]) === null || _a === void 0 ? void 0 : _a.image_url}`;
    beerTitle.textContent = `${data[0].name}`;
    if (((_b = data[0]) === null || _b === void 0 ? void 0 : _b.image_url) === null) {
        console.log("bilden är null");
        beerImg.src =
            "https://img.freepik.com/premium-vector/beer-bottle-brown-glass-soda-drink-bottle-blank-alcohol-beverage-product-brand-illustration_83194-1979.jpg?size=626&ext=jpg&ga=GA1.1.2013632916.1700655652&semt=ais";
    }
    seeMoreBtn.addEventListener("click", () => {
        infoBox.classList.remove("hide");
        beerBox.classList.add("hide");
        backToSearch.classList.add("hide");
        back.classList.remove("hide");
        next.classList.add("hide");
        previous.classList.add("hide");
        seeMoreInfo(data);
    });
});
randomBtn.addEventListener("click", () => {
    getRandomBeer();
    form.classList.add("hide");
});
searchBtn.addEventListener("click", () => {
    form.classList.remove("hide");
    backToSearch.classList.add("hide");
});
back.addEventListener("click", () => {
    beerBox.classList.remove("hide");
    infoBox.classList.add("hide");
});
function seeMoreInfo(data) {
    if (data[0].name) {
        beerList.innerText = "";
        let hops = [];
        let malt = [];
        data[0].ingredients.hops.forEach((element) => {
            hops.push(element.name);
        });
        data[0].ingredients.malt.forEach((element) => {
            malt.push(element.name);
        });
        const beerDescription = document.createElement("ul");
        beerDescription.innerHTML = `
            <li>Description: ${data[0].description}<li/>
            <li>Alcohol by volume: ${data[0].abv}%<li/>
            <li>Brewers tips: ${data[0].brewers_tips}<li/>
            <li>Volume: ${data[0].volume.value} liters<li/>
            <li>Food pairing: ${data[0].food_pairing}<li/>
            <p>Ingredients</p>
            <li>Hops: ${hops}<li/>
            <li>Malt: ${malt}<li/>
            <li>Yeast: ${data[0].ingredients.yeast}<li/>
            `;
        beerList.append(beerDescription);
    }
}
const getInfoList = (index) => __awaiter(this, void 0, void 0, function* () {
    const response = yield fetch(`https://api.punkapi.com/v2/beers?beer_name=${formInput.value}&per_page=10&page=${page}`);
    const data = yield response.json();
    console.log("sökresultat", data);
    beerList.innerText = "";
    let hops = [];
    let malt = [];
    if (data[index].name && data[index].ingredients) {
        data[index].ingredients.hops.forEach((element) => {
            hops.push(element.name);
        });
        data[index].ingredients.malt.forEach((element) => {
            malt.push(element.name);
        });
    }
    const beerDescription = document.createElement("ul");
    beerDescription.innerHTML = `
          <li>Description: ${data[index].description}<li/>
          <li>Alcohol by volume: ${data[index].abv}%<li/>
          <li>Brewers tips: ${data[index].brewers_tips}<li/>
          <li>Volume: ${data[index].volume.value} liters<li/>
          <li>Food pairing: ${data[index].food_pairing}<li/>
          <p>Ingredients</p>
          <li>Hops: ${hops}<li/>
          <li>Malt: ${malt}<li/>
          <li>Yeast: ${data[index].ingredients.yeast}<li/>
          `;
    beerList.append(beerDescription);
    console.log(beerList);
});
form.addEventListener("submit", (e) => __awaiter(this, void 0, void 0, function* () {
    e.preventDefault();
    back.classList.remove("hide");
    backToSearch.classList.add("hide");
    beerList.innerHTML = "";
    previous.classList.remove("hide");
    next.classList.remove("hide");
    if (page === 1) {
        previous.disabled = true;
    }
    const response = yield fetch(`https://api.punkapi.com/v2/beers?beer_name=${formInput.value}&per_page=10&page=${page}`);
    const data = yield response.json();
    console.log("sökresultat", data);
    printList(data);
}));
next.addEventListener("click", () => __awaiter(this, void 0, void 0, function* () {
    beerList.innerHTML = "";
    page++;
    const response = yield fetch(`https://api.punkapi.com/v2/beers?beer_name=${formInput.value}&per_page=10&page=${page}`);
    const data = yield response.json();
    console.log("data:", data);
    if (data.length < 9) {
        next.disabled = true;
    }
    if (page > 1) {
        previous.disabled = false;
    }
    printList(data);
}));
previous.addEventListener("click", () => __awaiter(this, void 0, void 0, function* () {
    beerList.innerHTML = "";
    page--;
    const response = yield fetch(`https://api.punkapi.com/v2/beers?beer_name=${formInput.value}&per_page=10&page=${page}`);
    const data = yield response.json();
    console.log("data:", data);
    if (data.length > 9) {
        next.disabled = false;
    }
    if (page === 1) {
        previous.disabled = true;
    }
    printList(data);
}));
const printList = (data) => {
    for (const [index, item] of data.entries()) {
        console.log("item", item.name);
        console.log("index item", index);
        const beerNameBtn = document.createElement("button");
        beerNameBtn.innerText = item.name;
        const beerItem = document.createElement("li");
        beerItem.appendChild(beerNameBtn);
        beerList.append(beerItem);
        infoBox.append(beerList);
        infoBox.classList.remove("hide");
        beerBox.classList.add("hide");
        beerNameBtn.addEventListener("click", () => {
            previous.classList.add("hide");
            next.classList.add("hide");
            backToSearch.classList.remove("hide");
            back.classList.add("hide");
            getInfoList(index);
        });
    }
};
backToSearch.addEventListener("click", () => __awaiter(this, void 0, void 0, function* () {
    beerList.innerHTML = "";
    previous.classList.remove("hide");
    next.classList.remove("hide");
    backToSearch.classList.add("hide");
    back.classList.remove("hide");
    const response = yield fetch(`https://api.punkapi.com/v2/beers?beer_name=${formInput.value}&per_page=10&page=${page}`);
    const data = yield response.json();
    printList(data);
}));
getRandomBeer();
