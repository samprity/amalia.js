fr.ina.amalia.player.BasePlayer.extend("fr.ina.amalia.player.JwBasePlayer",{jwPlayerContainerClassCss:"player",jwPlayerContainerStyle:"position: relative; width: inherit; height: inherit; background-color: black; "},{jwPlayerContainer:null,jwPlayerInstance:null,startedInterval:null,initialize:function(){this.jwPlayerContainer=$("<div/>",{"class":this.Class.jwPlayerContainerClassCss,style:this.Class.jwPlayerContainerStyle,id:fr.ina.amalia.player.helpers.UtilitiesHelper.generateUUID("ajs-jw-player")}),this.mediaContainer.append(this.jwPlayerContainer),this.setSrc(this.settings.src,this.settings.autoplay),this._super(),$(document).on("webkitfullscreenchange mozfullscreenchange fullscreenchange MSFullscreenChange",{self:this},this.onFullscreenHandler)},setSrc:function(src,autoplay){var withControlBarYt="object"==typeof this.settings.controlBar&&this.settings.controlBar.hasOwnProperty("hide")===!0&&this.settings.controlBar.hide===!0;this.jwPlayerInstance=jwplayer(this.jwPlayerContainer.get(0)).setup({file:this.settings.src,image:this.settings.poster,autostart:this.settings.advertising,height:"100%",width:"100%",primary:"flash",advertising:this.settings.advertising}),this.jwPlayerInstance.setControls(withControlBarYt),null!==this.logger&&this.logger.trace(this.Class.fullName,"src:"+src+" autoplay:"+autoplay)},onPlayerReady:function(event){this.hideLoader(),this.setVolume(this.localStorageManager.hasItem("volume")===!1?this.settings.defaultVolume:this.localStorageManager.getItem("volume"));var hasControlBarHeight="object"==typeof this.settings.controlBar&&this.settings.controlBar.hasOwnProperty("height")===!0&&""!==this.settings.controlBar.height,stickyMode="object"==typeof this.settings.controlBar&&this.settings.controlBar.hasOwnProperty("sticky")===!0&&this.settings.controlBar.sticky===!0;if(stickyMode){var controlBarHeight=hasControlBarHeight?this.settings.controlBar.height:45;this.jwPlayerInstance.resize("100%",this.mediaContainer.height()-controlBarHeight)}this.startedInterval=setInterval($.proxy(this.onStarted,this),250),null!==this.logger&&this.logger.trace(this.Class.fullName,event)},onStarted:function(){var duration=this.getDuration();duration>0&&(this.mediaContainer.trigger(fr.ina.amalia.player.PlayerEventType.STARTED,[this]),clearInterval(this.startedInterval))},onPlay:function(){this.mediaContainer.trigger(fr.ina.amalia.player.PlayerEventType.PLAYING,[this]),this.hideLoader(),null!==this.logger&&this.logger.trace(this.Class.fullName,"onPlay")},onPause:function(){this.mediaContainer.trigger(fr.ina.amalia.player.PlayerEventType.PAUSED,[this]),this.hideLoader(),null!==this.logger&&this.logger.trace(this.Class.fullName,"onPause")},onComplete:function(){this.mediaContainer.trigger(fr.ina.amalia.player.PlayerEventType.ENDED,[this]),null!==this.logger&&this.logger.trace(this.Class.fullName,"onComplete")},onPlayerError:function(event){null!==this.logger&&(this.logger.warn(this.Class.fullName+" :: onPlayerError"),this.logger.warn(event)),this.mediaContainer.trigger(fr.ina.amalia.player.PlayerEventType.ERROR,{self:this,errorCode:fr.ina.amalia.player.PlayerErrorCode.MEDIA_FILE_NOT_FOUND})},onVolume:function(volume){this.mediaContainer.trigger(fr.ina.amalia.player.PlayerEventType.VOLUME_CHANGE,{volume:volume})},play:function(){this.jwPlayerInstance.play(!0),this._super()},pause:function(){this.jwPlayerInstance.pause(!0),this._super()},stop:function(){this.jwPlayerInstance.stop(),this._super()},mute:function(){this.jwPlayerInstance.mute(!0),this._super()},unmute:function(){this.jwPlayerInstance.unMute(!1),this._super()},getDuration:function(){return this.jwPlayerInstance.getDuration()},getVolume:function(){return this.jwPlayerInstance.getVolume()},setVolume:function(volume){return this.localStorageManager.setItem("volume",volume),this.jwPlayerInstance.setVolume(volume)},getCurrentTime:function(){return this.jwPlayerInstance.getPosition()+this.tcOffset},setCurrentTime:function(value){var currentTime=isNaN(value)?0:value;this.jwPlayerInstance.seek(Math.max(0,currentTime-this.tcOffset)),this._super(currentTime)},isPaused:function(){return"paused"===this.jwPlayerInstance.getState()},getPlaybackrate:function(){return null!==this.logger&&this.logger.warn("Not supported."),null},setPlaybackrate:function(suggestedRate){null!==this.logger&&this.logger.warn("Not supported. suggestedRate:"+suggestedRate)},onTimeupdate:function(){var tcOffset=this.getTcOffset(),currentTime=this.getCurrentTime(),duration=this.getDuration()+tcOffset,percentage=100*(currentTime-tcOffset)/(duration-tcOffset);if(this.mediaContainer.trigger(fr.ina.amalia.player.PlayerEventType.TIME_CHANGE,{self:this,currentTime:currentTime,duration:duration,percentage:percentage,tcOffset:this.getTcOffset()}),this.isRangePlayer===!0&&"number"==typeof this.rangePlayerTcout&&this.rangePlayerTcout<=currentTime&&this.pause(),"undefined"!=typeof this.settings.callbacks.onTimeupdate)try{eval(this.settings.callbacks.onTimeupdate+"(currentTime)")}catch(e){null!==this.logger&&this.logger.warn("Send callback failed.")}},onFullscreenHandler:function(event){event.data.self.updateContainerSize(),null!==event.data.self.logger&&event.data.self.logger.trace(event.data.self.Class.fullName,"onFullscreenHandler")}}),fr.ina.amalia.player.JwBasePlayer.extend("fr.ina.amalia.player.JwPlayer6",{},{setSrc:function(src,autoplay){this._super(src,autoplay),this.jwPlayerInstance.onReady($.proxy(this.onPlayerReady,this)),this.jwPlayerInstance.onComplete($.proxy(this.onPlayerReady,this)),this.jwPlayerInstance.onPlay($.proxy(this.onPlay,this)),this.jwPlayerInstance.onPause($.proxy(this.onPause,this)),this.jwPlayerInstance.onTime($.proxy(this.onTimeupdate,this)),this.jwPlayerInstance.onVolume($.proxy(this.onVolume,this)),this.jwPlayerInstance.onSetupError($.proxy(this.onPlayerError,this)),this.jwPlayerInstance.onError($.proxy(this.onPlayerError,this))},onPlayerReady:function(event){this._super(event),this.settings.autoplay===!1&&(this.jwPlayerInstance.play(),this.jwPlayerInstance.pause())}}),fr.ina.amalia.player.JwBasePlayer.extend("fr.ina.amalia.player.JwPlayer7",{},{setSrc:function(src,autoplay){this._super(src,autoplay),this.jwPlayerInstance.on("ready",$.proxy(this.onPlayerReady,this)),this.jwPlayerInstance.on("complete",$.proxy(this.onPlayerReady,this)),this.jwPlayerInstance.on("play",$.proxy(this.onPlay,this)),this.jwPlayerInstance.on("pause",$.proxy(this.onPause,this)),this.jwPlayerInstance.on("time",$.proxy(this.onTimeupdate,this)),this.jwPlayerInstance.on("setupError",$.proxy(this.onPlayerError,this)),this.jwPlayerInstance.on("error",$.proxy(this.onPlayerError,this))},onPlayerReady:function(event){this._super(event);var stickyMode=!("object"==typeof this.settings.controlBar&&this.settings.controlBar.hasOwnProperty("sticky")===!0&&this.settings.controlBar.sticky===!0),hasControlbarHeight="object"==typeof this.settings.controlBar&&this.settings.controlBar.hasOwnProperty("height")===!0&&""!==this.settings.controlBar.height;if(!stickyMode){var controlBarHeight=hasControlbarHeight?this.settings.controlBar.height:45;this.mediaContainer.find("iframe").first().css("height",this.mediaContainer.height()-controlBarHeight)}this.startedInterval=setInterval($.proxy(this.onStarted,this),250),this.settings.autoplay===!1&&(this.jwPlayerInstance.play(),this.jwPlayerInstance.pause())}});