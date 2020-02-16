import { Component } from '@angular/core';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { ApimessageService } from './message/apimessage/apimessage.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'frontend';
  localnames: object = {'en':'English','es':'Español','zh-tw':'繁體中文','zh-cn':'简体中文'};

  constructor(
    private apimessageService : ApimessageService,
    private router: Router,
    private translate: TranslateService, 
  ){
    translate.addLangs(['en','es','zh-tw','zh-cn']);
    translate.setDefaultLang('en');
    let browser_lang = translate.getBrowserLang();
    translate.use( (browser_lang=='zh') ? 'zh-tw' : browser_lang );
  }

  changelanguage( lang : string):void{
    this.translate.use(lang);
  }

  goHome(): void {
    this.apimessageService.clear();
    this.router.navigate(["./home"]);
  }

  goProduct(): void {
    this.apimessageService.clear();
    this.router.navigate(["./product"]);
  }

}
