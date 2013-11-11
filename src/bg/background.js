// Generated by CoffeeScript 1.6.3
var ports, requestDomFlags, updateContextMenus,
  __hasProp = {}.hasOwnProperty;

updateContextMenus = function(flags, port) {
  var key, onClickHandler, value, _results;
  onClickHandler = function(info, tab) {
    return port.postMessage({
      name: "contextMenuClick",
      key: info.menuItemId,
      tab: tab
    });
  };
  if (flags.length > 0) {
    _results = [];
    for (key in flags) {
      if (!__hasProp.call(flags, key)) continue;
      value = flags[key];
      _results.push(chrome.contextMenus.create({
        title: value,
        id: "" + key,
        contexts: ['all'],
        onclick: onClickHandler
      }));
    }
    return _results;
  }
};

requestDomFlags = function(tabId, port) {
  return chrome.tabs.sendMessage(tabId, "Give me domflags", function(response) {
    if (response) {
      return updateContextMenus(response.flags, port);
    }
  });
};

ports = [];

chrome.runtime.onConnect.addListener(function(port) {
  if (port.name !== "devtools") {
    return;
  }
  chrome.tabs.query({
    currentWindow: true,
    active: true
  }, function(tabs) {
    var contentScript, tabChange, tabId, tabPort;
    tabId = tabs[0].id;
    ports[tabId] = {
      port: port,
      portId: port.portId_,
      tab: tabId
    };
    tabPort = ports[tabId].port;
    tabChange = function(activeInfo) {
      chrome.contextMenus.removeAll();
      if (activeInfo.tabId === tabId) {
        return requestDomFlags(tabId, tabPort);
      }
    };
    contentScript = function(message, sender, sendResponse) {
      if (sender.tab.id !== tabId) {
        return;
      }
      if (message.name === 'panelClick') {
        return port.postMessage({
          name: message.name,
          key: message.key
        });
      } else if (message.name === 'pageReloaded') {
        chrome.tabs.insertCSS(tabId, {
          file: "src/inject/inject.css"
        }, function() {
          return requestDomFlags(tabId, tabPort);
        });
        return port.postMessage({
          name: message.name,
          key: 0
        });
      }
    };
    chrome.tabs.onActivated.addListener(tabChange);
    chrome.runtime.onMessage.addListener(contentScript);
    return port.onDisconnect.addListener(function(port) {
      chrome.contextMenus.removeAll();
      chrome.runtime.onMessage.removeListener(contentScript);
      chrome.tabs.sendMessage(tabId, "Remove panel");
      chrome.tabs.onActivated.removeListener(tabChange);
      return delete ports[tabId];
    });
  });
  return port.onMessage.addListener(function(msg) {
    return chrome.tabs.query({
      currentWindow: true,
      active: true
    }, function(tabs) {
      var tabId, tabPort;
      tabId = tabs[0].id;
      tabPort = ports[tabId].port;
      chrome.contextMenus.removeAll();
      return requestDomFlags(tabId, tabPort);
    });
  });
});
