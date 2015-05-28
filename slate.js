/*
 * Slate configuration file taken from https://gist.github.com/gfreezy/6060661
 *
 * lives-at: ~/.slate.js
 *
 * Usage: 
 *
 * hyper = ctrl + cmd + alt (caps lock key should be remapped to this on hold)
 *
 * ctrl + cmd + up      -> Maximize the window;If maximized, move it to the next screen.
 * ctrl + cmd + down    -> Move the window to the next screen.
 * ctrl + cmd + left    -> Push window to the left with half size. If already done, move it to the next screen.
 * ctrl + cmd + right   -> Push window to the right with half size. If already done, move it to the next screen.
 */

S.log("[SLATE] -------------- About to loading config --------------");

S.src('.reslate.js');
// enable to see debug messages in Console.app
//$.debug = true;

slate.alias('hyper', 'ctrl;alt;cmd');

// begin config
slate.configAll({
    defaultToCurrentScreen: true,
    nudgePercentOf: 'screenSize',
    resizePercentOf: 'screenSize',
    undoOps: [
        'active-snapshot',
        'chain',
        'grid',
        'layout',
        'move',
        'resize',
        'sequence',
        'shell',
        'push'
    ]
});

// Library functions. These should be included in reslate.js
// so have a look into deleting these.
var pushRight = slate.operation("push", {
  "direction": "right",
  "style": "bar-resize:screenSizeX/2"
});
 
var pushLeft = slate.operation("push", {
  "direction": "left",
  "style": "bar-resize:screenSizeX/2"
});
 
var throwNextLeft = slate.operation("throw", {
  "width": "screenSizeX/2",
  "height": "screenSizeY",
  "screen": "next"
});
 
var throwNextRight = slate.operation("throw", {
  "x": "screenOriginX+(screenSizeX)/2",
  "y": "screenOriginY",
  "width": "screenSizeX/2",
  "height": "screenSizeY",
  "screen": "next"
});
 
var fullscreen = slate.operation("move", {
  "x" : "screenOriginX",
  "y" : "screenOriginY",
  "width" : "screenSizeX",
  "height" : "screenSizeY"
});
 
var throwNextFullscreen = slate.operation("throw", {
  "x": "screenOriginX",
  "y": "screenOriginY",
  "width": "screenSizeX",
  "height": "screenSizeY",
  "screen": "next"
});
 
var throwNext = function(win) {
  if (!win) {
    return;
  }
  var winRect = win.rect();
  var screen = win.screen().visibleRect();
 
  var newX = (winRect.x - screen.x)/screen.width+"*screenSizeX+screenOriginX";
  var newY = (winRect.y - screen.y)/screen.height+"*screenSizeY+screenOriginY";
  var newWidth = winRect.width/screen.width+"*screenSizeX";
  var newHeight = winRect.height/screen.height+"*screenSizeY";
  var throwNext = slate.operation("throw", {
    "x": newX,
    "y": newY,
    "width": newWidth,
    "height": newHeight,
    "screen": "next"
  });
  win.doOperation(throwNext);
};
 
var pushedLeft = function(win) {
  if (!win) {
    return false;
  }
  var winRect = win.rect();
  var screen = win.screen().visibleRect();
 
  if (winRect.x === screen.x &&
      winRect.y === screen.y &&
      winRect.width === screen.width/2 &&
      winRect.height === screen.height
    ) {
    return true;
  }
  return false;
};
 
var pushedRight = function(win) {
  if (!win) {
    return false;
  }
  var winRect = win.rect();
  var screen = win.screen().visibleRect();
 
  if (winRect.x === screen.x + screen.width/2 &&
      winRect.y === screen.y &&
      winRect.width === screen.width/2 &&
      winRect.height === screen.height
    ) {
    return true;
  }
  return false;
};
 
var isFullscreen = function(win) {
  if (!win) {
    return false;
  }
  var winRect = win.rect();
  var screen = win.screen().visibleRect();
  if (winRect.width === screen.width &&
      winRect.height === screen.height
    ) {
    return true;
  }
  return false;
};
 
slate.bind("left:ctrl,cmd", function(win) {
  if (!win) {
    return;
  }
  if (pushedLeft(win)) {
    win.doOperation(throwNextLeft);
  } else {
    win.doOperation(pushLeft);
  }
});
 
slate.bind("right:ctrl,cmd", function(win) {
  if (!win) {
    return;
  }
 
  if (pushedRight(win)) {
    win.doOperation(throwNextRight);
  } else {
    win.doOperation(pushRight);
  }
});
 
slate.bind("up:ctrl,cmd", function(win) {
  if (!win) {
    return;
  }
 
  if (isFullscreen(win)) {
    win.doOperation(throwNextFullscreen);
  } else {
    win.doOperation(fullscreen);
  }
});

slate.bind("down:ctrl,cmd", function(win) {
  if (!win) {
    return;
  }
 
  if (pushedLeft(win)) {
    win.doOperation(throwNextLeft);
  } else if (pushedRight(win)) {
    win.doOperation(throwNextRight);
  } else if (isFullscreen(win)) {
    win.doOperation(throwNextFullscreen);
  } else {
    throwNext(win);
  }
});

// Layouts
// Monitors
var monTbolt  = "1920x1080";
var monLaptop = "2880x1800";

// Operations
var lapFull = S.op("move", {
  "screen" : monLaptop,
  "x" : "screenOriginX",
  "y" : "screenOriginY",
  "width" : "screenSizeX",
  "height" : "screenSizeY"
});
var lapChat = S.op("corner", {
  "screen" : monLaptop,
  "direction" : "top-left",
  "width" : "screenSizeX/9",
  "height" : "screenSizeY"
});
var lapMain = lapChat.dup({ "direction" : "top-right", "width" : "8*screenSizeX/9" });
var tboltFull = S.op("move", {
  "screen" : monTbolt,
  "x" : "screenOriginX",
  "y" : "screenOriginY",
  "width" : "screenSizeX",
  "height" : "screenSizeY"
});
var tboltBig = S.op("move", {
  "screen" : monTbolt,
  "x" : "screenOriginX+screenSizeX/3",
  "y" : "screenOriginY",
  "width" : "screenSizeX*2/3",
  "height" : "screenSizeY",
});
var tboltLeft = tboltFull.dup({ "width" : "screenSizeX/3" });
var tboltMid = tboltLeft.dup({ "x" : "screenOriginX+screenSizeX/3" });
var tboltRight = tboltLeft.dup({ "x" : "screenOriginX+(screenSizeX*2/3)" });
var tboltLeftTop = tboltLeft.dup({ "height" : "screenSizeY/2" });
var tboltLeftBot = tboltLeftTop.dup({ "y" : "screenOriginY+screenSizeY/2" });
var tboltMidTop = tboltMid.dup({ "height" : "screenSizeY/2" });
var tboltMidBot = tboltMidTop.dup({ "y" : "screenOriginY+screenSizeY/2" });
var tboltRightTop = tboltRight.dup({ "height" : "screenSizeY/2" });
var tboltRightBot = tboltRightTop.dup({ "y" : "screenOriginY+screenSizeY/2" });

// common layout hashes
var lapMainHash = {
  "operations" : [lapMain],
  "ignore-fail" : true,
  "repeat" : true
};
var lapFullHash = {
  "operations" : [lapFull],
  "ignore-fail" : true,
  "repeat" : true
};
var adiumHash = {
  "operations" : [lapChat, lapMain],
  "ignore-fail" : true,
  "title-order" : ["Contacts"],
  "repeat-last" : true
};
var mvimHash = {
  "operations" : [tboltMid, tboltRightTop],
  "repeat" : true
};
var tboltBigHash = {
  "operations" : [tboltBig],
  "sort-title" : true,
  "repeat" : true
};
var tboltFullHash = {
  "operations" : [tboltFull],
  "sort-title" : true,
  "repeat" : true
};
var genBrowserHash = function(regex) {
  return {
    "operations" : [function(windowObject) {
      var title = windowObject.title();
      if (title !== undefined && title.match(regex)) {
        windowObject.doOperation(tboltLeftBot);
      } else {
        windowObject.doOperation(lapFull);
      }
    }],
    "ignore-fail" : true,
    "repeat" : true
  };
}

// 3 monitor layout
var threeMonitorLayout = S.lay("threeMonitor", {
  "Adium" : {
    "operations" : [lapChat, lapMain],
    "ignore-fail" : true,
    "title-order" : ["Contacts"],
    "repeat-last" : true
  },
  "MacVim" : mvimHash,
  "iTerm" : tboltFullHash,
  "Xcode" : tboltBigHash,
  "Google Chrome" : genBrowserHash(/^Developer\sTools\s-\s.+$/),
  "GitX" : {
    "operations" : [lapFull],
    "repeat" : true
  },
  "Firefox" : genBrowserHash(/^Firebug\s-\s.+$/),
  "Safari" : lapFullHash,
  "Spotify" : {
    "operations" : [lapFull],
    "repeat" : true
  },
  "TextEdit" : {
    "operations" : [lapFull],
    "repeat" : true
  }
});

// 2 monitor layout
var twoMonitorLayout = S.lay("twoMonitor", {
  "Adium" : {
    "operations" : [lapChat, lapMain],
    "ignore-fail" : true,
    "title-order" : ["Contacts"],
    "repeat-last" : true
  },
  "MacVim" : mvimHash,
  "iTerm" : tboltFullHash,
  "Xcode" : tboltBigHash,
  "Google Chrome" : genBrowserHash(/^Developer\sTools\s-\s.+$/),
  "GitX" : {
    "operations" : [lapFull],
    "repeat" : true
  },
  "Firefox" : genBrowserHash(/^Firebug\s-\s.+$/),
  "Safari" : lapFullHash,
  "Spotify" : {
    "operations" : [lapFull],
    "repeat" : true
  },
  "TextEdit" : {
    "operations" : [lapFull],
    "repeat" : true
  }
});

// 1 monitor layout
var oneMonitorLayout = S.lay("oneMonitor", {
  "Adium" : adiumHash,
  "MacVim" : lapFullHash,
  "iTerm" : lapFullHash,
  "Terminal" : lapFullHash,
  "Google Chrome" : lapFullHash,
  "Xcode" : lapFullHash,
  "Flex Builder" : lapFullHash,
  "GitX" : lapFullHash,
  "Ooyala Player Debug Console" : lapFullHash,
  "Firefox" : lapFullHash,
  "Safari" : lapFullHash,
  "Eclipse" : lapFullHash,
  "Spotify" : lapFullHash
});

// Defaults
S.def(3, threeMonitorLayout);
S.def(2, twoMonitorLayout);
S.def(1, oneMonitorLayout);

// Layout Operations
var threeMonitor = S.op("layout", { "name" : threeMonitorLayout });
var twoMonitor = S.op("layout", { "name" : twoMonitorLayout });
var oneMonitor = S.op("layout", { "name" : oneMonitorLayout });
var universalLayout = function() {
  // Should probably make sure the resolutions match but w/e
  S.log("SCREEN COUNT: " + S.screenCount());
  if (S.screenCount() === 1) {
    oneMonitor.run();
  } else if (S.screenCount() === 2) {
    twoMonitor.run();
  } else if (S.screenCount() === 3) {
      threeMonitor.run();
  }
};

// bindings
slate.bindAll({
    hyper: {
        shift: {
            // edges
            h: [$('barResize', 'left',   3),
                $('center',    'left',   3, 3)],
            j: [$('barResize', 'bottom', 2),
                $('center',    'bottom', 3, 3)],
            k: [$('barResize', 'top',    2),
                $('center',    'top',    3, 3)],
            l: [$('barResize', 'right',  3),
                $('center',    'right',  3, 3)],

            // corners
            y: [$('corner', 'top-left',     3, 2),
                $('corner', 'top-left',     3, 3)],
            i: [$('corner', 'top-right',    3, 2),
                $('corner', 'top-right',    3, 3)],
            b: [$('corner', 'bottom-left',  3, 2),
                $('corner', 'bottom-left',  3, 3)],
            m: [$('corner', 'bottom-right', 3, 2),
                $('corner', 'bottom-right', 3, 3)],

            // centers
            u: [$('center', 'top'),
                $('center', 'top', 3, 3)],
            n: [$('center', 'bottom'),
                $('center', 'bottom', 3, 3)],
            'return': $('center', 'center', 3, 3),

            // bars
            a: [$('barResize', 'left',  2),
                $('barResize', 'left',  1.5)],
            s: $('barResize', 'bottom', 2),
            d: $('barResize', 'top',    2),
            f: [$('barResize', 'right', 2),
                $('barResize', 'right', 1.5)],

            // corners
            t: [$('corner', 'top-left'),
                $('corner', 'top-left', 1.5)],
            e: [$('corner', 'top-right'),
                $('corner', 'top-right', 1.5)],
            c: [$('corner', 'bottom-left'),
                $('corner', 'bottom-left', 1.5)],
            z: [$('corner', 'bottom-right'),
                $('corner', 'bottom-right', 1.5)],

            // centers
            r: $('center', 'top'),
            x: $('center', 'bottom'),
            //'return': $('center', 'center'),
        },
        // direct focus 
        a: $.focus('Spotify'),
        b: $.focus('Google Chrome'),
        c: $.focus('Calendar'),
        d: $.focus('Dash'),
        e: $.focus('Evernote'),
        f: $.focus('Firefox'),
        g: $.focus('Messages'),
        h: $.focus('HipChat'),
        i: $.focus('iTerm'),
        j: $.focus('IntelliJ IDEA'),
        m: $.focus('Mail'),
        p: $.focus('Preview'),
        s: $.focus('Spotify'),
        t: $.focus('Terminal'),
        w: $.focus('1Password'),
        x: $.focus('Xcode'),
        v: $.focus('MacVim'),

        // throw to monitor
        '`': ['throw 0 resize',
              'throw 1 resize'],
        '1': $('toss', '0', 'resize'),
        '2': $('toss', '1', 'resize'),
        '3': $('toss', '2', 'resize'),

        // layouts
        space: universalLayout,

        // utility functions
        f1: 'relaunch',
        z: 'undo',
        tab: 'hint'
    }
});

// Batch bind everything. Less typing.
// FIXME: Not sure if any of this is working. Try and work
// out how to get grid working and how to use it.
S.bnda({
  // Focus Bindings
  "l:ctrl,cmd" : S.op("focus", { "direction" : "right" }),

  // Grid
  "esc:ctrl" : S.op("grid")
});

// Log that we're done configuring
 S.log("[SLATE] -------------- Finished Loading Config --------------");
