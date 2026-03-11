/* 

API DOCUMENTATION: https://ergast.com/mrd/

REMEMBAH: You must not create any application which 
polls the API more than four times per second or 
more than 200 times per hour. 

Applications and users exceeding these rates are likely 
to be blocked. Caching is permitted and encouraged.

All API queries require a GET request using a URL of the form:

http://ergast.com/api/<series>/<season>/<round>/...

where:

<series>	should be set to “f1”
<season>	is a 4 digit integer
<round>	is a 1 or 2 digit integer

EXAMPLE:

http://ergast.com/api/f1/2008/12 -> this query will show data from the 12th
round of the 2008 season in f1


https://rapidapi.com/mattfoster02/api/ -> USING THIS API FOR THE NEWS SECTION

HEADERS:
'X-RapidAPI-Key': '43e07c9a03msh0816066abcbb829p1ba935jsn560fbc666b65',
'X-RapidAPI-Host': 'f1-latest-news.p.rapidapi.com'
*/


const ergastApi = "http://ergast.com/api/f1/";
const newsApi = "https://rapidapi.com/mattfoster02/api/";

export async function getData(api, endpoint) {
    let apiUrl = '';
    let apiPrefix = '';

    if (api == 'ergast') {
        apiUrl = ergastApi;
        apiPrefix = 'ergast';
    } else if (api == 'news') {
        apiUrl = newsApi;
        apiPrefix = 'news';
    } else {
        console.error("INVALID PARAM: " + api);
        return;
    }

    const fullUrl = apiUrl + endpoint;

    const cachedData = getFromLocalStorage(endpoint, apiPrefix);
    if (cachedData) {
        console.log("KINUHA SA LOCALSTORAGE:", fullUrl);
        return cachedData;
    }

    console.log("KINUHA SA API:", fullUrl);

    try {
        const response = await fetch(fullUrl);
        if (!response.ok) throw new Error('Network error');
        const data = await response.json();

        storeInLocalStorage(endpoint, data, apiPrefix);

        return data;
    } catch (error) {
        console.error('ERROR!: ', error);
    }
}


//RETURNS WIKI DATA!!!
export async function getWikiData(url) {
  const fullUrl = getWikiApi(url);

  console.log("FULL URL IS: "+fullUrl);

  const cachedData = getFromLocalStorage(url, 'wiki');
  if (cachedData) {
      console.log("KINUHA SA LOCALSTORAGE:", fullUrl);
      return cachedData;
  }

  console.log("KINUHA SA API:", fullUrl);

  try {
      const response = await fetch(fullUrl);
      if (!response.ok) throw new Error('Network error');
      const data = await response.json();

      // Extract the relevant content
      const pageId = Object.keys(data.query.pages)[0];
      const extract = data.query.pages[pageId].extract;

      storeInLocalStorage(url, extract, 'wiki');
    
      return extract;
  } catch (error) {
      console.error('ERROR!: ', error);
  }
}

function getWikiApi(pageTitle) {
    console.log("LE TITLE:", pageTitle);
    const apiUrl = `https://en.wikipedia.org/w/api.php?format=json&origin=*&action=query&prop=extracts&exintro&explaintext&redirects=1&titles=${encodeURIComponent(pageTitle)}`;
    console.log("For this title: " + pageTitle + ", the API URL is: " + apiUrl);
    return apiUrl;
}


//RETURNS ENDPOITN
export function yearToF1WikiApiUrl(year) {
  return `${year}_Formula_One_season`;
}

export async function getSeasonInfo(season) {
  const endpoint = `${season}.json`;
  return fetchData('ergast',endpoint);
}

export async function testLamang(){
  return getData('ergast',"2022/2/results.json");
}

export async function getRaceSched(){
return getData('ergast',"current.json");
}

export async function getDriverStandings(year){
return getData('ergast', "current/driverStandings.json");
}

export async function getConstructorStandings(year){
return getData('ergast', "current/constructorStandings.json");
}

export async function getDriversInfo(year){
const endpoint = `${year}/drivers.json`;
return getData('ergast', endpoint);
}

export async function getConstructorsInfo(year){
const endpoint = `${year}/constructors.json`;
return getData('ergast', endpoint);
}

export async function getCircuitsInfo(year){
    const endpoint = `${year}/circuits.json`;
    return getData('ergast', endpoint);
}

export async function getNews(){
    const url = 'https://f1-latest-news.p.rapidapi.com/news/f1';
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': '43e07c9a03msh0816066abcbb829p1ba935jsn560fbc666b65',
            'X-RapidAPI-Host': 'f1-latest-news.p.rapidapi.com',
            'length': '3'
        }
    };

    try {
        const response = await fetch(url, options);
        const result = await response.json();
        return result;
    } catch (error) {
        console.error(error);
    }
}


function storeInLocalStorage(endpoint, data, apiPrefix) {
    const storageKey = `${apiPrefix}-${endpoint}`;
    localStorage.setItem(storageKey, JSON.stringify(data));
}

function getFromLocalStorage(endpoint, apiPrefix) {
    const storageKey = `${apiPrefix}-${endpoint}`;
    return JSON.parse(localStorage.getItem(storageKey));
}

