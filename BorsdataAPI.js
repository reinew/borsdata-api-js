/**
 * @file BorsdataAPI.js
 * @description Borsdata API class.
 * @author ReineW
 * @license MIT
 * @link https://github.com/reinew/borsdata-api-js
 *
 * This class is a wrapper for easily interacting with Borsdata API.
 *
 * This class have not been thoroughly tested under all conditions.
 * The creator cannot guarantee or imply reliability, serviceability, or function of this class.
 * All code contained herein are provided to you “AS IS” without any warranties of any kind.
 */

/** Import the required module.
 * @requires dotenv
 * @link https://www.npmjs.com/package/dotenv
 */
import dotenv from "dotenv"

/** Borsdata API class.
 * @class BorsdataAPI
 * @param {string} key API key.
 * @const {string} BASE_URL - API base url.
 * @const {string} VERSION - API version.
 * @const {number} RATE_LIMIT - API rate limit.
 * @returns {object} an BorsdataAPI class.
 */
class BorsdataAPI {
	constructor() {
		// Load environment variables.
		try {
			const result = dotenv.config()

			if (result.error) {
				throw new Error("Missing .env file.")
			}
			this.key = process.env.API_KEY

			if (!this.key) {
				throw new Error("API key not found in environment variables.")
			}
		} catch (error) {
			console.error(error.message)
			process.exit(1)
		}

		/** Set API variables.
		 * @const {string} BASE_URL - API base url.
		 * @const {string} VERSION - API version.
		 * @const {number} RATE_LIMIT - API rate limit.
		 */
		this.BASE_URL = "https://apiservice.borsdata.se"
		this.VERSION = "v1"
		this.RATE_LIMIT = 0.11 // Rate limit, max 100 requests allowed per 10s.
	}

	/** This method calls Borsdata API.
	 * @param {string} requestUrl API request URL.
	 * @param {object} params API parameters.
	 * @param {string} authKey API key from environment variable.
	 * @returns {object} a promise that resolves to the parsed JSON data.
	 * @throws {error} API error.
	 */
	async getDataFromApi(requestUrl, params = {}, authKey = this.key) {
		// Building requestUrl with params, if any.
		if (Object.keys(params).length > 0) {
			const paramString = Object.entries(params)
				.map(([key, value]) => `${key}=${value}`)
				.join("&")
			requestUrl = `${requestUrl}?authKey=${authKey}&${paramString}`
		} else {
			requestUrl = `${requestUrl}?authKey=${authKey}`
		}

		// Building url, setting headers and options.
		const url = `${this.BASE_URL}/${this.VERSION}/${requestUrl}`
		const headers = {
			"Content-Type": "application/json",
			Accept: "application/json",
		}
		const options = {
			method: "GET",
			headers: headers,
		}

		// Fetching data and returning json.
		try {
			const response = await fetch(url, options)
			if (response.status === 429) {
				const retryAfter = response.headers.get("Retry-After")
				console.warn(`Rate limited! Retrying after ${retryAfter} seconds...`)
				await new Promise((resolve) => setTimeout(resolve, retryAfter * 1000))
				return await this.getDataFromApi(requestUrl, params, authKey)
			} else if (!response.ok) {
				let error = "HTTP error! status: " + response.status + " - " + response.statusText
				if (response.status === 418) {
					error = "HTTP error! status: " + response.status + " - No global access"
				}
				throw new Error(error)
			}
			await new Promise((resolve) => setTimeout(resolve, this.RATE_LIMIT)) // Avoid rate limit.
			return await response.json()
		} catch (error) {
			console.error(error.message)
			process.exit(1)
		}
	}

	/** This method returns all nordic instruments or metadata. \
	 * \
	 * Choose one of the following API options: \
	 * 'instruments' - Returns all instruments. \
	 * 'branches' - Returns all branches. \
	 * 'countries' - Returns all countries for nordic. \
	 * 'markets' - Returns all markets. \
	 * 'sectors' - Returns all sectors. \
	 * 'translationmetadata' - Returns language translations for bransch, sector and country.
	 *
	 * @param {string} option API option.
	 * @returns {object} a promise that resolves to the parsed JSON data.
	 * @link https://github.com/Borsdata-Sweden/API/wiki/Instruments
	 */
	async getAllInstruments(option) {
		return await this.getDataFromApi(option)
	}

	/** This method returns Holdings data in the nordic for a list of instruments. (Require Pro+)
	 * \
	 * Choose one of the following API options: \
	 * 'insider' - Returns holdings insider. \
	 * 'shorts' - Returns holdings short. \
	 * 'buyback' - Returns holdings buyback.
	 * \
	 * @param {string} holdingsOption API option.
	 * @param {string} instList Comma separated list of instrument id's. (Max 50) (Get all different id's with the "getAllInstruments('instruments')" method.)
	 * @returns {object} a promise that resolves to the parsed JSON data.
	 * @link https://github.com/Borsdata-Sweden/API/wiki/Holdings
	 */
	async getHoldings(holdingsOption, instList) {
		const params = {
			instList: instList,
		}
		const requestUrl = `holdings/${holdingsOption}`
		return await this.getDataFromApi(requestUrl, params)
	}

	/** This method returns all global instruments. (Require Pro+)
	 * @returns {object} a promise that resolves to the parsed JSON data.
	 * @link https://github.com/Borsdata-Sweden/API/wiki/Instruments
	 */
	async getAllGlobalInstruments() {
		return await this.getDataFromApi("instruments/global")
	}

	/** This method returns all updated nordic instruments.
	 * @returns {object} a promise that resolves to the parsed JSON data.
	 * @link https://github.com/Borsdata-Sweden/API/wiki/Instruments
	 */
	async getAllUpdatedInstruments() {
		return await this.getDataFromApi("instruments/updated")
	}

	/** This method returns descriptions for a list of instruments.
	 * @param {string} instList Comma separated list of instrument id's. (Max 50) (Get all different id's with the "getAllInstruments('instruments')" method.)
	 * @returns {object} a promise that resolves to the parsed JSON data.
	 * @link https://github.com/Borsdata-Sweden/API/wiki/Instruments
	 */
	async getInstrumentDescriptions($instList) {
		const params = {
			instList: $instList,
		}
		return await this.getDataFromApi("instruments/description", params)
	}

	/** This method returns calendar data for the nordic market.
	 * @param {string} calendarOption API option. (report, dividend)
	 * @param {string} instList Comma separated list of instrument id's. (Max 50) (Get all different id's with the "getAllInstruments('instruments')" method.)
	 * @returns {object} a promise that resolves to the parsed JSON data.
	 * @link https://github.com/Borsdata-Sweden/API/wiki/Calendar
	 */
	async getCalendar(calendarOption, instList) {
		const params = {
			instList: instList,
		}
		const requestUrl = `instruments/${calendarOption}/calendar`
		return await this.getDataFromApi(requestUrl, params)
	}

	/** This method returns kpi history for the nordic market.
	 * @param {int} insId Instrument id. (Get all different id's with the "getAllInstruments('instruments')" method.)
	 * @param {int} kpiId Kpi id. (Get all different id's with the "getKpiMetadata()" method.)
	 * @param {string} reportType Report type. (year, r12, quarter)
	 * @param {string} priceType Price type. (low, mean or high)
	 * @param {int} maxCount Max number of results returned. (Max Year=20, R12&Quarter=40) (optional)
	 * @returns {object} a promise that resolves to the parsed JSON data.
	 * @link https://github.com/Borsdata-Sweden/API/wiki/KPI-History
	 */
	async getKpisHistory(insId, kpiId, reportType, priceType, maxCount = null) {
		const requestUrl = `instruments/${insId}/kpis/${kpiId}/${reportType}/${priceType}/history`

		const params = {}

		if (maxCount !== null) {
			params.maxCount = maxCount
		}

		return await this.getDataFromApi(requestUrl, params)
	}

	/** This method returns a kpi summary list for one instrument in the nordic market.
	 * @param {int} insId Instrument id. (Get all different id's with the "getAllInstruments('instruments')" method.)
	 * @param {string} reportType Report type. (year, r12, quarter)
	 * @param {int} maxCount Max number of results returned. (optional)
	 * @returns {object} a promise that resolves to the parsed JSON data.
	 * @link https://github.com/Borsdata-Sweden/API/wiki/KPI-History
	 */
	async getKpiSummary(insId, reportType, maxCount = null) {
		const requestUrl = `instruments/${insId}/kpis/${reportType}/summary`

		const params = {}

		if (maxCount !== null) {
			params.maxCount = maxCount
		}

		return await this.getDataFromApi(requestUrl, params)
	}

	/** This method returns kpi history for a list of instruments in the nordic market.
	 * @param {int} kpiId Kpi id. (Get all different id's with the "getKpiMetadata()" method.)
	 * @param {string} reportType Report type. (year, r12, quarter)
	 * @param {string} priceType Price type. (low, mean or high)
	 * @param {string} instList Comma separated list of instrument id's. (Max 50)  (Get all different id's with the getAllInstruments('instruments') method.)
	 * @param {int} maxCount Max number of results returned. (Max Year=20, R12&Quarter=40) (optional)
	 * @returns {object} a promise that resolves to the parsed JSON data.
	 * @link https://github.com/Borsdata-Sweden/API/wiki/KPI-History
	 */
	async getHistoricalKpis(kpiId, reportType, priceType, instList, maxCount = null) {
		const requestUrl = `instruments/kpis/${kpiId}/${reportType}/${priceType}/history`

		const params = {
			instList: instList,
		}

		if (maxCount !== null) {
			params.maxCount = maxCount
		}

		return await this.getDataFromApi(requestUrl, params)
	}

	/** This method returns kpi data for one instrument in the nordic market.
	 * @param {int} insId Instrument id. (Get all different id's with the getAllInstruments('instruments') method.)
	 * @param {int} kpiId Kpi id. (Get all different id's with the "getKpiMetadata()" method.)
	 * @param {string} calcGroup Kpi calculation group. Mainly based on time.
	 * @param {string} calc Kpi calculation.
	 * @returns {object} a promise that resolves to the parsed JSON data.
	 * @link https://github.com/Borsdata-Sweden/API/wiki/KPI-Screener
	 */
	async getKpisForOneInstrument(insId, kpiId, calcGroup, calc) {
		const requestUrl = `instruments/${insId}/kpis/${kpiId}/${calcGroup}/${calc}`
		return await this.getDataFromApi(requestUrl)
	}

	/** This method returns kpi data for all instruments in the nordic market.
	 * @param {int} kpiId Kpi id. (Get all different id's with the "getKpiMetadata()" method.)
	 * @param {string} calcGroup Kpi calculation group. Mainly based on time.
	 * @param {string} calc Kpi calculation.
	 * @returns {object} a promise that resolves to the parsed JSON data.
	 * @link https://github.com/Borsdata-Sweden/API/wiki/KPI-Screener
	 */
	async getKpisForAllInstruments(kpiId, calcGroup, calc) {
		const requestUrl = `instruments/kpis/${kpiId}/${calcGroup}/${calc}`
		return await this.getDataFromApi(requestUrl)
	}

	/** This method returns kpi data for all global instruments. (Require Pro+)
	 * @param {int} kpiId Kpi id. (Get all different id's with the "getKpiMetadata()" method.)
	 * @param {string} calcGroup Kpi calculation group. Mainly based on time.
	 * @param {string} calc Kpi calculation.
	 * @returns {object} a promise that resolves to the parsed JSON data.
	 * @link https://github.com/Borsdata-Sweden/API/wiki/KPI-Screener
	 */
	async getKpisForAllGlobalInstruments(kpiId, calcGroup, calc) {
		const requestUrl = `instruments/global/kpis/${kpiId}/${calcGroup}/${calc}`
		return await this.getDataFromApi(requestUrl)
	}

	/** This method returns nordic kpi last updated calculation dateTime.
	 * @returns {object} a promise that resolves to the parsed JSON data.
	 * @link https://github.com/Borsdata-Sweden/API/wiki/KPI-Screener
	 */
	async getKpisUpdated() {
		return await this.getDataFromApi("instruments/kpis/updated")
	}

	/** This method returns kpi metadata.
	 * @returns {object} a promise that resolves to the parsed JSON data.
	 * @link https://github.com/Borsdata-Sweden/API/wiki/KPI-Screener
	 */
	async getKpisMetadata() {
		return await this.getDataFromApi("instruments/kpis/metadata")
	}

	/** This method returns reports for one instrument with one report type for the nordic market.
	 * @param {int} insId Instrument id. (Get all different id's with the "getAllInstruments('instruments')" method.)
	 * @param {string} reportType Report type. (year, r12, quarter)
	 * @param {int} maxCount Max number of results returned. (Max Year=20, R12&Quarter=40) (optional)
	 * @returns {object} a promise that resolves to the parsed JSON data.
	 * @link https://github.com/Borsdata-Sweden/API/wiki/Reports
	 */
	async getReportsByType(insId, reportType, maxCount = null) {
		const requestUrl = `instruments/${insId}/reports/${reportType}`

		const params = {}

		if (maxCount !== null) {
			params.maxCount = maxCount
		}

		return await this.getDataFromApi(requestUrl, params)
	}

	/** This method returns reports for one instrument with all report types included. (year, r12, quarter)
	 * @param {int} insId Instrument id. (Get all different id's with the "getAllInstruments('instruments')" method.)
	 * @param {int} maxYearCount Max number of year reports returned. (10 year default, max 20) (optional)
	 * @param {int} maxR12QCount Max number of r12 and quarter reports returned. (10 default, max 40) (optional)
	 * @returns {object} a promise that resolves to the parsed JSON data.
	 * @link https://github.com/Borsdata-Sweden/API/wiki/Reports
	 */
	async getReportsForAllTypes(insId, maxYearCount = null, maxR12QCount = null) {
		const requestUrl = `instruments/${insId}/reports`

		const params = {}

		if (maxYearCount !== null) {
			params.maxYearCount = maxYearCount
		}

		if (maxR12QCount !== null) {
			params.maxR12QCount = maxR12QCount
		}

		return await this.getDataFromApi(requestUrl, params)
	}

	/** This method returns report metadata for the nordic market.
	 * @returns {object} a promise that resolves to the parsed JSON data.
	 * @link https://github.com/Borsdata-Sweden/API/wiki/Reports
	 */
	async getReportsMetadata() {
		return await this.getDataFromApi("instruments/reports/metadata")
	}

	/** This method returns reports for list of instruments with all report types included. (year, r12, quarter)
	 * @param {string} instList Comma separated list of instrument id's. (Max 50) (Get all different id's with the "getAllInstruments('instruments')" method.)
	 * @param {int} maxYearCount Max number of year reports returned. (10 year default, max 20) (optional)
	 * @param {int} maxR12QCount Max number of r12 and quarter reports returned. (10 default, max 40) (optional)
	 * @returns {object} a promise that resolves to the parsed JSON data.
	 * @link https://github.com/Borsdata-Sweden/API/wiki/Reports
	 */
	async getAllReports(instList, maxYearCount = null, maxR12QCount = null) {
		const params = {
			instList: instList,
		}

		if (maxYearCount !== null) {
			params.maxYearCount = maxYearCount
		}

		if (maxR12QCount !== null) {
			params.maxR12QCount = maxR12QCount
		}

		return await this.getDataFromApi("instruments/reports", params)
	}

	/** This method returns stockprices for one instrument between two dates for the nordic market.
	 * @param {int} insId Instrument id. (Get all different id's with the "getAllInstruments('instruments')" method.)
	 * @param {string} from From date. (YYYY-MM-DD) (optional)
	 * @param {string} to To date. (YYYY-MM-DD) (optional)
	 * @param {int} maxCount Max number of results returned. (Max 20) (optional)
	 * @returns {object} a promise that resolves to the parsed JSON data.
	 * @link https://github.com/Borsdata-Sweden/API/wiki/Stockprice
	 */
	async getStockPricesForInstrument(insId, from = null, to = null, maxCount = null) {
		const requestUrl = `instruments/${insId}/stockprices`

		const params = {}

		if (from !== null) {
			params.from = from
		}

		if (to !== null) {
			params.to = to
		}

		if (maxCount !== null) {
			params.maxCount = maxCount
		}

		return await this.getDataFromApi(requestUrl, params)
	}

	/** This method returns stockprices for a list of instruments between two dates for the nordic market.
	 * @param {string} instList Comma separated list of instrument id's. (Max 50) (Get all different id's with the "getAllInstruments('instruments')" method.)
	 * @param {string} from From date. (YYYY-MM-DD) (optional)
	 * @param {string} to To date. (YYYY-MM-DD) (optional)
	 * @returns {object} a promise that resolves to the parsed JSON data.
	 * @link https://github.com/Borsdata-Sweden/API/wiki/Stockprice
	 */
	async getStockPricesForListOfInstruments(instList, from = null, to = null) {
		const params = {
			instList: instList,
		}

		if (from !== null) {
			params.from = from
		}

		if (to !== null) {
			params.to = to
		}

		return await this.getDataFromApi("instruments/stockprices", params)
	}

	/** This method returns last stockprices for all nordic instruments.
	 * @returns {object} a promise that resolves to the parsed JSON data.
	 * @link https://github.com/Borsdata-Sweden/API/wiki/Stockprice
	 */
	async getLastStockPrices() {
		return await this.getDataFromApi("instruments/stockprices/last")
	}

	/** This method returns last/latest stockprices for all global instruments. Only Global(Pro+)
	 * @returns {object} a promise that resolves to the parsed JSON data.
	 * @link https://github.com/Borsdata-Sweden/API/wiki/Stockprice
	 */
	async getLastGlobalStockPrices() {
		return await this.getDataFromApi("instruments/stockprices/global/last")
	}

	/** This method returns one stock price for each nordic instrument on a specific date.
	 * @param {string} date Date. (YYYY-MM-DD)
	 * @returns {object} a promise that resolves to the parsed JSON data.
	 * @link https://github.com/Borsdata-Sweden/API/wiki/Stockprice
	 */
	async getStockPricesForDate(date) {
		const params = {
			date: date,
		}
		return await this.getDataFromApi("instruments/stockprices/date", params)
	}

	/** This method returns one stock price for each global instrument on a specific date. Only Global(Pro+)
	 * @param {string} date Date. (YYYY-MM-DD)
	 * @returns {object} a promise that resolves to the parsed JSON data.
	 * @link https://github.com/Borsdata-Sweden/API/wiki/Stockprice
	 */
	async getGlobalStockPricesForDate(date) {
		const params = {
			date: date,
		}
		return await this.getDataFromApi("instruments/stockprices/global/date", params)
	}

	/** This method returns stock splits for all nordic instruments. Max 1 year history.
	 * @returns {object} a promise that resolves to the parsed JSON data.
	 */
	async getStockSplits() {
		return await this.getDataFromApi("instruments/stockSplits")
	}
}

export default BorsdataAPI
