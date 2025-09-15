import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject,Observable } from 'rxjs';
import {tap} from 'rxjs/operators';
import { ApiUrl } from '../../environments/environment';

export interface VoitureImage{
    url: string;
  public_id: string;
  alt: string;
  backgroundRemoved?: string;
  withGrayBackground?: string;
}
export interface Voiture{
    _id?:string;
    marque: string;
    modele: string;
    annee: string;
    prixParJour: number;
    disponible: boolean;
    images?:VoitureImage[];
    description?:string;
    caractéristiques?:string[];
}
export interface VoituresReponse{
    success: boolean;
    message: string;
    voiture: Voiture;
}

@Injectable({
    providedIn:'root'
})
export class VoitureService{
    private apiUrl= ApiUrl.ApiUrl+'/api/voitures';
    constructor(private http: HttpClient){}

    //recuperer et afficher les voitures enregistrer 
    getAllVoitures():Observable<Voiture[]>{
        return this.http.get<Voiture[]>(this.apiUrl);
    }
     
    // ajouter une voiture
    AddVoiture(voiture:Voiture):Observable<Voiture>{
        return this.http.post<Voiture>(this.apiUrl,voiture);
    }

    // modifier une voiture
    updateVoiture(id:string, voiture:Voiture):Observable<Voiture>{
        return this.http.put<Voiture>(`${this.apiUrl}/${id}`,voiture);
    }
    //supprimer une voiture
    deleteVoiture(id:string):Observable<Voiture>{
        return this.http.delete<Voiture>(`${this.apiUrl}/${id}`);
    }
}