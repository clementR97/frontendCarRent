import { Component,OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { VoitureService,Voiture } from '../../services/voitures.service';
@Component({
  selector: 'app-admin-dashboard',
  imports: [CommonModule,FormsModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.scss'
})
export class AdminDashboardComponent implements OnInit{
voitures: Voiture[] = [];
selectedVoiture: Voiture |null = null;
showForm = false;
isEditing = false;
constructor(private voitureService:VoitureService){}
ngOnInit(): void {
  this.loadVoitures()
}
loadVoitures(){
  this.voitureService.getAllVoitures().subscribe({
    next: (voitures)=>{
      this.voitures = voitures;
    },
    error:(error)=>{
      console.log('Erreur lors du chargement des voitures', error);
    }
  });
}
// ouvrir le formulaire
openAddForm(){
  this.selectedVoiture = {
    marque: '',
    modele: '',
    annee: '',
    prixParJour: 0,
    disponible: true
  };
  this.isEditing = false;
  this.showForm=true;
}
//ouvrir le formulaire pour modifier une voiture
openEditForm(voiture:Voiture){
  this.selectedVoiture = {...voiture};
  this.isEditing = true;
  this.showForm = true;
}
// save une voiture
saveVoiture(){
 if(!this.selectedVoiture)return;
 if(this.isEditing && this.selectedVoiture._id){
    // modification

    this.voitureService.updateVoiture(this.selectedVoiture._id,this.selectedVoiture).subscribe({
      next: () =>{
        this.loadVoitures();
        this.closeForm();
      },
      error:(error) => {
        console.error('erreur lors de la modification:',error)
      }
    });
 }else{
  // creation
  this.voitureService.AddVoiture(this.selectedVoiture).subscribe({
    next: ()=>{
      this.loadVoitures();
      this.closeForm();
    },
    error: (error) => {
      console.error('Erreur lors de la creation:',error);
    }
  });
 }
}
// supprimer une voiture

deleteVoiture(id: string) {
  if (confirm('Êtes-vous sûr de vouloir supprimer cette voiture ?')) {
    this.voitureService.deleteVoiture(id).subscribe({
      next: () => {
        this.loadVoitures();
      },
      error: (error) => {
        console.error('Erreur lors de la suppression:', error);
      }
    });
  }
}
closeForm() {
  this.showForm = false;
  this.selectedVoiture = null;
  this.isEditing = false;
}
}
