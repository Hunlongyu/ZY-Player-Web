// ==UserScript==
// @name         m3u8 资源播放助手
// @version      0.1
// @author       Hunlongyu
// @namespace    https://github.com/Hunlongyu/m3u8_player
// @description  自动匹配 m3u8 资源，点击播放，即跳转到播放器页面。
// @lilcense     WTFPL
// @match        http://zuidazy.net/*
// @match        http://www.okzyw.com/*
// @match        http://www.172zy.net/*
// @match        http://www.1977zy.com/*
// @grant        none
// ==/UserScript==
(function() {
  'use strict';

  // code here
  function getTitle () {    // 获取页面标题
    if (document.title) {
      return document.title
    }
    return null
  }
  function getUrl () {      // 获取 m3u8 的链接
    let list = document.querySelectorAll("input[name*='copy_']")
    let url = null
    for (let i = 0; i < list.length; i++) {
      let j = list[i].value;
      if (j.indexOf('m3u8') !== -1) {
        url = `<a href="?url=${j}&title=${getTitle()}" target="_blank">${list[i].parentNode.textContent}</a>`
        list[i].parentNode.innerHTML = url
      }
    }
  }
  getUrl()
})();