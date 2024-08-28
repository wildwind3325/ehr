var crypto = require('crypto');
var uuid = require('uuid');

const aes_key = '754a5bdc7468bb1f', iv = '370284027734754a';

var utils = {
  md5(str, code) {
    let md5 = crypto.createHash('md5');
    code = code || 'hex';
    return md5.update(str).digest(code);
  },
  sha1(str, code) {
    let sha1 = crypto.createHash('sha1');
    code = code || 'hex';
    return sha1.update(str).digest(code);
  },
  encrypt(str) {
    let cipher = crypto.createCipheriv('aes-128-cbc', aes_key, iv);
    return cipher.update(str, 'utf8', 'hex') + cipher.final('hex');
  },
  decrypt(str) {
    let decipher = crypto.createDecipheriv('aes-128-cbc', aes_key, iv);
    return decipher.update(str, 'hex', 'utf8') + decipher.final('utf8');
  },
  sleep(ms) {
    return new Promise((resolve, reject) => {
      setTimeout(() => { resolve(); }, ms);
    });
  },
  random(len) {
    return crypto.randomBytes(len).toString('hex').substring(0, len);
  },
  uid() {
    return uuid.v4().replace(/-/g, '');
  }
};

export default utils;