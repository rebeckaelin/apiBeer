//Funktion som fetchar öl från ett API
//Lägger in bild och text i ett kort utifrån API
//länka "see more" till ölens "info" och skriv ut det i en lista
// slumpas varje gång sidan laddar om
//En sökfunktion för att hitta öl och skriver ut en lista med max 10st items som är knappar som länkar till "see more"
//skapa ett kort i html som kan uppdateras med data från API. skall innehålla namnet på ölen & "see more"
//hämtar en lista på öl

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
let page = 1;
const next = document.querySelector(".next");
const previous = document.querySelector(".previous");

//Hämtar alla öl
// const getBeer = async () => {
//   const response = await fetch(
//     "https://api.punkapi.com/v2/beers?page=1&per_page=10"
//   );
//   const data = await response.json();
//   console.log("beers", data); //arrayen

//   getRandomBeer();
// };

//Hämtar en random öl ------rör ej
const getRandomBeer = async () => {
  infoBox.classList.add("hide");
  beerBox.classList.remove("hide");
  const response = await fetch("https://api.punkapi.com/v2/beers/random");
  const data = await response.json();
  console.log("random beer", data);
  console.log("random beer", data[0]);
  beerImg.src = `${data[0]?.image_url}`;
  beerTitle.textContent = `${data[0].name}`;

  //kommer att skriva ut i bildrutan att bilden ej finns
  if (data[0]?.image_url === null) {
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
};

randomBtn.addEventListener("click", () => {
  getRandomBeer();
  form.classList.add("hide");
});

searchBtn.addEventListener("click", () => {
  form.classList.remove("hide");
  backToSearch.classList.add("hide");
});

// back knappen på info page
back.addEventListener("click", () => {
  beerBox.classList.remove("hide");
  infoBox.classList.add("hide");
});

//rör ej
function seeMoreInfo(data) {
  if (data[0].name) {
    beerList.innerText = "";
    let hops = [];
    let malt = [];

    data[0].ingredients.hops.forEach((element) => {
      hops.push(element.name);
    });

    data[0].ingredients.malt.forEach((element) => {
      // console.log("malt", element);
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

const getInfoList = async (index) => {
  const response = await fetch(
    `https://api.punkapi.com/v2/beers?beer_name=${formInput.value}&per_page=10&page=${page}`
  );
  const data = await response.json();
  console.log("sökresultat", data);

  beerList.innerText = "";
  let hops = [];
  let malt = [];

  if (data[index].name) {
    data[index].ingredients.hops.forEach((element) => {
      hops.push(element.name);
    });

    data[index].ingredients.malt.forEach((element) => {
      // console.log("malt", element);
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
};

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  back.classList.remove("hide");
  backToSearch.classList.add("hide");
  beerList.innerHTML = "";
  previous.classList.remove("hide");
  next.classList.remove("hide");

  if (page === 1) {
    previous.disabled = true;
  }
  const response = await fetch(
    `https://api.punkapi.com/v2/beers?beer_name=${formInput.value}&per_page=10&page=${page}`
  );
  const data = await response.json();
  console.log("sökresultat", data);
  // console.log("form input: ",formInput.value);

  // gör alla öl (data.name) till knappar
  printList(data);
});

next.addEventListener("click", async () => {
  beerList.innerHTML = "";
  page++;
  const response = await fetch(
    `https://api.punkapi.com/v2/beers?beer_name=${formInput.value}&per_page=10&page=${page}`
  );
  const data = await response.json();
  console.log("data:", data);
  if (data.length < 9) {
    next.disabled = true;
  }
  if (page > 1) {
    previous.disabled = false;
  }

  printList(data);
});

previous.addEventListener("click", async () => {
  beerList.innerHTML = "";
  page--;

  const response = await fetch(
    `https://api.punkapi.com/v2/beers?beer_name=${formInput.value}&per_page=10&page=${page}`
  );
  const data = await response.json();
  console.log("data:", data);
  if (data.length > 9) {
    next.disabled = false;
  }
  if (page === 1) {
    previous.disabled = true;
  }

  printList(data);
});

//Skriver ut listan
const printList = (data) => {
  for (const [index, item] of data.entries()) {
    console.log("item", item.name);
    console.log("index item", index);

    const beerNameBtn = document.createElement("button");
    beerNameBtn.innerText = item.name;
    // console.log("Ölnamn: ", beer.name);

    // lägger knapparn i en lista <li>
    const beerItem = document.createElement("li"); //skapar li i HTML
    beerItem.appendChild(beerNameBtn);
    beerList.append(beerItem); //gör så li-elementen syns i HTML
    infoBox.append(beerList);
    infoBox.classList.remove("hide");
    beerBox.classList.add("hide");

    beerNameBtn.addEventListener("click", () => {
      previous.classList.add("hide");
      next.classList.add("hide");
      backToSearch.classList.remove("hide");
      back.classList.add("hide");
      getInfoList(index); //skall ligga i eventlistener
    });
  }
};

backToSearch.addEventListener("click", async () => {
  beerList.innerHTML = "";
  previous.classList.remove("hide");
  next.classList.remove("hide");
  backToSearch.classList.add("hide");
  back.classList.remove("hide");
  const response = await fetch(
    `https://api.punkapi.com/v2/beers?beer_name=${formInput.value}&per_page=10&page=${page}`
  );
  const data = await response.json();
  printList(data);
});

//<fetch>`https://api.punkapi.com/v2/beers?beer_name=${formInput.value}&per_page=10`

getRandomBeer();
