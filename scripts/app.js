angular.module('jester', [
    'ui.ace',
    'hc.marked',
    'ngSanitize',
    'debounce'
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
.controller('editorCtrl', function ($scope, marked, Ace, LocalStorage, debounce) {
    $scope.availableThemes = Ace.themes;
    $scope.configureAce = Ace.configure;

    $scope.newDocument = function () {
        $scope.rawContent = '';
    };

    var _loadContent = function () {
        $scope.rawContent = LocalStorage.getItem('rawContent') || '';
    };
    /* debounce for 5 seconds */
    var _saveContent = debounce(function (content) {
        LocalStorage.setItem('rawContent', content);
    }, 1000);
    var _loadTheme = function () {
        $scope.theme = LocalStorage.getItem('theme') || 'github';
    };
    var _setTheme = function (theme) {
        LocalStorage.setItem('theme', theme);
    };
    var _generatePreview = function (raw) {
        $scope.preview = marked(raw);
    };

    $scope.$watch('theme', _setTheme);
    $scope.$watch('rawContent', function (newVal) {
        _saveContent(newVal);
        _generatePreview(newVal);
    });

    _loadTheme();
    _loadContent();
})
.value('SpacesPerIndent', [2,3,4,8]) // maybe future use
.value('AceThemes', [
    { ilk: 'Light', val: 'chrome', lbl: 'Chrome' },
    { ilk: 'Light', val: 'clouds', lbl: 'Clouds' },
    { ilk: 'Light', val: 'crimson_editor', lbl: 'Crimson Editor' },
    { ilk: 'Light', val: 'dawn', lbl: 'Dawn' },
    { ilk: 'Light', val: 'dreamweaver', lbl: 'Dreamweaver' },
    { ilk: 'Light', val: 'eclipse', lbl: 'Eclipse' },
    { ilk: 'Light', val: 'github', lbl: 'Github' },
    { ilk: 'Light', val: 'iplastic', lbl: 'IPlastic' },
    { ilk: 'Light', val: 'solarized_light', lbl: 'Solarized Light' },
    { ilk: 'Light', val: 'textmate', lbl: 'Textmate' },
    { ilk: 'Light', val: 'xcode', lbl: 'XCode' },
    { ilk: 'Light', val: 'kuroir', lbl: 'Kuroir' },
    { ilk: 'Light', val: 'katzenmilch', lbl: 'KatzenMilch' },
    { ilk: 'Light', val: 'sqlserver', lbl: 'SQL Server' },
    { ilk: 'Dark', val: 'ambiance', lbl: 'Ambiance' },
    { ilk: 'Dark', val: 'chaos', lbl: 'Chaos' },
    { ilk: 'Dark', val: 'clouds_midnight', lbl: 'Clouds Midnight' },
    { ilk: 'Dark', val: 'cobalt', lbl: 'Cobalt' },
    { ilk: 'Dark', val: 'idle_fingers', lbl: 'idle Fingers' },
    { ilk: 'Dark', val: 'kr_theme', lbl: 'krTheme' },
    { ilk: 'Dark', val: 'merbivore', lbl: 'Merbivore' },
    { ilk: 'Dark', val: 'merbivore_soft', lbl: 'Merbivore Soft' },
    { ilk: 'Dark', val: 'mono_industrial', lbl: 'Mono Industrial' },
    { ilk: 'Dark', val: 'pastel_on_dark', lbl: 'Pastel on Dark' },
    { ilk: 'Dark', val: 'solarized_dark', lbl: 'Solarized Dark' },
    { ilk: 'Dark', val: 'terminal', lbl: 'Terminal' },
    { ilk: 'Dark', val: 'tomorrow_night', lbl: 'Tomorrow Night' },
    { ilk: 'Dark', val: 'tomorrow_night_blue', lbl: 'Tomorrow Night Blue' },
    { ilk: 'Dark', val: 'tomorrow_night_bright', lbl: 'Tomorrow Night Bright' },
    { ilk: 'Dark', val: 'tomorrow_night_eighties', lbl: 'Tomorrow Night 80s' },
    { ilk: 'Dark', val: 'twilight', lbl: 'Twilight' },
    { ilk: 'Dark', val: 'vibrant_ink', lbl: 'Vibrant Ink' }
])
/*
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
})
*/
.factory('Ace', function (AceThemes) {
    return {
        themes: AceThemes,
        configure: function (_editor) {
            // Editor part
            var _session = _editor.getSession();
            var _renderer = _editor.renderer;

            // Options
            _session.setUseSoftTabs(true);
            _session.setTabSize(4); // TODO: how do custom?
            _session.setWrapLimit(40);
            _renderer.setDisplayIndentGuides(true);
            _renderer.setPadding(6);
        }
    };
})
/**
 * Copied from Encore > rxLocalStorage
 * (https://github.com/rackerlabs/encore-ui/blob/master/src/rxLocalStorage/rxLocalStorage.js)
 */
.service('LocalStorage', function ($window) {
    this.setItem = function (key, value) {
        $window.localStorage.setItem(key, value);
    };

    this.getItem = function (key) {
        return $window.localStorage.getItem(key);
    };

    this.key = function (key) {
        return $window.localStorage.key(key);
    };

    this.removeItem = function (key) {
        $window.localStorage.removeItem(key);
    };

    this.clear = function () {
        $window.localStorage.clear();
    };

    this.__defineGetter__('length', function () {
        return $window.localStorage.length;
    });

    this.setObject = function (key, val) {
        var value = _.isObject(val) || _.isArray(val) ? JSON.stringify(val) : val;
        this.setItem(key, value);
    };

    this.getObject = function (key) {
        var item = $window.localStorage.getItem(key);
        try {
            item = JSON.parse(item);
        } catch (error) {
            return item;
        }

        return item;
    };
});
