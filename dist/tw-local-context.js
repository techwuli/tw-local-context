(function() {
    'use strict';
    angular
        .module('tw.local.context', [])
        .provider('twLocalContext', [
            '$windowProvider',
            function($windowProvider) {
                var self = this;
                self.prefix = 'twlc';
                self.storageType = 'localStorage';
                self.autoGenerateKey = true;

                self.setPrefix = function(value) {
                    this.prefix = value;
                    return this;
                };

                self.setStorageType = function(value) {
                    this.storageType = value;
                    return this;
                };

                self.setAutoGenerateKey = function(value) {
                    this.autoGenerateKey = value;
                    return this;
                };

                var getStorage = function() {

                    var win = $windowProvider.$get();

                    switch (self.storageType) {
                        case 'localStorage':
                            return win.localStorage;

                        case 'sessionStorage':
                            return win.sessionStorage;

                        default:
                            throw 'Storage type: "' + self.storageType + '" not supported';
                    }
                };

                var generateKey = function() {
                    var format = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx';
                    return format.replace(/[xy]/g, function(c) {
                        var r = Math.random() * 16 | 0,
                            v = c === 'x' ? r : (r & 0x3 | 0x8);
                        return v.toString(16);
                    });
                };

                var LocalContext = function(name, key) {
                    this.data = [];
                    this.name = name;
                    this.key = key;

                    this.addOrUpdate = function(items) {
                        if (!items) {
                            return;
                        }
                        if (!Array.isArray(items)) {
                            items = [items];
                        }

                        for (var i = 0; i < items.length; i++) {
                            if (!items[i][this.key]) {
                                if (this.autoGenerateKey) {
                                    items[i][this.key] = generateKey();
                                } else {
                                    console.error('item key not set: ');
                                    console.error(items[i]);
                                    throw 'item key not set';
                                }
                            }

                            if (this.data.length === 0) {
                                this.data.push(items[i]);
                                continue;
                            }
                            var updated = false;
                            for (var j = 0; j < this.data.length; j++) {
                                if (items[i][this.key] == this.data[j][this.key]) {
                                    this.data[j] = items[i];
                                    updated = true;
                                    break;
                                }
                            }

                            if (!updated) {
                                this.data.push(items[i]);
                            }
                        }
                    };

                    this.load = function() {
                        var value = getStorage().getItem(this.name);
                        if (value) {
                            var arr = JSON.parse(value);
                            if (Array.isArray(arr)) {
                                this.data = arr;
                                return;
                            }
                        }
                        this.data = [];
                    };

                    this.getByKey = function(keyValue) {
                        if (this.data.length === 0) {
                            return null;
                        }
                        for (var i = 0; i < this.data.length; i++) {
                            if (this.data[i][this.key] == keyValue) {
                                return this.data[i];
                            }
                        }
                    };

                    this.removeByKey = function(keyValue) {
                        if (this.data.length === 0) {
                            return;
                        }

                        for (var i = 0; i < this.data.length; i++) {
                            if (this.data[i][this.key] == keyValue) {
                                this.data.splice(i, 1);
                                return;
                            }
                        }
                    };

                    this.removeAll = function() {
                        this.data = [];
                        getStorage().removeItem(this.name);
                    };

                    this.saveChanges = function() {
                        var valueString = JSON.stringify(this.data);
                        getStorage().setItem(this.name, valueString);
                    };
                    this.load();

                };

                self.$get = function() {
                    return {
                        create: function(name, key) {
                            if (!name) {
                                console.error('local context name must be set.');
                            }
                            key = key || 'id';
                            name = self.prefix + '_' + name;

                            return new LocalContext(name, key);
                        },

                        removeAll: function() {
                            var storage = getStorage();
                            var storageItemLength = storage.length;
                            if (storageItemLength === 0) {
                                return;
                            }
                            for (var i = 0; i < storageItemLength; i++) {
                                if (storage.key(i).indexOf(self.prefix + '_') === 0) {
                                    storage.removeItem(storage.key(i));
                                }
                            }
                        }
                    };
                };
            }
        ]);
})();
