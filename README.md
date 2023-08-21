# Borsdata API class written in javascript.

I made this javascript class for a quick and easy use of Borsdata API.

#### Setup:
Create a .env file in the same folder as the class file, and add your API key on a single line.
> API_KEY="\<your api key goes here\>"

Then, install the dependencies by running:
> npm install

#### Usage:
Now, with just three lines of code, you can get the data you want.

This example code gets all the instruments.
> import BorsdataAPI from "./BorsdataAPI.js" \
> const borsdata = new BorsdataAPI() \
> borsdata.getAllInstruments("instruments").then((data) => { console.log(data) })

See <example.js> for more info about the code above, \
and take a look in <test.js> for all possible calls more in depth. \

---

For more info about the API: \
Borsdata's github wiki. \
https://github.com/Borsdata-Sweden/API/wiki

Borsdata API developer tool. \
https://apidoc.borsdata.se/swagger/index.html

---

Please report any issues or bugs [here](https://github.com/reinew/borsdata-api-js/issues).
