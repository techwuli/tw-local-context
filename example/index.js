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

            var zhaoyu = {
                name: 'Zhao Yu',
                id: 1
            };

            var chenmin = {
                name: 'Chen Min',
                id: 2
            };

            var localContext = twLocalContext.getList('items', 'id');

            console.log(localContext.data);

            localContext.addOrUpdate([zhaoyu]);

            console.log(localContext.data);

            localContext.addOrUpdate(chenmin);

            console.log(localContext.data);
            console.log(localContext.getByKey(1));

            localContext.removeByKey(1);

            console.log(localContext.data);

            localContext.saveChanges();


            twLocalContext.clear();
            // localContext.removeAll();
            console.log(localContext.data);

            var account = twLocalContext.get('account');
            if (account) {
                console.log(account.name);
            } else {
                console.log('account not found');
            }
            twLocalContext.set('account', zhaoyu);
            account = twLocalContext.get('account');
            console.log(account.name);
        }]);
})();
