const dns = require('dns');
dns.resolveSrv('_mongodb._tcp.karim-portfolio.xjkl1ht.mongodb.net', (err, addresses) => {
    if (err) {
        console.error('SRV Resolution Failed:', err.message);
    } else {
        console.log('SRV Records found:', addresses);
    }
});
