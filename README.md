# DeDrops-server
 
### npm i
### 配置 MongoDB 数据库 conf/config.js
```javascript
//conf/config.js
var exports = {
    port: 3000,
    fliePath: 'http://xxx/upload/',
    db_user: 'root',
    db_pwd: '123456',
    db_host: 'localhost',
    db_port: 27017,
    db_name: 'dedrops',
    db_url: function() {
        return 'mongodb://' + this.db_user + ':' + this.db_pwd + '@' + this.db_host + ':' + this.db_port + '/'
    }
}
module.exports = exports;
```
### node app.js
### 打开 http://127.0.0.1:3000/sign/getERC20ClaimData