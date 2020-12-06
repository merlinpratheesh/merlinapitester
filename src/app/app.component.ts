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

  showEditProject = false;
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
  pokemonGroupsObsStart: PokemonGroup[] = [
    {
      disabled: false,
      name: 'Main Section',
      pokemon: [
        {
          value: 'HomeSection',
          viewValue: 'StartTC'
        }]
    }];
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
    this.submenuSub= this.dbSelectionSubSec.valueChanges.subscribe(selectedsubsec => {
      this.checklength = this.SubSectionList.filter(item => item.toLowerCase() === (selectedsubsec.SubSecList.toLowerCase()));
      if (this.checklength.length === 0) {//UNIQUE
        this.showAddSubSec = true;
        this.showDeleteSubSec = false;
      } else {
        this.showAddSubSec = false;
        this.showDeleteSubSec = true;
      }
    });

    //here user will serach for the project and if project is found no buttons are highlighted.
    this.mainmenuSub = this.dbSelectionSec.valueChanges.subscribe(selectedsection => {
      if(selectedsection.SecList !== ''){  //IMP learning
        console.log('186',selectedsection,selectedsection.SecList);
        this.checklength = this.MainSectionList.filter(item => item.toLowerCase() === (selectedsection.SecList.toLowerCase()));
        if (this.checklength.length === 0) {//UNIQUE
          this.showAddMainsec = true;
          this.showDeleteMainsec = false;
          this.SubSectionList = [];
          this.checkedenable.setValue('2');
          console.log('reachedafyetuserchange');
          this.showvisibility=true;
          if (this.dbSelectionSubSec.valid) {
            this.dbSelectionSubSec.reset({SubSecList:''});
          }
          this.dbSelectionSubSec.disable();

        } else {
          this.dbSelectionSubSec.enable();
          this.checkvisibilityGroup.enable();
          /*if(this.dbSelectionSubSec.enabled ){
            if (this.dbSelectionSubSec.valid) {
              this.dbSelectionSubSec.reset({SubSecList:''});
            }
          }else{
            this.dbSelectionSubSec.enable();
          }*/
          this.showvisibility=false;
          this.SubSectionList = [];
          this.showAddMainsec = false;
          this.showDeleteMainsec = true;
          this.selectedprojectkeys[selectedsection.SecList].forEach(singlesublist => {
            for (const mission in singlesublist) {
              this.SubSectionList.push(mission);
              this.savedisabledval = singlesublist[mission];
            }
          });

        }
      }
    });

    this.projselSub= this.projectName.valueChanges.pipe(
      switchMap((userselection: any) => {
        return doc(this.db.firestore.doc('keys/' + userselection.editProject)).pipe(take(1),
          map((values: any) => {
            console.log('data',values.data());
              this.MainSectionList = [];
              this.SubSectionList = [];
              console.log('236',this.dbSelectionSec.enabled,this.dbSelectionSubSec.enabled );

                this.dbSelectionSec.reset({SecList:''});


                this.dbSelectionSubSec.reset({SubSecList:''});


                this.checkvisibilityGroup.reset({checkedenable:'2'});                

              this.checkvisibilityGroup.disable();
              this.showAddMainsec = false;
              this.showDeleteMainsec = false;
              this.dbSelectionSec.enable();
              
              this.selectedprojectkeys = values.data();
              for (const allmainlist in values.data()) {
                this.MainSectionList.push(allmainlist);
                this.selectedprojectkeys[allmainlist].forEach(singlesublist => {
                  for (const mission in singlesublist) {
                    this.SubSectionList.push(mission);
                    this.savedisabledval = singlesublist[mission];
                  }
                });
                if(this.savedisabledval === true){
                  this.checkedenable.setValue('1');
                }else{
                  this.checkedenable.setValue('2');
                }
              }
              this.showDeleteProject = true;
            return values.data();
          }));
      })).subscribe(some => {

      });
      this.newprojselSub= this.homePublicProj.valueChanges.subscribe(userselection => {
      if (userselection && userselection.homePublicProjAutocomplete !== null) {
        this.userSelectedproject = userselection.homePublicProjAutocomplete;
        console.log('235',this.userSelectedproject);
        this.checklength = this.publicprojectsList.filter(item => item.toLowerCase() === (this.userSelectedproject.toLowerCase()));
        if (this.checklength.length === 0) {//UNIQUE
          if (this.CurrentUserType === 'Demo') {
            this.shownewproject = false;
            this.showcurrentproj = false;
          } else {
            this.shownewproject = true;
            this.showcurrentproj = false;
          }
        } else {
          if (this.CurrentUserType === 'Demo') {
            this.shownewproject = false;
            this.showcurrentproj = true;
          } else {
            this.shownewproject = false;
            this.showcurrentproj = true;
          }
        }
      }
    });

    this.authstartSub= this.afAuth.authState.pipe(
      switchMap((credential: any) => {
        if (credential !== null) {
          this.publicProject = this.homePublicProj.valueChanges.pipe(
            startWith({homePublicProjAutocomplete:''}),
            switchMap((some:any)=>{
              console.log('some',some);
              return doc(this.db.firestore.doc('keysList/listid')).pipe(
                map((val:any)=>{
                  console.log(val.data());
                  this.publicprojectsList =val.data().AllList;
                  this.publicprojectsList = this.publicprojectsList.filter(item => item !== this.CurrentUserProject);
                  this.publicprojectsList = this.publicprojectsList.filter((option => option.toLowerCase().includes(some.homePublicProjAutocomplete.toLowerCase())));
                  console.log(this.publicprojectsList);
                  return this.publicprojectsList;
                }))
            }));

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
                  if (this.CurrentUserProject === 'Demo') {//Member cannot have a public project with name 'Demo'
                    this.loadkeysfromDb('/keysList/' + this.userid + '/keys' + '/Demo');//alsocheckthisconditionfor member edit/create/delete-Tc
                  } else {
                    this.loadkeysfromDb('keys/' + userdetails.data().selection);
                  }

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

    this.mainpagekeySub = this.selectFirstPage.valueChanges.subscribe(userselection => {
      if(userselection !== null){
        console.log(this.userid, this.CurrentUserType, this.CurrentUserProject);
        console.log(userselection.value, userselection.groupValue);
        //return('display keys');
        this.selectedGroupval = userselection.groupValue;
        this.selectedVal = userselection.value;
        if (userselection !== null) {
          if (this.CurrentUserProject === 'Demo') {
            this.loadTestCase('keysList/' + this.userid + '/' + this.CurrentUserProject + '/' + userselection.groupValue + '/items/' + userselection.value);
          } else {
            console.log(this.CurrentUserProject + '/' + userselection.groupValue + '/items/' + userselection.value, '255');
            this.loadTestCase(this.CurrentUserProject + '/' + userselection.groupValue + '/items/' + userselection.value);
          }
          return ('display keys-Load Tc from Db-Display First Listed Tc Details for the user');
        }              
      }
    });
  }
  updatevisibility(){

    if(this.checkvisibilityGroup.controls['checkedenable'].value === '1'){
      console.log('Enabled');
    }else{
      console.log('Disabled');
    }

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
    const nextMonth: Date = new Date();
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    const newItem: Item = {
      MembershipEnd: nextMonth.toDateString(),
      MembershipType: 'Demo',
      selection: 'Demo'
    };
    this.db.doc<Item>('myProfile/' + this.userid).set(newItem);
    this.db.collection('keysList/' + this.userid + '/keys').doc(newItem.selection).set({ MainSection: [{ SubSection: false }] });
  }

  loadTestCase(locationlocal) {
    this.filteredOptions = doc(this.db.firestore.doc(locationlocal)).pipe(
      map((tctoshow: any) => {
        this.myarray = [];
        if (tctoshow.data() === undefined) {
          //this.filteredOptions = this.myarray;
          this.headingtext = 'TextArea Empty';
          this.detailsdisplay.setValue('Add NewSection');
          return this.myarray;
        } else {
          this.myarray = tctoshow.data().item;
          //this.filteredOptions = this.myarray;
          if (this.myarray.length !== 0) {
            this.detailsdisplay.setValue(this.myarray[0].details);
            this.headingtext = this.myarray[0].testitem;
            this.saveditemforedit = this.myarray[0];
          }
          return this.myarray;
        }
      }));
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
  refreshList(item) {//When user Selects testitem by doubleclick
    this.saveditemforedit = item;
    this.headingtext = `${item.testitem}`;
    this.detailsdisplay.setValue(`${item.details}`);//show the selected item details
  }
  Delete() {
    if (this.CurrentUserProject === 'Demo') {
      this.savedlocation = 'keysList/' + this.userid + '/' + this.CurrentUserProject + '/' + this.selectedGroupval + '/items/' + this.selectedVal;

    } else {
      this.savedlocation = this.CurrentUserProject + '/' + this.selectedGroupval + '/items/' + this.selectedVal;
    }

    if (this.CurrentUserProject === 'Demo' || this.validMember === true) {
      this.tutorialService.delete(this.savedlocation, this.saveditemforedit).then(success => {

        if (this.myarray.length !== 0) {
          this.detailsdisplay.setValue(this.myarray[0].details);
          this.headingtext = this.myarray[0].testitem;
          this.saveditemforedit = this.myarray[0];
        }
        else {
          this.headingtext = 'TextArea Empty';
          this.detailsdisplay.setValue('Add NewSection');
        }
      });

    } else {
      alert('Only Member can Delete public projects');
    }
  }
  openedit() {
    const locationlocal = this.CurrentUserProject + '/' + this.selectedGroupval + '/items/' + this.selectedVal;
    const locationlocaldemo = 'keysList/' + this.userid + '/' + this.CurrentUserProject + '/' + this.selectedGroupval + '/items/' + this.selectedVal;
    if (this.CurrentUserProject === 'Demo' || this.validMember === true) {
      const dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
        width: '80vw',
        data: this.saveditemforedit,
        disableClose: true
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result !== null) {
          const updateObject = { ...result };
          if (this.CurrentUserProject === 'Demo'){
            this.tutorialService.update(locationlocaldemo, updateObject, this.saveditemforedit).then(success => {
              this.detailsdisplay.setValue(updateObject.details);
              this.headingtext = updateObject.testitem;
              this.saveditemforedit.description = updateObject.description;
              this.saveditemforedit.details = updateObject.details;
              this.saveditemforedit.linkstackblitz = updateObject.linkstackblitz;
            });
          }else{
            this.tutorialService.update(locationlocal, updateObject, this.saveditemforedit).then(success => {
              this.detailsdisplay.setValue(updateObject.details);
              this.headingtext = updateObject.testitem;
              this.saveditemforedit.description = updateObject.description;
              this.saveditemforedit.details = updateObject.details;
              this.saveditemforedit.linkstackblitz = updateObject.linkstackblitz;
            });
          }
          
        }
      });
    } else {
      alert('Only Member can Edit public projects');
    }
  }
  AddNew() {// User Adds a New Testitem after selecting the main list
    if (this.myarray.length < 25) {
      if (this.CurrentUserProject === 'Demo' || this.validMember === true)
      {
      this.showedit = true;
      }else{
        alert('Only Member can Add to public projects');
      }

    } else {
      alert('Reached Maximum Testcase');
    }


  }
  saveTC() {
    const locationlocal = this.CurrentUserProject + '/' + this.selectedGroupval + '/items/' + this.selectedVal;
    const locationlocaldemo = 'keysList/' + this.userid + '/' + this.CurrentUserProject + '/' + this.selectedGroupval + '/items/' + this.selectedVal;

    const updateObject: Testeditems = {
      value: this.selectedVal,
      description: 'Enter',
      linkstackblitz: 'https://www.google.com/',
      name: this.selectedGroupval,
      details: 'Enter',
      testitem: this.newtcheader.value
    };
    if (this.CurrentUserProject === 'Demo') {
      this.tutorialService.create(locationlocaldemo, updateObject).then(resultid => {
        if (resultid !== null) {
          const changeditem: loaditems = { ...updateObject };
          this.detailsdisplay.setValue(updateObject.details);
          this.headingtext = updateObject.testitem;
          this.saveditemforedit = changeditem;
          this.showedit = false;
        }
      });

    } else {
      this.tutorialService.create(locationlocal, updateObject).then(resultid => {
        if (resultid !== null) {
          const changeditem: loaditems = { ...updateObject };
          this.detailsdisplay.setValue(updateObject.details);
          this.headingtext = updateObject.testitem;
          this.saveditemforedit = changeditem;
          this.showedit = false;
        }
      });
    } 
    this.newtcheader.reset('');
  }
  exitTC() {// User Adds a New Testitem after selecting the main list and cancels operation
    this.showedit = false;
  }

  ChangeCurrProject() {
    this.CurrentUserProject = this.homePublicProj.controls['homePublicProjAutocomplete'].value;
    this.loadkeysfromDb('keys/' + this.CurrentUserProject);
    if (this.CurrentUserType !== 'Demo') {//member is trying other projects
      this.tutorialService.getMyProfileInfoUpdate({ selection: this.homePublicProj.controls['homePublicProjAutocomplete'].value }, this.userid);
    }
    if (this.homePublicProj.valid) {
      this.homePublicProj.reset({homePublicProjAutocomplete:''});
    }
    this.sidenav.close();
  }

  NewProject() {// member screating own project
    const newItem: Item = {
      selection: this.homePublicProj.controls['homePublicProjAutocomplete'].value
    };
    this.tutorialService.createnewproject(newItem, this.userid);
    this.CurrentUserProject = newItem.selection;
    this.loadkeysfromDb('keys/' + this.CurrentUserProject);
    if (this.CurrentUserType !== 'Demo') {//member is trying other projects
      this.tutorialService.getMyProfileInfoUpdate({ selection:newItem.selection }, this.userid);
    }

    this.sidenav.close();
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