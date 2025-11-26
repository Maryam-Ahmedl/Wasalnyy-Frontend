import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FaceService } from '../../services/face.service';
import { AuthService } from '../../auth/auth-service';
import { NgZone } from '@angular/core';

@Component({
  selector: 'app-face-scan',
  templateUrl: './face-scan.html',
  styleUrls: ['./face-scan.css']
})
export class FaceScan implements OnInit, OnDestroy {
  @ViewChild('video', { static: true }) videoRef!: ElementRef<HTMLVideoElement>;

  mode: 'register'|'login' = 'login';
  userId?: string;
  preview: string|null=null;
  buttonText: string|null =null;
  loginResult: string|null = null;
  private stream?: MediaStream;

constructor(
  private route: ActivatedRoute,
  private router: Router,
  private faceService: FaceService,
  private authService: AuthService,
  private zone: NgZone
) {}
  ngOnInit() {
    this.preview = null;
    const path = this.route.snapshot.routeConfig?.path || '';
    if (path.startsWith('face-scan/register')) {
      this.mode = 'register';
      this.userId = this.route.snapshot.paramMap.get('userId') || undefined;
    } else {
      this.mode = 'login';
    }
    this.startCamera();
  }

  async startCamera() {
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
      this.videoRef.nativeElement.srcObject = this.stream;
    } catch (err) {
      console.error('Camera error', err);
      alert('Camera access required');
    }
  }

captureAndUpload() {
  const videoEl = this.videoRef.nativeElement;
  const canvas = document.createElement('canvas');
  canvas.width = videoEl.videoWidth || 640;
  canvas.height = videoEl.videoHeight || 480;
  const ctx = canvas.getContext('2d');
  if (!ctx) return alert('Capture failed');

  // Draw current frame
  ctx.drawImage(videoEl, 0, 0, canvas.width, canvas.height);
  this.preview = canvas.toDataURL('image/jpeg', 0.9); // Show preview

  // Stop camera immediately after capture
  this.stream?.getTracks().forEach(track => track.stop());

  // Convert canvas to blob/file
  canvas.toBlob(blob => {
    if (!blob) return alert('Capture failed');
    const file = new File([blob], 'capture.jpg', { type: 'image/jpeg' });

    if (this.mode === 'register') {
      this.buttonText = 'Registering...';
      this.loginResult = null;

      this.faceService.uploadDriverFace(this.userId!, file).subscribe({
        next: (res: any) => {
          this.zone.run(() => {
            this.loginResult = res?.message || 'Face registration successful. Please login using your face.';
            this.buttonText = null;

            // Navigate after 1 second so user sees message
            setTimeout(() => this.router.navigate(['/login/Driver']), 1000);
          });
        },
        error: (err: any) => {
          this.zone.run(() => {
            this.loginResult = `Face registration failed: ${err?.error?.message || err.error || err.message}`;
            this.buttonText = null;
          });
        }
      });

    } else {
      this.buttonText = 'Logging in...';
      this.loginResult = null;

      this.faceService.loginWithFace(file).subscribe({
        next: (res: any) => {
          this.zone.run(() => {
            if (res.token) {
              this.loginResult = 'Face login successful';
              this.buttonText = null;

              this.authService.saveToken(res.token);
              this.authService.saveRole('Driver');

              setTimeout(() => this.router.navigate(['']), 1000);
            } else {
              this.loginResult = 'No matching face found';
              this.preview = null; 
              this.buttonText = null;
            }
          });
        },
        error: (err: any) => {
          this.zone.run(() => {
            console.error(err);
            this.loginResult = 'Face login failed';
            this.buttonText = null;
          });
        }
      });
    }
  }, 'image/jpeg', 0.9);
}


  ngOnDestroy() {
    this.stream?.getTracks().forEach(t => t.stop());
  }
}
