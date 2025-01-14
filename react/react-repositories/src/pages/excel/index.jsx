import React from 'react'
import { Excel } from '../../components'

const dataSource = [
  {
    activityName: '',
    pageId: '',
    flexcubeNew: '-',
    customNew: '-',
    flexcubeReuse: '-',
    customReuse: '-',
    flexcubeIteration: '4(ly_平铺一列PC,开放店铺,错落滑动商品,zj测试错落轮播)',
    customIteration: '1(PC报告A)',
    flexcubeNum: 4,
    customNum: 1,
    systemNum: 5,
    viewkitNum: 0,
    flexcubeRate: '40.00%',
    customRate: '10.00%',
    systemRate: '50.00%',
    viewkitRate: '0%',
    hotzoneNum: 2,
    hotzoneRate: '占系统楼层40.00%，占总楼层20.00%',
    sum: 10,
  },
  {
    activityName: '总计',
    pageId: '',
    flexcubeNew: '-',
    customNew: '-',
    flexcubeReuse: '-',
    customReuse: '-',
    flexcubeIteration: '4(4种)',
    customIteration: '1(1种)',
    flexcubeNum: 4,
    customNum: 1,
    systemNum: 5,
    viewkitNum: 0,
    flexcubeRate: '40.00%',
    customRate: '10.00%',
    systemRate: '50.00%',
    viewkitRate: '0.00%',
    hotzoneNum: 2,
    hotzoneRate: '占系统楼层40.00%，占总楼层20.00%',
    sum: 10,
  },
]

const headers = {
  dataIndex: [
    'activityName',
    'pageId',
    'flexcubeNew',
    'flexcubeReuse',
    'flexcubeIteration',
    'flexcubeNum',
    'flexcubeRate',
    'customNew',
    'customReuse',
    'customIteration',
    'customNum',
    'customRate',
    'hotzoneNum',
    'hotzoneRate',
    'systemNum',
    'systemRate',
    'viewkitNum',
    'viewkitRate',
    'sum',
  ],
  dataSource: [
    {
      activityName: '会场',
      pageId: '会场分期',
      flexcubeNew: '灵活楼层',
      flexcubeReuse: '灵活楼层',
      flexcubeIteration: '灵活楼层',
      flexcubeNum: '灵活楼层',
      flexcubeRate: '灵活楼层',
      customNew: '共建楼层',
      customReuse: '共建楼层',
      customIteration: '共建楼层',
      customNum: '共建楼层',
      customRate: '共建楼层(占比)',
      hotzoneNum: '系统楼层',
      hotzoneRate: '图片热区(占比)',
      systemNum: '系统楼层',
      systemRate: '系统楼层(占比)',
      viewkitNum: '积木楼层',
      viewkitRate: '积木楼层(占比)',
      sum: '合计',
    },
    {
      activityName: '',
      pageId: '',
      flexcubeNew: '新增样式',
      customNew: '新增',
      flexcubeReuse: '复用样式',
      customReuse: '复用',
      flexcubeIteration: '迭代样式',
      customIteration: '迭代',
      flexcubeNum: '个数',
      customNum: '个数',
      systemNum: '个数',
      viewkitNum: '个数',
      flexcubeRate: '占比',
      customRate: '复用',
      systemRate: '占比',
      viewkitRate: '占比',
      hotzoneNum: '图片热区(个数)',
      hotzoneRate: '图片热区(占比)',
      sum: '',
    },
  ],
  colsWidth: [60],
  merges: [
    // 纵向合并，范围是第1列的行1到行2
    { s: { r: 0, c: 0 }, e: { r: 1, c: 0 } },
    { s: { r: 0, c: 1 }, e: { r: 1, c: 1 } },
    { s: { r: 0, c: 18 }, e: { r: 1, c: 18 } },
    // 横向合并，范围是第1行的列3到列7
    { s: { r: 0, c: 2 }, e: { r: 0, c: 6 } },
    { s: { r: 0, c: 7 }, e: { r: 0, c: 11 } },
    { s: { r: 0, c: 12 }, e: { r: 0, c: 15 } },
    { s: { r: 0, c: 16 }, e: { r: 0, c: 17 } },
  ],
}

class ExportExcel extends React.Component {
  parseExcel = (dataSource) => {
    console.log(dataSource)
  }

  render() {
    return (
      <div>
        <Excel
          multiple
          fileProps={[headers, dataSource, 'anaylysis']}
          parseExcel={this.parseExcel}
        />
      </div>
    )
  }
}
export default ExportExcel
