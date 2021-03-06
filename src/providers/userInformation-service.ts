import { NavController, App } from 'ionic-angular';
import { AngularFire, AngularFireModule, AuthProviders, AuthMethods, FirebaseListObservable, AngularFireAuth } from 'angularfire2';
import { Injectable } from '@angular/core';
import * as firebase from 'firebase';

@Injectable()
export class userInformationService {

    profile : FirebaseListObservable<any[]>;
    schoolList : FirebaseListObservable<any[]>;
    workList : FirebaseListObservable<any[]>;
    skillList : FirebaseListObservable<any[]>;
    userReference : FirebaseListObservable<any[]>;
    hobbies : string[];
    userLogin : any;
    userId : string;
    authState: any = null;

    //Information de l'utilisateur connecté
    competences : string;
    email : string;
    nom : string;
    photoDeProfil : string;
    prenoms : string;
    telephone : string;
    tribu : string;
    id : string;
    titreDuPosteActuel : string;
    societeDuPosteActuel : string;
    dateDeDebutDuPosteActuel : String;
    posteActuel : any;
    
    constructor(public afAuth: AngularFireAuth, private app: App, private af: AngularFire)  {

      this.profile = af.database.list('/consultants'); 
      this.userLogin = firebase.auth().currentUser;
  
      //Formattage de l'id de l'utilisateur courant
      this.userId = this.userLogin.email.split("@")[0].replace(".","");
  
    
      this.userReference = af.database.list('/consultants/'+this.userId); 
      
        //getUsersInfo
        /**
         * ici  on ne recupere que les informations qui sont stockées sous formes de clé-valeurs
         * c'est a dire qu'elles n'ont pas de noeud enfant
         * par exemple l'information 'email = quelquun@neolynk.fr' est sous forme de clé-valeur et n'a pas de noeuf enfant
         */
        this.userReference.subscribe(snapshots=>{
        snapshots.forEach(snapshot => {
          switch(snapshot.$key){
            case "competences" : { this.competences = snapshot.$value ;console.log("coucou" + this.competences);break;}
            case 'email' : { this.email = snapshot.$value ; console.log(this.email);}
            case 'id' : { this.id = snapshot.$value ;break;}
            case 'nom' : { this.nom = snapshot.$value  ;break;}
            case 'photoDeProfil' : { this.photoDeProfil = snapshot.$value ;console.log(this.photoDeProfil);break;}
            case 'prenoms' : { this.prenoms = snapshot.$value ;break;}
            case 'telephone' : { this.telephone = snapshot.$value ;break;}
            case 'tribu' : { this.tribu = snapshot.$value ;break;}    
          }
  
          });
        });
        
      /**
       * A partir de la on recupere les informations qui ont des noeuds enfants 
       * par exemple le parcours scolaire a plusieurs noeuds qui correspond a plusieurs
       * diplomes obtenus a differentes dates
       */
      this.schoolList = af.database.list('/consultants/'+this.userId+'/etudes', {
        query: {
          orderByChild: 'date'
        }
      }); 

      this.posteActuel = this.af.database.object('/consultants/'+this.userId+'/poste');      

      this.workList = af.database.list('/consultants/'+this.userId+'/experiences', {
        query: {
          orderByChild: 'date'
        }
      }); 
      this.skillList = af.database.list('/consultants/'+this.userId+'/competences'); 
  
      
      // Get a reference to the hobbies
      this.hobbies = [];
      let instance = this;
      let ref = firebase.database().ref('/consultants/'+this.userId+'/hobbies');
  
      // Get the hobbies
      ref.on("child_added", function(snapshot) {
        instance.hobbies.push(snapshot.val());
      });
        
    }
    
}