// 1. Give the user the ability to send a stock symbol.
// 2. Ge the Symbol
// 3. Once submitted, make an AJAX request to Yahoo
// 4. Get the response from Yahoo and update the DOM
$(document).ready(function() {
    var firstView = true;
    $('.yahoo-finance-form').submit((event) => {
        event.preventDefault();
        // console.log("User submitted the form!")
        // tell JSON two things
        // 1. Where  
        // 2. What to do (function)  
        var stockSymbol = $('#ticker').val();
        console.log(stockSymbol)
        var url = 'http://query.yahooapis.com/v1/public/yql?q=env%20%27store://datatables.org/alltableswithkeys%27;select%20*%20from%20yahoo.finance.quotes%20where%20symbol%20in%20(%22' + stockSymbol + '%22)%0A%09%09&env=http%3A%2F%2Fdatatables.org%2Falltables.env&format=json';
        $.getJSON(url, (theDataJSFound) => {
            var numFound = theDataJSFound.query.count;
            var numRow = "";
            if (numFound > 1) {
                theDataJSFound.query.results.quote.map((stock) => {
                    newRow += buildRow(stock);
                })
            } else {
                var stockInfo = theDataJSFound.query.results.quote;
                newRow = buildRow(stockInfo)
            }
            var stockInfo = theDataJSFound.query.results.quote;
            var newRow = buildRow(stockInfo);

            if (firstView) {
                $('#stock-table-body').html(newRow);
                firstView = false;
            } else {
                $('#stock-table-body').append(newRow);
            }

        });
    });

    function buildRow(stockInfo) {
        if (stockInfo.Change.indexOf('+') > -1) {
            // that means the stock is up!
            var classChange = "success";
        } else {
            var classChange = "danger";
        }
        var newRow = '';
        newRow += '<tr>';
        newRow += `<td>${stockInfo.Symbol}</td>`;
        newRow += `<td>${stockInfo.Name}</td>`;
        newRow += `<td>${stockInfo.Ask}</td>`;
        newRow += `<td>${stockInfo.Bid}</td>`;
        newRow += `<td class="bg-${classChange}">${stockInfo.Change}</td>`;
        newRow += '</tr>';
        return newRow;
    };
});