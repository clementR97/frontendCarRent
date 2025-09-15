import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
 import { ApiUrl } from "../../environments/environment";
// import { environment } from "../../environments/environment";
export interface ImageVariants{
    original: string;
    backgroundRemoved: string;
    withGrayBackground: string;
    withCustomBackground: string;
    public_id: string;
}

export interface BackgroundVariant{
    name: string;
    color: string;
    url: string;
}
@Injectable({
    providedIn:'root'
})
export class ImageAiService{
    private apiUrl = `${ApiUrl.ApiUrl}/api/voitures`;
    // private apiUrl = `${environment.apiUrl}/api/voitures`;
    constructor(private http: HttpClient){}

    uploadWithBackgroundRemoval(file:File,backgroundColor?: string):Observable<ImageVariants>{
        const formData = new FormData();
        formData.append('image',file);
        if(backgroundColor){
            formData.append('backgroundColor',backgroundColor);
        }
        return this.http.post<ImageVariants>(`${this.apiUrl}/upload-with-bg-removal`,formData);
    }
    generateBackgroundVariants(publicId: string): Observable<{variants: BackgroundVariant[]}>{
        return this.http.get<{variants: BackgroundVariant[]}>(`${this.apiUrl}/${publicId}/background-variants`);
    }
    deleteImage(publicId: string): Observable<any>{
        return this.http.delete(`${this.apiUrl}/images/${publicId}`);
    }
    checkCredits(): Observable<any> {
      return this.http.get(`${this.apiUrl}/check-credits`);
    }
}