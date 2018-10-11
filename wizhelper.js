// ==UserScript==
// @name              Wiz助手
// @name:en           WizHelper
// @namespace         windviki@gmail.com
// @version           1.0
// @description       在网页上添加一个按钮，可以保存页面内容到Wiz
// @description:en    Add a button for all websites which can save webpage to Wiz.
// @icon              http://wiz.cn/favicon.ico
// @author            windviki
// @copyright         2018, windviki
// @create            2018-10-10
// @lastmodified      2018-10-10
// @home-url          https://github.com/windviki/script-wizhelper
// @home-url2         https://greasyfork.org/zh-CN/users/218509-windviki
// @resource          wiz_capture_button_icon http://wiz.cn/favicon.ico
// @resource          wiz_option_button_icon http://www.iconpng.com/png/softies-icons/gear.png
// @require           https://cdn.bootcss.com/jquery/1.12.4/jquery.min.js
// @include           http*://*/*
// @grant             GM_info
// @grant             GM_getResourceURL
// @grant             GM_getValue
// @grant             GM_setValue
// @grant             GM_addStyle
// @noframes
// ==/UserScript==

(function() {
    'use strict';
    var $ = $ || window.$;
    var opacityMouseLeave = 0.5;
    var opacityMouseEnter = 0.8;
    var wizMail = GM_getValue("wizMail", "xxx@mywiz.cn");
    if (wizMail === "") {
        wizMail = "xxx@mywiz.cn";
    }
    var wizDir = GM_getValue("wizDir", "/My Notes/");
    if (wizDir === "") {
        wizDir = "/My Notes/";
    }

    var wizDiv = document.createElement("div");
    wizDiv.className = "wiz-helper";
    wizDiv.id = "wiz-helper-container";
    wizDiv.innerHTML = "<img class='wiz-helper-main-button wiz-helper' id='wiz-helper-capture'/>\n" +
        "<img class='wiz-helper-main-button wiz-helper' id='wiz-helper-option'/>\n" +
        "<div id='wiz-helper-menu'>\n" +
        "        <div class='wiz-helper-option wiz-helper'>\n" +
        "            <label>邮箱 <input class='wiz-helper-inputs wiz-helper' id='wiz-helper-wizMail' type='text' placeholder='" + wizMail + "'/></label>\n" +
        "        </div>\n" +
        "        <div class='wiz-helper-option wiz-helper'>\n" +
        "            <label>目录 <input class='wiz-helper-inputs wiz-helper' id='wiz-helper-wizDir' type='text' placeholder='" + wizDir + "'/></label>\n" +
        "        </div>\n" +
        "        <div class='wiz-helper-option wiz-helper' id='wiz-helper-save'>\n" +
        "            <button class='wiz-helper wiz-helper-menu-button' id='wiz-helper-cancelbutton' type='button'>取消</button>\n" +
        "            <button class='wiz-helper wiz-helper-menu-button' id='wiz-helper-savebutton' type='button'>保存</button>\n" +
        "        </div>\n" +
        "</div>";
    var captureButton = wizDiv.children[0];
    captureButton.style.opacity = opacityMouseLeave;
    captureButton.src = GM_getResourceURL("wiz_capture_button_icon");
    var optionButton = wizDiv.children[1];
    optionButton.style.opacity = opacityMouseLeave;
    optionButton.src = GM_getResourceURL("wiz_option_button_icon");

    // Add to body!!!
    GM_addStyle(".wiz-helper { fontFamily:'微软雅黑,arial,sans-serif !important';fontSize:100%; }" +
                "#wiz-helper-container { position:fixed;zIndex:10000;bottom:150px;right:30px; }" +
                ".wiz-helper-main-button { display:block;width:24px;height:24px;cursor:pointer; }" +
                "#wiz-helper-menu { display:none;opacity:1.0;color:#333;background:#eee;padding:10px 10px;margin:0px;border:1px solid black;}" +
                ".wiz-helper-option { display:block;fontSize:70%; }" +
                ".wiz-helper-inputs { width:150px;height:20px; }" +
                "#wiz-helper-save { text-align:center; }" +
                ".wiz-helper-menu-button { display:inline-block;margin:10px 5px; }");
    document.getElementsByTagName("body")[0].appendChild(wizDiv);

    captureButton.addEventListener("mouseenter",function() {
        captureButton.style.opacity = opacityMouseEnter;
    })
    captureButton.addEventListener("mouseleave",function() {
        captureButton.style.opacity = opacityMouseLeave;
    })
    captureButton.addEventListener("click",function() {
        if (wizMail && wizDir) {
            var url = 'http://note.wiz.cn/url2wiz?url=' +
                encodeURIComponent(document.location.href) +
                '&folder=' + encodeURIComponent(wizDir) +
                '&user=' + wizMail +
                '&content-only=true&bookmark=1';
            window.open(url);
        }
    })

    optionButton.addEventListener("mouseenter",function() {
        optionButton.style.opacity = opacityMouseEnter;
    })
    optionButton.addEventListener("mouseleave",function() {
        optionButton.style.opacity = opacityMouseLeave;
    })
    optionButton.addEventListener("click",function(e) {
        e.stopPropagation();
        try {
            setTimeout(function () {
                document.querySelector("#wiz-helper-wizMail").value = wizMail;
                document.querySelector("#wiz-helper-wizDir").value = wizDir;
                document.querySelector("#wiz-helper-menu").style.display = 'block';
                document.querySelector("#wiz-helper-capture").style.display = 'none';
                document.querySelector("#wiz-helper-option").style.display = 'none';
            }, 100);
        } catch (e) {
        }
    })

    try {
        document.querySelector("#wiz-helper-savebutton").addEventListener("click", function(e){
            wizMail = document.querySelector("#wiz-helper-wizMail").value.trim();
            wizDir = document.querySelector("#wiz-helper-wizDir").value.trim();
            if (wizMail !== "" && wizDir !== "") {
                if (!/^\/.*/.test(wizDir)) {
                    wizDir = "/" + wizDir;
                }
                if (!/^.*?\/$/.test(wizDir)) {
                    wizDir = wizDir + "/";
                }
                GM_setValue("wizMail", wizMail);
                GM_setValue("wizDir", wizDir);
                setTimeout(function () {
                    window.location.reload();
                }, 100);
            } else {
                e.stopPropagation();
            }
        }, false);
        document.querySelector("#wiz-helper-cancelbutton").addEventListener('click', function (e) {
            e.stopPropagation();
            setTimeout(function () {
                document.querySelector("#wiz-helper-menu").style.display = 'none';
                document.querySelector("#wiz-helper-capture").style.display = 'block';
                document.querySelector("#wiz-helper-option").style.display = 'block';
            }, 100);
        }, false);
        document.querySelector("#wiz-helper-container").addEventListener('click', function (e) {
            e.stopPropagation();
        }, false);
    } catch (e) {
    }
})();
