'use strict';

yeoAngApp.controller('BuilderCtrl', function($scope,$http,DataType,Widget,Framework,Theme,App) {
  //property declarations
  $scope.widgetMarkup = null;
  $scope.dataTypes = null;
  $scope.frameworks = null;
  $scope.themes = null;
  
  $scope.framework = null;
  $scope.theme = null;
  
  $scope.templates = null;
  $scope.formHtml = null;
  
  $scope.appTitle = "App Title"; 
  
  /////Modal
  $scope.listItemMarkup={
      input:{icon:'icon-pencil',color:'blue',tooltip:'Great for names, emails, phone numbers or anywhere typing is needed.'},
      select:{icon:'icon-th-list',color:'red',tooltip:'Best for selecting items from a list. Only requires a few screen taps.'},
      option:{icon:'icon-hand-up',color:'orange',tooltip:'Includes radio buttons and check boxes. Suited for toggle options.'},
      date:{icon:'icon-calendar',color:'green',tooltip:'Need to set a date or time? This is what you want.'},
  }
  //Get a listing of the data types availible
  DataType.get({},function(dataTypes){
           $scope.dataTypes = dataTypes; 
  });
  
  Widget.get({},function(widgets){
           $scope.widgetMarkup = widgets;
  });

  Framework.get({},function(frameworks){
           $scope.frameworks = frameworks;
  });

  Theme.get({},function(themes){
           $scope.themes = themes;
  });

  
  $http({method: 'GET', url: '/data/apptemplates/mobileSimulator.html'}).
  success(function(data, status, headers, config) {
    // this callback will be called asynchronously
    // when the response is available
           $scope.templateHTML = data;
  }).
  error(function(data, status, headers, config) {
        console.log("Error ");
    // called asynchronously if an error occurs
    // or server returns response with an error status.
  });
  
  $scope.$on('itemUpdated',function(event,item){
     console.log('Item Updated Called');
     item.widget.markup = renderWidget(item.widget);
     $scope.$emit('listchange'); 
  });
  
  $scope.onFrameworkChange = function(){     
      //console.log('onFrameworkChange');
      //var element = $("#1");
      //element.attr('src',$scope.framework);    
  }
  
  $scope.onThemeChange = function(){     
      console.log('onThemeChange');
      if($scope.theme){
        var element = document.getElementById('1').contentWindow.dstyle.add($scope.theme,'css');
      } 
  }
  
  $scope.saveForm = function(){

      var source = $scope.templateHTML;
      var template = Handlebars.compile(source);
      var newApp = App();
      var postData = {
          html:_.unescape(template({
              content1:$scope.updateHtml(),
              scripts:$scope.javascript
              }))
          };
      App.save({},postData);
      
  }
  
  function loadTemplate(element,isAdmin){
      var prefix = isAdmin ? '_admin_' :'_';
      var index = isAdmin ? prefix+element : element;
      
      if($scope.templates == null){
          $scope.templates = {};
      }
      if(!$scope.templates.hasOwnProperty(index)){
            var source   = $("#"+prefix+element).html();
            $scope.templates[index] = Handlebars.compile(source);
      }
  }
  
  function renderWidget(widget){
    return renderElement(widget.dataType.ui,widget.data);
  }
 
  function renderElement(element,context,isAdmin){  
      var config = context || {};
      var index = isAdmin ? "_admin_"+element: element;
      
      if($scope.templates == null){
          $scope.templates = {};
      }
      if(!$scope.templates.hasOwnProperty(index)){
          loadTemplate(element,isAdmin);
      }
      return $scope.templates[index](config);
  }
   
  // Modal Handlers
  $scope.open = function (widget) {
    widget.admin.state = true;
  };

  $scope.close = function (widget) {
    widget.admin.state = false;
  };
  
  $scope.updateItem = function (widget) {
    console.dir(this);
    console.dir(widget);
    $scope.close(widget);
    $scope.$emit("itemUpdated",this);
  };
  
// Modal options
  $scope.opts = {
    backdropFade: true,
    dialogFade:true
  };
  ////End Modal
  
  //Startup stuff
  $scope.id = 0;
  $scope.widgets = [];  

  function getDataType(code){     
      for(var element in $scope.dataTypes){
          if ($scope.dataTypes[element].code == code){
              return $scope.dataTypes[element];
          }    
      }
  }
  
  function getMarkup(ui,element){
     console.log("UI: "+ui);
     
     if($scope.widgetMarkup.hasOwnProperty(ui))
     {
         return $scope.widgetMarkup[ui][element];
     }
      return '<p> markup not available</p>';    
  }
  
  $scope.updateHtml = function(){
      var markup = []
      for(var widget in $scope.widgets){
          markup.push($scope.widgets[widget].markup);
      }
      return  markup.join("");
  };
   
  
  //Event handling
   $scope.$on('listchange', function() {
    buildValidationScript();
    setTimeout(function(){
        $scope.updateHtml();
        setTimeout(function(){$scope.put();},200);   
        },200); 
    
    });
   
  $scope.update = function(){
      var temp = $scope.widgets;
      //$scope.widgets.
     //$scope.$emit('listchange');  
  }
  
  //Item creation
   $scope.removeItem = function(index){
      var toDelete = $scope.widgets[index];
    $scope.widgets.splice(index,1);
   // $scope.$emit('listchange');
  };
  
  
  
  $scope.addItem = function(itemType){     

function getDataTypeByGroup(groupName){
   return _.find($scope.dataTypes, function(dataType){
        if(dataType.hasOwnProperty('group')){
            if(dataType.group == groupName){
                return dataType    
            }
        }
    })   
}
    
    
    var dataType = getDataTypeByGroup(itemType);
    
      
      
   //Standard initial config for and element
      var data = {
          title:dataType.name,
          require:false,
          validate:true,
          maxMin:$scope.validationOptions.hasOwnProperty(dataType.type) ? $scope.validationOptions[dataType.type].hasOwnProperty('hasMax') : false ,
          elementId : _.uniqueId(dataType.ui+'_'),
          label:true,
          placeholder:true
      
      };
      
      $scope.widgets.push({
          id: $scope.id, 
          dataType: dataType,
          data:data,
          markup: renderElement(dataType.ui,data), //getMarkup(dataType.ui,'html'),       
          admin: {state:false, template: getAdminTemplate(dataType)} //markup:renderElement(dataType.ui,data,true)
      });

        $scope.id++;
        $scope.$emit('listchange');
}

        $scope.changeContent = function(content){
            document.getElementById('1').contentWindow.jQuery('#form').html(content);
            document.getElementById('1').contentWindow.jQuery('#form').trigger( "create" );     
        }
        
        $scope.put =function(){
            var html = $('#content').html();     
            $scope.changeContent(html);
        }

        function getAdminTemplate(dataType){
            var path = "data/admintemplates/"+dataType.ui+".html"
            return path;
        }

$scope.validationOptions = {
  string :{ hasMax:true,hasMin:true},
  "int": { },
  date:{ },
  time:{ },
  phone:{ hasMax:true,hasMin:true},
  email:{ hasMax:true,hasMin:true},
  url:{ hasMax:true,hasMin:true},
  creditcard:{}   
};


function buildValidationScript(){
    
    var source   = $("#_validate").html();
    var template = Handlebars.compile(source);
    var list = [];
    
    for(var element in $scope.widgets){    
        if($scope.widgets[element].data.validate){
            list.push($scope.widgets[element].data.elementId);
        }
    }
    var script = template({item:list});
   $scope.javascript = "<script>$('#form').validate();</script>";
   injectScript(script); 
    console.log(script);
};

function injectScript(content){
    var markup = "<script>"+content+"</script>";
    markup = "<script>$('#form').validate();</script>"
    document.getElementById('1').contentWindow.jQuery('#script').html(markup);   
}

});

 