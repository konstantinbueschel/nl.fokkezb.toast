var LTAG = '[nl.fokkezb.toast]',
    parent;


/**
 * SEF to organize otherwise inline code
 *
 * @private
 * @param {Object} args
 * @returns void
 */
(function constructor(args) {
    
    var showAndroidToast = OS_ANDROID && !args.image && !args.icon;
    
    if (showAndroidToast) {
        
        var properties = {
            
            message: args.message
        };
        
        if (args.duration) {
            
            // convert ms to constant
            if (args.duration !== Ti.UI.NOTIFICATION_DURATION_SHORT && args.duration !== Ti.UI.NOTIFICATION_DURATION_LONG) {
                
                properties.duration = (args.duration > 2000) ? Ti.UI.NOTIFICATION_DURATION_LONG : Ti.UI.NOTIFICATION_DURATION_SHORT;
            }
            else {
                properties.duration = args.duration;
            }
        }
        
        $.notification = $.UI.create('Notification', {
            
            id: 'notification',
            classes: ['nlFokkezbToast_notification']
        });
        
        $.notification.applyProperties(properties);
        
        $.notification.show();
    }
    else {
        
        var viewClasses = ['nlFokkezbToast_view'],
            labelClasses = ['nlFokkezbToast_label'];
        
        if (args.theme) {
            
            viewClasses[viewClasses.length] = 'nlFokkezbToast_view_' + args.theme;
            
            labelClasses[labelClasses.length] = 'nlFokkezbToast_label_' + args.theme;
        }
        
        $.resetClass($.view, viewClasses);
        
        $.resetClass($.label, labelClasses, {
            
            text: args.message
        });
        
        if (args.image) {
            
            $.image.setImage(args.image);
            
            $.resetClass($.window, 'nlFokkezbToast_window_image');
        }
        
        if (OS_ANDROID && !args.view) {
            
            Ti.API.error(LTAG, 'Could not build up toast for Android, no parent view given!');
            
            return;
        }
        
        parent = args.view || $.window;
        
        parent.add($.view);
        
        args.view || $.window.open();
        
        show();
        
        // set a timeout to hide and close
        args.persistent || setTimeout(hide, args.duration || 3000);
    }
    
    
    // PUBLIC INTERFACE
    $.show = show;
    $.hide = hide;
    
})(arguments[0] || {});


function show(event) {
    
    // enterAnimation defined in TSS
    $.view.animate(_.omit($.createStyle({
        
        classes: ['nlFokkezbToast_enterAnimation']
        
    }), 'classes'));
    
    return;
    
} // END show()


function hide(event) {
    
    // exitAnimation defined in TSS
    $.view.animate(_.omit($.createStyle({
        classes: ['nlFokkezbToast_exitAnimation']
        
    }), 'classes'), function(e) {
        
        parent === $.window && $.window.close();
        
        parent.remove($.view);
        
        return;
    });
    
    return;
    
} // END hide()
