// All sample code is provided for illustrative purposes only.
// These examples have not been thoroughly tested under all conditions.
// The creator cannot guarantee or imply reliability, serviceability, or function of these programs.
// All programs contained herein are provided to you “AS IS” without any warranties of any kind.

// This simple example imports the API class file, initiates the class,
// returns an array of all instruments and prints the result in json format.

// Run this example with: node example.js

// Import the API class file.
import BorsdataAPI from "./BorsdataAPI.js"

// Initiate functions from Borsdata API class.
const borsdata = new BorsdataAPI()

// Make the API call and print the result to console.
borsdata.getAllInstruments("instruments").then((data) => {
	console.log(data)
})
