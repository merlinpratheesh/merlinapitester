import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { Observable, Subscription } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';
import { map } from 'rxjs/operators';
import { UserdataService } from './service/userdata.service';
import { MatSidenav } from '@angular/material/sidenav';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'globalstart';
  loggedin:string= undefined;
  ShowMessage = 'ShowSpinner';
  ShowMessageloading = 'Log in';
  titleDialogRef: MatDialogRef<any>
  authstartSub: Subscription;
  userid: any;
  @ViewChild('drawer') public sidenav: MatSidenav;
  userDisplayName: string;
  constructor(public dialog: MatDialog, public afAuth: AngularFireAuth,
    public tutorialService: UserdataService) {

      this.authstartSub= this.afAuth.authState.pipe(
        map((credential: any) => {
             if (credential !== null) {
               this.loggedin = 'true';
               this.userid = credential.uid;
               this.userDisplayName = credential.displayName;
         return 'true';
            }else{
               this.loggedin= 'false';
               this.titleDialogRef.close();
               this.openDialog('loggedout');//login screen is shown
               return 'false';
       }
        })).subscribe(mydata => {
           if (mydata === 'true') {
             this.titleDialogRef.close();//Main Screen is shown
             }
         });

  }
  
  ngOnInit(): void {
    this.openDialog('loggingin');//Spinner is shown
  }

ngOnDestroy(){
        this.authstartSub.unsubscribe();
}
drawerclose() {
  this.sidenav.close();
}
draweropen() {

}
  openDialog(status: string): void {
    this.titleDialogRef = this.dialog.open(DialogOverviewExampleDialog, {
      //width: '250px',
      data: status
    });

    this.titleDialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }
  componentLogout() {
    this.ShowMessage = 'Logged out';
    this.sidenav.close();
    this.tutorialService.logout();
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
export class DialogOverviewExampleDialog  {
  mydata = 'showspinner';
  constructor(
    public dialogRef: MatDialogRef<DialogOverviewExampleDialog >,
    @Inject(MAT_DIALOG_DATA) public data: string, public tutorialService: UserdataService) {

  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
