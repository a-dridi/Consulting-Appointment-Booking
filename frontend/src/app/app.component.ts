import { Component } from '@angular/core';
import { AppointmentService } from './appointment.service';
import { AdminDataSharingService } from './admindatasharingservice';
import { Router } from '@angular/router';
import { UiText } from './uiText.model';
import { Language } from './language.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'consultingappointmentbooking';
  adminLoggedIn: Boolean = false;

  public uiString: Map<String, String> = new Map<String, String>();
  public static uiStringFinal: Map<String, String>;
  public languages: Language[] = [
    { code: "en", languagename: "English" },
    { code: "de", languagename: "Deutsch" },
    { code: "fr", languagename: "Français" },
    { code: "es", languagename: "Español" },
    { code: "pl", languagename: "polski" },
    { code: "pt", languagename: "Português" },
    { code: "ru", languagename: "русский" },
    { code: "ja", languagename: "日本語" },
    { code: "ko", languagename: "한국어" },
    { code: "th", languagename: "ไทย" },
    { code: "zh", languagename: "中文" }
  ];
  userSelectedLanguageValue: Language = { code: "en", languagename: "English" };

  constructor(private adminDataSharingService: AdminDataSharingService, private appointmentService: AppointmentService, private router: Router) {
    //Check language of user os and load it
    this.loadUserLanguage();

    // console.log("selected " + this.selectedLanguage.languagename)
    //LOAD admin toolbar links if admin is authenticated
    appointmentService.checkAdminAuthentication()
      .subscribe(
        data => {
          this.adminLoggedIn = true;
        },
        error => {
          this.adminLoggedIn = false;
        }
      )
    this.adminDataSharingService.adminLoggedIn.subscribe(value => {
      this.adminLoggedIn = value;
    });
  }

  showAdminAgentPage() {
    this.appointmentService.checkAdminAuthentication()
      .subscribe(
        data => {
          this.router.navigate(['/admin']);
        },
        error => {
          this.router.navigate(['/admin-login']);
        }
      )
  }

  /**
   * Load the language that is used on users os. If a language was selected from the language combobox, then load the selected language
   */
  loadUserLanguage() {
    let userSelectedLanguage = sessionStorage.getItem("appX283ndSelectedLanguage");

    //Language was not selected - not saved in session storage
    if (userSelectedLanguage === null) {
      let userLanguage = navigator.language;
      //User language cannot be queried or is not available in this app
      if (userLanguage === undefined || userLanguage === "" || this.languages[userLanguage] === undefined) {
        this.userSelectedLanguageValue = { code: "en", languagename: "English" };
      } else {
        this.userSelectedLanguageValue = this.languages[userLanguage];
      }
      this.loadUiText(userLanguage);

    } else {
      //load selected anguage saved in session storage
      let selectedIndex = this.languages.findIndex(lang => lang.code == userSelectedLanguage)
      this.userSelectedLanguageValue = this.languages[selectedIndex];
      this.loadUiText(this.userSelectedLanguageValue.code);
    }

  }

  onLanguageSelected(event) {
    let newSelectedLanguage = event;

    let selectedIndex = this.languages.findIndex(lang => lang.code == newSelectedLanguage)

    this.userSelectedLanguageValue = { code: ""+this.languages[selectedIndex].code, languagename: ""+this.languages[selectedIndex].languagename } ;
    this.loadUiText(newSelectedLanguage);
    sessionStorage.removeItem("appX283ndSelectedLanguage");
    sessionStorage.setItem("appX283ndSelectedLanguage", "" + newSelectedLanguage);
    window.location.reload();
  }

  loadUiText(languageCode: String) {
    let createUiString: Map<String, String> = new Map<String, String>();
    this.appointmentService.
      getUiTextTranslationforLanguage(languageCode)
      .subscribe((data: UiText[]) => {
        data.forEach(function (dataItem) {
          createUiString.set(dataItem.code, dataItem.translation);
        })
      });

    this.uiString = createUiString;
    AppComponent.uiStringFinal = createUiString;
  }


}
