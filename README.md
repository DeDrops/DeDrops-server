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
<br>

## 服务器已安装forever
### npm install forever -g   #安装
### forever start app.js  #启动应用
### forever stop app.js  #关闭应用
### forever list #显示所有运行的服务 