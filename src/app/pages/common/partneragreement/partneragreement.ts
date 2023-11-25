import { Component, ViewChild, ElementRef } from '@angular/core'
import {
  
  NavController,
  LoadingController,
  ToastController,
} from '@ionic/angular'
import { ModalController } from '@ionic/angular'
import { Constants } from '../../../Utils/Constants'
import { Storage } from '@ionic/storage'
import { DashboardPage } from '../../dashboard/dashboard'
import { Utility } from '../../../Utils/Utility'

import { DomSanitizer } from '@angular/platform-browser'
import { RegistrationService } from '../../../services/registration.service'
import { ActivatedRoute } from '@angular/router'

//import * as PDFJS from "pdfjs-dist/webpack.js";
//import { PdfViewerModule } from 'ng2-pdf-viewer';

/**
 * Generated class for the PartneragreementPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
// @IonicPage()
@Component({
  selector: 'page-partneragreement',
  templateUrl: 'partneragreement.html',
  styleUrls:['partneragreement.scss']
})
export class PartneragreementPage {
  role
  loading
  userId
  url: any
  disableAccept: boolean = true
  listed = ''
  type = ''
  userInfo
  showBusinessAdd: boolean = false
  showAdd: boolean = false
  /* pdfDocument: PDFJS.PDFDocumentProxy;
    PDFJSViewer = PDFJS;
    pageContainerUnique = {
        width: 0 as number,
        height: 0 as number,
        element: null as HTMLElement,
        canvas: null as HTMLCanvasElement,
        textContainer: null as HTMLElement,
        canvasWrapper: null as HTMLElement
    }
    @ViewChild('pageContainer') pageContainerRef: ElementRef;
    @ViewChild('viewer') viewerRef: ElementRef;
    @ViewChild('canvas') canvasRef: ElementRef;
    @ViewChild('canvasWrapper') canvasWrapperRef: ElementRef;
    @ViewChild('textContainer') textContainerRef: ElementRef; */
  address
  businessAddress
  name
  constructor(
    private storage: Storage,
    public modalCtrl: ModalController,
    public toastCtrl: ToastController,
    public registrationService: RegistrationService,
    public loadingCtrl: LoadingController,
    private navCtrl: NavController,
    private route: ActivatedRoute,
    // public appCtrl: App,
    private sanitizer: DomSanitizer
  ) {
    //this.url = this.sanitizer.bypassSecurityTrustResourceUrl('https://www.amu.ac.in/pdf/FreeResources.pdf');
    ////this.url = this.sanitizer.bypassSecurityTrustResourceUrl('http://docs.google.com/gview?embedded=true&url=' + encodeURI(navParams.get("url")));
    //this.url = this.sanitizer.bypassSecurityTrustResourceUrl(navParams.get("url"));

    route.queryParams.subscribe((params: any) => {
      this.role = params.role
      this.type = params.type
      this.userInfo = params.userInfo
      this.name = this.userInfo.firstName + ' ' + this.userInfo.lastName
      this.address =
        this.userInfo.address.location +
        ',' +
        this.userInfo.address.flatWing +
        ',' +
        this.userInfo.address.locality
      console.log('addrs', this.address)
  
      console.log('userifo in partner aggremnt', this.userInfo)
      if (this.type == 'Listed') {
        this.listed = 'Listed'
      }
  
      this.storage.get('userInfo').then((val) => {
        this.userId = val.userId
      })
      
    })

  }

  ionViewDidEnter() {

  }

  async Accept() {
    let request = {
      userId: this.userId,
      statusId: true,
      updatedBy: this.userId,
    }
    this.loading = await this.loadingCtrl.create({ cssClass: 'transparent' })
    this.loading.present()
    this.registrationService.acceptAgreement(request, this.type).subscribe(
      async (data) => {
        if (this.loading) this.loading.dismiss()
        console.log('res in ts', data)
        if (data != null) {
          if (data.status == 200) {
            Utility.showToast(
              this.toastCtrl,
              Constants.agreementAccepted,
              false,
              '',
              false
            )
            await this.navCtrl.navigateRoot('DashboardPage')
          }
        }
      },
      (err) => {
        console.log(err)
        if (this.loading) this.loading.dismiss()
        Utility.showToast(
          this.toastCtrl,
          Constants.someErrorOccurred,
          false,
          '',
          true
        )
      }
    )
  }

  async notNow() {
    await this.navCtrl.navigateRoot('DashboardPage')
  }

  onPdfLoaded(src) {
    if (document) {
      if (document.getElementById('myFrame')) {
        document
          .getElementById('myFrame')
          .addEventListener('load', function (e) {
            document.getElementById('loader').style.display = 'none'
            document.getElementById('acceptBtn').removeAttribute('disabled')
          })
      }
    }
  }

  /* ngOnInit() {
    this.pageContainerUnique.element = this.pageContainerRef.nativeElement as HTMLElement;
    this.pageContainerUnique.canvasWrapper = this.canvasWrapperRef.nativeElement as HTMLCanvasElement;
    this.pageContainerUnique.canvas = this.canvasRef.nativeElement as HTMLCanvasElement;
    this.pageContainerUnique.textContainer = this.textContainerRef.nativeElement as HTMLCanvasElement;
    this.loadPdf(encodeURI(this.navParams.get("url")));
}

loadPdf(pdfPath: string): Promise<boolean> {

  return this.PDFJSViewer.getDocument(pdfPath)
      .then(pdf => {
          this.pdfDocument = pdf;
          console.log("pdf loaded:"); console.dir(this.pdfDocument);
          return this.loadPage(1);
      }).then((pdfPage) => {
          console.dir(pdfPage);
      }).catch(e => {
          console.error(e);
          return false;
      });
}

loadPage(pageNum: number = 1) {
  let pdfPage: PDFPageProxy;

  return this.pdfDocument.getPage(pageNum).then(thisPage => {
      pdfPage = thisPage;
      return this.renderOnePage(pdfPage);
  }).then(() => {
      return pdfPage;
  });

} // loadpage()

async renderOnePage(pdfPage: PDFPageProxy) {

  let textContainer: HTMLElement;
  let canvas: HTMLCanvasElement;
  let wrapper: HTMLElement;

  let canvasContext: CanvasRenderingContext2D;
  let page: HTMLElement

  page = this.pageContainerUnique.element;
  textContainer = this.pageContainerUnique.textContainer;
  canvas = this.pageContainerUnique.canvas;
  wrapper = this.pageContainerUnique.canvasWrapper;

  canvasContext = canvas.getContext('2d') as CanvasRenderingContext2D;
  canvasContext.imageSmoothingEnabled = false;
  //canvasContext.webkitImageSmoothingEnabled = false;
  //canvasContext.mozImageSmoothingEnabled = false;
  //canvasContext.oImageSmoothingEnabled = false;

  let viewport = pdfPage.getViewport(1) as PDFPageViewport;

  canvas.width = viewport.width;
  canvas.height = viewport.height;
  page.style.width = `${viewport.width}px`;
  page.style.height = `${viewport.height}px`;
  wrapper.style.width = `${viewport.width}px`;
  wrapper.style.height = `${viewport.height}px`;
  textContainer.style.width = `${viewport.width}px`;
  textContainer.style.height = `${viewport.height}px`;

  //fix for 4K


  if (window.devicePixelRatio > 1) {
      let canvasWidth = canvas.width;
      let canvasHeight = canvas.height;

      canvas.width = canvasWidth * window.devicePixelRatio;
      canvas.height = canvasHeight * window.devicePixelRatio;
      canvas.style.width = canvasWidth + "px";
      canvas.style.height = canvasHeight + "px";

      canvasContext.scale(window.devicePixelRatio, window.devicePixelRatio);
  }

  // THIS RENDERS THE PAGE !!!!!!


  let renderTask: PDFRenderTask = pdfPage.render({
      canvasContext,
      viewport
  });

  let container = textContainer;

  return renderTask.then(() => {
      //console.error("I WORK JUST UNTIL HERE");


      return pdfPage.getTextContent();

  }).then((textContent) => {

      let textLayer: HTMLElement;


      textLayer = this.pageContainerUnique.textContainer


      while (textLayer.lastChild) {
          textLayer.removeChild(textLayer.lastChild);
      }

      this.PDFJSViewer.renderTextLayer({
          textContent,
          container,
          viewport,
          textDivs: []
      });

      return true;
  });
}
 */
}
