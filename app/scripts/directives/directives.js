
yeoAngApp.directive('dbBlur', function(statement) {
    return {
        restrict: 'EA',
        require: 'ngModel',
        link: function(scope, elm, attr, ngModelCtrl) {

            if (attr.type === 'radio' || attr.type === 'checkbox') {
                return;
            }
            elm.unbind('input').unbind('keydown').unbind('change');
            elm.bind('blur', function() {
                scope.$apply(function() {
                    alert('blur')
                    eval(statement)
                });
            });
        }
    };
});