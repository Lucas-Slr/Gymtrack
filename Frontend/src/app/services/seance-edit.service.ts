import { Injectable } from '@angular/core';
import { Seance } from '../models/seance.model';

@Injectable({
  providedIn: 'root'
})
export class SeanceEditService {
  private seanceAModifier: Seance | null = null;

  setSeanceAModifier(seance: Seance) {
    this.seanceAModifier = seance;
  }

  getSeanceAModifier(): Seance | null {
    return this.seanceAModifier;
  }

  clearSeanceAModifier() {
    this.seanceAModifier = null;
  }
}
