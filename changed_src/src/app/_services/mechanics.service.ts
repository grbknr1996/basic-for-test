/*
	MechanicsService is the lowest level service there is. Because it is injected in every other component and service, it must not import anything else than Angular core stuf (this would create a dependency loop).
*/

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService, TranslationChangeEvent } from '@ngx-translate/core';
import { configuration, environment } from '../../environments/environment'
import packagejson from '../../../package.json';

import { HttpErrorResponse } from '@angular/common/http';
import { instanceType, resizeImage } from '../utils';
import { map, take } from 'rxjs';
import { AnySoaRecord } from 'dns';


const localesMapping = { // for Intl.DateTimeFormat and language switching
	ar: "ar-LB",
	de: "de-DE",
	en: "en-US",
	es: "es-ES",
	fr: "fr-FR",
	id: "id-ID",
	jp: "ja-JP",
	ko: "ko-KR",
	kh: "km-KH",
	ms: "en-MS",
	pt: "pt-PT",
	ro: "ro-RO",
	ru: "ru-RU",
	vi: "vi-VN",
	zh: "zh-CN",
}

@Injectable({
	providedIn: 'root'
})
export class MechanicsService {

	// General variables
	public isLoading: boolean = false;
	private isLoadingTimeout: any = null;
	public contextualMenuVisible: boolean = true;
	public environment: any;
	public breadcrumbs : boolean = true
	public appVersion: string = `v${packagejson.version}`;

	public isLocalHost: boolean = environment.env.toLowerCase() === 'localhost';
	public isBeta: boolean = false
	public isAwsProd: boolean = environment.env.toLowerCase() === 'awsprod';
	public isAwsAcc: boolean = environment.env.toLowerCase() === 'awsacc';
	public isAwsDev: boolean = environment.env.toLowerCase() === 'awsdev';

	public endpoint: string = null
	private searchErrorTimeout = null



	// Language
	public availableLangs: string[] = configuration[instanceType()].availableLangs
	public lang: string
	public translations: any;
	public defaultTranslation;

	public dateFormatterHuman; 
	public dateFormatterISO = new Intl.DateTimeFormat("en-CA",
		{ // "2022-02-01"
			year: "numeric",
			month: "numeric",
			day: "numeric"
		});

	public numberFormatter; 

	public graphsRange = {
		// { applicationDate: [from, to] }
		range: {},

		add: function (field: string, start: string, end: string): void {
			this.range[field] = [start, end]
		},

		reset: function (field: string = '*'): void {
			if (field !== '*') delete this.range[field]
			else this.range = {}
		},

		contains: function (field: string): boolean {
			return (this.range[field] || []).length
		}
	}

	async downloadBase64ImageFromUrl(imageUrl) {
		return this.http.get(imageUrl, {
			observe: 'body',
			responseType: 'arraybuffer',
		  })
		  .pipe(
			take(1),
			map((arrayBuffer) =>
			  btoa(
				Array.from(new Uint8Array(arrayBuffer))
				.map((b) => String.fromCharCode(b))
				.join('')
			  )
			),
		  ).toPromise()
	
	  }

	async getBase64ImageFromUrl(imageUrl:string):Promise<string>{
		let base64 = ''
		try{
			base64 = await this.downloadBase64ImageFromUrl(imageUrl) as string
			if(base64.startsWith("data:binary")){
				base64 = base64.split(',')[1]
			}
			if (!base64.startsWith("data:image")) {
				base64 = `data:image/jpeg;base64,` + base64;
			}
		}
		catch(e){
			base64 = 'data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw=='
		}
		return base64
	}

	constructor(public ts: TranslateService,
		private http:HttpClient,
		public activatedRoute: ActivatedRoute,
		public router: Router) {

		const l: string = `MS constructor - `



		this.environment = environment;
		this.environment.env = (environment.env || "").toLowerCase();

		
		this.isBeta = (localStorage.getItem(`beta`) || '') != ''
 
		this.ts.setDefaultLang(configuration[instanceType()].defaultLanguage)
		this.detectEndpoint()

		this.switchLang() // Initializing language immediately, so it's defined.
		// Extracting the full translations object from Angular translate service :) Cool
		this.ts.onLangChange.subscribe((event: TranslationChangeEvent) => {
			// console.log(`${l}Angular TranslationChangeEvent = `, this.ts.translations);
			this.translations = event.translations
			this.defaultTranslation = this.ts.translations[configuration[instanceType()].defaultLanguage]
			// console.info(`${l}Set ms.translations = `, this.translations);

		});


	}




	_rename_for_special_collection(root: any, needle: string, replace: string) {
		for (let key in root) {
			if (typeof root[key] == 'string') {
				if (root[key].includes(needle)) {
					root[key] = root[key].replace(needle, replace)
				}
			}
			else {
				this._rename_for_special_collection(root[key], needle, replace)
			}
		}
	}

	initDateFormatter(locale?: string): void { // 'en-US'

		const l = `ms.initDateFormatter - `

		// console.log(`${l}Passed locale = `, locale)

		locale = locale || new Intl.NumberFormat().resolvedOptions().locale; // 'en-US'

		// console.log(`${l}Using locale = `, locale)

		this.dateFormatterHuman = new Intl.DateTimeFormat(locale, // If this was in utils.ts, the locale won't update after init. For the locale to be dynamic, this needs to be in a service
			{ // "November 27, 2019"
				timeZone: "Europe/London", // 2023-02-15 problems with Seattle users who see dates the day before, attempting to force Europe timezone
				year: "numeric",
				month: "long",
				day: "numeric"
			});
	}

	initNumberFormatter(locale?: string): void {

		locale = locale || new Intl.NumberFormat().resolvedOptions().locale;

		this.numberFormatter = new Intl.NumberFormat(locale); // Default options are good for decimal formatting. 123456 --> '123,456' or '123 456' (returns a string)
	}

	get isMobileView(): boolean {
		return window.innerWidth <= 800
	}
	

	detectEndpoint() {

		const l: string = `MS detectEndpoint() - `

		// For some reason, Angular's ActivatedRoute is empty at startup (??) so I'm simply using the good old window.location

		// console.log(`${l}ActivatedRoute.url subscription : trying to detect endpoint from window.location.pathname='${window.location.pathname}'`);

		if (window.location.pathname === "/") {
			// console.log(`${l}'this.endpoint' is "/", the page is probably still loading. Skipping for now`);
			return []
		}

		const errMsg: string = `${l}Could not work out the endpoint from URL : '${window.location.pathname}'. Expecting '/:lang/:endpoint'`;

		try {
			this.endpoint = window.location.pathname.split("/")[2]
			// console.log(`${l}Found endpoint : '${this.endpoint}'`);
		} catch (err) {
			console.error(errMsg);
		}

		if (!this.endpoint) {
			console.error(errMsg);
		}

		// console.log(`${l}Found endpoint='${this.endpoint}'`)
	}



	makeRoute({ path = this.endpoint, subpath = '', caller }: { path?: string, subpath?: string, caller?: string }): string {

		const l = `ms.makeroute() - `

		// console.log(`${l}caller='${caller}'`)

		let parts: string[] = ['', this.lang]

		parts.push(path)

		if (subpath) {
			parts.push(subpath)
		}

		const route = parts.join('/');

		// console.log(`${l}route = '${route}'`)

		return route
	}


	setEndpoint(endpoint: string): void {
		this.endpoint = endpoint
	}

	unsetEndpoint(): void {
		this.endpoint = null
	}


	setLoading(state: boolean = true, caller?: string) {

		const l: string = `MS setLoading() - caller = '${caller}' - `

		/*
			Manages the "processing" UI blocker. Displays it only after 1 second so it's not too intrusive
		*/

		// console.log(`${l}state='${state}' this.isLoadingTimeout='${this.isLoadingTimeout}'`);

		if (state && this.isLoadingTimeout) {
			// Some function asked to display the "is processing" blocker, but there's already a timeout in the process (like, another function asked the same thing 0.5s earlier) so I'm just ignoring this request.
			// console.log(`${l}UI blocker is already scheduled to appear. Ignoring this request.`);
			return
		}

		if (state) {

			const delay: number = 800
			// console.log(`${l}Scheduling UI blocker in ${delay}ms...`);

			this.isLoadingTimeout = setTimeout(() => {
				// console.log(`${l}Displaying UI blocker.`)
				this.isLoading = true
			}, delay)

		} else {

			// console.log(`${l}Clearing UI blocker.`);
			clearTimeout(this.isLoadingTimeout);
			this.isLoadingTimeout = null
			this.isLoading = false;
		}

	}

	switchLang(lang?: string) {

		const l: string = `ms.switchLang() - `

		let routeLang

		try {
			routeLang = window.location.pathname.split("/")[1] // Apparently, activatedRoute.snapshot and stuff aren't yet accessible (a service constructor is quite low-level) so I'm using window.location :P
			routeLang = routeLang.toLowerCase();
			// console.log(`${l}Found lang from URL : ${routeLang}`);
		} catch (err) {
			console.warn(`${l}Could not parse language from URL`);
		}

		lang = lang || routeLang

		if (!lang) {
			// console.log(`${l}Using default language 'en'`);
			lang = configuration[instanceType()].defaultLanguage;
		} else if (!this.availableLangs.includes(lang)) {
			console.warn(`Language not supported '${lang}'! Falling back to 'en'`)
			lang = configuration[instanceType()].defaultLanguage;
			this.router.navigate([lang, "datacoverage"])
		}

		// console.log(`${l}using lang = ` + lang);

		this.lang = lang;

		this.initDateFormatter(localesMapping[lang]); // Can be undefined. Will defaut to the user's detected locale
		this.initNumberFormatter(localesMapping[lang]);
		this.ts.use(lang);
	}



	dateToHuman(dateString: string): string {

		const l = `ms.dateToHuman() - `

		// console.log(`\n\n${l}formatting : ${dateString}`)

		if (!dateString) return ''

		// Dates can be "2010-03-02T23:59:59Z" or "1608940799000"

		try {

			let dateShort: string

			if (/^\d{13}$/.test(dateString)) { // "1608940799000" 
				dateShort = new Date(+dateString).toISOString() // '2020-12-25T23:59:59.000Z'
			}

			/*
				Problem : 2012-01-02T23:59:59Z is converted to "January 3" despite the date being January 2.
				It's also converted the day before in other timezones.
				
				I'm removing the T23:59:59Z part. Without any hour nor timezone indication, the day should never be wrong
			*/

			dateShort = dateString.split("T")[0];

			// console.log(`${l}dateShort='${dateShort}'`)

			const newDate: Date = new Date(dateShort)

			// console.log(`${l}newDate.toISOstring() = `, newDate.toISOString())

			const toReturn = this.dateFormatterHuman.format(newDate);

			// console.log(`${l}formatted = `, toReturn)

			return toReturn

		} catch (err) {

			// console.log(`${l}Caught error formatting date '${dateString}' : `, err.message || err)
			return ""
		}
	}

	dateToIso(dateString: string): string {
		if (!dateString) return ''

		// Dates can be "2010-03-02T23:59:59Z" or "1608940799000"

		let date: Date;

		if (/\d{13}/.test(dateString)) {
			date = new Date(+dateString); // "1608940799000" --> "2020-12-25T23:59:59.000Z"
		} else {
			date = new Date(dateString)
		}

		return this.dateFormatterISO.format(date);
	}

	translate(word: string): string {

		const l: string = `ms.translate() - `
		// console.log(`${l}translating ${word}`);

		/*
			Normally, in templates, the | translate pipe is used.
			But from Typescript code, I can just use the JSON language file (which is extracted from the TranslateService in the constructor of MS).
		*/

		if (!this.translations) {
			return "⧗";
		}

		// multilevel support for translation json: level1.level2.level3.level...
		let translation: any = this.translations,
			deafult: any = this.defaultTranslation,
			split = word.split('.');
		try {
			split.forEach(key => { 
				if (translation) {
					translation = translation[key]; 
				}
			})
		} catch (err) {
			// console.log(l, err)
		}

	
		if (translation !== undefined) {
			return translation
		}

		try {
			split.forEach(key => { 
				if (deafult) {
					deafult = deafult[key]; 
				}
			})
		} catch (err) {
			// console.log(l, err)
		}

		if (deafult !== undefined) {
			return deafult
		}
		return word
	}

	async waitForTranslations(): Promise<string> {

		const l = `MS waitforTranslations()`

		// Utility that makes sure translation object is loaded and you can use ms.translate()

		while (!this.translations || !this.defaultTranslation) {
			// console.log(`${l}Translations not yet ready...`)
			await new Promise(r => setTimeout(r, 100))
		}

		return "ok"
	}
}
