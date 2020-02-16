import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule, MatListModule, MatRadioModule,
MatTableModule, MatFormFieldModule, MatInputModule,
MatCheckboxModule, MatButtonModule, MatToolbarModule, MatSidenavModule, 
MatSelectModule, MatDialogModule, MatButtonToggleModule } from '@angular/material';

import { HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { ProductComponent } from './product.component';
import { ProductQueryComponent } from './query/product.query.component';
import { ProductDetailComponent } from './detail/product.detail.component';
import { ProductEditComponent } from './edit/product.edit.component';
import { ProductInsertComponent } from './insert/product.insert.component';
import { ProductDuplicateComponent } from './duplicate/product.duplicate.component';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

const product_routes = [
  { path: ':lang/product', component: ProductComponent },
  { path: 'product', component: ProductComponent, children: [
    { path: 'query', component: ProductQueryComponent },
    { path: 'query/:existslang', component: ProductQueryComponent },
    { path: 'insert', component: ProductInsertComponent },
    { path: 'detail/:id', component: ProductDetailComponent },
    { path: 'edit/:id', component: ProductEditComponent },
    { path: 'duplicate/:id', component: ProductDuplicateComponent },
  ]},
];

@NgModule({
  imports: [
    RouterModule.forChild(product_routes),
    TranslateModule.forRoot({
      loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient]
      }
    }),
    CommonModule,
    FormsModule,
    MatRadioModule,
    MatListModule,
    MatIconModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatButtonModule,
    MatToolbarModule,
    MatSidenavModule,
    MatSelectModule,
    MatDialogModule,
    MatButtonToggleModule,
  ],
  entryComponents: [
  ],
  declarations: [
    ProductComponent,
    ProductQueryComponent,
    ProductDetailComponent,
    ProductEditComponent,
    ProductInsertComponent,
    ProductDuplicateComponent,
  ]
})
export class ProductModule { 
  constructor() {  }
  ngOnInit() { }
}

