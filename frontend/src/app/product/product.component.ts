import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ApimessageService } from '../message/apimessage/apimessage.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css'],
  
})
export class ProductComponent implements OnInit {
  url_lang = '';

  constructor(
    private apimessageService : ApimessageService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private translate: TranslateService,
  ) {  

  }

  ngOnInit() {
    //this.apimessageService.clear();
    this.url_lang = this.activatedRoute.snapshot.paramMap.get('lang');
    console.log('url_lang='+this.url_lang);
    if( this.translate.getLangs().includes(this.url_lang) ){
      this.translate.use(this.url_lang);
    }
    document.getElementById('productsearch').style.display = 'block';
    document.getElementById('apiMessageBlock').style.display = 'none';
  }
  goQuery( exists_lang : string):void{
    this.router.navigate(["/product/query/" + exists_lang ]);
    //window.location.reload();

    //window.open("/product/query/" + exists_lang, '_self');
    
  }

  goHome(): void {
    this.apimessageService.clear();
    this.router.navigate(["../home"]);
  }

}


