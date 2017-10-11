// 1. Give the user the ability to send a stock symbol.
// 2. Ge the Symbol
// 3. Once submitted, make an AJAX request to Yahoo
// 4. Get the response from Yahoo and update the DOM
$(document).ready(function() {
    $('.yahoo-finance-form').submit((event) => {
        event.preventDefault();
        // console.log("User submitted the form!")
        // tell JSON two things
        // 1. Where  
        // 2. What to do (function)  
        var stockSymbol = $('#ticker').val();
        console.log(stockSymbol)
        var url = 'http://query.yahooapis.com/v1/public/yql?q=env%20%27store://datatables.org/alltableswithkeys%27;select%20*%20from%20yahoo.finance.quotes%20where%20symbol%20in%20(%22'++'%22)%0A%09%09&env=http%3A%2F%2Fdatatables.org%2Falltables.env&format=json';
        $.getJSON(url, (theDataJSFound) => {
            console.log(theDataJSFound)
        });
    });
});