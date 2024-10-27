/**
 * @file test.js
 * @description Examples on how to use the BorsdataAPI class.
 * @author ReineW
 * @license MIT
 * @link https://github.com/reinew/borsdata-api-js
 *
 * All sample code is provided for illustrative purposes only.
 * These examples have not been thoroughly tested under all conditions.
 * The creator cannot guarantee or imply reliability, serviceability, or function of this class.
 * All code contained herein are provided to you “AS IS” without any warranties of any kind.
 *
 * Run this script with the following command: node test.js <method number> (1-25)
 */

// Import the API class file.
import BorsdataAPI from "./BorsdataAPI.js"

// Initiate methods from BorsdataAPI class.
const borsdata = new BorsdataAPI()

// Test parameters for methods.
const instrumentsOption = "instruments" // Options: branches, countries, markets, sectors, instruments, translationmetadata
const holdingsOption = "insider" // Options: insider, shorts, buyback
const calendarOption = "report" // Options: report, dividend
const insId = "3" // Get all different id's with the getAllInstruments('instruments') method.
const kpiId = "2" // Get all different id's with the getKpiMetadata() method.
const reportType = "year" // Options: year, quarter, r12
const priceType = "mean" // Options: low, mean, high
const calcGroup = "last" // For KPI-Screener, for more info, see https://github.com/Borsdata-Sweden/API/wiki/KPI-Screener
const calc = "latest" // For KPI-Screener, for more info, see https://github.com/Borsdata-Sweden/API/wiki/KPI-Screener
const from = "2024-01-01" // For stock price history. (optional, can be empty)
const to = "2024-10-25" // For stock price history. (optional, can be empty)
const maxCount = "2" // 10 default. year=20 max, r12 & quarter=40 max. (optional, can be empty)
const maxYearCount = "2" // 10 default, 20 max.
const maxR12QCount = "2" // 10 default, 40 max.
const date = "2024-10-25" // For stockprices date.
const instList = "2,3,6" // List of instrument id's.
const original = "1" // get original report data currency. (optional) {0, 1}

// all possible API calls as methods
switch (process.argv[2]) {
	case "1": // Returns All Nordic Instruments
		borsdata.getAllInstruments(instrumentsOption).then((data) => console.log(data))
		break
	case "2": // Returns holdings (Require Pro+)
		borsdata.getHoldings(holdingsOption, instList).then((data) => console.log(data))
		break
	case "3": // Returns all Global Instruments. (Require Pro+)
		borsdata.getAllGlobalInstruments().then((data) => console.log(data))
		break
	case "4": // Returns all Updated Nordic Instruments
		borsdata.getAllUpdatedInstruments().then((data) => console.log(data))
		break
	case "5": // Returns descriptions for a list of instruments.
		borsdata.getInstrumentDescriptions(instList).then((data) => console.log(data))
		break
	case "6": // Returns calendar data for a list of instruments.
		borsdata.getCalendar(calendarOption, instList).then((data) => console.log(JSON.stringify(data, null, 2)))
		break
	case "7": // Returns Kpis History. Nordic
		borsdata.getKpisHistory(insId, kpiId, reportType, priceType, maxCount).then((data) => console.log(data))
		break
	case "8": // Returns Kpis summary list
		borsdata.getKpiSummary(insId, reportType, maxCount).then((data) => console.log(JSON.stringify(data, null, 2)))
		break
	case "9": // Returns Kpis History for list of instruments. (Instrument Array)
		borsdata
			.getHistoricalKpis(kpiId, reportType, priceType, instList, maxCount)
			.then((data) => console.log(JSON.stringify(data, null, 2)))
		break
	case "10": // Returns Kpis Data for one Instrument
		borsdata.getKpisForOneInstrument(insId, kpiId, calcGroup, calc).then((data) => console.log(data))
		break
	case "11": // Returns Kpis Data for all Instruments
		borsdata.getKpisForAllInstruments(kpiId, calcGroup, calc).then((data) => console.log(data))
		break
	case "12": // Returns Kpis Data for all Global Instruments (Require Pro+)
		borsdata.getKpisForAllGlobalInstruments(kpiId, calcGroup, calc).then((data) => console.log(data))
		break
	case "13": // Returns Nordic Kpis Calculation DateTime
		borsdata.getKpisUpdated().then((data) => console.log(data))
		break
	case "14": // Returns Kpis metadata
		borsdata.getKpisMetadata().then((data) => console.log(data))
		break
	case "15": // Returns Reports for Instrument. Report Type (year, r12, quarter)
		borsdata.getReportsByType(insId, reportType, maxCount, original).then((data) => console.log(data))
		break
	case "16": // Returns Reports for one Instrument, All Reports Type included. (year, r12, quarter)
		borsdata.getReportsForAllTypes(insId, maxYearCount, maxR12QCount, original).then((data) => console.log(data))
		break
	case "17": // Returns Report metadata
		borsdata.getReportsMetadata().then((data) => console.log(data))
		break
	case "18": // Returns Reports for list of instruments (Instrument Array)
		borsdata
			.getAllReports(instList, maxYearCount, maxR12QCount, original)
			.then((data) => console.log(JSON.stringify(data, null, 2)))
		break
	case "19": // Returns StockPrices for Instrument
		borsdata.getStockPricesForInstrument(insId, from, to, maxCount).then((data) => console.log(data))
		break
	case "20": // Returns StockPrice for list of Instruments. (Instrument Array) (Max 50 instruments)
		borsdata
			.getStockPricesForListOfInstruments(instList, from, to)
			.then((data) => console.log(JSON.stringify(data, null, 2)))
		break
	case "21": // Returns Last StockPrices for all Instruments. Only Nordic(Pro)
		borsdata.getLastStockPrices().then((data) => console.log(data))
		break
	case "22": // Returns Last/Latest StockPrices for all Global Instruments. Only Global(Pro+)
		borsdata.getLastGlobalStockPrices().then((data) => console.log(data))
		break
	case "23": // Returns one StockPrice for each Instrument for a specific date. Only Nordic(Pro)
		borsdata.getStockPricesForDate(date).then((data) => console.log(data))
		break
	case "24": // Returns one StockPrice for each global Instrument for a specific date. Only Global(Pro+)
		borsdata.getGlobalStockPricesForDate(date).then((data) => console.log(data))
		break
	case "25": // Returns Stock Splits for all Instruments
		borsdata.getStockSplits(from).then((data) => console.log(data))
		break

	default:
		console.log("No method selected")
}
