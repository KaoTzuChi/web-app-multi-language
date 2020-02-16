import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location, formatDate } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { Product } from '../product';
import { ProductQueryService } from './product.query.service';

@Component({
  selector: 'app-supervisor-product-query',
  templateUrl: './product.query.component.html',
  providers: [ProductQueryService],
  styleUrls: ['./product.query.component.css']
})

export class ProductQueryComponent implements OnInit {
  products: Product[];
  selectedItem: Product;
  displayColumn = ['radio', 'serialno', '_id', 'field1', 'field2', 'field3', 'field4'];
  search_cond1_exists_lang = '';
  data_lang = this.translate.currentLang;

  constructor(
    private productQueryService: ProductQueryService,
    private location: Location,
    private router: Router,
    private translate: TranslateService,  
    private activatedRoute: ActivatedRoute,
    ) {
  }

  ngOnInit() {
    this.search_cond1_exists_lang = this.activatedRoute.snapshot.paramMap.get('existslang');
    this.search_cond1_exists_lang = (this.search_cond1_exists_lang ==null ? '' : this.search_cond1_exists_lang.trim());
    console.log('this.search_cond1_exists_lang='+this.search_cond1_exists_lang);

    if( ( this.translate.getLangs().includes(this.search_cond1_exists_lang) )
      &&( this.search_cond1_exists_lang.length>0 ) ){
        this.data_lang = this.search_cond1_exists_lang;
        this.getProducts_bylang( this.search_cond1_exists_lang );
    }else{
      this.getProducts();
    }
    
    document.getElementById('productsearch').style.display = 'none';
    document.getElementById('apiMessageBlock').style.display = 'block';
  }

  getProducts_bylang(lang : string): void {
    this.productQueryService.getProducts_bylang( lang )
      .subscribe(products => {
        this.products = products;
        if((this.products!=null)&&(this.products.length>0)){
          this.selectedItem = this.products[0];
        }
      });
  } 

  getProducts(): void {
    this.productQueryService.getProducts()
      .subscribe(products => {
        this.products = products;
        if((this.products!=null)&&(this.products.length>0)){
          this.selectedItem = this.products[0];
        }
      });
  } 

  goBack(): void {
    document.getElementById('productsearch').style.display = 'block';
    document.getElementById('apiMessageBlock').style.display = 'none';
    this.router.navigate(["/product"]);
    //window.open("/product", '_self');
  }
  goInsert(path1:string) {
    this.router.navigate(["/product/insert"]);
  }
  goMaintain(path1:string, path2:string) {
    this.router.navigate(["/product/"+path2+"/"+this.selectedItem._id]);
  }
  onSelect(item: Product): void {
    this.selectedItem = item;
  }
}
