import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { loaditems, loadkeys,mykeys } from '../app-name/item';
import { collectionData, doc } from 'rxfire/firestore';
import firebase from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import { map, switchMap,filter,flatMap  } from 'rxjs/operators';
import { Observable, Subject, Subscriber, Subscription } from 'rxjs';
export interface Shirt { description: string; details: string; disabled: string; linkstackblitz: string; name: string; testitem: string; value: string;viewvalue:string; }

import { FirebaseApp } from '@angular/fire';
import { first, tap } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';


export interface Item { 
  MembershipEnd?: string;
  MembershipType?:string;
  selection:string;
 }


@Injectable({
  providedIn: 'root'
})
export class UserdataService {
  private dbPath = 'tutorials';
  private dbPathkey = 'mykey';
  private dbPathMap = 'tutorialsMap/CDK/items';
  tutorialsRef: AngularFirestoreCollection<loaditems> = null;
  tutorialsRefMap: AngularFirestoreCollection<Shirt> = null;
  tutorialskeyRef: AngularFirestoreCollection<loadkeys> = null;
  private itemDoc: AngularFirestoreDocument<Item>;

  constructor(private db: AngularFirestore,
    public readonly auth: AngularFireAuth) {
    this.tutorialsRef = db.collection(this.dbPath);
    this.tutorialskeyRef = db.collection(this.dbPathkey);
    this.tutorialsRefMap = db.collection(this.dbPathMap);
  }


 
  getMyProfileInfo(uid:string): Observable<any> {
          const mystr= 'myProfile/' + uid;
          const davidDocRef = this.db.firestore.doc(mystr);
          return doc(davidDocRef);
  }
  initkeys(selecteduid:string): Observable<any> {
      const mystr= 'keysList/' + 'listid';
      const davidDocRef = this.db.firestore.doc(mystr);
      return doc(davidDocRef);
}
initProjkeys(uid:String) {
  const mystr= 'keys/' +  uid;
  const davidDocRef = this.db.firestore.doc(mystr);
  return doc(davidDocRef).pipe(
    map(changes => ({ ...changes.data() })
    ));
}
initProjSeckeys(mainProj:string){  
  const locationlocal= 'keys/' + mainProj + '/';  
  const davidDocRef = this.db.firestore.doc(locationlocal);            
  return doc(davidDocRef).pipe(
    map(changes => ({ ...changes.data() })
    ));
}
  async createMapAdd(dblocation: string, myitem:loaditems): Promise<void>{
    const davidDocRef = this.db.firestore.doc(dblocation);//'tutorialsMap/CDK/items/dragAndDrop');
    await davidDocRef.set({item: firebase.firestore.FieldValue.arrayUnion(myitem)
      /*{
      description:'Enter', 
      details: 'Enter',
      disabled: 'Enter',
      linkstackblitz: 'Enter',
      name: 'Enter',
      testitem: 'Enter',
      value: 'Enter',
      viewvalue: 'Enter'})*/
    },
    {merge: true});
  }
  createMapupdate(){
    const davidDocRef = this.db.collection('tutorialsMap/CDK/items');
    return true;
  }
  createMapDelete(){
    const davidDocRef = this.db.collection('tutorialsMap/CDK/items');
    return true;
  }
  readdocs(){
    return this.tutorialsRefMap.snapshotChanges().pipe(
      map(changes => 
        changes.map(c => ({ ...c.payload.doc.data() }))
      )
    );
  }
  loadStartPageSelect(labelid:string,userid:string){
    console.log('labelid',labelid,userid);
    if(labelid === 'Demo'){
      const mystr= 'keysList/'+ userid +'/keys'+ '/Demo/';
      const davidDocRef = this.db.firestore.doc(mystr);
      return doc(davidDocRef).pipe(
        map(changes => ({ ...changes.data() })
        ));
    }else{
      const mystr= 'keys/' + labelid;
      const davidDocRef = this.db.firestore.doc(mystr);
      return doc(davidDocRef).pipe(
        map(changes => ({ ...changes.data() })
        ));
    }

  }
  createMapKeys(){
    const davidDocRef = this.db.firestore.doc('tutorialsMap/CDK/items/dragAndDrop');
    return doc(davidDocRef).pipe(
      map(changes => ({ ...changes.data() })
      ));
  }

  getServicesSelectors(mainfield: string, subfield: string): any {            
    const queryref = this.db.collection(this.dbPath).ref.where('name', '==', mainfield).where('value', '==', subfield);
    return collectionData(queryref, 'id');
  }

  getServicesSelectorsMap(locationlocal: string){  
    const davidDocRef = this.db.firestore.doc(locationlocal);            
    return doc(davidDocRef).pipe(
      map(changes => ({ ...changes.data() })
      ));
  }
  async create(id: string , tutorial: loaditems): Promise<void>  {
    const davidDocRef = this.db.firestore.doc(id);
    await davidDocRef.set({item: firebase.firestore.FieldValue.arrayUnion(tutorial) },
    {merge: true});   
  }
  async createMapkeys(id: string , myitem:string, tutorial: string): Promise<void>  {
    const davidDocRef = this.db.firestore.doc(id);
    let myObj = new Object();
    let a = myitem;
    myObj[a] = firebase.firestore.FieldValue.arrayUnion(tutorial);
    await davidDocRef.set(myObj,{merge: true});
  }
  async createList( tutorial: string): Promise<void>  {
    const davidDocRef = this.db.firestore.doc('keysList/listid');
    await davidDocRef.set({AllList: firebase.firestore.FieldValue.arrayUnion(tutorial) },
    {merge: true});   
  }
  async update(id: string, dataupdated: any, olddata:any): Promise<void> {
    const davidDocRef = this.db.firestore.doc(id);
    await this.db.firestore.runTransaction(() => {
      const promise = Promise.all([
        // changed from set,{merge: true}
        davidDocRef.update({item: firebase.firestore.FieldValue.arrayUnion(dataupdated)}),
        davidDocRef.update({item: firebase.firestore.FieldValue.arrayRemove(olddata)})

      ]);
      return promise;
    });
  }
  async delete(id: string,olddata:any): Promise<void> {
    const davidDocRef = this.db.firestore.doc(id);
    return await davidDocRef.update({item: firebase.firestore.FieldValue.arrayRemove(olddata)});
  }
  async login() {
    return await this.auth.signInWithPopup( new (firebase.auth as any).GoogleAuthProvider());
  }
  async logout() {
    await this.auth.signOut();
  }
  getAll(): AngularFirestoreCollection<loaditems> {//notused
    return this.tutorialsRef;
  }
  createkeys(mykeys: loadkeys): any {//notused
    return this.tutorialskeyRef.add({ ...mykeys });
  }

  getDocumentData(projectname:string, mainfield: string, subfield: string): any {
    const collectionPath= projectname + '/' + mainfield + '/items/'+ subfield;  
    const davidDocRef = this.db.firestore.doc(collectionPath);            
    return doc(davidDocRef).pipe(
      map(changes => ({ ...changes.data() })
      ));
  }

  getDocumentSnapShots(projectname:string, mainfield: string, subfield: string){
    const collectionPath= projectname + '/' + mainfield + '/items/'+ subfield;  
    return this.db.doc<any>(collectionPath).valueChanges();
    
  }

  getProjectCollection(){
    return this.db.collection<any>('KeysListCollection').valueChanges({ idField: 'customID' });
  }
  getquerycollection(projName: string): any {            
    //using angularfire
    //const query = this.db.ref.where('uid', '==', key);
    //using angularfire running query once
    //return this.db.collection<any>('KeysListCollection', ref => ref.where('project', '==', projName)).valueChanges();
    //using angularfire running query and returning unique record
    //return this.db.collection<any>('KeysListCollection', ref => ref.where('project', '==', projName).limit(1)).valueChanges();
    //using angularfire running query and returning records by order Ascending and returning last record
    return this.db.collection<any>('KeysListCollection', ref => ref.where('project', '==', projName).orderBy('mykey')).valueChanges().pipe(flatMap(users=> users));
    
    //using firebase native api
    
  }
//imp one
  async createnewproject(newproj: Item,useruid:string): Promise<void>{   
      const davidDocRefself = this.db.firestore.doc('keysList/' + useruid);
      const davidDocRef = this.db.firestore.doc('keysList/' + 'listid/');
      const docpathKeysRef=this.db.firestore.doc('keys/' + newproj.selection);
      const profileupdate = this.db.firestore.doc('myProfile/' + useruid);
      this.db.firestore.runTransaction(() => {
      const promise = Promise.all([
        // changed from set,{merge: true}        
    profileupdate.set({selection:newproj.selection},{merge: true}),
    davidDocRefself.set({AllList: firebase.firestore.FieldValue.arrayUnion(newproj.selection) },
    {merge: true}),
    davidDocRef.set({AllList: firebase.firestore.FieldValue.arrayUnion(newproj.selection) },
    {merge: true}),
    docpathKeysRef.set({ MainSection: [{ SubSection: false }]}) ]);
      return promise;
    });

  }
  async firstLoginCreatePrivateProject(newproj: Item,useruid:string): Promise<void>{   

    //this.db.collection("keysList").doc(useruid).set({AllList: firebase.firestore.FieldValue.arrayUnion(newproj.selection) }, {merge: true}).then(success=>{
      const docpath='keysList/' + useruid + '/keys';
      this.db.collection(docpath).doc(newproj.selection).set({MainSection:[{SubSection: false}]});
    //});

}
  getMyProfileInfoUpdate(newproj: Item,useruid:string){
    const docpath='myProfile/' + useruid;
    this.itemDoc = this.db.doc<Item>(docpath);
    this.itemDoc.set(newproj, {merge:true}).then(success=>{
      //console.log(success);
    });
  }
  


}
