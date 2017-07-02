var _ = require("underscore");
module.exports = class PhoneBookRecord {

    constructor(name, phone) {
        this.token = null;
        this.name = null;
        this.phone = null;

        this._set(name, phone);
    }

    _set(name, phone) {
        this.token = Math.random().toString(36).substring(12);
        this.name = name;
        this.phone = phone;
    }

    setToken(token){
        this.token = token;
    }

}