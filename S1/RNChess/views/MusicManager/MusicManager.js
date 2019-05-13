import Sound from "react-native-sound";

export default class MusicManager {

    constructor() {
        this.bgm = new Sound('bgm.mp3', Sound.MAIN_BUNDLE, (error) => {
            if (error) {
                console.log('failed to load the sound', error);
                return;
            }
            // loaded successfully
            console.log('duration in seconds: ' + this.bgm.getDuration() + 'number of channels: ' + this.bgm.getNumberOfChannels());
        });

        this.money = new Sound('moneyring.mp3', Sound.MAIN_BUNDLE, (error) => {
            if (error) {
                console.log('failed to load the sound', error);
                return;
            }
            // loaded successfully
            console.log('duration in seconds: ' + this.money.getDuration() + 'number of channels: ' + this.money.getNumberOfChannels());
        });

        this.showAlert = new Sound('showalertring.mp3', Sound.MAIN_BUNDLE, (error) => {
            if (error) {
                console.log('failed to load the sound', error);
                return;
            }
            // loaded successfully
            console.log('duration in seconds: ' + this.showAlert.getDuration() + 'number of channels: ' + this.showAlert.getNumberOfChannels());
        });

        this.err = new Sound('errring.mp3', Sound.MAIN_BUNDLE, (error) => {
            if (error) {
                console.log('failed to load the sound', error);
                return;
            }
            // loaded successfully
            console.log('duration in seconds: ' + this.err.getDuration() + 'number of channels: ' + this.err.getNumberOfChannels());
        });
    }

    static getInstance() {
        if(!this.instance) {
            this.instance = new MusicManager();
        }
        return this.instance;
    }

    //循环播放bgm
    playBGM() {
        setTimeout(()=>{
            this.bgm.play((success) => {
                if (success) {
                    console.log('successfully finished playing');
                } else {
                    console.log('playback failed due to audio decoding errors');
                    // reset the player to its uninitialized state (android only)
                    // this is the only option to recover after an error occured and use the player again
                    this.bgm.reset();
                }
            });

            // Loop indefinitely until stop() is called
            //循环播放
            this.bgm.setNumberOfLoops(-1);
        },2*1000)
    }

    //暂停bgm
    pauseBGM() {
        this.bgm.stop();
    }

    //获取bgm音量
    bgmPlayerVolume()
    {
        return this.bgm.getVolume();
    }

    //设置bgm音量
    configBgmPlayerVolume(volume)
    {
        this.bgm.setVolume(volume);
    }

    //获取提示音音量
    alertPlayerVolume()
    {
        return this.showAlert.getVolume();
    }

    //设置提示音音量
    configAlertPlayerVolume(volume)
    {
        this.showAlert.setVolume(volume);
        this.money.setVolume(volume);
        this.err.setVolume(volume);
    }



    //播放弹窗音效
    playShowAlert() {
        this.showAlert.play((success) => {
            if (success) {
                console.log('successfully finished playing');
            } else {
                console.log('playback failed due to audio decoding errors');
                // reset the player to its uninitialized state (android only)
                // this is the only option to recover after an error occured and use the player again
                this.showAlert.reset();
            }
        });
    }

    //播放money音效
    playMoney() {
        this.money.play((success) => {
            if (success) {
                console.log('successfully finished playing');
            } else {
                console.log('playback failed due to audio decoding errors');
                // reset the player to its uninitialized state (android only)
                // this is the only option to recover after an error occured and use the player again
                this.money.reset();
            }
        });
    }
}