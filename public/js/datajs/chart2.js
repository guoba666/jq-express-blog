var chart_c1 = echarts.init(document.getElementById('chart2'));//指定的id要有高度和宽度
    var dataMoney = [0, 100, 200, 300, 400, 500, 600, 700, 800];//y轴
    var dataMouth = ['1','2','3','4','5','6','7','8','9','10','11','12'];//x轴
    //显示数据，可修改
    var data1 = [22, 24, 38, 43, 59, 25, 49, 34, 44, 34, 22, 46];
    var data2 = [35, 46, 43, 59, 60, 45, 53, 42, 56, 45, 36, 59];
    // 总计
    var data3 = function() {
        var datas = [];
        for (var i = 0; i < data1.length; i++) {
            datas.push(data1[i] + data2[i]);
        }
        return datas;
    }();
 
    option = {
        title: {
            // text: '费用统计',
            left: 'left',
            top: 'top',
        },
        tooltip : {
            trigger: 'axis',
            axisPointer : {
                type : 'shadow'
            },
            formatter:function (params){
 
                var relVal = params[0].name+"<br/>";
                relVal += params[0].seriesName+ ' : ' + params[0].value+"例子"+"<br/>";
                relVal +=params[1].seriesName+ ' : ' +params[1].value+"<br/>";
                // relVal += params[2].seriesName+ ' : ' + params[2].value+"%";
                return relVal;
            }
        },
        legend: {
            // orient: 'vertical',
            // x: 'center',
            // y: 'top',
            selectedMode:false, 
            itemWidth:15,  
            itemHeight:15, 
            icon: 'circle',
            data:['访问人数','会员人数']
        },
        grid: {
            left: '1%',
            right: '15%',
            bottom: '3%',
            containLabel: true
        },
        xAxis : [
            {
                type : 'category',
                axisLine:{
                    symbol:['none','arrow'],
                    lineStyle:{
                        color:'#9b9b9b',
                    }    
                },
                name: '月份',
                data : dataMouth,
                splitLine:{
                    show:false,
                },
            }
        ],
        yAxis : [
            {
                type : 'value',
                axisLine:{
                    symbol:['none','arrow'],
                    lineStyle:{
                        color:'#9b9b9b',
                    }  
                },
                name: '人数(个)',
                data : dataMoney,//可省略，只要type : 'value',会自适应数据设置Y轴
                splitLine:{
                    show:false,
                },
            }
        ],
        series : [
            {
                name:'访问人数',
                type:'bar',
                stack:'sum',  //柱状图叠在一起的关键设置
                // barWidth : 20,
                itemStyle:{
                    normal:{
                        label: {
                            show: false,//是否展示
                        },
                        color:'#2a6afd',
                    }
                },
                data:data1
            },
            {
                name:'会员人数',
                type:'bar',
                stack:'sum',  //柱状图叠在一起的关键设置
                // barWidth : 20,
                itemStyle:{
                    normal:{
                        label: {
                            show: false,//是否展示
                        },
                        color:'#7fa6ff',
                        barBorderRadius:[10, 10, 0, 0],
                    }
                },
                data:data2
            },
 
 
            ]
        };
    chart_c1.setOption(option);