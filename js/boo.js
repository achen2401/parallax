
var mainApp = angular.module("mainApp", []);
var winHeight = $(window).height();
var linkSources;


$.fn.isOnScreen = function(){
    var viewport = {};
    viewport.top = $(window).scrollTop();
    viewport.bottom = viewport.top + winHeight;
    var bounds = {};
    bounds.top = this.offset().top;
    bounds.bottom = bounds.top + this.outerHeight();
    return ((bounds.top <= viewport.bottom) && (bounds.bottom >= viewport.top));
};

function setVis(sources) {

  var circleContainers = document.getElementsByClassName("circle");

  sources.forEach(function(source) {
      var inView = false;
      var target = $(source.target);
      var circle = $("#" + source.category + "-circle");
      if (!inView) {
        if (target.isOnScreen()) {
          $(".inner").removeClass("show").addClass("noshow");
          target.removeClass("noshow");
          target.addClass("show");
          $(circleContainers).removeClass("circle-selected");
          circle.addClass("circle-selected");
          inView = true;
        }
      } else {
        return;
      };
  });

};

function setContainerVis() {
  $("header").css("opacity", 1);
  $("main").css("opacity", 1);
  $("#loadingContainer").hide();
};

function getCount() {
  $.getJSON( "./data/data.php?method=visitCount", function(data) {
    var ct = data[0].count;
    $("footer").text("Visited: " + ct)
  });

};

function setCount() {
  $.getJSON( "./data/data.php?method=visitCount", function(data) {
    console.log(data[0])
    var ct = data[0].count;
    ct = parseInt(ct) + 1;
    $.ajax({
      url: "./data/data.php",
      dataType: "json",
      data: {"method": "setCount", "count": ct}
    }).done(function(data) {
      if (data[0] && parseInt(data[0].count) > 0) {
        $("footer").text("visitor count: " + data[0].count).show();
      };
    }).fail(function() {
      console.log("Failed")
    });
  });

};

function init($scope) {

    var categories = $scope["categories"];
    var f = $("#nav-container");
    categories.forEach(function(category, index) {
        f.append('<a href="#' + category.href +'"><div class="circle" id="' + category.href + '-circle" title="' + category.title + '">&nbsp;</div></a>');
    });
    linkSources = $scope.linkSources;

    $scope.visitCount = 0;

    setCount();

    setContainerVis();
    setVis(linkSources);
    $(window).scroll(function() {
        setVis(linkSources);
    });

    $(window).load(setCount);

};

mainApp.controller('booController', function ($scope, $http) {
    $http.get("./data/data.json").success(function (response) {
        if ($scope) {
          for (var prop in response) {
            if (response.hasOwnProperty(prop)) $scope[prop] = response[prop];
          };
          init($scope);
        }
    });

});

mainApp.controller('imageController', function($scope) {
  $scope.currentGalleryImage = 'image1';
  this.setCurrent = function(val) {
    $scope.currentGalleryImage = (val !== null? val : 'image1');
  };
});

mainApp.controller('labMembersController', function($scope) {
  this.setCurrent = function(val) {
    if (val !== null) $scope.defaultLabImage = val;
  };
});


