import Poller from '@/utils/poller';
import { useRef } from 'react';

type EventPool = {
  [k in 'update' | 'no-update']?: () => void;
};
export default class VersionUpdater extends Poller {
  /**
   * 网站html地址
   */
  htmlUrl: string;
  /**
   * 事件池
   */
  private eventPool: EventPool = {};
  /**
   * 之前的script src
   */
  private oldScriptsSrc: string[] = [];
  constructor(htmlUrl: string) {
    super(5000);
    this.htmlUrl = htmlUrl;
  }
  /**
   * 注册事件函数
   * @param eventName 事件名
   * @param cb 事件回调
   */
  on(eventName: 'update' | 'no-update', cb: () => void) {
    this.eventPool[eventName] = cb;
  }
  /**
   * 获取网站首页html文本
   */
  async getHtml() {
    const resp = await fetch(this.htmlUrl);
    if (resp.status !== 200) {
      console.log('Fuck 网站崩了!');
    }
    return await resp.text();
  }
  /**
   * 截取html标签src
   * @param tagStr html标签
   * @returns
   */
  sliceTagSrc(tagStr: string) {
    const pattern = /src="([^"]+)"/;
    return tagStr.match(pattern) || [];
  }
  /**
   * 轮询函数
   * @returns
   */
  private async polling() {
    const htmlText = await this.getHtml();
    const matchedScriptsTag = this.parseHtmlTextToScriptTag(htmlText);
    if (matchedScriptsTag === null) {
      return;
    }
    const targetScritptTagSrcs = matchedScriptsTag.map(tag => this.sliceTagSrc(tag)[0] as string);

    if (this.oldScriptsSrc.length !== 0) {
      this.diffScriptsSrc(targetScritptTagSrcs);
    } else {
      this.oldScriptsSrc = targetScritptTagSrcs;
    }
  }
  /**
   * 将html中的script标签解析出来
   * @description 可作为纯函数
   * @param htmlText html文本
   * @returns
   */
  parseHtmlTextToScriptTag(htmlText: string) {
    const scriptSrcPattern = /<script(.*) src="(.*)">(.*)<\/script>/g;
    return htmlText.match(scriptSrcPattern);
  }
  /**
   * 对比新的script src 找出不同的src
   * @param newScriptSrcs 新的script src
   * @returns
   */
  private diffScriptsSrc(newScriptSrcs: string[]) {
    if (this.oldScriptsSrc.length !== newScriptSrcs.length) {
      this.eventPool['update']?.();
      return;
    }
    const unMatchedSrcs = newScriptSrcs.find(src => !this.oldScriptsSrc.includes(src));
    if (unMatchedSrcs) {
      this.eventPool['update']?.();
      return;
    }
    this.eventPool['no-update']?.();
  }
  /**
   * 监听函数
   */
  async start() {
    super.stop();
    super.start(this.polling.bind(this));
  }
}
/**
 * 版本监听hook
 * @returns
 */
export function useVersionUpdater(baseURL = '/') {
  const updater = useRef<VersionUpdater | null>(null);
  if (updater.current === null) {
    updater.current = new VersionUpdater(baseURL);
  }
  return updater;
}
