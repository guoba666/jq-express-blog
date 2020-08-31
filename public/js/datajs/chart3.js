var  option = {
    tooltip: {
        trigger: 'axis'
    },
    grid: {
        left: '1%',
        right: '15%',
        bottom: '3%',
        containLabel: true
    },
    xAxis: [
        {
            type: 'category',
            axisLine:{
                symbol:['none','arrow'],
                lineStyle:{
                    color:'#9b9b9b',
                }  
            },
            name: '月份',
            data: ['1','2','3','4','5','6','7','8','9','10','11','12'],
            splitLine:{
                show:false,
            },
        }
    ],
    yAxis: [
        {
            type: 'value',
            axisLine:{
                symbol:['none','arrow'],
                lineStyle:{
                    color:'#9b9b9b',
                }  
            },
            name: '用户数/人',
            min: 0,
            max: 600,
            interval: 100,
            axisLabel: {
                formatter: '{value} '
            },
            splitLine:{
                show:false,
            },
        }
    ],
    series: [
         
        {
            name:'用户统计',
            type:'bar',
            /*itemStyle: {
                normal: {
                    color: new echarts.graphic.LinearGradient(
                        0, 0, 0, 1,
                        [
                            {offset: 0, color: '#fe6262'},
                            {offset: 0.5, color: '#fe4141'},
                            {offset: 1, color: '#fe1818'}
                        ]
                    ),
                },
                emphasis: {
                    color: new echarts.graphic.LinearGradient(
                        0, 0, 0, 1,
                        [
                            {offset: 0, color: '#fe6262'},
                            {offset: 0.5, color: '#fe4141'},
                            {offset: 1, color: '#fe1818'}
                        ]
                    )
                }
            },*/
            
            /*设置柱状图颜色*/
            itemStyle: {
                normal: {
                    color: function(params) {
                        // build a color map as your need.
                        var colorList = [
                          '#d9e8fd'
                        ];
                        return colorList[params.dataIndex]
                    },
                    /*信息显示方式*/
                    label: {
                        show: false,
                        position: 'top',
                        formatter: '{b}\n{c}'
                    }
                }
            },
            data:[180, 280, 300, 150, 200, 250, 150, 100, 95, 160, 380, 400]
        },
        {
            name:'折线',
            type:'line',
            itemStyle : {  /*设置折线颜色*/
                normal : {
                   color:'#78aef9'
                }
            },
            data:[180, 280, 300, 150, 200, 250, 150, 100, 95, 160, 380, 400]
        }
    ]
};
// 基于准备好的dom，初始化echarts实例
var myChart = echarts.init(document.getElementById('chart3'));
// 使用刚指定的配置项和数据显示图表。
myChart.setOption(option); 