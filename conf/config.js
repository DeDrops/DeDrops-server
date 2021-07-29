/*配置文件*/

var exports = {
    port: 3000,
    fliePath: 'http://xxx/upload/',
    db_user: 'root',
    db_pwd: '',
    db_host: 'localhost',
    db_port: 27017,
    db_name: 'dedrops',
    db_url: function() {
        return 'mongodb://' + this.db_user + ':' + this.db_pwd + '@' + this.db_host + ':' + this.db_port + '/'
    }
}



module.exports = exports;