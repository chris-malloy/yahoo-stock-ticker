$(document).ready(function() {
    var watchList = [
        "goog",
        "msft",
        "tsla",
        "tata",
        "race"
    ]
    var watchListAsAString = JSON.stringify(watchList);
    var watchListAsAnObjectAgain = JSON.parse(watchListAsAString);
    var watchList = localStorage.getItem('watchList');
    if (watchList != null) {
        updateWatchList();
    } else {

    }
    var firstView = true;
    $('.yahoo-finance-form').submit((event) => {
        event.preventDefault();
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
                var stockToSave = $(this).attr('symbol');
                var oldWatchList = localStorage.getItem('watchList');
                console.log(oldWatchList)
                var oldAsJSON = JSON.parse(oldWatchList);
                if (oldAsJSON == null) {
                    oldAsJSON = [];
                }
                if (oldAsJSON.indexOf(stockToSave) > -1) {
                    console.log('no stock')
                } else {
                    oldAsJSON.push(stockToSave);
                    var newWatchListAsString = JSON.stringify(oldAsJSON);
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
        // if (isNan(updateTime) == true)
    setInterval(() =>
        updateWatchList(), 30000)
});
// TODO - give user ability to change updatetime