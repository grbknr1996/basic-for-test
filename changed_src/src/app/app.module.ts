

// ANGULAR CORE

import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { providePrimeNG } from 'primeng/config';
import Material from "@primeng/themes/material";

import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS, HttpBackend } from '@angular/common/http';

import { ButtonModule } from 'primeng/button';
import { MenubarModule } from 'primeng/menubar';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { BlockUIModule } from 'primeng/blockui';
import { SelectModule } from 'primeng/select';


// ENVIRONMENT

import { environment } from "../environments/environment"
import { instanceType } from './utils';

// CACHE BUSTING

import cacheBusting from '../../assets-cache-busting.json';

// TRANSLATION

import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { MultiTranslateHttpLoader } from 'ngx-translate-multi-http-loader'

// https://github.com/ngx-translate/core
// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpBackend) {
	return new MultiTranslateHttpLoader(
		http, 
		[{prefix:'./assets' + '/i18n/' + instanceType() + '/', suffix: '.json?_=' + cacheBusting['i18n'], optional: true},
		 {prefix:'./assets' + '/i18n/' + 'default' + '/', suffix:'.json?_=' + cacheBusting['i18n']}
		])


}

import { NgxEchartsModule } from 'ngx-echarts';
// import echarts core
import * as echarts from 'echarts/core';
// import necessary echarts components
import { MapChart } from 'echarts/charts';
import { GridComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
echarts.use([MapChart, GridComponent, CanvasRenderer]);

import { CompMenuBar } from './components/comp-nav-bar/comp-nav-bar.component';

import { NbFromater } from './_pipes/nbformater.pipe';

// PAGES COMPONENTS

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';


import { PageRedirectComponent } from './pages/page-redirect/page-redirect.component';
import { PageNotfoundComponent } from './pages/page-notfound/page-notfound.component';

import { PageAboutComponent } from './pages/page-about/page-about.component';


import { DataViewModule } from 'primeng/dataview';
import { AddHeaderInterceptor } from './_services/http-client';

@NgModule({
	declarations: [
		CompMenuBar,

		AppComponent,
		PageRedirectComponent,
		PageNotfoundComponent,
		PageAboutComponent,
		NbFromater
	],
	imports: [
		BrowserModule,
		BrowserAnimationsModule,
		ButtonModule,
		BlockUIModule,
		ProgressSpinnerModule,
		MenubarModule,
		SelectModule,
		AppRoutingModule,
		FormsModule,
		HttpClientModule,
		DataViewModule,

		// https://github.com/ngx-translate/core
		TranslateModule.forRoot({

			defaultLanguage: 'en',

			loader: {
				provide: TranslateLoader,
				useFactory: HttpLoaderFactory,
				deps: [HttpBackend]
			}
		}),
		NgxEchartsModule.forRoot({ echarts }),
		
	],
	providers: [
		
		/*{
			provide: HTTP_INTERCEPTORS,
			useClass: AwsInterceptInterceptor,
			multi: true // false completely breaks the app, for some reason
		},*/
		{
			provide: HTTP_INTERCEPTORS,
			useClass: AddHeaderInterceptor,
			multi: true,
		  },
		  providePrimeNG({
			theme:{
				preset: Material,
				options:{
					prefix: 'p',
                    darkModeSelector: '.app-dark',
				}
			}
		  }),
	
	],
	bootstrap: [AppComponent]
})
export class AppModule { }
