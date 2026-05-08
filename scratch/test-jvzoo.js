const crypto = require('crypto');

const secretKey = 'YOUR_JVZOO_SECRET_KEY_HERE';
const params = {
  cpemail: 'testuser@example.com',
  cporderid: 'TEST12345',
  cpprice: '2900', // $29.00
  cpproduct: '440581',
  transtype: 'SALE',
  cpaffemail: 'affiliate@example.com'
};

const stringToHash = secretKey + params.cpemail + params.cporderid + params.cpprice + params.cpproduct;
const computedHash = crypto.createHash('sha1').update(stringToHash).digest('hex').toUpperCase();

params.cverify = computedHash;

const body = new URLSearchParams(params).toString();

fetch('http://localhost:3000/api/jvzoo', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  },
  body: body
})
.then(response => response.json())
.then(data => console.log('Response:', data))
.catch(error => console.error('Error:', error));
