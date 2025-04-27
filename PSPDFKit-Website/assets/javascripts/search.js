import lunr from "lunr";
import "corejs-typeahead";
import _ from "underscore";

var $typeahead = $("[data-typeahead]");
var $form = $typeahead.parents("form");
var $spinner = $form.find(".tt-spinner");
var searchURL = $form.attr("action");
var metaKey = false;
var searchTerm = "";

if ($typeahead.length) {
  $(document)
    .on("keyup", onKeyup)
    .on("keydown", onKeydown);

  $typeahead
    .one("focus", onFirstFocus)
    .on("typeahead:select", onSelect)
    .on("typeahead:render", onRender);
}

var searchIndex = lunr(function() {
  this.field("title", { boost: 10 });
  this.field("body");
  this.field("path");
});

var typeaheadConfig = {
  highlight: true
};

var typeaheadData = {
  limit: 10,
  highlight: true,
  display: displayTemplate,
  templates: { suggestion: suggestionTemplate }
};

function loadSearchData() {
  $spinner.addClass("in");
  return $.getJSON(searchURL);
}

function addItemToSearchIndex(item) {
  searchIndex.add(item);
}

function onFirstFocus(e) {
  loadSearchData().then(function(searchData) {
    _.forEach(searchData, addItemToSearchIndex);
    typeaheadData.source = searchFilter(searchIndex, searchData);
    initTypeahead();
  });
}

function initTypeahead() {
  $typeahead.typeahead(typeaheadConfig, typeaheadData).trigger("focus");

  $spinner.removeClass("in");
}

function onKeyup(e) {
  metaKey = e.metaKey;
  if (e.target.tagName.toUpperCase() === "INPUT") return;
  e.preventDefault();

  switch (e.which) {
    case 191: // slash
      $typeahead.focus();
      break;
  }
}

function onKeydown(e) {
  metaKey = e.metaKey;
}

function searchFilter(searchIndex, searchData) {
  return function(query, sync) {
    var results = searchIndex.search(query).map(function(result) {
      return searchData.filter(function(q) {
        return q.id === result.ref;
      })[0];
    });
    sync(results);
  };
}

function displayTemplate(result) {
  return result.title;
}

function suggestionTemplate(result) {
  return (
    '<a class="list-group-item list-group-item-action" href="' +
    result.id +
    '">' +
    result.title +
    "</a>"
  );
}

function onSelect(e, result) {
  var url = result.id;
  if (searchTerm !== "") {
    url += "?search=" + searchTerm;
  }
  if (metaKey) {
    return;
  } else {
    window.location = url;
  }
}

function onRender(e) {
  searchTerm = e.target.value;

  // auto-select first result
  $typeahead
    .parent()
    .find(".tt-selectable:first")
    .addClass("tt-cursor");
}
