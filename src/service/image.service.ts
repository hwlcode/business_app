import {Injectable} from '@angular/core';
import {ActionSheetController} from "ionic-angular";
import { Camera, CameraOptions } from '@ionic-native/camera';
import {ImagePicker} from "@ionic-native/image-picker";
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import {UtilService} from "./util.service";

@Injectable()
export class ImageService {
    // 调用相机时传入的参数
     private cameraOpt: CameraOptions = {
        quality: 50,
        destinationType: 1, // Camera.DestinationType.FILE_URI,
        sourceType: 1, // Camera.PictureSourceType.CAMERA,
        encodingType: 0, // Camera.EncodingType.JPEG,
        mediaType: 0, // Camera.MediaType.PICTURE,
        allowEdit: true,
        correctOrientation: true
    }

    // 调用相册时传入的参数
    private imagePickerOpt = {
        maximumImagesCount: 1,//选择一张图片
        width: 800,
        height: 800,
        quality: 80
    };

    upload: any = {
        url: '',           //接收图片的url
        fileKey: 'file',                                       //接收图片时的key
        headers: {
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8' //不加入 发生错误！！
        },
        params: {},             //需要额外上传的参数
        success: (data) => {

        },  //图片上传成功后的回调
        error: (err) => {},     //图片上传失败后的回调
        listen: () => {}        //监听上传过程
    };

    constructor(
        public actionSheetCtrl: ActionSheetController,
        private camera: Camera,
        private imagePicker: ImagePicker,
        private utilService: UtilService,
        private transfer: FileTransfer
    ) {

    }

    showPicActionSheet() {
        this.useASComponent();
    }

    // 使用ionic中的ActionSheet组件
    private useASComponent() {
        let actionSheet = this.actionSheetCtrl.create({
            title: '选择头像',
            buttons: [
                {
                    text: '拍照',
                    handler: () => {
                        this.startCamera();
                    }
                },
                {
                    text: '从手机相册选择',
                    handler: () => {
                        this.openImgPicker();
                    }
                },
                {
                    text: '取消',
                    role: 'cancel',
                    handler: () => {

                    }
                }
            ]
        });
        actionSheet.present();
    }

    // 启动拍照功能
    private startCamera() {
        this.camera.getPicture(this.cameraOpt).then((imageData) => {

            this.uploadImg(imageData);

        }, (err) => {
            this.utilService.toast('ERROR:' + err); //错误：无法使用拍照功能！
        });
    }

    // 打开手机相册
    private openImgPicker() {
        let temp = '';
        this.imagePicker.getPictures(this.imagePickerOpt)
            .then((results) => {
                for (var i = 0; i < results.length; i++) {
                    temp = results[i];
                }

                this.uploadImg(temp);

            }, (err) => {
                this.utilService.toast('ERROR:' + err); //错误：无法从手机相册中选择图片！
            });

        /*let str = '{"status":1,"msg":"提示：图片上传成功！","data":"http:\/\/192.168.1.20\/image\/580af6bcc4d40580af6bcc4d45.jpg"}';
        let res = JSON.parse(str);
        this.upload.success(res);*/
    }

    public fileTransfer: FileTransferObject = this.transfer.create();
    // 上传图片
    private uploadImg(path: string) {
        if (!path) {
            return;
        }

        let options: FileUploadOptions = {
            fileKey: this.upload.fileKey,
            headers: this.upload.headers,
            params: this.upload.params
        };

        this.fileTransfer.upload(path, this.upload.url, options)
            .then((data) => {

                if (this.upload.success) {
                    this.upload.success(JSON.parse(data.response));
                }

            }, (err) => {
                if (this.upload.error) {
                    this.upload.error(err);
                } else {
                    this.utilService.toast('错误：上传失败！');
                }
            });
    }

    // 停止上传
    stopUpload() {
        if (this.fileTransfer) {
            this.fileTransfer.abort();
        }
    }
}
