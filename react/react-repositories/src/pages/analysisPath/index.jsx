import React, { useEffect, useState } from 'react'
import * as echarts from 'echarts'
import { Button, Form, Table } from 'antd'
import { Excel } from '../../components'
import {
  files as FF,
  prefixCls,
  initialValues,
  fileds,
  deptSeriesOps,
  originMap,
} from './constant'
import './index.css'

const AnalysisPath = () => {
  const [formValues, setformValues] = useState(initialValues)

  useEffect(() => {
    parseExcel(FF)
  }, [formValues])

  // 解析文件内容
  const getParseData = (file) => {
    const headers = file[0]
    const jsonData = file.slice(1).reduce((p, c) => {
      const map = {}
      c.forEach((cur, idx) => {
        map[[headers[idx]]] = cur
      })
      return [...p, map]
    }, [])
    return jsonData
  }

  // 筛选数据
  const filterData = (datas, rules, type = 'business') => {
    const res = []
    datas.forEach((d) => {
      let num = 0
      Object.keys(rules).forEach((k) => {
        if (d[k] == rules[k]) {
          num = num + 1
        }
      })

      if (num === Object.keys(rules).length) {
        // 事业部筛选
        if (type === 'business' && !!d[`dept_id_${formValues.dept}`]) {
          res.push(d)
        }
        // 商家用户筛选
        if (type === 'usertype-jdb' && d.erp.startsWith('JD_B')) {
          res.push(d)
        }
        // 运营筛选
        if (type === 'usertype-jd' && !d.erp.startsWith('JD_B')) {
          res.push(d)
        }
      }
    })
    return res
  }

  // 筛选部门
  const getDeptList = (data, type = 'name') =>
    data.reduce(
      (p, c) =>
        !!c[`dept_${type}_${formValues.dept}`]
          ? [...p, c[`dept_${type}_${formValues.dept}`]]
          : p,
      []
    )
  // 路线去重
    const removeSamePath=(data)=>{
      data = data.map(item =>{
        // 筛选核心区域
        let points = item['zone_chain'] && item['zone_chain'].split('_').filter((p) => {
          return !['A', 'K', 'J', 'I', 'N'].includes(p)
        })
        // 去重
        let newPoints = new Set(points)
        // 排序
        item['zone_chain'] = [...newPoints].sort((a, b) => a.localeCompare(b)).join('-')
        return item
      })
      return data
    }
  
  // 获取EChart堆叠图展示数据
  const getDeptSeries = (data) => {
    return [
      {
        name: 'C-D', // 路径名称
        data: [320, 302, 301, 334, 390, 330, 320], // length=部门数 内容=每个部门下对应的路径使用总数
        stack: 'total',
        ...deptSeriesOps,
      },
    ]
  }

  const getBusinessEchart = (data) => {
    // 1. 事业部柱状图
    let element = document.getElementById('new_dept_histogram')

    let myChart = echarts.init(element)
    myChart.clear()
    const deptList = getDeptList(data)
    const series = getDeptSeries(data)
    let option
    option = {
      title: {
        text: '新页面路径分析',
        subtext: '部门',
        left: 'center',
      },
      tooltip: {
        trigger: 'axis',
      },
      legend: {
        orient: 'vertical',
        left: 'left',
      },
      xAxis: [
        {
          type: 'category',
          data: deptList,
        },
      ],
      yAxis: [
        {
          type: 'value',
        },
      ],
      series,
    }
    option && myChart.setOption(option)
  }

  // 获取路径
  const getUsersPath = (data) => {
    return ['c-d']
  }

  // 获取用户展示柱状图数据
  const getUsersSeries = (data) => {
    return [
      {
        name: '商家', // 路径名称
        data: [320, 302, 301, 334, 390, 330, 320], // length=部门数 内容=每个部门下对应的路径使用总数
        ...deptSeriesOps,
      },
      {
        name: '运营',
        data: [20], // length=部门数 内容=每个部门下对应的路径使用总数
        ...deptSeriesOps,
      },
    ]
  }

  const getUsersEchart = (data) => {
    let element = document.getElementById('new_user_histogram')

    let myChart = echarts.init(element)
    myChart.clear()
    const deptList = getUsersPath(data)
    const series = getUsersSeries(data)
    let option
    option = {
      title: {
        text: '新页面路径分析',
        subtext: '部门',
        left: 'center',
      },
      tooltip: {
        trigger: 'axis',
      },
      legend: {
        orient: 'vertical',
        left: 'left',
      },
      xAxis: [
        {
          type: 'category',
          data: deptList,
        },
      ],
      yAxis: [
        {
          type: 'value',
        },
      ],
      series,
    }
    option && myChart.setOption(option)
  }

  // 各区域点击次数、搭建时长
  const getOriginOps = (data) => {
    // 所有区域的点击次数
    const allChain = data.reduce((p, c) => {
      if (c.zone_chain) {
        c.zone_chain.split('_').forEach((path) => {
          p[path] = (p[path] || 0) + 1
        })
      }
      return p
    }, {})
    // 所有区域的搭建时长
    const allTime = data.reduce((p, c) => {
      Object.keys(c).forEach((key) => {
        if (key.endsWith('_time') && Number(c[key])) {
          p[key] = (p[key] || 0) + Number(c[key])
        }
      })
      return p
    }, {})
    let element = document.getElementById('count111')

    let myChart = echarts.init(element)
    myChart.clear()
    let option
    option = {
      title: {
        text: 'Referer of a Website',
        subtext: 'Fake Data',
        left: 'center',
      },
      tooltip: {
        trigger: 'item',
      },
      legend: {
        orient: 'vertical',
        left: 'left',
      },
      series: [
        {
          name: '',
          type: 'pie',
          radius: '50%',
          data: Object.keys(allChain).map((c) => {
            return {
              value: allChain[c],
              name: originMap[c]?.desc || c,
            }
          }),
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)',
            },
          },
        },
      ],
    }
    option && myChart.setOption(option)
    const sum = Object.keys(allChain).reduce((p, c) => p + allChain[c], 0)
    const map = Object.keys(allChain).reduce(
      (p, c) => ({
        ...p,
        [c]: {
          val: allChain[c],
          percent: allChain[c] / sum,
        },
      }),
      {}
    )
    console.log('allChain', map)
  }

  // 把数字专为百分比
  const parsePercent=(data)=>{
    if(Number.isNaN(data)) return 0
    return (Number(data) * 100).toFixed(2) + '%' 
  }
  // 获取事业部表格数据
  const getBusinessTable=(data)=>{
    // 表格数据
    let dataSource = []
    // 操作次数（总）
    let totalNum = 0
    // 操作时间（总）
    let totalTime = 0
    // 根据当前部门级别聚合数据
    let dataMap = new Map()
    data.forEach((item,index)=>{
      // 有效时间
      const effectiveTime = Number(item.total_time) - Number(item.k_time)
      totalTime += effectiveTime
      totalNum ++
      const mustObj = {
        key: index,
        path:item.zone_chain, // 路径
        dept_name_1: item.dept_name_1, // 一级部门名
        dept_name_2: item.dept_name_2, // 二级部门名
        dept_name_3: item.dept_name_3, // 三级部门名
        dept_name_4: item.dept_name_4, // 四级部门名
      }
      if(!dataMap.has(item[`dept_name_${formValues.dept}`])){
        // 部门下的路径映射map
        const pathMap = new Map()
        pathMap.set(item.zone_chain,{
          count: 1, // 总操作数
          time: effectiveTime, // 总时间
          ...mustObj
        })
        dataMap.set(item[`dept_name_${formValues.dept}`],pathMap)
      }else{
        // 上一次的部门维度数据
        let lastDeptValue = dataMap.get(item[`dept_name_${formValues.dept}`])
        if(!lastDeptValue.get(item.zone_chain)){
          lastDeptValue.set(item.zone_chain,{
            count: 1, // 总操作数
            time: effectiveTime, // 总时间
            ...mustObj
          })
        }else{
          // 上一次的路径维度数据
          const lastPathValue = lastDeptValue.get(item.zone_chain)
          lastDeptValue.set(item.zone_chain,{
            count: lastPathValue.get('count') + 1, // 总操作数
            time: lastPathValue.get('time') + effectiveTime, // 总时间
            ...mustObj
          })
        }
        dataMap.set(item[`dept_name_${formValues.dept}`],lastDeptValue)
    }
    })
    
    // 给每个数据加上次数和时间的占比
    dataMap.forEach((pathMapItem)=>{
      pathMapItem = pathMapItem.forEach((value,key)=>{
        value.count_percent = parsePercent(value.count / totalNum)
        value.time_percent = parsePercent(value.time / totalTime)
        // 右侧table数据
        dataSource.push(value)
      })
    })
    console.log(dataMap,'事业部表格数据',dataSource)
    return dataSource
  }

  const parseExcel = (file) => {
    /* 解析文件内容 */
    // 1. 将数据转换为json格式
    let datas = getParseData(file)
    // 路径去重&留存核心路径
    datas = removeSamePath(datas)
    /* 筛选数据 */
    // 1. 新页面类型数据
    let new_data = filterData(datas, { new_old: 1, copy_type: -1 })
    // 2. 老页面类型数据
    let old_data = filterData(datas, { new_old: 2 })
    // 3. 复制类型数据
    let copy_data = filterData(datas, { new_old: 1, copy_type: 1 })
    copy_data = filterData(datas, { copy_type: 0 })
    // 4. 计算商家分类数据
    let jdb_data = filterData(datas, {}, 'usertype-jdb')
    // 5. 计算运营数据
    let jd_data = filterData(datas, {}, 'usertype-jd')
    /* 计算路径 */
    /* 用户路径 Echart */
    // 1. 事业部分类
    getBusinessEchart(old_data)
    // 获取事业部表格数据
    getBusinessTable(old_data)
    // 2. 用户类型分类
    getUsersEchart(old_data)
    /* 各区域点击次数 */
    getOriginOps(datas)
  }

  const onFinish = (values) => {
    setformValues(values)
  }

  return (
    <div className={prefixCls}>
      <h1>用户路径分析</h1>
      <div className={`${prefixCls}-steps`}>
        <div>
          <h3>Step 1 上传文件</h3>
          <Excel type="upload" parseExcel={parseExcel} />
        </div>
        <div>
          <h3>Step 2 搜索类型定义</h3>
          <div>
            <Form
              name="basic"
              initialValues={initialValues}
              onFinish={onFinish}
            >
              {fileds.map(({ name, child, label }) => (
                <Form.Item key={name} label={label} name={name}>
                  {child}
                </Form.Item>
              ))}
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  Search
                </Button>
              </Form.Item>
            </Form>
          </div>
        </div>
      </div>
      {[
        { header: '新页面路径分析', key: 'new' },
        { header: '复制页面路径分析', key: 'copynew' },
        { header: '老页面路径分析', key: 'old' },
      ].map(({ header, key }) => (
        <div key={key} className={`${prefixCls}-visual`}>
          <h3>{header}</h3>
          <div className={`${prefixCls}-visual-item`}>
            <div>
              <div className={`${prefixCls}-visual-title`}>事业部柱状图</div>
              <div
                className={`${prefixCls}-visual-echart`}
                id={`${key}_dept_histogram`}
              />
            </div>
            <div>
              <div className={`${prefixCls}-visual-title`}>事业部明细表</div>
              <div className={`${prefixCls}-visual-echart`}>
                <Table
                  size="small"
                  columns={[
                    {
                      title: '部门',
                      dataIndex: `dept_name_${formValues.dept}`,
                      key: `dept_name_${formValues.dept}`,
                    },
                    {
                      title: '操作路径链路',
                      dataIndex: 'path',
                      key: 'path',
                    },
                    {
                      title: '操作次数',
                      dataIndex: 'count',
                      key: 'count',
                    },
                    {
                      title: '次数占比',
                      dataIndex: 'count_percent',
                      key: 'count_percent',
                    },
                    {
                      title: '操作时长',
                      dataIndex: 'time',
                      key: 'time',
                    },
                    {
                      title: '时长占比',
                      dataIndex: 'time_percent',
                      key: 'time_percent',
                    },
                  ]}
                  dataSource={[
                    {
                      key: '1',
                      path: 'John Brown',
                      count: 32,
                      count_percent: 'New York No. 1 Lake Park',
                      time: ['nice', 'developer'],
                      time_percent: '50%',
                      dept_name_1: '部门',
                      dept_id_1: '11',
                      dept_name_2: '..',
                      // ...3， 4级部门
                    },
                  ]}
                />
              </div>
            </div>
            <div>
              <div className={`${prefixCls}-visual-title`}>用户Echarts</div>
              <div
                className={`${prefixCls}-visual-echart`}
                id={`${key}_user_histogram`}
              ></div>
            </div>
            <div>
              <div className={`${prefixCls}-visual-title`}>用户明细表</div>
              <div className={`${prefixCls}-visual-echart`}>
                <Table
                  size="small"
                  columns={[
                    {
                      title: '用户类型',
                      dataIndex: 'usertype',
                      key: 'usertype',
                    },
                    {
                      title: '操作路径链路',
                      dataIndex: 'path',
                      key: 'path',
                    },
                    {
                      title: '操作次数',
                      dataIndex: 'count',
                      key: 'count',
                    },
                    {
                      title: '次数占比',
                      dataIndex: 'count_percent',
                      key: 'count_percent',
                    },
                    {
                      title: '操作时长',
                      dataIndex: 'time',
                      key: 'time',
                    },
                    {
                      title: '时长占比',
                      dataIndex: 'time_percent',
                      key: 'time_percent',
                    },
                  ]}
                  dataSource={[
                    {
                      key: '1',
                      path: 'John Brown',
                      count: 32,
                      count_percent: 'New York No. 1 Lake Park',
                      time: ['nice', 'developer'],
                      time_percent: '50%',
                      usertype: '商家',
                    },
                  ]}
                />
              </div>
            </div>
          </div>
        </div>
      ))}
      <h1>各区域点击次数</h1>
      <div id="count111" className={`${prefixCls}-visual-echart`} />
    </div>
  )
}

export default AnalysisPath
