import { Component, OnInit, Inject, ViewChild, OnDestroy, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { PokemonGroup, Testeditems, loaditems, loadkeys, Pokemon } from './app-name/item';
import { UserdataService, Item } from './service/userdata.service';
import { CdkPortal, } from '@angular/cdk/portal';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms'
import { AngularFireAuth } from '@angular/fire/auth';
import { Subscription } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';
import { doc } from 'rxfire/firestore';
import { Observable } from 'rxjs';
import { MatSidenav } from '@angular/material/sidenav';
import { BehaviorSubject } from 'rxjs';
import { switchMap, filter, map, take, tap, withLatestFrom, startWith, first } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'apitester';
  todo1: loaditems[] = [];
  selectFirstPage = new FormControl();
  newtcheader = new FormControl('', Validators.required);
  detailsdisplay = new FormControl('Click Now');

  saveditemforedit: loaditems;
  newitemforedit: loaditems;
  showedit = false;
  loggedin: string = undefined;
  headingtext = 'TextArea';
  checklength: string[] = [];
  allListKeysList: string[] = [];
  MainSectionList: string[] = [];
  SubSectionList: string[] = [];
  programkeys: string[] = [
    'Components',
    'CDK',
    'rxFire',
    'ReactiveForms',
    'HTML',
    'CSS',
    'Font Awesome',
    'Share Icons',
    'Flex Layout',
    'Angular'
  ];

  pokemonGroups: PokemonGroup[] = [];
  tutorials: any;
  subquery;
  @ViewChild(CdkPortal)
  portal: CdkPortal;
  selectedGroupval: string = 'Main Section';
  selectedVal: string;

  somedata: loaditems[] = [];
  mysubject$;
  myarray: loaditems[] = [];
  
  myarrayload: PokemonGroup[] = [];
  newpokearray: Pokemon[] = [];
  myshirts: Observable<any>;
  items$: Observable<any[]>;
  userid: string = '';
  @ViewChild('drawer') public sidenav: MatSidenav;
  checkvisibilityGroup= this.fb.group({
    checkedenable: ['2']
  });

  projectName = this.fb.group({
    editProject: [{ value: '', disabled: false }, Validators.required]
  });
  homePublicProj = this.fb.group({
    homePublicProjAutocomplete: [{ value: '', disabled: false }, Validators.required]
  });
  dbSelectionSec = this.fb.group({
    SecList: [{ value: '', disabled: false }, Validators.required]
  });

  dbSelectionSubSec = this.fb.group({
    SubSecList: [{ value: '', disabled: false }, Validators.required]
  });
  MainList = '';
  SecList = '';
  SubList = '';
  addProjectdisabled = true;

  addSectionDisabled = true;
  addsectionDelete = false
  addSubDisabled = true;
  addSubDelete = false;
  selectedmainproj = '';
  labelPosition: 'true' | 'false' = 'true';
  myarraydisplay = [];
  myitemsdisplay: Observable<any>;
  myitemsdisplaycoll: Observable<any>;
  mytodo: BehaviorSubject<any[]>;

  showDeleteProject = false;

  showAddMainsec = false;
  showDeleteMainsec = false;
  showEditMainsec = false;
  showAddSubSec = false;
  showDeleteSubSec = false;
  showEditSubSec = false;

  validMember = false;
  ValidMemberEndDate = new Date();
  selectedProjFirsttab = '';
  changebuttonoff: boolean = undefined;
  selectedmemend: Date = new Date();
  selectedmemtype = '';
  gotopaymentspage = false;
  savedisabledval = false;
  showlflag = false;
  MainKeysread: [] = [];
  MainSecEnableFlag = '';
  shownewproject = false;
  showcurrentproj = false;
  private authStatusSub: BehaviorSubject<boolean> = new BehaviorSubject(false);
  currentAuthStatus = this.authStatusSub.asObservable();
  savedlocation = '';
  filteredOptions: Observable<Testeditems[]>;
  loggedinstatus: Observable<boolean>;
  ShowMessage = 'ShowSpinner';
  ShowMessageloading = 'Log in';
  dialogRef;
  displaydata: Observable<string[]>;
  loadUserloadSelectkeys: Observable<string>;
  loadTcFromSelectkeys: Observable<string>;
  pokemonGroupsObs: Observable<PokemonGroup[]>;
  CurrentUserType = 'Demo';
  CurrentUserProject = 'Demo';
  mysubfirst: Subscription;
  mysubSec: Subscription;
  publicProject: Observable<string[]>;
  publicProjectEdit: string[]=[];

  userSelectedproject = '';
  publicprojectsList: string[] = [];
  publicprojectsListforEdit: string[] = [];
  titleDialogRef: MatDialogRef<DialogAStartSpinner>
  userDisplayName = '';
  selectedprojectkeys: any[];
  submenuSub:Subscription;
  mainmenuSub:Subscription;
  projselSub:Subscription;
  newprojselSub:Subscription;
  authstartSub:Subscription;
  mainpagekeySub:Subscription;
  filteredProjList: Observable<string[]>;
  showvisibility:boolean= undefined;
  constructor(private tutorialService: UserdataService,

    private db: AngularFirestore,
    public afAuth: AngularFireAuth,
    public dialog: MatDialog,
    public cd: ChangeDetectorRef,
    public fb: FormBuilder
  ) {//setup Auth and Query Observables
    this.authstartSub= this.afAuth.authState.pipe(
      switchMap((credential: any) => {
        if (credential !== null) {
          
          this.loggedin = 'true';
          this.userid = credential.uid;
          this.userDisplayName = credential.displayName;
          console.log('281-loggedin',this.loggedin,'-userid', this.userid,'-userDisplayName',this.userDisplayName);
          return doc(this.db.firestore.doc('myProfile/' + this.userid)).pipe(take(1),
            map((userdetails: any) => {
              if (userdetails.data() === undefined) {
                this.CurrentUserType = 'Demo';
                this.CurrentUserProject = 'Demo';
                this.startDemoUser();
                this.loadkeysfromDb('/keysList/' + this.userid + '/keys' + '/Demo');                
              } else {
                this.selectedmemend= userdetails.data().MembershipEnd;
                if (new Date(userdetails.data().MembershipEnd).valueOf() < new Date().valueOf()) {
                  if (userdetails.data().MembershipType === 'Demo') {
                    this.CurrentUserType = 'Demo';
                    this.CurrentUserProject = 'Demo';
                    this.gotopaymentspage = true;
                    this.loadkeysfromDb('/keysList/' + this.userid + '/keys' + '/Demo');
                  } else {
                    this.CurrentUserType = 'Demo';
                    this.CurrentUserProject = 'Demo';
                    this.startDemoUser();
                    this.loadkeysfromDb('/keysList/' + this.userid + '/keys' + '/Demo');
                  }
                } else {
                if (userdetails.data().MembershipType === 'Demo') {
                  this.CurrentUserType = 'Demo';
                  this.CurrentUserProject = 'Demo';
                  this.loadkeysfromDb('/keysList/' + this.userid + '/keys' + '/Demo');
                } else {
                  this.validMember = true;
                  this.CurrentUserType = userdetails.data().MembershipType;
                  this.CurrentUserProject = userdetails.data().selection;
                }
                }
              }
              return 'true';
            })
          );

        } else {
          this.loggedin= 'false';
          this.titleDialogRef.close();
          this.openDialog('loggedout');
          return 'false';
        }
      })
    ).subscribe(mydata => {
      if (mydata === 'true') {
        doc(this.db.firestore.doc('keysList/'+ this.userid)).pipe(take(1)).subscribe(val=>{
          if(val.data() !== null){
            this.publicProjectEdit= val.data().AllList;
            this.dbSelectionSec.disable();
            this.dbSelectionSubSec.disable();       
            this.checkvisibilityGroup.disable();       
          }          
        });
        this.titleDialogRef.close();

      }
    });
  }

  get checkedenable() {return this.checkvisibilityGroup.get('checkedenable')}; 

  openDialog(status: string): void {
    this.titleDialogRef = this.dialog.open(DialogAStartSpinner, {
      data: status
    });

    this.titleDialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  loadkeysfromDb(selectedproj: string) {
    this.pokemonGroupsObs = doc(this.db.firestore.doc(selectedproj)).pipe(take(1),
      map((values: any) => {
        this.pokemonGroups = [];
        for (const allmainlist in values.data()) {
          const myval = values.data();
          myval[allmainlist].forEach(singlesublist => {
            for (const mission in singlesublist) {
              this.newpokearray.push({ value: mission, viewValue: mission });
              this.savedisabledval = singlesublist[mission];
            }
            this.pokemonGroups.push({
              name: allmainlist,
              disabled: this.savedisabledval,
              pokemon: this.newpokearray
            });
            this.newpokearray = [];
          });
          
        }
        return this.pokemonGroups;
      }));
  }
  startDemoUser() {

  }

  loadTestCase(locationlocal) {
    
  }


  ngOnDestroy() {
    this.submenuSub.unsubscribe();
    this.mainmenuSub.unsubscribe();
    this.projselSub.unsubscribe();
    this.newprojselSub.unsubscribe();
    this.authstartSub.unsubscribe();
  }
  ngOnInit(): void {
    this.openDialog('loggingin');
  }
  componentLogout() {
    this.ShowMessage = 'Logged out';
    this.sidenav.close();
    this.tutorialService.logout();
  }
  DelSection() {

  }
  MainSection() {

  }
  DelMainSection() {

  }
  SubSection() {

  }
  DeleteSubSection() {
  }
  drawerclose() {
    this.sidenav.close();
  }
  draweropen() {

  }

  Delete() {
    
  }
  openedit() {
 
  }
 
 
  exitTC() {// User Adds a New Testitem after selecting the main list and cancels operation
    this.showedit = false;
  }
}

@Component({
  selector: 'dialog-overview-example-dialog',
  template: `
  <!--{{userProfile.value | json}}-->
  <h1 mat-dialog-title>Edit TestCase</h1>
  <div mat-dialog-content>


  <form [formGroup]="userProfile" fxLayout="row wrap" fxLayoutAlign="center center">
    <mat-form-field appearance="fill" floatLabel="floatLabelControl.value" fxFlex="75vw">
      <mat-label>Give Description</mat-label>
      <input matInput placeholder="Enter Description" formControlName = "description">
    </mat-form-field>

    <mat-form-field appearance="fill" floatLabel="floatLabelControl.value" fxFlex="75vw">
      <mat-label>Update in Stackblitz</mat-label>
      <input matInput placeholder="Stackblitz github link" formControlName = "linkstackblitz">
    </mat-form-field>

    <mat-form-field appearance="fill" floatLabel="floatLabelControl.value" fxFlex="75vw">
      <mat-label>Give More Information</mat-label>
      <textarea 
        matInput 
        placeholder="Explain More here" 
        formControlName = "details"
        cdkTextareaAutosize
        cdkAutosizeMinRows="30"
        cdkAutosizeMaxRows="70" 
        ></textarea>
    </mat-form-field>
  </form>
  
</div>
<div mat-dialog-actions>
  <button mat-button mat-raised-button color="warn" (click)="onNoClick()" cdkFocusInitial >Cancel</button>
  <button mat-button mat-raised-button color="primary" [mat-dialog-close]="userProfile.value"  [disabled]="userProfile.pristine">Update</button>
</div> `
})
export class DialogOverviewExampleDialog implements OnInit {
  userProfile: FormGroup;
  constructor(
    public dialogRef: MatDialogRef<DialogOverviewExampleDialog>,
    @Inject(MAT_DIALOG_DATA) public data: loaditems,
    private fb: FormBuilder) { }

  onNoClick(): void {
    this.dialogRef.close(null);
  }

  ngOnInit() {
    this.userProfile = this.fb.group({
      value: [this.data.value],
      disabled: [this.data.disabled],
      description: [this.data.description],
      linkstackblitz: [this.data.linkstackblitz],
      name: [this.data.name],
      details: [this.data.details],
      viewvalue: [this.data.viewValue],
      testitem: [this.data.testitem]
    });
  }
}


@Component({
  selector: 'dialog-overview-example-dialog',
  template: `
    <div *ngIf="data === 'loggedout'" >
    <div fxLayout="column" fxLayoutAlign="space-around center">
    <h1> Testing Tool </h1>
    <h1>  Create New TestCases </h1>
    <h1>  Browse different Public projects </h1>
    </div>
    <div fxLayout="row " fxLayoutAlign="space-around center">
      <mat-chip-list>
      <mat-chip  style="font-size:2em;" >Login now:</mat-chip>
      </mat-chip-list>
      <button mat-raised-button color="primary" (click)="tutorialService.login()"> Google login</button>
    </div>
    </div>
    <mat-spinner  *ngIf="data !== 'loggedout'"></mat-spinner>
  `
})
export class DialogAStartSpinner {
  mydata = 'showspinner';
  constructor(
    public dialogRef: MatDialogRef<DialogAStartSpinner>,
    @Inject(MAT_DIALOG_DATA) public data: string, public tutorialService: UserdataService) {

  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}