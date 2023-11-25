/*
 * Revision History:
 *
 *
 *    update mentor Code type from profile for partner       2019/08/13       Yogesh Chavan
 */

import * as $ from 'jquery'

import { Component, ElementRef, ViewChild } from '@angular/core'
import {
  IonContent,
  IonList,
  // List,
  NavController,
  ToastController,
} from '@ionic/angular'

import { Constants } from '../../../Utils/Constants'
import { ErrorPage } from '../../common/error/error'
import { File } from '@ionic-native/file/ngx'
import { LoadingController } from '@ionic/angular'
import { Questionnaire1Page } from '../questionnaire1/questionnaire1'
import { Questionnaire4Page } from '../../questionnaire/questionnaire4/questionnaire4'
import { Questionnaire6Page } from '../../questionnaire/questionnaire6/questionnaire6'
import { Questionnaire8Page } from '../questionnaire8/questionnaire8'
import { QuestionsInfo } from '../../../../app/models/QuestionsInfo'
import { Storage } from '@ionic/storage'

import { UserInfo } from '../../../../app/models/userInfo'
import { Utility } from './../../../Utils/Utility'
import { ModalController } from '@ionic/angular'
import { BusinessDetailsService } from '../../../services/business-details.service'
import { DemoService } from '../../../services/demo.service'
import { MentorService } from '../../../services/mentor.service'
import { UserProfileService } from '../../../services/user-profile.service'
import { ActivatedRoute } from '@angular/router'

//import { DemoProvider } from '../providers/demo/demo';

/**
 * Generated class for the Questionnaire5Page page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
declare function scrollToElm(val1: any, val2: any, val3: any): any
// @IonicPage()
@Component({
  selector: 'page-questionnaire5',
  templateUrl: 'questionnaire5.html',
  styleUrls: ['questionnaire5.scss']
})
export class Questionnaire5Page {
  userFirstName: any
  //Page Title
  pageTitle = 'Enroll as Partner'
  checkValidation: boolean = false
  items: string = ''
  searchTerm: string = ''
  notFocused: boolean = false
  itemName: any
  myClass: any
  inputVal: any
  userList: UserInfo[]
  mentorCode: string
  userId
  userType: string
  loading
  showSave: boolean = false
  knowledgeSource = ''
  disableSave: any
  noDataFound: any
  @ViewChild('scrollMe', { static: true }) scrollElement: ElementRef
  @ViewChild('Content', { static: true }) content: IonContent
  @ViewChild(IonList, { static: true }) list: IonList
  isInputgiven: boolean = false
  params
  constructor(
    public modalCtrl: ModalController,
    public demoService: DemoService,
    public navCtrl: NavController,
    public GetMentorService: MentorService,
    private route: ActivatedRoute,
    public business: BusinessDetailsService,
    public file: File,
    private storage: Storage,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    private profileProvider: UserProfileService
  ) {
    route.queryParams.subscribe((params: any) => {
      this.params = params
      this.userList = new Array<UserInfo>()
  
      this.myClass = 'hide'
      this.inputVal = params.inputVal
      console.log('input val', this.inputVal)
    })
  }

  async ionViewWillEnter() {
    this.disableSave = ''
    this.loading = await this.loadingCtrl.create({ cssClass: 'transparent' })
    this.storage.get('userInfo').then((val) => {
      this.userId = val.userId
    })

    this.loading = await this.loadingCtrl.create({ cssClass: 'transparent' })
    let fromPartnerPage = this.params.referer
    if (fromPartnerPage == 'PartnerPage') {
      this.showSave = true
    }

    this.knowledgeSource = this.params.data
  }

  /**
   * get the list of all the mentors from api based on text entered by user.
   */
  getMentorList() {
    
    this.checkValidation = false
    if (this.searchTerm.length > 2) {
      this.GetMentorService.getMentorList(this.searchTerm).subscribe(
        (res: any) => {
          if (res.json.message[0].type == 'SUCCESS') {
            let data = res.json.data
            console.log('list', data)
            this.userList = new Array<UserInfo>()
            for (let i = 0; i <= data.length - 1; i++) {
              let userinfoobj = new UserInfo()
              userinfoobj.firstName = data[i].firstName
              console.log('data', data[i])
              userinfoobj.lastName = data[i].lastName
              userinfoobj.ujbId = data[i].mentorCode
              if (data[i].base64_Image)
                userinfoobj.base64Image = Utility.getImageUrl(
                  data[i].base64_Image
                )
              userinfoobj.userId = data[i].userId
              if (data[i].address) {
                userinfoobj.locality = data[i].address.locality
              }
              userinfoobj.noOfConnects = data[i].noOfConnects

              console.log('obj', userinfoobj)
              this.userList.push(userinfoobj)
            }
            console.log('local list', this.userList)
            this.myClass = 'view'
            this.noDataFound = 'hide'

            $("div").scrollTop(0);
            this.content.scrollToPoint(0, 0, 950);
            window.scrollTo(0,0)
            let scrollContent: any = document.getElementById("listScroll");
            scrollContent.scrollToTop();
          } else if (res.json.message[0].type == 'INFO') {
            //let data = res.json.data
            // console.log("list", data)
            // this.userList = new Array<UserInfo>()
            // let userinfoobj = new UserInfo()
            //   userinfoobj.firstName = "No data found"
            //  // userinfoobj.lastName = ""
            //   //userinfoobj.locality = ""
            //  // userinfoobj.noOfConnects = ""
            //   //userinfoobj.base64Image=""
            //   this.userList.push(userinfoobj)
            this.userList = new Array<UserInfo>()
            this.noDataFound = 'view'
            this.myClass = 'view'
          } else {
            this.userList = new Array<UserInfo>()
            this.myClass = 'hide'
          }
          let box = <HTMLElement>document.querySelector('.box')
          let targetElm = <HTMLElement>document.querySelector('.boxChild')
          console.log('box inTs', box)
          console.log('boxChild inTs', targetElm)
          scrollToElm(box, targetElm, 600)
        },
        (err) => {
          this.userList = new Array<UserInfo>()

          this.myClass = 'hide'
        }
      )
    } else {
      this.userList = new Array<UserInfo>()
      this.mentorCode = ''
      this.myClass = 'hide'
    }
  }

  /**
   * closes the current page
   */
  goBack() {
    this.navCtrl.pop()
  }

  /**
   * goes to next page
   */
  async goToQuestionnaire6() {
    this.myClass = 'hide'
    this.checkValidation = true
    if (
      this.searchTerm == null ||
      this.searchTerm == undefined ||
      this.searchTerm == ''
    ) {
      this.isInputgiven = false
      this.myClass = 'hide'
    } else {
      // if(this.isInputgiven == true){
      this.disableSave = 'disabled'
      this.checkValidation = false
      this.isInputgiven = false
      Questionnaire1Page.questionnaireObj.mentorCode = this.mentorCode
      // // this.navCtrl.push(Questionnaire6Page, { "inputVal": this.inputVal });
      await this.navCtrl.navigateForward('Questionnaire8Page')
      // }
    }
  }

  /**
   * called when user selects and item from list of mentors
   * @param value selected object
   */
  onValueSelection(value) {
    this.isInputgiven = true
    console.log('item', value)
    this.searchTerm = value.firstName + ' ' + value.lastName
    this.mentorCode = value.ujbId

    this.myClass = 'hide'
  }

  saveMentor() {
    this.disableSave = 'disabled'
    let data = {
      userId: this.userId,
      type: 'KnowledgeSource',
      value: this.knowledgeSource,
    }
    this.loading.present()
    this.profileProvider.updatePartnerProfile(data).subscribe(
      (res: any) => {
        if (this.loading) this.loading.dismiss()
        this.updateMentorCode()
        //  this.navCtrl.pop()
      },
      (err) => {
        this.disableSave = ''
        if (this.loading) this.loading.dismiss()
        //// this.navCtrl.push(ErrorPage)
      }
    )
  }
  updateMentorCode() {
    let data = {
      userId: this.userId,
      type: 'MentorCode',
      value: this.mentorCode,
    }
    this.loading.present()
    this.profileProvider.updatePartnerProfile(data).subscribe(
      (res: any) => {
        if (this.loading) this.loading.dismiss()
        Utility.showToast(
          this.toastCtrl,
          'Knowledge source and mentor updated successfully',
          false,
          '',
          false
        )
        setTimeout(() => {
          // TODO
          // for (let i = 0; i < this.navCtrl.getViews().length; i++) {
          //   if (
          //     this.navCtrl.getViews()[i].instance instanceof Questionnaire5Page
          //   ) {
          //     this.navCtrl.removeView(this.navCtrl.getViews()[i])
          //   }
          //   if (
          //     this.navCtrl.getViews()[i].instance instanceof Questionnaire4Page
          //   ) {
          //     this.navCtrl.removeView(this.navCtrl.getViews()[i])
          //   }
          // }
          this.disableSave = ''
        }, Constants.toastTimeOut)
      },
      (err) => {
        this.disableSave = ''
        if (this.loading) this.loading.dismiss()
        //// this.navCtrl.push(ErrorPage)
      }
    )
  }

  scrollToBottom() {
    /* setTimeout( ()=> {
      this.scrollElement.nativeElement.scrollTop = this.scrollElement.nativeElement.scrollHeight;
    }, 50); */
  }
}
