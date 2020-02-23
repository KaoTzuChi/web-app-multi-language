# Web app with multiple languages: angular(i18n), python(django) and mongodb in docker

## Version
- node 12.13.0
- angular/cli 8.3.14
- @ngx-translate/core@11.0.1
- @ngx-translate/http-loader@4.0.0
- Python 3.7.4
- django 2.2.10
- MongoDB 4.2.0
- Docker 19.03.5
- Ubuntu 18.04.3 LTS


## Getting start
This example is for building a web application with multiple languages. We will use i18n to translate the text in the user interface, and pass a language as a parameter by url to search data by languages.

This is a simple three tiers design. The source code is [here](https://github.com/KaoTzuChi/web-app-multi-language).


## Database setting
Prepare the image of mongodb in docker first, and then create a container from the image.
After execute the container and enter the mongo shell, build the sample data as below.
```
conn = new Mongo("127.0.0.1:27017");
dbadmin = conn.getDB("admin");
dbadmin.auth( "root", "123456789" );
db = dbadmin.getSiblingDB('mydatabase');
db.createUser({
    "user" : "myuser",
    "pwd" : "myuserspwd",
    "roles" : [{ "db" : "mydatabase", "role": "readWrite" },{ "db" : "mydatabase", "role": "dbOwner" }]
    });
db.createCollection("mycollection", { autoIndexId: true } );
db.mycollection.remove({});
db.mycollection.insertMany([
    { "field1": "valueof-doc1-field1", "field2":{"en":"English", "es":"Español", "zh-tw": "繁體中文", "zh-cn":"简体中文"}, "field3": new Date("2011-01-01 01:01:01+01:00"), "field4":1.01 },
    { "field1": "valueof-doc2-field1", "field2":{"en":"Good morning!", "es":"¡Buenos días!", "zh-tw": "早安！", "zh-cn":"早上好！"}, "field3": new Date("2012-02-02 02:02:02+02:00"), "field4":2.02 },
    { "field1": "valueof-doc3-field1", "field2":{"en":"Hello!", "es":"¡Hola!", "zh-tw": "你好！", "zh-cn":"你好！"}, "field3": new Date("2013-03-03 03:03:03+03:00"), "field4":3.03 }
]);
```
The details about mongo shell, please reference [here](https://docs.mongodb.com/manual/tutorial/write-scripts-for-the-mongo-shell/).


## Access data by language

### Query database by pymongo
For database CRUD operations, we are using pymongo to achieve them. 

e.g. find those documents at least having the field "_id":
```
collection.find({'_id': {'$exists': True}})
```
e.g. find those documents at least having the field "field2" and exists a item named "en":
```
collection.find({'field2.en': {'$exists': True}})

```
More operations and detailed descriptions about pymongo, please reference [here](https://api.mongodb.com/python/current/api/pymongo/index.html).

Additionally, there is an example code about database CRUD operations [here](http://www.tzuchikao.com/en/notes/essay/5dbf622be97675ab36451861).


Moreover, we need to pass a parameter through REST API for the language we want, so the API urls would be added a parameter as below:
```
urlpatterns = [
    ... 
    url(r'^read_mycollection_all/$', api_views.read_mycollection_all),
    url(r'^read_mycollection_bylang/(?P<language>[-\w]+)/$', api_views.read_mycollection_bylang),
]
```

### Provide REST API by Django rest framework
Also, the api views need be added the same parameter "language".
```
@api_view(['GET'])
def read_mycollection_bylang(request, language):   
    global LANGS
    if request.method == 'GET':
        data_list = []
        db_obj = dbutilities.db_util('mycollection', language)
        db_data = db_obj.read_documents_bylang('field2')       
        for doc in db_data:  
            formated_doc= models.myModel( doc['_id'], doc['field1'], doc['field2'], doc['field3'], doc['field4'] )
            data_list.append(formated_doc)            
        serializedList = api_ser.mySerializer(data_list, many=True)
        return Response(serializedList.data)
    else:
        return Response({'status':'read_mycollection_bylang fail'})
```

For more information about API views of django REST framework, please reference [here](https://www.django-rest-framework.org/api-guide/views/).


### REST API calls in Angular
In the frontend app, we will have a new method in a service, and the method will pass the language parameter to the API.
```
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Product } from '.';

export class Product {
    _id: string;
    field1: string;
    field2: object;
    field3: string;
    field4: number;
}

let url: string = 'http://localhost:9900/';
let header: object = { headers: new HttpHeaders({'Content-Type':  'application/json'}) };

getProducts (): Observable<Product[]> {
    return this.http.get<Product[]>( url+'read_mycollection_all/', header )
      .pipe( tap(_ => this.log('fetched')) );
}

getProducts_bylang (lang : string): Observable<Product[]> {
    return this.http.get<Product[]>( url+'read_mycollection_bylang'+ lang + '/', header )
      .pipe( tap(_ => this.log('fetched')) );
}
```
More details about HttpClient, please reference [here](https://angular.io/guide/http).


## User interface translation
The translation in the user interface of Angular doesn't directly relate to data accessing above, but using i18n we can easily get, set and change languages, and we can use the language choosen in the user interface to be the parameter to access APIs.

Before using, make sure "@ngx-translate/core" and "@ngx-translate/http-loader" are installed by npm in docker.

### Build translated json files
For all available languages, make corresponding files in JSON format for translating all displayed texts in html pages, and save them under Angular assets folder.

> mkdir ~/myproject/frontend/src/assets/i18n

> vi ~/myproject/frontend/src/assets/i18n/en.json


```
{
    "group1":{
        "item1":"value of item1-group1 in English",
        "item2":"value of item2-group1 in English",
        "item3":"value of item3-group1 in English"
    },
    "group2":{
        "item1":"value of item1-group2 in English",
        "item2":"value of item2-group2 in English"
    },
    "group3":"value of group3 in English"
}
```

So forth, we will have several .json files named in available languages each, and all json files have the same keys but different values by languages.

> vi ~/myproject/frontend/src/assets/i18n/es.json


```
{
    "group1":{
        "item1":"value of item1-group1 in Spanish",
        "item2":"value of item2-group1 in Spanish",
        "item3":"value of item3-group1 in Spanish"
    },
    "group2":{
        "item1":"value of item1-group2 in Spanish",
        "item2":"value of item2-group2 in Spanish"
    },
    "group3":"value of group3 in Spanish"
}
```

### Use translated texts in htmls
In the modules that imported the components we need, import "TranslateModule", "TranslateLoader" and "TranslateHttpLoader", and then create a local TranslateHttpLoader.

```
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

// create TranslateHttpLoader as the local loader
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

@NgModule({
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient]
      }
    }),
    ...
})
```

In all components we want to translate, import "TranslateService", and then we can use the methods of the service to get, set and change translations. 
```
import { TranslateService } from '@ngx-translate/core';

  constructor(
    private translate: TranslateService, 
  ){
    //assign available languages
    translate.addLangs(['en','es','zh-tw','zh-cn']);

    //get all set languages
    console.log(translate.getLangs());

    //set a default language
    translate.setDefaultLang('en');

    //get the language from browser's setting
    let browser_lang = translate.getBrowserLang();

    //translate to a specific language
    translate.use( browser_lang );

    //get current using language
    console.log(translate.currentLang);
  }

```

Finally, in html pages, now we can easily use the format below to get the values in the json files by their keys.
```
<p>{{ 'group2.item1' | translate }}</p>
<p>{{ 'group3' | translate }}</p>
```

More details about @ngx-translate, see [@ngx-translate/core](https://www.npmjs.com/package/@ngx-translate/core) and [@ngx-translate/http-loader](https://www.npmjs.com/package/@ngx-translate/http-loader).


## References
- [See more topics in my website](http://www.tzuchikao.com/en/notes/)
- [Write scripts for the mongo shell](https://docs.mongodb.com/manual/tutorial/write-scripts-for-the-mongo-shell/)
- [pymongo – Python driver for MongoDB](https://api.mongodb.com/python/current/api/pymongo/index.html)
- [Django REST framework](https://www.django-rest-framework.org/)
- [Angular docs](https://angular.io/docs)
