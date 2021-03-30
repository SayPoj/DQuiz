import { Component, OnInit } from '@angular/core';
import {FirebaseService} from "../../shared/services/firebase.service";

export interface testDoc{
  array?: Array<any>
}

@Component({
  selector: 'app-firebase-array-update',
  templateUrl: './firebase-array-update.component.html',
  styleUrls: ['./firebase-array-update.component.scss']
})

export class FirebaseArrayUpdateComponent {

  doc/*:testDoc*/
  docId = 'Ogsbs1YhsdiF14ASUY9K'

  constructor(public firebaseService: FirebaseService) {
    firebaseService.getTestDoc(this.docId).subscribe((doc/*:testDoc*/) => {
      this.doc=doc
      console.log(doc)
    })

  }

  incr(){
    this.firebaseService.updateTestDoc(this.docId, 3)
  }


}
