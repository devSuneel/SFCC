(function () {
    /**
     * It runs when we toggle the button of komoju payment methods from the BM module
     */
    function initialize() {
        // Initialize tree
        var $ = jQuery;
        $('.togglePaymentMethod').on('click', function () {
            let form = {};
            let controllerUrl = this.value;
            form.komojuPaymentMethodId = this.id;
            form.checked = this.checked;

            $.ajax({
                url: controllerUrl,
                type: 'post',
                data: form,
                datatype: 'json',
                context: this,
                success: function () {
                    console.log('success');
                    console.log('Payment method updated');
                },
                error: function () {
                    console.log('error occured');
                }
            });
        });
        $('.secretKeySaveBtn').on('click', function () {
            let form = {};
            let controllerUrl = this.value;
            form.komojuSecretKey = $('#komojuSecretKey')[0].value;

            $.ajax({
                url: controllerUrl,
                type: 'post',
                data: form,
                datatype: 'json',
                context: this,
                success: function () {
                    console.log('success');
                    console.log('Secret key updated');
                    window.location.reload();
                },
                error: function () {
                    console.log('error occured');
                }
            });
        });
        $('.emailUpdateBtn').on('click', function () {
            let form = {};
            let controllerUrl = this.value;
            form.komojuEmail = $('#komojuEmail')[0].value;
            var validRegex = /^[\w-\\.]+@([\w-]+\.)+[\w-]{2,4}$/g;

            if ($('#komojuEmail')[0].value.match(validRegex)) {
                $.ajax({
                    url: controllerUrl,
                    type: 'post',
                    data: form,
                    datatype: 'json',
                    context: this,
                    success: function () {
                        console.log('Merchant email updated');
                        console.log('success');
                        window.location.reload();
                    },
                    error: function () {
                        console.log('error occured');
                    }
                });
            } else {
                alert('Invalid email address!');
            }
        });
        $('.emailToggleValue').on('click', function () {
            let form = {};
            let controllerUrl = this.value;
            form.emailToggleValue = this.checked;

            $.ajax({
                url: controllerUrl,
                type: 'post',
                data: form,
                datatype: 'json',
                context: this,
                success: function () {
                    console.log('Merchant email functionality updated');
                    console.log('success');
                },
                error: function () {
                    console.log('error occured');
                }
            });
        });
        $('.codeUpdateBtn').on('click', function () {
            let form = {};
            let controllerUrl = this.value;
            form.webhooksAuthenticationCode = $('#webhooksAuthenticationCode')[0].value;

            $.ajax({
                url: controllerUrl,
                type: 'post',
                data: form,
                datatype: 'json',
                context: this,
                success: function () {
                    console.log('authentication code updated');
                    console.log('success');
                    window.location.reload();
                },
                error: function () {
                    console.log('error occured');
                }
            });
        });
        $('.copyWebhook').on('click', function () {
            let elementID = this.id;
            let clsSuffix = elementID.slice(4);
            let webHookCls = '.copy' + clsSuffix;
            let currentWebhookContent = $(webHookCls).text();
            try {
                navigator.clipboard.writeText(currentWebhookContent);
                $('.copy_to_clipboard_message').css('display', 'block');
                setTimeout(() => {
                    $('.copy_to_clipboard_message').css('display', 'none');
                }, 3000);
            } catch (err) {
                console.error('Failed to copy: ', err);
            }
        });
    }
    initialize();
}());
