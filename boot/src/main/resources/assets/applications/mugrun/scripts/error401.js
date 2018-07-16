$(document).ready(function() {
    BootstrapDialog.show({
        title: mugrunApp.getMessage('common.text.message'),
        message: mugrunApp.getMessage('common.menu.no.permission'),
        closable: false,
        buttons: [
            {
                label: mugrunApp.getMessage('common.btn.ok'),
                cssClass: 'blue',
                action: function() {
                    window.location.href = '/';
                }
            }
        ]
    });
});