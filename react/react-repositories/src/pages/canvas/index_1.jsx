import React, { useEffect, useState } from 'react'
// https://jinjilynn.github.io/
import EasyDrawing from 'easy-drawing'
import { Excel } from '../../components'
import { COLOR } from '../../utils'
import A from '../../static/img/A.png'
import B from '../../static/img/B.png'
import C from '../../static/img/C.png'
import D from '../../static/img/D.png'
import E from '../../static/img/E.png'
import F from '../../static/img/F.png'
import G from '../../static/img/G.png'
import H from '../../static/img/H.png'
import I from '../../static/img/16gl-I.png'
import J from '../../static/img/16gl-J.png'
import K from '../../static/img/16gl-K.png'
import L from '../../static/img/16gl-L.png'
import M from '../../static/img/16gl-M.png'
import N from '../../static/img/16gl-N.png'

const areas = {
  polygon: [
    [-77.044688, 38.895265],
    [-77.043683, 38.895265],
    [-77.043683, 38.894595],
    [-77.044682, 38.894595],
  ],
  fillStyle: '#fcf7f2',
  strokeStyle: 'gray',
}

const SCATTERS = {
  //   A: {
  //     desc: "	进入运营区域",
  //     src: A,
  //     point: [-77.043837, 38.895011],
  //   },
  B: {
    desc: '模板选择区域',
    src: B,
    point: [-77.0446, 38.894906],
    textpoint: [-77.0446, 38.894859],
  },
  C: {
    desc: '可视化预览区域',
    src: C,
    point: [-77.04440975, 38.895],
    textpoint: [-77.04440975, 38.895054],
  },
  D: {
    desc: '配置面板（样式）',
    src: D,
    point: [-77.044212997, 38.895],
    textpoint: [-77.044212997, 38.8948959],
  },
  E: {
    desc: '导航区域',
    src: E,
    point: [-77.043699, 38.895],
  },
  F: {
    desc: '全局操作',
    src: F,
    point: [-77.044212997, 38.895229],
  },
  G: {
    desc: '千人千面',
    src: G,
    point: [-77.043749, 38.895],
  },
  H: {
    desc: '模板库',
    src: H,
    point: [-77.044579, 38.895229],
  },
  //   I: {
  //     desc: "iFrame",
  //     src: I,
  //     point: [-77.044579, 38.895229],
  //   },
  //   J: {
  //     desc: "空闲",
  //     src: J,
  //     point: [-77.044579, 38.895229],
  //   },
  // K: {
  //   desc: '跳出', // (刷新，页面失去焦点，最小化窗口，切换其他浏览器tab，电脑睡眠，关闭网页，页面跳转)
  //   src: K,
  //   point: [-77.043979, 38.895229],
  // },
  L: {
    desc: '发布、预览',
    src: L,
    point: [-77.043837, 38.895229],
  },
  M: {
    desc: '配置面板（素材）',
    src: M,
    point: [-77.044052997, 38.895],
    textpoint: [-77.044052997, 38.895054],
  },
  //   N: {
  //     desc: "弹窗",
  //     src: N,
  //     point: [-77.044152997, 38.895],
  //   },
}

const scatters = Object.keys(SCATTERS).map((s) => {
  const { src, point } = SCATTERS[s]
  return {
    size: 20,
    img: { src },
    point,
  }
})

const texts = Object.keys(SCATTERS).map((s) => {
  const { desc, textpoint, point } = SCATTERS[s]
  return {
    text: desc,
    color: '#000',
    point: textpoint || point,
  }
})
let curIdx = 0
const Canvas = () => {
  const [paths, setPaths] = useState([])
  const [file, setFile] = useState([])

  useEffect(() => {
    if (file && file.length !== 0) {
      parseFile(file)
    }
    // const local_excel = localStorage.getItem('excel')
    // if (local_excel) {
    // setFile(JSON.parse(JSON.stringify(file)))
    // }
  }, [file])

  // 解析file
  const parseFile = (f = file) => {
    // console.log('f123456',f);

    /**
     * 获取标题栏
     * dept_name_1：事业部名称
     * dept_id_1:事业部ID
     * new_old: 2 是老页面 1 是新页面  0是未上线页面
     * copy_type: -1是非复制，0和1都是复制
     * traceid：每次操作链路
     * zone_chain:区域轨迹
     * sp_chain：功能轨迹
     * page_id: 页面id
     */
    const headers = f.shift()
    const [page_idIdx, zone_chainIdx, new_oldIdx, dept_id_1Idx, copy_typeIdx] =
      [
        headers.findIndex((h) => h === 'page_id'),
        headers.findIndex((h) => h === 'zone_chain'),
        headers.findIndex((h) => h === 'new_old'),
        headers.findIndex((h) => h === 'dept_id_1'),
        headers.findIndex((h) => h === 'copy_type'),
      ]
    /* 获取分类数据 */
    // 新建页面下非复制
    const new_uncopy_data = filiterData(
      f,
      { new_oldIdx, page_idIdx, copy_typeIdx },
      'new_uncopy'
    )
    // 老页面下非复制
    const old_data = filiterData(
      f,
      { new_oldIdx, page_idIdx, copy_typeIdx },
      'old'
    )
    // console.log(f,'old_data',old_data);

    /* 获取会话路径 */
    // 获取 path 路径
    let columnPath = getCanvasPaths(f, headers)
    if (columnPath) {
      // columnPath = columnPath.slice(0, 20)
      // console.log('columnPath', columnPath)
      // 定时任务绘制路径
      // showCurPath(columnPath)
    }
  }

  const showCurPath = (columnPath) => {
    if (curIdx !== columnPath.length - 1) {
      setTimeout(() => {
        console.log(111, curIdx, columnPath[curIdx])
        if (columnPath[curIdx]) {
          setPaths([columnPath[curIdx]])
        }
        curIdx = curIdx + 1
        showCurPath(columnPath)
      }, 10000)
    }
  }

  const filiterData = (
    files,
    { new_oldIdx, page_idIdx, copy_typeIdx },
    type
  ) => {
    const res = []
    // new_old: 2 是老页面 1 是新页面  0是未上线页面
    const new_oldMap = {
      new: '1',
      old: '2',
    }
    // copy_type: -1是非复制，0和1都是复制
    const copy_typeMap = {
      copy: ['0', '1'],
      uncopy: ['-1'],
    }
    const [new_oldType, iscopy] = type.split('_')
    files.forEach((file) => {
      const [new_old, page_id, copy_type] = [
        file[new_oldIdx],
        file[page_idIdx],
        file[copy_typeIdx],
      ]
      // 只记录一次会话
      const hasPageId = res.find((f) => f[page_idIdx] === page_id)
      if (
        new_old === new_oldMap[new_oldType] &&
        (iscopy ? copy_typeMap[iscopy].includes(copy_type) : true)
      ) {
        res.push(file)
      }
    })
    return res
  }


  // 获取echarts数据
  const getCanvasPaths = (files, headers) => {
    let canvasPaths = [],
      filePath = [],
      totalNum = 0 // 页面总数据
    const [erpIdx, timeIdx, page_id, zone_chainIdx, new_oldIdx, dept_id_1Idx, copy_typeIdx, total_timeIdx, k_timeIdx,deptNameIdx] =
      [
        headers.findIndex((h) => h === 'erp'),
        headers.findIndex((h) => h === 'time'),
        headers.findIndex((h) => h === 'page_id'),
        headers.findIndex((h) => h === 'zone_chain'),
        headers.findIndex((h) => h === 'new_old'),
        headers.findIndex((h) => h === 'dept_id_1'),
        headers.findIndex((h) => h === 'copy_type'),
        headers.findIndex((h) => h === 'total_time'),
        headers.findIndex((h) => h === 'k_time'),
        headers.findIndex((h) => h === 'dept_name_1'),
      ]
    console.log(files, 'file', );
    let erpSet = new Set()

    files.forEach((file) => {
      totalNum++
      // 除了跳出的时间的有效时间
      let times = Number(file[total_timeIdx]) - Number(file[k_timeIdx])
      let erp = file[erpIdx]
      let deptName = file[deptNameIdx]|| '商家' //部门
      erpSet.add(erp)
      // console.log(times,'times');

      let points = file[zone_chainIdx] && file[zone_chainIdx].split('_').filter((p) => {
        return !['A', 'K', 'J', 'I', 'N'].includes(p)
      })
      if (!points) return
      let newPoints = new Set(points)
      if (points && points.length > 1) {

        filePath.push({ erp, name: [...newPoints].sort((a, b) => a.localeCompare(b)).join('-'), times: times,deptName:deptName })
      }
      points = points.map((w) => SCATTERS[w]?.point).filter((c) => !!c)
      if (points.length > 1) {
        canvasPaths.push({
          points,
          color: COLOR.color16(),
          // speed: 20,
        })
      }
    })
    // {
    //   'c-d':{
    //     num:1//次数
    //     time:10//时间和单位秒
    //   }
    // }
    {
      'xxx事业部'
    }
    let temp = new Map()
    console.log(erpSet, 'filePath', filePath);
    let effectiveNumer = 0 // 有效数据
    filePath.forEach(item => {

      // if (item.name.length < 2 || item.erp !== 'lijin44') {
      if (item.name.length < 2 ) {
        return
      }
      effectiveNumer++
      if (!temp.has(item.name)) {
        temp.set(item.name, {
          num: 1,
          times: Number(item.times)
        })
      } else {
        temp.set(item.name, {
          num: Number(temp.get(item.name).num) + 1,
          times: Number(temp.get(item.name).times) + Number(item.times)
        })
      }
    })

    let okNumber = 0 // >=10次的数据次数
    // 过滤使用次数<10的到其他里面
    function filterMap(map, filterFn) {
      const result = new Map();
      for (const [key, value] of map) {
        if (filterFn(key, value)) {
          okNumber += value.num
          result.set(key, value);
        } else {
          if (!result.has('其他')) {
            result.set('其他', value)
          } else {
            result.set('其他', {
              num: Number(result.get('其他').num) + Number(value.num),
              times: Number(result.get('其他').times) + Number(value.times),
            })
          }
        }
      }
      return result;
    }
    console.log('temp', temp);
    // 复制用的20 
    const filteredMap = filterMap(temp, (key, value) => value.num >= 13);
    console.log('页面总数据:', totalNum, "非单条数据：", effectiveNumer);
    console.log('大于10有效数据条数', okNumber, '小于10次条数：', effectiveNumer - okNumber)
    // console.log("用户数据：",temp,'大于10次用户数据', filteredMap,)
    const sortAllMap = sortByValue(temp); // 
    const sortFilterMap = sortByValue(filteredMap);
    const rateMap = rateByNumAndTimes(sortFilterMap)
    console.log("用户数据：", sortAllMap, "lijin44用户百分比数据", rateMap)
    return canvasPaths
  }
  // // 获取路径
  // const getCanvasPaths = (files, headers) => {
  //   let canvasPaths = [],
  //     filePath = [],
  //     totalNum = 0 // 页面总数据
  //   const [erpIdx, timeIdx, page_id, zone_chainIdx, new_oldIdx, dept_id_1Idx, copy_typeIdx, total_timeIdx, k_timeIdx] =
  //     [
  //       headers.findIndex((h) => h === 'erp'),
  //       headers.findIndex((h) => h === 'time'),
  //       headers.findIndex((h) => h === 'page_id'),
  //       headers.findIndex((h) => h === 'zone_chain'),
  //       headers.findIndex((h) => h === 'new_old'),
  //       headers.findIndex((h) => h === 'dept_id_1'),
  //       headers.findIndex((h) => h === 'copy_type'),
  //       headers.findIndex((h) => h === 'total_time'),
  //       headers.findIndex((h) => h === 'k_time'),
  //     ]
  //   console.log(files, 'file', zone_chainIdx);
  //   let erpSet = new Set()

  //   files.forEach((file) => {
  //     totalNum++
  //     // 除了跳出的时间的有效时间
  //     let times = Number(file[total_timeIdx]) - Number(file[k_timeIdx])
  //     let erp = file[erpIdx]
  //     erpSet.add(erp)
  //     // console.log(times,'times');

  //     let points = file[zone_chainIdx] && file[zone_chainIdx].split('_').filter((p) => {
  //       return !['A', 'K', 'J', 'I', 'N'].includes(p)
  //     })
  //     if (!points) return
  //     let newPoints = new Set(points)
  //     if (points && points.length > 1) {

  //       filePath.push({ erp, name: [...newPoints].sort((a, b) => a.localeCompare(b)).join('-'), times: times })
  //     }
  //     points = points.map((w) => SCATTERS[w]?.point).filter((c) => !!c)
  //     if (points.length > 1) {
  //       canvasPaths.push({
  //         points,
  //         color: COLOR.color16(),
  //         // speed: 20,
  //       })
  //     }
  //   })
  //   // {
  //   //   'c-d':{
  //   //     num:1//次数
  //   //     time:10//时间和单位秒
  //   //   }
  //   // }
  //   let temp = new Map()
  //   console.log(erpSet, 'filePath', filePath);
  //   let effectiveNumer = 0 // 有效数据
  //   filePath.forEach(item => {

  //     // if (item.name.length < 2 || item.erp !== 'lijin44') {
  //       if (item.name.length < 2 ) {
  //       return
  //     }
  //     effectiveNumer++
  //     if (!temp.has(item.name)) {
  //       temp.set(item.name, {
  //         num: 1,
  //         times: Number(item.times)
  //       })
  //     } else {
  //       temp.set(item.name, {
  //         num: Number(temp.get(item.name).num) + 1,
  //         times: Number(temp.get(item.name).times) + Number(item.times)
  //       })
  //     }
  //   })

  //   let okNumber = 0 // >=10次的数据次数
  //   // 过滤使用次数<10的到其他里面
  //   function filterMap(map, filterFn) {
  //     const result = new Map();
  //     for (const [key, value] of map) {
  //       if (filterFn(key, value)) {
  //         okNumber += value.num
  //         result.set(key, value);
  //       } else {
  //         if (!result.has('其他')) {
  //           result.set('其他', value)
  //         } else {
  //           result.set('其他', {
  //             num: Number(result.get('其他').num) + Number(value.num),
  //             times: Number(result.get('其他').times) + Number(value.times),
  //           })
  //         }
  //       }
  //     }
  //     return result;
  //   }
  //   console.log('temp', temp);
  //   // 复制用的20 
  //   const filteredMap = filterMap(temp, (key, value) => value.num >= 13);
  //   console.log('页面总数据:', totalNum, "非单条数据：", effectiveNumer);
  //   console.log('大于10有效数据条数', okNumber, '小于10次条数：', effectiveNumer - okNumber)
  //   // console.log("用户数据：",temp,'大于10次用户数据', filteredMap,)
  //   const sortAllMap = sortByValue(temp); // 
  //   const sortFilterMap = sortByValue(filteredMap);
  //   const rateMap = rateByNumAndTimes(sortFilterMap)
  //   console.log("用户数据：", sortAllMap, "lijin44用户百分比数据", rateMap)
  //   return canvasPaths
  // }

  // 增加时间和次数的百分比
  function rateByNumAndTimes(sortFilterMap) {
    let allNum = 0 // 总使用次数
    let allTimes = 0 // 总时长
    for (let [key, value] of sortFilterMap.entries()) {
      console.log(key, 'sortFilterMap', value);
      allNum += Number(value.num)
      allTimes += Number(value.times)
    }
    console.log('allNum', allNum, 'allTimes', allTimes);
    for (let [key, value] of sortFilterMap.entries()) {
      sortFilterMap.set(key, { ...value, numRate: (Number(value.num) / Number(allNum) * 100).toFixed(2) + '%', timesRate: (Number(value.times) / Number(allTimes) * 100).toFixed(2) + '%' })
    }
    return sortFilterMap
  }
  // map根据value排序
  function sortByValue(map) {
    const sortedEntries = Array.from(map.entries()).sort((a, b) => {
      if (a[1].num > b[1].num) {
        return -1;
      } else if (a[1] > b[1]) {
        return 1;
      } else {
        return 0;
      }
    });
    return new Map(sortedEntries);
  }
  const parseExcel = (file) => {
    // if (!localStorage.getItem('excel')) {
    // localStorage.setItem('excel', JSON.stringify(file))
    setFile(file)
    // }
  }

  return (
    <div>
      <Excel type="upload" parseExcel={parseExcel} />
      <div></div>
      <div style={{ width: '100vh', height: '90vh', margin: '0 auto' }}>
        <EasyDrawing
          areas={[areas]}
          scatters={scatters}
          paths={paths}
          texts={texts}
        />
      </div>
    </div>
  )
}

export default Canvas