import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Exercice } from '../../models/exercice.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-exercice-form',
  templateUrl: './exercice-form.html',
  styleUrl: './exercice-form.scss',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule]
})
export class ExerciceForm {
  @Output() exerciceChange = new EventEmitter<Exercice>();

  exerciceForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.exerciceForm = this.fb.group({
      nom: ['', Validators.required],
      type: ['repetition', Validators.required],
      repetitions: [null],
      duree: [null],
      repos: [null, Validators.required]
    });

    this.exerciceForm.valueChanges.subscribe(val => {
      this.exerciceChange.emit(val);
    });
  }

  get type() {
    return this.exerciceForm.get('type')?.value;
  }
}
