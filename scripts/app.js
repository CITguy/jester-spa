angular.module('jester', [
    'ui.ace',
    'hc.marked',
    'ngSanitize'
])
.config([
    'markedProvider',
    function (markedProvider) {
        markedProvider.setOptions({
            gfm: true,
            breaks: true
        });
    }
])
.controller('editorCtrl', function ($scope, marked) {
    $scope.editorContent = '';

    $scope.$watch('editorContent', function (newVal, oldVal) {
        $scope.generatedContent = marked(newVal);
    });
});
