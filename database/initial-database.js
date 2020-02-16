/* 
==============================================================================
Terminal 1
    $ sudo service docker start
    $ /.../myprojectfolder/docker-compose up
Terminal 2
    $ docker-compose exec database-service mongo -u "root" -p "123456789" --authenticationDatabase "admin"
    >> load("data/db/initial-database.js")
==============================================================================
*/

var conn=null;
var db=null;
var dbadmin=null;

try {
    conn = new Mongo("127.0.0.1:27017");
    print ('<< 1. mongo service: ok >>');
    try {
        dbadmin = conn.getDB("admin");
        dbadmin.auth( "root", "123456789" );
        db = dbadmin.getSiblingDB('mydatabase');
        print ('<< 2. connect to mydatabase: ok >>');

        // create a new user for later app accessing.
        try {   
            db.createUser({
                "user" : "myuser",
                "pwd" : "myuserspwd",
                "roles" : [
                    { "db" : "mydatabase", "role": "readWrite" },
                    { "db" : "mydatabase", "role": "dbAdmin" },
                    { "db" : "mydatabase", "role": "dbOwner" },
                    { "db" : "mydatabase", "role": "userAdmin" }
                ]
            });
            print ('<< 3. createuser: ok >>');
        } catch (e) {
            print ('<< 3. createuser: FAIL >>'+e);
        }

        // initialize mycollection, in mydatabase, by user root.
        try {
            db.createCollection("mycollection", { autoIndexId: true } );
            db.mycollection.remove({});
            db.mycollection.insertMany([
            { "field1": "valueof-doc1-field1", "field2":{"en":"English", "es":"Español", "zh-tw": "繁體中文", "zh-cn":"简体中文"}, "field3": new Date("2011-01-01 01:01:01+01:00"), "field4":1.01 },
            { "field1": "valueof-doc2-field1", "field2":{"en":"Good morning!", "es":"¡Buenos días!", "zh-tw": "早安！", "zh-cn":"早上好！"}, "field3": new Date("2012-02-02 02:02:02+02:00"), "field4":2.02 },
            { "field1": "valueof-doc3-field1", "field2":{"en":"Hello!", "es":"¡Hola!", "zh-tw": "你好！", "zh-cn":"你好！"}, "field3": new Date("2013-03-03 03:03:03+03:00"), "field4":3.03 }
            ]);
            print ('<< initialize mycollection: ok >>');
        } catch (e) {print ('<< initialize mycollection: FAIL >>'+e);}


    } catch (e) {
        print ('<< 2. connect to mydatabase: FAIL >>'+e);
    }
} catch (e) {
    print ('<< 1. mongo service: FAIL >>'+e);
}



