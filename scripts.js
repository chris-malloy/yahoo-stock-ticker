// 1. Give the user the ability to send a stock symbol.
// 2. Ge the Symbol
// 3. Once submitted, make an AJAX request to Yahoo
// 4. Get the response from Yahoo and update the DOM
$(document).ready(function() {
    // setItem takes 2 args:
    // 1. Name of the var  
    // 2. Name to set
    var watchList = [
            "goog",
            "msft",
            "tsla",
            "tata",
            "race"
        ]
        // Native javascript has JSON.stringify to turn a JSON object to a string/ necessary to do so browser can local store it 
    var watchListAsAString = JSON.stringify(watchList);
    // Now you need to turn it back into an object to be used as JSON object so you can loop through it and make use of it again
    // console.log(watchListAsAString)
    var watchListAsAnObjectAgain = JSON.parse(watchListAsAString);
    // console.log(watchListAsAnObjectAgain)
    // localStorage.setItem('watchList', "race");
    var watchList = localStorage.getItem('watchList');
    if (watchList != null) {
        updateWatchList();
    }
    var firstView = true;
    $('.yahoo-finance-form').submit((event) => {
        event.preventDefault();
        // console.log("User submitted the form!")
        // tell JSON two things
        // 1. Where  
        // 2. What to do (function)  
        var stockSymbol = $('#ticker').val();
        var url = 'http://query.yahooapis.com/v1/public/yql?q=env%20%27store://datatables.org/alltableswithkeys%27;select%20*%20from%20yahoo.finance.quotes%20where%20symbol%20in%20(%22' + stockSymbol + '%22)%0A%09%09&env=http%3A%2F%2Fdatatables.org%2Falltables.env&format=json';
        $.getJSON(url, (theDataJSFound) => {
            var numFound = theDataJSFound.query.count;
            var newRow = "";
            if (numFound > 1) {
                theDataJSFound.query.results.quote.map((stock) => {
                    newRow += buildRow(stock);
                })
            } else {
                var stockInfo = theDataJSFound.query.results.quote;
                newRow = buildRow(stockInfo)
            }
            if (firstView) {
                $('#stock-table-body').html(newRow);
                firstView = false;
            } else {
                $('#stock-table-body').append(newRow);
            }
            $('td button').click(function() {
                // add a click listener to all the buttons in the tables when clicked
                // when clicked on, save the symbol to localStorage.
                var stockToSave = $(this).attr('symbol');
                var oldWatchList = localStorage.getItem('watchList');
                // oldWatchList just came out of localStorage.
                var oldAsJSON = JSON.parse(oldWatchList);
                if (oldAsJSON == null) {
                    oldAsJSON = [];
                }
                if (oldAsJSON.indexOf(stockToSave) > -1) {

                } else {
                    oldAsJSON.push(stockToSave);
                    var newWatchListAsString = JSON.stringify(oldAsJSON)
                    localStorage.setItem('watchList', newWatchListAsString);
                    updateWatchList();
                }
            })
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
        newRow += `<td><button symbol=${stockInfo.Symbol} class="btn btn-success">Save</button></td>`;
        newRow += `<td><button symbol=${stockInfo.Symbol} class="btn btn-danger">Delete</button></td>`;
        newRow += '</tr>';
        return newRow;
    };

    function updateWatchList() {
        $('#stock-table-saved-body').html('');
        var watchList = localStorage.getItem('watchList');
        var watchListAsJSON = JSON.parse(watchList);
        watchListAsJSON.map((symbol, index) => {
            console.log(symbol);
            var url = 'http://query.yahooapis.com/v1/public/yql?q=env%20%27store://datatables.org/alltableswithkeys%27;select%20*%20from%20yahoo.finance.quotes%20where%20symbol%20in%20(%22' + symbol + '%22)%0A%09%09&env=http%3A%2F%2Fdatatables.org%2Falltables.env&format=json';
            $.getJSON(url, (stockData) => {
                var stockInfo = stockData.query.results.quote;
                var newRow = buildRow(stockInfo);
                $('#stock-table-saved-body').append(newRow);
            })
        })
    };

    // ***USER CAN CHANGE UPDATE TIME***
    var updateTime = $('#update').val()
    if (isNan(updateTime) == true)
        setInterval(() =>
            updateWatchList(), 30000)
});
// TODO - give user ability to change updatetime