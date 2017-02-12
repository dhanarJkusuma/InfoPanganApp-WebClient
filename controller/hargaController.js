/**
 * Created by Dhanar J Kusuma on 12/02/2017.
 */
var http = require('http');
var axios = require('axios');

const base_url = 'http://infopangan.jakarta.go.id/api';


exports.getGridData = function(req, res, next){
    var page = req.params.page;
    axios.get(base_url + '/price/lists')
        .then(function (response) {
            var resData = response.data;
            var prices = resData.data.prices;
            var totalCount = prices.length;
            var totalPage = Math.round(prices.length/10);
            var pagePages;
            if(page == 1 && page < totalPage){
                pagePages = prices.slice(0, 10);
            }
            else if(page > 1 && page < totalPage){
                var firstPage = (page-1)*10;
                pagePages = prices.slice( firstPage, firstPage + 10);
            }else if(page == totalPage){
                var firstPage = (page-1)*10;
                console.log(firstPage);
                console.log(firstPage + totalCount % 10);
                pagePages = prices.slice( firstPage, firstPage + totalCount % 10);
            }else{
                pagePages = [];
            }

            var maxPage = (totalCount % 10 > 0) ? totalPage+1 : totalPage;
            res.render('index',{ prices : pagePages,
                maxPage : maxPage,
                page : page,
                isChart: false,
                menu : 'grid'
            });
        });
};

exports.getListData = function(req, res, next){
    var page = req.params.page;
    axios.get(base_url + '/price/lists')
        .then(function (response) {
            var resData = response.data;
            var prices = resData.data.prices;
            console.log(prices);
            var totalCount = prices.length;
            var totalPage = Math.round(prices.length/20);
            console.log(totalPage);
            var pagePages;
            if(page == 1 && page < totalPage){
                pagePages = prices.slice(0, 20);
            }
            else if(page > 1 && page < totalPage){
                var firstPage = (page-1)*20;
                pagePages = prices.slice( firstPage, firstPage + 20);
            }else if(page == totalPage){
                var firstPage = (page-1)*20;
                console.log(firstPage + totalCount % 20);
                pagePages = prices.slice( firstPage, firstPage + totalCount % 20);
            }else{
                pagePages = [];
            }

            var maxPage = (totalCount % 20 > 0) ? totalPage+1 : totalPage;
            res.render('list',{
                prices : pagePages,
                maxPage : maxPage,
                page : page,
                isChart: false,
                menu : 'list'
            });
        });
};

exports.getChart = function(req, res, next){
    var name = req.query.name;
    var comodity = req.query.cm;
    var d = new Date();
    var month = d.getMonth() +1;
    var url = base_url + '/price/series_by_commodity?public=1&cid=' + comodity +'&m=' + month +  '&y=' + d.getFullYear();
    axios.get(url)
        .then(function(response){
            value = populateChart(response.data.data[0]);
            value1 = populateChart(response.data.data[1]);
            value2 = populateChart(response.data.data[2]);

            vname = response.data.data[0].name;
            vname1 = response.data.data[1].name;
            vname2 = response.data.data[2].name;

            res.render('chart', {
                name : name,
                dataChart : value,
                dataChart1 : value1,
                dataChart2 : value2,
                vname : vname,
                vname1 : vname1,
                vname2 : vname2,
                isChart: true,
                menu : 'chart'
            });
        });

};

function populateChart(data){
    var date = new Date();
    var day = date.getDate();

    var firstDate = day - 7;

    var value = [];
    var valueTmp = 0;
    for(var i=firstDate;i<day;i++){
        if(typeof data.series[i] != 'undefined'){
            value.push(data.series[i]);
            valueTmp = data.series[i];
        }else{
            value.push(valueTmp);
        }
    }
    return value;
}