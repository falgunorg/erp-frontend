import ls from "local-storage";

class LS {
  constructor() {
    this.watches = {};
  }

  on(key, cb) {
    ls.on(key,cb); //for tracking change in other tab
    if (!this.watches[key]) {
      this.watches[key] = [];
    }
    this.watches[key].push(cb);
  }

  off(key) {
    ls.off(key)
    if (this.watches[key]) {
      delete this.watches[key];
    }
  }

 get(key) {
    try {
      return ls.get(key);
    } catch (e) {
      // error reading value
      return null;
    }
  }

 set(key, value) {
    try {
      var prevVal = this.get(key);
      ls.set(key, value);
      if (prevVal !== value && this.watches[key] && this.watches[key].length) {
        for (var func of this.watches[key]) {
          func.call(this, value, prevVal);
        }
      }
      return true;
    } catch (e) {
      // saving error
      return false;
    }
  }

  async remove(key) {
    try {
      return this.set(key, null);
    } catch (e) {
      // saving error
      return false;
    }
  }
}

export default new LS();
