/**
 * @file example.js
 * @description Example on how to use the BorsdataAPI class.
 * @author ReineW
 * @license MIT
 * @link https://github.com/reinew/borsdata-api-js
 *
 * All sample code is provided for illustrative purposes only.
 * These examples have not been thoroughly tested under all conditions.
 * The creator cannot guarantee or imply reliability, serviceability, or function of this class.
 * All code contained herein are provided to you “AS IS” without any warranties of any kind.
 *
 * This simple example imports the API class file, initiates the class,
 * returns an object of all instruments and prints the result in json format.
 *
 * Run this script with the following command: node example.js
 */

// Import the API class file.
import BorsdataAPI from "./BorsdataAPI.js"

// Initiate methods from BorsdataAPI class.
const borsdata = new BorsdataAPI()

// Async function to get all instruments.
async function getInstruments() {
	try {
		const data = await borsdata.getAllInstruments("instruments")
		return data.instruments
	} catch (error) {
		console.error(error)
		process.exit(1)
	}
}

// Call the async function and print the result.
getInstruments().then((data) => {
	console.log(data)
})
