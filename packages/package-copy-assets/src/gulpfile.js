var gulp = require('gulp');
var htmlmin = require('gulp-htmlmin');
var fileInline = require('gulp-file-inline');
var zip = require('gulp-zip');
var del = require('del');
var vinylPaths = require('vinyl-paths');
var filter = require('gulp-filter');
var fs = require('fs');
var gulpif = require('gulp-if');
var path = require('path');
var merge = require('merge-stream');
var gulpIgnore = require('gulp-ignore');
var foreach = require("gulp-foreach");
var print = require("gulp-print").default;
var minimist = require('minimist');
var size = require('gulp-size');
var concat = require('gulp-concat');
var mergejson = require('gulp-merge-json');
var md5plus = require('gulp-md5-plus');
// var md5assets = require('gulp-md5-assets');
// var md5 = require('gulp-md5');

var imagemin = require('gulp-imagemin'),
    mozjpeg = require('imagemin-mozjpeg'),
    pngquant = require('imagemin-pngquant'),
    //确保本地已安装gulp-cache [cnpm install gulp-cache --save-dev]
    cache = require('gulp-cache');

var tiny = require("gulp-tinypng-nokey");

var source = "../../../build/web-mobile/";
var sourceassets = "../../../build/web-mobile/assets/";

// var sourcelang = "../../../build/web-mobile/res/lang/";
// var pngsource = "../../../temp/build/web-mobile/";
// var pngsource_subgames = "../../../temp/build/web-mobile/output/subgames/";
// var pngsource_others = "../../../temp/build/web-mobile/output/others/";
// var jssource_subgames = "../../../build/web-mobile/subpackages/";

function getArguments() {
    //任务参数列表. 比如命令行为：gulp test --a aa --b=bb --c， 则 argv = { _: [ 'test' ], a: 'aa', b: 'bb', c: true }
    let argv = minimist(process.argv.slice(2));
    return argv;
}

let spine_images = null;
function getSpineImages() {
    if(spine_images){
        return spine_images;
    }

    spine_images = {};
    let file_output_bundle_results = path.join(__dirname, "..", "build", "output_bundle_results.json");
    let isExist = fs.existsSync(file_output_bundle_results);
    if(isExist){
        let content = fs.readFileSync(file_output_bundle_results);
        let object = JSON.parse(content);
        for (const bundle_name in object) {
            const array = object[bundle_name];
            for (let index = 0; index < array.length; index++) {
                const item = array[index];
                let file_name = path.basename(item.buildPath);
                spine_images[file_name] = item;
            }
        }
    }
    return spine_images;
}

var inited = false;
var isNative = false;
function init(params) {
    if(inited) return;
    inited = true;

    let argv = getArguments();
    console.log("platform: ", argv.platform);
    if(argv.platform=='web-mobile'){
    }
    else{
        isNative = true;
        source = "../../../build/jsb-link/";
        sourceassets = "../../../build/jsb-link/assets/";
    }
}

function getFolders(dir) {
    return fs.readdirSync(dir)
        .filter(function(file) {
            return fs.statSync(path.join(dir, file)).isDirectory();
        });
}

gulp.task('empty', function (cb) {
    init();
    return cb();
})

gulp.task('test', function (cb) {
    return gulp.src(source + 'assets/**')
        // .pipe(print(filepath => `built: ${filepath}`))
        .pipe(gulpif(file=>(fs.statSync(file.path).size<12*1000), zip('import1.json'), zip('import2.json')))
        // .pipe(zip('import.json'))
        .pipe(gulp.dest(source + 'res'));
});

var includeSize = function (file) {
    let size = fs.statSync(file.path).size;
    let include = size > 16 * 1000; //x(*kb)
    return include;
};
var includeSpine = function (file) {
    let include = false;
    let items = getSpineImages();
    let item = items[path.basename(file.path)];
    let file_path = item ? item.path : file.path;
    include = (file_path.indexOf("spine")>=0) ? true : false;

    return include;
};
var conditionSizeAndNoSpine = function (file) {
    let include = includeSize(file);
    if(include){
        include = !includeSpine(file);
    }
    return include;
}
gulp.task('image-assets', (cb) => {
    if(isNative){
        return cb();
    }

    var pngFilter = filter(['**/*.png'], { restore: true });
    return gulp.src(source + 'assets/**/*.{png,jpg,jpeg}')
        .pipe(gulpIgnore.include(conditionSizeAndNoSpine))
        .pipe(print(filepath => `built: ${filepath}`))
        .pipe(pngFilter)
        .pipe(
            cache(
                imagemin([
                    pngquant({
                        quality: [0.60, 0.8],
                    }),
                ])
            )
        )
        .pipe(pngFilter.restore)
        .pipe(gulp.dest(function (file) {
            return file.base;
        }))
});

gulp.task('image-tiny', (cb) => {
    if(isNative){
        return cb();
    }
    
    return gulp.src(source + 'assets/**/*.{png,jpg}')
        .pipe(gulpIgnore.include(includeSpine))
        .pipe(print(filepath => `built: ${filepath}`))
        .pipe(tiny())
        .pipe(gulp.dest(function (file) {
            return file.base;
        }))
});

gulp.task('bundle_cocos2d', function(cb){
    if(isNative){
        return cb();
    }

    var files = [
        source+'cocos2d-js*.js',
    ]
    return gulp.src(files)
        .pipe(foreach(function(stream, file){
            var path = file.path.replace(/\\/g, '/');
            var fileName = path.substring(path.lastIndexOf("/")+1);
            gulp.src(path)
                .pipe(zip(fileName+".png"))
                .pipe(gulp.dest(source));

            return stream;
        }));
})

gulp.task('bundle_json', (cb)=>{
    let maxsize = 0;
    let countermax = {
        size8: 24,      //*8(kb)
        size6: 32,      //*6(kb)
        size4: 256,      //*4(kb)
    }
    let counter = {
        size8: 0,
        size6: 0,
        size4: 0,
    }
    let condition = function(file){
        let size = fs.statSync(file.path).size;
        let filtersize = 8;
        if(counter.size8>=countermax.size8){
            filtersize = 6;
        }
        if(counter.size6>=countermax.size6){
            filtersize = 4;
        } 
        if(counter.size4>=countermax.size4){
            filtersize = 2;
        }  
        if(maxsize>1024*128*8){
            filtersize = 2;
        }

        let handled = size<filtersize*1024 ? true : false; //x(*kb)
        if(handled){
            if(size>1024*6){
                counter.size8++;
            }
            else if(size>1024*4){
                counter.size6++;
            }
            else if(size>1024*2){
                counter.size4++;
            }
            maxsize = maxsize + size;
        }
        else{
            //console.log("filter: ", size, (size/1024).toFixed(2), file.path);
        }
        return handled; 
    };

    if(!fs.existsSync(sourceassets)){
        return cb();
    }

    let folders = getFolders(sourceassets);
    var tasks = folders.map(function(bundle_folder) {
        return gulp.src(sourceassets+`${bundle_folder}/import/**/*.json`)
            .pipe(gulpIgnore.include(condition))
            .pipe(zip(`import.json`))
            .pipe(size({
                title: `bundle ${bundle_folder} --> import: `,
            }))
            // .pipe(gulpif(file=>(fs.statSync(file.path).size<512*1000), zip(`raw-assets-${folder}.png`), gulpIgnore.include(condition)))
            .pipe(gulp.dest(sourceassets+`${bundle_folder}/res-zip`));
    })
    return merge(tasks);
})

gulp.task('bundle_image', (cb)=>{
    let maxsize = 0;
    let countermax = {
        size8: 12,      //*8(kb)
        size6: 16,      //*6(kb)
        size4: 156,      //*4(kb)
    }
    let counter = {
        size8: 0,
        size6: 0,
        size4: 0,
    }
    let condition = function(file){
        let size = fs.statSync(file.path).size;
        let filtersize = 8;
        if(counter.size8>=countermax.size8){
            filtersize = 6;
        }
        if(counter.size6>=countermax.size6){
            filtersize = 4;
        } 
        if(counter.size4>=countermax.size4){
            filtersize = 2;
        }  
        if(maxsize>1024*128*6){
            filtersize = 2;
        }
        
        let handled = size<filtersize*1024 ? true : false; //x(*kb)
        if(handled){
            if(size>1024*6){
                counter.size8++;
            }
            else if(size>1024*4){
                counter.size6++;
                // console.log("size6: ", counter.size6);
            }
            else if(size>1024*2){
                counter.size4++;
                // console.log("size4: ", counter.size4);
            }
            maxsize = maxsize + size;
        }
        else{
            //console.log("filter: ", size, (size/1024).toFixed(2), file.path);
        }
        return handled; 
    };

    if(!fs.existsSync(sourceassets)){
        return cb();
    }

    let folders = getFolders(sourceassets);
    var tasks = folders.map(function(bundle_folder) {
        return gulp.src(sourceassets+`${bundle_folder}/native/**/*.png`)
            .pipe(gulpIgnore.include(condition))
            .pipe(zip(`native.png`))
            .pipe(size({
                title: `bundle ${bundle_folder} --> native: `,
            }))
            // .pipe(gulpif(file=>(fs.statSync(file.path).size<512*1000), zip(`raw-assets-${folder}.png`), gulpIgnore.include(condition)))
            .pipe(gulp.dest(sourceassets+`${bundle_folder}/res-zip`));
    })
    return merge(tasks);
})


gulp.task('bundle_index', function (cb) {
    if(isNative){
        return cb();
    }

    return gulp.src([
        source+'src/settings.*js',
        // source+'assets/internal/index.*js', // internal 子包无实际代码，不需要合并
        source+'assets/main/index.*js',
        source+'assets/app-common/index.*js',
        source+'assets/game-common/index.*js',
        source+'assets/game-live-assets/index.*js',
        source+'assets/game-live-views/index.*js',
        source+'assets/game-set-assets/index.*js',
        source+'assets/game-set-views/index.*js',
        source+'assets/game-club-assets/index.*js',
        source+'assets/game-club-views/index.*js',
  		source+'assets/game-club-chat/index.*js',
        // source+'main.*js',
    ])
        .pipe(concat('bundle-index.min.js'))//合并后的文件名
        // .pipe(md5({
        //     separator: '.',
        //     size: 5,
        // }))
        .pipe(gulp.dest('.'));
});

gulp.task('bundle_config', function (cb) {
    if(isNative){
        return cb();
    }

    return gulp.src([
        source+'assets/internal/config.*json',
        source+'assets/main/config.*json',
        source+'assets/app-common/config.*json',
        source+'assets/game-common/config.*json',
        source+'assets/game-live-assets/config.*json',
        source+'assets/game-live-views/config.*json',
        source+'assets/game-set-assets/config.*json',
        source+'assets/game-set-views/config.*json',
        source+'assets/game-club-assets/config.*json',
        source+'assets/game-club-views/config.*json',
		source+'assets/game-club-chat/config.*json',
    ])
        .pipe(mergejson({
            exportModule: 'window._CCBundleConfig',
            fileName: 'bundle-config.min.js',
            jsonSpace: '',
            edit: (parsedJson, file) => {
                return {
                    [file.basename]: parsedJson
                };
            },
        }))
        .pipe(gulp.dest('.'));
});

gulp.task('bundle_internal_import', function (cb) {
    if(isNative){
        return cb();
    }

    let pre_path = 'assets/internal/import/';
    return gulp.src(source+pre_path+'*/*.json')
        .pipe(mergejson({
            exportModule: 'window._CCInternalImport',
            fileName: 'bundle-internal-import.min.js',
            jsonSpace: '',
            edit: (parsedJson, file) => {
                let key = pre_path + file.basename.substr(0, 2) + "/" + file.basename;
                return {
                    [key]: parsedJson
                };
            },
        }))
        .pipe(gulp.dest('.'));
});

gulp.task('game_html', function (cb) {
    if(isNative){
        return cb();
    }
    
    return gulp.src(['bundle-index.min.js', 'bundle-config.min.js', 'bundle-internal-import.min.js'])
    .pipe(md5plus(5, source+'game.html', {
        connector: '.',
    }))
    .pipe(gulp.dest(source+'src'));
})


gulp.task("clearCache", (cb)=>{
    return cache.clearAll(cb);
});


gulp.task('imagemin', gulp.series('image-assets'/*, 'image-tiny'*/));
gulp.task('bundle_zip', gulp.series('bundle_cocos2d', 'bundle_json', 'bundle_image'));
gulp.task('bundle_main', gulp.series('bundle_index', 'bundle_config', 'bundle_internal_import', 'game_html'));

gulp.task('gulp_all', gulp.series('empty', 'imagemin', /*'bundle_zip',*/ 'bundle_main'));