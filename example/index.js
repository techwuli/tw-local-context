(function() {
    'use strict';
    angular
        .module('tw.local.context.example', [
            'tw.local.context'
        ])
        .config(['twLocalContextProvider', function(twLocalContextProvider) {
            twLocalContextProvider
                .setPrefix('tlcExample')
                .setStorageType('localStorage')
                .setAutoGenerateKey(true);
        }])
        .run(['twLocalContext', function(twLocalContext) {
            var localContext = twLocalContext.create('items', 'id');
            localContext.autoCreateKey = true;
            console.log(localContext.data);
            localContext.addOrUpdate([{
                name: 'Zhao Yu',
                id: 1
            }]);
            console.log(localContext.data);
            localContext.addOrUpdate([{
                name: 'Chen Min',
                id: 2
            }]);
            console.log(localContext.data);
            console.log(localContext.getByKey(1));
            localContext.removeByKey(1);
            console.log(localContext.data);
            localContext.saveChanges();
            twLocalContext.removeAll();
            // localContext.removeAll();
            console.log(localContext.data);
        }]);
})();
