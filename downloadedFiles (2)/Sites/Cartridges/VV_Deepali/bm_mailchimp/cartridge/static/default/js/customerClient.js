(function () {
    /**
     * It runs when we change the value of customer from the BM module
     */
    function initialize() {
        // Initialize tree
        var $ = jQuery;
        var customerUpdateRoute = document.querySelector('[name="toggleURL"]').value;
        console.log(customerUpdateRoute);
        $('.changeOptinfo').on('click', function () {
            var form={
                customerNo:this.classList[1],
                optIn : this.classList[2]
            };
            $.ajax({
                url: customerUpdateRoute,
                type: 'post',
                data: form,
                datatype: 'json',
                context: this,
                success: function () {
                    window.location.reload();
                    console.log('success');
                },
                error: function () {
                    console.log('error occured');
                }
            });
            
            
        });
    }
    initialize();
}());
