// All sample code is provided for illustrative purposes only.
// These examples have not been thoroughly tested under all conditions.
// The creator cannot guarantee or imply reliability, serviceability, or function of these programs.
// All programs contained herein are provided to you “AS IS” without any warranties of any kind.

// Please be advised that functions for global instruments require a pro+ subscription.

// Import the required modules.
import fetch from "node-fetch"
import dotenv from "dotenv"

// Create a class for the Borsdata API.
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

		// Set API variables.
		this.base_url = "https://apiservice.borsdata.se"
		this.version = "v1"
		this.sleep = 0.11 // Max 100 requests allowed per 10s.
	}

	// Call Borsdata API.
	async call(endpoint, params = {}, authKey = this.key) {
		// Building endpoint with params, if any.
		if (Object.keys(params).length > 0) {
			const paramString = Object.entries(params)
				.map(([key, value]) => `${key}=${value}`)
				.join("&")
			endpoint = `${endpoint}?authKey=${authKey}&${paramString}`
		} else {
			endpoint = `${endpoint}?authKey=${authKey}`
		}

		// Building url, setting headers and options.
		const url = `${this.base_url}/${this.version}/${endpoint}`
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
				return await this.call(endpoint, params, authKey)
			} else if (!response.ok) {
				let error = "HTTP error! status: " + response.status + " - " + response.statusText
				if (response.status === 418) {
					error = "HTTP error! status: " + response.status + " - No global access"
				}
				throw new Error(error)
			}
			await new Promise((resolve) => setTimeout(resolve, this.sleep)) // Sleep to avoid rate limit.
			return await response.json()
		} catch (error) {
			console.error(error.message)
			process.exit(1)
		}
	}

	// Returns All Nordic Instruments
	async getAllInstruments() {
		const endpoint = "instruments"
		return await this.call(endpoint)
	}

	// Returns all Global Instruments. (Require Pro+)
	async getAllGlobalInstruments() {
		const endpoint = "instruments/global"
		return await this.call(endpoint)
	}

	// Returns all Updated Nordic Instruments
	async getAllUpdatedInstruments() {
		const endpoint = "instruments/updated"
		return await this.call(endpoint)
	}

	// Returns Kpis History. Nordic
	async getKpisHistory(insId, kpiId, reportType, priceType, maxCount) {
		const endpoint = `instruments/${insId}/kpis/${kpiId}/${reportType}/${priceType}/history`
		const params = {
			maxCount: maxCount,
		}
		return await this.call(endpoint, params)
	}

	// Returns Kpis summary list
	async getKpisSummary(insId, reportType, maxCount) {
		const endpoint = `instruments/${insId}/kpis/${reportType}/summary`
		const params = {
			maxCount: maxCount,
		}
		return await this.call(endpoint, params)
	}

	// Returns Kpis History for list of instruments. (Instrument Array)
	async getHistoricalKpis(kpiId, reportType, priceType, instList) {
		const endpoint = `instruments/kpis/${kpiId}/${reportType}/${priceType}/history`
		const params = {
			instList: instList,
		}
		return await this.call(endpoint, params)
	}

	// Returns Kpis Data for one Instrument
	async getKpisForOneInstrument(insId, kpiId, calcGroup, calc) {
		const endpoint = `instruments/${insId}/kpis/${kpiId}/${calcGroup}/${calc}`
		return await this.call(endpoint)
	}

	// Returns Kpis Data for all Instruments
	async getKpisForAllInstruments(kpiId, calcGroup, calc) {
		const endpoint = `instruments/kpis/${kpiId}/${calcGroup}/${calc}`
		return await this.call(endpoint)
	}

	// Returns Kpis Data for all Global Instruments (Require Pro+)
	async getKpisForAllGlobalInstruments(kpiId, calcGroup, calc) {
		const endpoint = `instruments/global/kpis/${kpiId}/${calcGroup}/${calc}`
		return await this.call(endpoint)
	}

	// Returns Nordic Kpis Calculation DateTime
	async getKpisUpdated() {
		const endpoint = `instruments/kpis/updated`
		return await this.call(endpoint)
	}

	// Returns Kpis metadata
	async getKpisMetadata() {
		const endpoint = `instruments/kpis/metadata`
		return await this.call(endpoint)
	}

	// Returns Reports for Instrument. Report Type (year, r12, quarter)
	async getReportsByType(insId, reportType, maxCount) {
		const endpoint = `instruments/${insId}/reports/${reportType}`
		const params = {
			maxCount: maxCount,
		}
		return await this.call(endpoint)
	}

	// Returns Reports for one Instrument, All Reports Type included. (year, r12, quarter)
	async getReportsForAllTypes(insId, maxYearCount, maxR12QCount) {
		const endpoint = `instruments/${insId}/reports`
		const params = {
			maxYearCount: maxYearCount,
			maxR12QCount: maxR12QCount,
		}
		return await this.call(endpoint, params)
	}

	// Returns Report metadata
	async getReportsMetadata() {
		const endpoint = `instruments/reports/metadata`
		return await this.call(endpoint)
	}

	// Returns Reports for list of instruments (Instrument Array)
	async getAllReports(instList, maxYearCount, maxR12QCount) {
		const endpoint = `instruments/reports`
		const params = {
			instList: instList,
			maxYearCount: maxYearCount,
			maxR12QCount: maxR12QCount,
		}
		return await this.call(endpoint, params)
	}

	// Returns StockPrices for Instrument
	async getStockPricesForInstrument(insId, from, to, maxCount) {
		const endpoint = `instruments/${insId}/stockprices`
		const params = {
			from: from,
			to: to,
			maxCount: maxCount,
		}
		return await this.call(endpoint, params)
	}

	// Returns StockPrice for list of Instruments. (Instrument Array) (Max 50 instruments)
	async getStockPricesForListOfInstruments(instList, from, to) {
		const endpoint = `instruments/stockprices`
		const params = {
			instList: instList,
			from: from,
			to: to,
		}
		return await this.call(endpoint, params)
	}

	// Returns Last StockPrices for all Instruments. Only Nordic(Pro)
	async getLastStockPrices() {
		const endpoint = `instruments/stockprices/last`
		return await this.call(endpoint)
	}

	// Returns Last/Latest StockPrices for all Global Instruments. Only Global(Pro+)
	async getLastGlobalStockPrices() {
		const endpoint = `instruments/stockprices/global/last`
		return await this.call(endpoint)
	}

	// Returns one StockPrice for each Instrument for a specific date. Only Nordic(Pro)
	async getStockPricesForDate(date) {
		const endpoint = `instruments/stockprices/date`
		const params = {
			date: date,
		}
		return await this.call(endpoint, params)
	}

	// Returns one StockPrice for each global Instrument for a specific date. Only Global(Pro+)
	async getGlobalStockPricesForDate(date) {
		const endpoint = `instruments/stockprices/global/date`
		const params = {
			date: date,
		}
		return await this.call(endpoint, params)
	}

	// Returns Stock Splits for all Instruments
	async getStockSplits() {
		const endpoint = `instruments/stockSplits`
		return await this.call(endpoint)
	}
}

export default BorsdataAPI
