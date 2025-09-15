import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { VoitureService, Voiture, VoitureImage } from '../../services/voitures.service';
import { ImageAiService, ImageVariants, BackgroundVariant } from '../../services/image-ai.service';

interface ProcessedImageData {
  variants: ImageVariants;
  backgroundVariants: BackgroundVariant[];
  selectedUrl: string;
}

@Component({
  selector: 'app-admin-dashboard',
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.scss'
})
export class AdminDashboardComponent implements OnInit {
  voitures: Voiture[] = [];
  selectedVoiture: Voiture | null = null;
  showForm = false;
  isEditing = false;

  // Propriétés IA pour multiple images
  selectedFiles: FileList | null = null;
  processedImages: ProcessedImageData[] = [];
  selectedBackground = 'lightgray';
  availableBackgrounds = [
    { name: 'Gris clair', value: 'lightgray' },
    { name: 'Blanc', value: 'white' },
    { name: 'Noir', value: 'black' },
    { name: 'Bleu', value: 'blue' },
    { name: 'Vert', value: 'green' }
  ];

  constructor(
    private voitureService: VoitureService,
    private imageAiService: ImageAiService
  ) {}

  ngOnInit(): void {
    this.loadVoitures();
  }

  loadVoitures() {
    this.voitureService.getAllVoitures().subscribe({
      next: (voitures) => {
        this.voitures = voitures;
      },
      error: (error: any) => {
        console.log('Erreur lors du chargement des voitures', error);
      }
    });
  }

  // Ouvrir le formulaire
  openAddForm() {
    this.selectedVoiture = {
      marque: '',
      modele: '',
      annee: '',
      prixParJour: 0,
      disponible: true,
      images: []
    };
    this.isEditing = false;
    this.showForm = true;
    this.resetImageData();
  }

  // Ouvrir le formulaire pour modifier une voiture
  openEditForm(voiture: Voiture) {
    this.selectedVoiture = { 
      ...voiture,
      images: voiture.images ? [...voiture.images] : []
    };
    this.isEditing = true;
    this.showForm = true;
    this.resetImageData();
  }

  // Sauvegarder une voiture
  saveVoiture() {
    if (!this.selectedVoiture) return;

    if (this.isEditing && this.selectedVoiture._id) {
      // Modification
      this.voitureService.updateVoiture(this.selectedVoiture._id, this.selectedVoiture).subscribe({
        next: () => {
          this.loadVoitures();
          this.closeForm();
        },
        error: (error: any) => {
          console.error('Erreur lors de la modification:', error);
        }
      });
    } else {
      // Création
      this.voitureService.AddVoiture(this.selectedVoiture).subscribe({
        next: () => {
          this.loadVoitures();
          this.closeForm();
        },
        error: (error: any) => {
          console.error('Erreur lors de la création:', error);
        }
      });
    }
  }

  // Supprimer une voiture
  deleteVoiture(id: string) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette voiture ?')) {
      this.voitureService.deleteVoiture(id).subscribe({
        next: () => {
          this.loadVoitures();
        },
        error: (error: any) => {
          console.error('Erreur lors de la suppression:', error);
        }
      });
    }
  }

  // Fermer le formulaire
  closeForm() {
    this.showForm = false;
    this.selectedVoiture = null;
    this.isEditing = false;
    this.resetImageData();
  }

  // Méthodes IA pour multiple images
  onFilesSelected(event: any) {
    const files = event.target.files;
    if (files.length > 6) {
      alert('Maximum 6 images autorisées');
      return;
    }
    this.selectedFiles = files;
  }

  removeFile(index: number) {
    if (this.selectedFiles) {
      const filesArray = Array.from(this.selectedFiles);
      filesArray.splice(index, 1);
      this.selectedFiles = filesArray as any;
    }
  }

  processAllImagesWithAI() {
    if (!this.selectedFiles || this.selectedFiles.length === 0) return;

    this.processedImages = [];
    const filesArray = Array.from(this.selectedFiles);

    filesArray.forEach((file, index) => {
      this.imageAiService.uploadWithBackgroundRemoval(file, this.selectedBackground).subscribe({
        next: (variants) => {
          const imageData: ProcessedImageData = {
            variants: variants,
            backgroundVariants: [],
            selectedUrl: variants.withGrayBackground
          };
          
          this.processedImages.push(imageData);
          
          // Charger les variantes d'arrière-plan pour cette image
          this.loadBackgroundVariantsForImage(variants.public_id, this.processedImages.length - 1);
        },
        error: (error: any) => {
          console.error(`Erreur lors du traitement de l'image ${index + 1}:`, error);
        }
      });
    });
  }

  loadBackgroundVariantsForImage(publicId: string, imageIndex: number) {
    this.imageAiService.generateBackgroundVariants(publicId).subscribe({
      next: (response) => {
        this.processedImages[imageIndex].backgroundVariants = response.variants;
      },
      error: (error: any) => {
        console.error('Erreur lors du chargement des variantes:', error);
      }
    });
  }

  selectImageForIndex(imageIndex: number, imageType: 'original' | 'backgroundRemoved' | 'withGrayBackground' | 'withCustomBackground') {
    if (this.processedImages[imageIndex]) {
      this.processedImages[imageIndex].selectedUrl = this.processedImages[imageIndex].variants[imageType];
    }
  }

  selectBackgroundVariantForIndex(imageIndex: number, variant: BackgroundVariant) {
    if (this.processedImages[imageIndex]) {
      this.processedImages[imageIndex].selectedUrl = variant.url;
    }
  }

  addSingleImageToVoiture(imageIndex: number) {
    if (this.processedImages[imageIndex] && this.selectedVoiture && this.processedImages[imageIndex].selectedUrl) {
      if (this.selectedVoiture.images && this.selectedVoiture.images.length >= 6) {
        alert('Maximum 6 images autorisées');
        return;
      }

      const imageData: VoitureImage = {
        url: this.processedImages[imageIndex].selectedUrl,
        public_id: this.processedImages[imageIndex].variants.public_id,
        alt: `${this.selectedVoiture.marque} ${this.selectedVoiture.modele}`,
        backgroundRemoved: this.processedImages[imageIndex].variants.backgroundRemoved,
        withGrayBackground: this.processedImages[imageIndex].variants.withGrayBackground
      };
      
      if (!this.selectedVoiture.images) {
        this.selectedVoiture.images = [];
      }
      this.selectedVoiture.images.push(imageData);
    }
  }

  addAllImagesToVoiture() {
    if (!this.selectedVoiture) return;

    if (this.selectedVoiture.images && this.selectedVoiture.images.length + this.processedImages.length > 6) {
      alert('Maximum 6 images autorisées au total');
      return;
    }

    this.processedImages.forEach((imageData, index) => {
      if (imageData.selectedUrl) {
        const voitureImage: VoitureImage = {
          url: imageData.selectedUrl,
          public_id: imageData.variants.public_id,
          alt: `${this.selectedVoiture!.marque} ${this.selectedVoiture!.modele}`,
          backgroundRemoved: imageData.variants.backgroundRemoved,
          withGrayBackground: imageData.variants.withGrayBackground
        };
        
        if (!this.selectedVoiture!.images) {
          this.selectedVoiture!.images = [];
        }
        this.selectedVoiture!.images.push(voitureImage);
      }
    });
  }

  removeImageFromVoiture(index: number) {
    if (this.selectedVoiture && this.selectedVoiture.images) {
      this.selectedVoiture.images.splice(index, 1);
    }
  }

  resetImageData() {
    this.selectedFiles = null;
    this.processedImages = [];
    this.selectedBackground = 'lightgray';
  }
}

