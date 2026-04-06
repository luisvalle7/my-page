import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MenuComponent } from '../../commons/menu/menu.component';

type Televisor = {
  id: number;
  marca: string;
  modelo: string;
  pulgadas: number;
  tipoPantalla: string;
  resolucion: string;
  precio: number;
};

@Component({
  selector: 'app-televisions',
  standalone: true,
  imports: [CommonModule, MenuComponent, ReactiveFormsModule],
  templateUrl: './televisions.component.html',
  styleUrl: './televisions.component.css'
})
export class TelevisionsComponent {
  private readonly http = inject(HttpClient);
  private readonly fb = inject(FormBuilder);
  //private readonly baseUrl = 'http://localhost:8080/televisions';
  //private readonly baseUrl = 'https://examenfinal-backend-412s.onrender.com/televisions';
  private readonly baseUrl = 'http://192.168.48.128:8080/televisions';

  readonly isLoading = signal(false);
  readonly isSubmitting = signal(false);
  readonly feedback = signal('');
  readonly televisions = signal<Televisor[]>([]);
  readonly editingId = signal<number | null>(null);

  readonly heading = computed(() =>
    this.editingId() ? 'Editar televisor' : 'Registrar televisor'
  );

  readonly televisionForm = this.fb.nonNullable.group({
    marca: ['', [Validators.required]],
    modelo: ['', [Validators.required]],
    pulgadas: ['', [Validators.required, Validators.min(10)]] as any,
    tipoPantalla: ['', [Validators.required]],
    resolucion: ['', [Validators.required]],
    precio: ['', [Validators.required, Validators.min(0)]] as any
  });

  constructor() {
    this.loadTelevisions();
  }

  loadTelevisions(): void {
    this.isLoading.set(true);
    this.feedback.set('');
    this.http.get<Televisor[]>(this.baseUrl).subscribe({
      next: (data) => this.televisions.set(data ?? []),
      error: () => this.feedback.set('No se pudo obtener el listado de televisores. Inténtalo nuevamente.'),
      complete: () => this.isLoading.set(false)
    });
  }

  submitTelevision(): void {
    if (this.televisionForm.invalid) {
      this.televisionForm.markAllAsTouched();
      return;
    }

    const tvPayload = {
      ...this.televisionForm.getRawValue(),
      pulgadas: Number(this.televisionForm.controls.pulgadas.value),
      precio: Number(this.televisionForm.controls.precio.value)
    };

    this.isSubmitting.set(true);
    this.feedback.set('');

    const request = this.editingId()
      ? this.http.put(`${this.baseUrl}/${this.editingId()}`, tvPayload, { responseType: 'text' as const })
      : this.http.post(this.baseUrl, tvPayload, { responseType: 'text' as const });

    request.subscribe({
      next: () => {
        this.feedback.set(this.editingId() ? 'Televisor actualizado correctamente.' : 'Televisor agregado.');
        this.resetForm();
        this.loadTelevisions();
      },
      error: () => this.feedback.set('No se pudo guardar el televisor. Revisa los datos e inténtalo de nuevo.'),
      complete: () => this.isSubmitting.set(false)
    });
  }

  editTelevision(tv: Televisor): void {
    this.editingId.set(tv.id);
    this.televisionForm.patchValue({
      marca: tv.marca,
      modelo: tv.modelo,
      pulgadas: tv.pulgadas,
      tipoPantalla: tv.tipoPantalla,
      resolucion: tv.resolucion,
      precio: tv.precio
    });
  }

  deleteTelevision(id: number): void {
    if (!confirm('¿Eliminar este televisor?')) {
      return;
    }
    this.isSubmitting.set(true);
    this.feedback.set('');
    this.http.delete(`${this.baseUrl}/${id}`, { responseType: 'text' as const }).subscribe({
      next: () => {
        this.feedback.set('Televisor eliminado.');
        this.loadTelevisions();
      },
      error: () => this.feedback.set('No se pudo eliminar. Revisa la API.'),
      complete: () => this.isSubmitting.set(false)
    });
  }

  cancelEdit(): void {
    this.resetForm();
  }

  trackByTelevision = (_: number, tv: Televisor) => tv.id;

  private resetForm(): void {
    this.editingId.set(null);
    this.televisionForm.reset({
      marca: '',
      modelo: '',
      pulgadas: '',
      tipoPantalla: '',
      resolucion: '',
      precio: ''
    });
  }
}
