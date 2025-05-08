import { Component, OnInit } from '@angular/core';
import { ApiService } from './api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  qrResultString: string = '';
  qrResultStrings: string[] = [];
  scannerEnabled: boolean = true;
  cameraCount: number = 0; // カメラデバイスの数を保持するプロパティ
  apiResponse: any = null;
  loading: boolean = false;
  error: string | null = null;

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.getCameraCount(); // コンポーネント初期化時にカメラ数を確認
  }

  // カメラデバイスの数を取得するメソッド
  async getCameraCount() {
    try {
      // 利用可能なメディアデバイスを取得
      const devices = await navigator.mediaDevices.enumerateDevices();
      // ビデオ入力デバイス（カメラ）のみをフィルタリング
      const videoDevices = devices.filter(
        (device) => device.kind === 'videoinput'
      );
      this.cameraCount = videoDevices.length; // カメラの数をセット
      console.log('利用可能なカメラデバイス:', videoDevices);
    } catch (error) {
      console.error('カメラデバイスの取得に失敗しました:', error);
      this.cameraCount = 0; // エラー時は0をセット
    }
  }

  onScanSuccess(result: string) {
    console.log('onScanSuccess');
    this.qrResultString = result;
    this.qrResultStrings.push(result);
    // this.scannerEnabled = false; // スキャン後にカメラをオフにする
  }

  onScanError(result: string) {
    this.qrResultStrings.push('onScanError');
  }

  onScanFailure(result: string) {
    this.qrResultStrings.push('onScanFailure');
  }

  onScanComplete(result: string) {
    this.qrResultStrings.push('onScanComplete');
  }

  onCamerasFoundHandler(results: any) {
    console.log('========');
    console.log(results);
  }

  restartScanner() {
    this.scannerEnabled = true;
    this.qrResultString = '';
    this.qrResultStrings = [];
    this.getCameraCount(); // 再スキャン時にカメラ数を再確認（必要に応じて）
  }

  private fetchData(url: string) {
    this.loading = true;
    this.error = null;
    this.apiService.getData(url).subscribe({
      next: (response) => {
        this.apiResponse = response;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'データの取得に失敗しました: ' + error.message;
        this.loading = false;
      },
    });
  }
}
