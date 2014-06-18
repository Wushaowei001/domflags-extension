save_options = ->
  autoInspectOpen   = document.getElementById("autoInspectOpen").checked
  autoInspectReload = document.getElementById("autoInspectReload").checked
  chrome.storage.sync.set
    autoInspectOpen: autoInspectOpen
    autoInspectReload: autoInspectReload

restore_options = ->
  chrome.storage.sync.get
    autoInspectOpen: true
    autoInspectReload: true
  , (items) ->
    document.getElementById("autoInspectOpen").checked   = items.autoInspectOpen
    document.getElementById("autoInspectReload").checked = items.autoInspectReload

$(document).ready ->
  restore_options()

  $('form').on 'click', 'input', ->
    save_options()