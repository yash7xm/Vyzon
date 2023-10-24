 class Environment {

    constructor(record = {}, parent = null) {
        this.record = record;
        this.parent = parent
    }

    define(name, value) {
        this.record[name] = value;
        return value;
    }
 }