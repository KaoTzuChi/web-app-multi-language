import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Location, formatDate } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { Product } from '../product';
import { ProductInsertService } from './product.insert.service';

@Component({
  selector: 'app-supervisor-product-insert',
  templateUrl: './product.insert.component.html',
  providers: [ProductInsertService],
  styleUrls: ['./product.insert.component.css']
})

export class ProductInsertComponent implements OnInit {
  @Input() product: Product;
  currentid: string = '';
  jstoday : string = '';

  constructor(
    private productInsertService: ProductInsertService,
    private location: Location,
    private router: Router,
    private translate: TranslateService,  
  ) {
    this.jstoday = formatDate(new Date(), 'yyyy-MM-dd hh:mm:ssZ', 'en-us', '+0800');
    this.product = new Product();
    this.product.field1 = '';
    this.product.field2 = {'item1':'', 'item2':''};
    this.product.field3 = this.jstoday.toString();
    this.product.field4 = 0.00;
  }

  ngOnInit() {}

  goBack(): void {
    this.router.navigate(["/product/query"]);
  }

  insertProduct(){
    console.log('this.product='+this.product.field1);
    this.productInsertService.insertProduct(this.product).subscribe(() => {
      this.router.navigate(["/product/query"]);
    });
  }
}

