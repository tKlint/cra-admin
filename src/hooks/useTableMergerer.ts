import { Key, ReactNode, useRef } from 'react';

export type MergeData = {
  /**
   * 开始并位置
   */
  s: number;
  /**
   * 结束合并位置
   */
  e: number;
  /**
   * 索引切片
   * @description 当前合并组所包含的row索引位置
   */
  section: number[];
  /**
   * 当前合并组所包含的row唯一标识
   */
  keys: React.Key[];
  /**
   * 合并后的排序索引
   */
  mergeIndex: number;
};

export type RenderFlag = {
  (
    dom: ReactNode,
    options: {
      fieldKey: string;
      rowIdx: number;
    }
  ): RenderObject;
};

export type RenderObject = {
  children: ReactNode;
  props: { rowSpan: number };
};

export default class TableMergerer<T = Record<string, unknown>> {
  /**
   * 合并数据集合
   */
  readonly mergeDataSet: Record<React.Key, Record<string, MergeData>>;
  constructor() {
    this.mergeDataSet = {};
  }
  /**
   * 创建字段合并数据
   */
  private createFeildMergeData(fieldKey: string, rowIdx: number, rowValue: Key, mergeIndex: number) {
    return {
      [`idx-${rowIdx}`]: {
        s: rowIdx,
        e: rowIdx,
        section: [rowIdx],
        keys: [rowValue as Key],
        mergeIndex
      }
    };
  }
  /**
   * 根据合并字段和索引查找合并组名称
   */
  findGroupKey(fieldKey: string, rowIdx: number) {
    const curFieldData = this.mergeDataSet[fieldKey];
    const allGroupKeys = Object.keys(curFieldData);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return allGroupKeys.find((groupKey: string) => curFieldData[groupKey].section.at(-1)! + 1 === rowIdx);
  }
  /**
   * 设置合并字段数据
   * @param fieldKey 合并字段key
   * @param rowValue 合并字段value
   * @param rowIdx 行索引
   * @param mergeIndex 合并索引
   * @returns
   */
  private setMergeFieldData(fieldKey: string, rowValue: T[keyof T], rowIdx: number, mergeIndex: number) {
    let isFirstRow = false;
    // 不存在合并数据
    if (!this.mergeDataSet[fieldKey]) {
      isFirstRow = true;
      // 新增
      this.mergeDataSet[fieldKey] = this.createFeildMergeData(fieldKey, rowIdx, rowValue as string, mergeIndex);
    } else {
      /**
       * 是否为紧随其后的节点
       */
      let isBehindNode = false;
      const targetGroupKey = this.findGroupKey(fieldKey, rowIdx);

      if (targetGroupKey) {
        isBehindNode = true;
      }
      // 紧贴其后的节点可以放到同一个合并组内
      if (isBehindNode && targetGroupKey) {
        // 紧随其后的节点依此入栈并更新结束索引位置
        this.mergeDataSet[fieldKey][targetGroupKey].e = rowIdx;
        this.mergeDataSet[fieldKey][targetGroupKey].section.push(rowIdx);
        this.mergeDataSet[fieldKey][targetGroupKey].keys.push(rowValue as string);
      } else {
        // 不是紧随其后的节点 为该节点新增合并组
        isFirstRow = true;
        this.mergeDataSet[fieldKey][`idx-${rowIdx}`] = this.createFeildMergeData(
          fieldKey,
          rowIdx,
          rowValue as string,
          mergeIndex
        )[`idx-${rowIdx}`];
      }
    }
    return isFirstRow;
  }
  /**
   * 设置合并数据
   * @param dataSource 数据源
   * @param dataIndex 主键唯一标识
   * @param fields 合并字段
   * @returns
   */
  setMergeData(dataSource: T[], dataIndex: keyof T, ...fields: (keyof T)[]) {
    if (!this.mergeDataSet) {
      return;
    }
    let mergeIndex = 0;
    dataSource.forEach((row, idx) => {
      fields.forEach((field, fieldIdx) => {
        const fieldKey = `${field as string}-${row[field]}`;
        // const isNewField = this.mergeDataSet[fieldKey] ? false :  true;
        const isNewField = this.setMergeFieldData(fieldKey, row[dataIndex], idx, mergeIndex);
        if (isNewField && fieldIdx == 0) {
          mergeIndex += 1;
        }
      });
    });
  }
  /**
   * 渲染合并内容
   * @param dom 渲染dom
   * @description 当传入'index'时, 会渲染合并后的索引
   * @param fieldKey 合并字段key
   * @param rowIdx 行索引
   * @param renderFlag 自定义合并规则
   * @returns
   */
  render(dom: ReactNode | 'index' | null, fieldKey: string, rowIdx: number, renderFlag?: RenderFlag | undefined) {
    const { s, e, mergeIndex } = this.getCurRowMergeData(fieldKey, rowIdx);
    const renderDom = dom === 'index' ? mergeIndex : dom;
    if (renderFlag) {
      return renderFlag(renderDom, {
        rowIdx,
        fieldKey
      });
    }

    const renderObject: RenderObject = {
      children: renderDom,
      props: { rowSpan: 0 }
    };

    /**
     * 是否为无效的数据
     */
    const isUnValidRow = s === undefined || e === undefined;
    /**
     * 是否为只有一行的数据
     */
    const isOnlyOneRow = rowIdx > e || (rowIdx === s && rowIdx === e);
    /**
     * 是否为第一行数据
     */
    const isFirstRow = rowIdx === s;
    if (isUnValidRow || isOnlyOneRow) {
      renderObject.props.rowSpan = 1;
    } else if (isFirstRow) {
      renderObject.props.rowSpan = e - s + 1;
    }
    return renderObject;
  }
  /**
   * 获取当前行合并数据
   * @param fieldKey 合并字段
   * @param rowIdx 行索引
   * @returns
   */
  getCurRowMergeData(fieldKey: string, rowIdx: number) {
    const fieldValues = this.mergeDataSet?.[fieldKey] || {};
    const idxKeys = Object.keys(fieldValues);
    const targetGroup = idxKeys.find(key => fieldValues?.[key]?.section?.includes(rowIdx));
    return fieldValues[targetGroup || ''] || {};
  }
}

export function useTableMergerer<T>() {
  const tableMergerIns = useRef<TableMergerer<T> | null>(null);
  if (tableMergerIns.current === null) {
    tableMergerIns.current = new TableMergerer<T>();
  }
  return tableMergerIns.current;
}
