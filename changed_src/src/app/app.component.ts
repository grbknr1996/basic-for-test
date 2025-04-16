import { ChangeDetectorRef, Component, ViewEncapsulation, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import {v4 as uuidv4} from 'uuid';

import { environment } from "../environments/environment"
import { MechanicsService } from './_services/mechanics.service';
import { HttpClient } from '@angular/common/http';
import { instanceType } from './utils';
import { Header } from 'primeng/api';


declare const SmartlingContextTracker

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	standalone: false,
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {

	public environment = environment
	public headerHTML = ""
	public hashSearches: string = localStorage.getItem(`hashSearches`)

	constructor(
		private router: Router,
		public ms: MechanicsService,
		public http: HttpClient,
		private changeDetector: ChangeDetectorRef) {

	}

	select_with_lang(value){
		return value ? (value[this.ms.lang] || value["en"]) : ''
	}

	
	async ngOnInit() {
	
		const l = `app.component ngOnInit() - `
		
		let state: string = window.location.pathname + window.location.search;


		this.router.navigateByUrl(state, {
			skipLocationChange: false,
			replaceUrl: true
		})

	}
	

	ngAfterViewChecked() {
		this.changeDetector.detectChanges();
	}


	get windowWidth(): number {
		return window.innerWidth
	}
}

