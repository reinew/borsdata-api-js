# Borsdata API class written in javascript.

I made this javascript class for a quick and easy use of Borsdata API.

#### Features:
- Easy to use
- All calls are made with a single function
- All functions are documented in the class file
- All calls and responses are asynchronous
- The class returns a promise
- All data is returned as JSON

#### Requirements:
- API key from borsdata.se
- A javascript runtime environment (node.js)
- npm (node package manager)

#### Setup:
Install the dotenv dependency by running:
> npm install

Create .env file in the same folder as the class file, add your API key on a single line.
> API_KEY="\<your api key goes here\>"

#### Usage:
With just three lines of code, you can get the data you want. \
This example code gets all the instruments.
> import BorsdataAPI from "./BorsdataAPI.js" \
> const borsdata = new BorsdataAPI() \
> borsdata.getAllInstruments("instruments").then((data) => { console.log(data) })

See <example.js> for example of an async/await function. \
Take a look in <test.js> for examples of all possible calls.

---

For more info about the API: \
Borsdata's github wiki. \
https://github.com/Borsdata-Sweden/API/wiki

Borsdata API developer tool. \
https://apidoc.borsdata.se/swagger/index.html

---

Please report any issues or bugs [here](https://github.com/reinew/borsdata-api-js/issues).
