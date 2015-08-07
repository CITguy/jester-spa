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
            breaks: true,
            highlight: function (code) {
                return hljs.highlightAuto(code).value;
            }
        });
    }
])
.controller('editorCtrl', function ($scope, marked, AceThemes) {
    $scope.editorContent = ''; // Start empty
    $scope.availableThemes = AceThemes;
    // TODO: initialize or pull from localStorage
    $scope.config = {
        theme: 'github'
    };

    $scope.$watch('editorContent', function (newVal, oldVal) {
        $scope.generatedContent = marked(newVal);
    });

    $scope.aceLoaded = function(_editor) {
        // Editor part
        var _session = _editor.getSession();
        var _renderer = _editor.renderer;

        // Options
        _session.setUseSoftTabs(true);
        _session.setTabSize(4); // TODO: how do custom?
        _session.setWrapLimit(40);
        _renderer.setDisplayIndentGuides(true);
        _renderer.setPadding(6);
    };
})
.value('SpacesPerIndent', [2,3,4,8]) // maybe future use
.value('AceThemes', {
    "Light": [
        ['Chrome','chrome'],
        ['Clouds','clouds'],
        ['Crimson Editor','crimson_editor'],
        ['Dawn','dawn'],
        ['Dreamweaver','dreamweaver'],
        ['Eclipse','eclipse'],
        ['Github','github'],
        ['IPlastic','iplastic'],
        ['Solarized Light','solarized_light'],
        ['Textmate','textmate'],
        ['Tomorrow','tomorrow'],
        ['XCode','xcode'],
        ['Kuroir','kuroir'],
        ['KatzenMilch','katzenmilch'],
        ['SQL Server','sqlserver']
    ],
    "Dark": [
        ['Ambiance','ambiance'],
        ['Chaos','chaos'],
        ['Clouds Midnight','clouds_midnight'],
        ['Cobalt','cobalt'],
        ['idle Fingers','idle_fingers'],
        ['krTheme','kr_theme'],
        ['Merbivore','merbivore'],
        ['Merbivore Soft','merbivore_soft'],
        ['Mono Industrial','mono_industrial'],
        ['Monokai','monokai'],
        ['Pastel on Dark','pastel_on_dark'],
        ['Solarized Dark','solarized_dark'],
        ['Terminal','terminal'],
        ['Tomorrow Night','tomorrow_night'],
        ['Tomorrow Night Blue','tomorrow_night_blue'],
        ['Tomorrow Night Bright','tomorrow_night_bright'],
        ['Tomorrow Night 80s','tomorrow_night_eighties'],
        ['Twilight','twilight'],
        ['Vibrant Ink','vibrant_ink']
    ]
});
