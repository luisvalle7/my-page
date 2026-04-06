import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MenuComponent } from '../../commons/menu/menu.component';

type Televisor = {
  id: number;
  marca: string;
  modelo: string;
};

type ControlRemoto = {
  id: number;
  marca: string;
  modelo: string;
  color: string;
  precio: number;
  televisor?: Televisor | null;
};

@Component({
  selector: 'app-remotes',
  standalone: true,
  imports: [CommonModule, MenuComponent, ReactiveFormsModule],
  templateUrl: './remotes.component.html',
  styleUrl: './remotes.component.css'
})
export class RemotesComponent {
  private readonly http = inject(HttpClient);
  private readonly fb = inject(FormBuilder);
  //private readonly baseUrl = 'http://localhost:8080/remotes';
  //private readonly televisionsUrl = 'http://localhost:8080/televisions';


  //private readonly baseUrl = 'https://examenfinal-backend-412s.onrender.com/remotes';
  private readonly baseUrl = 'http://192.168.48.128:8080/remotes';
  //private readonly televisionsUrl = 'https://examenfinal-backend-412s.onrender.com/televisions';
  private readonly televisionsUrl = 'http://192.168.48.128:8080/televisions';



  readonly remotes = signal<ControlRemoto[]>([]);
  readonly televisions = signal<Televisor[]>([]);
  readonly isLoading = signal(false);
  readonly isSubmitting = signal(false);
  readonly feedback = signal('');
  readonly editingId = signal<number | null>(null);

  readonly heading = computed(() =>
    this.editingId() ? 'Editar control remoto' : 'Agregar control remoto'
  );

  readonly remoteForm = this.fb.nonNullable.group({
    marca: ['', Validators.required],
    modelo: ['', Validators.required],
    color: ['', Validators.required],
    precio: ['', [Validators.required, Validators.min(0)]] as any,
    televisorId: this.fb.control<number | null>(null)
  });

  constructor() {
    this.loadRemotes();
    this.loadTelevisions();
  }

  loadRemotes(): void {
    this.isLoading.set(true);
    this.feedback.set('');
    this.http.get<ControlRemoto[]>(this.baseUrl).subscribe({
      next: (data) => this.remotes.set(data ?? []),
      error: () => this.feedback.set('No se pudo obtener la lista de controles.'),
      complete: () => this.isLoading.set(false)
    });
  }

  loadTelevisions(): void {
    this.http.get<Televisor[]>(this.televisionsUrl).subscribe({
      next: (data) => this.televisions.set(data ?? []),
      error: () => console.warn('No se pudo cargar el listado de televisores para la asociación.')
    });
  }

  submitRemote(): void {
    if (this.remoteForm.invalid) {
      this.remoteForm.markAllAsTouched();
      return;
    }

    const televisorId = this.remoteForm.controls.televisorId.value;
    const payload = {
      marca: this.remoteForm.controls.marca.value,
      modelo: this.remoteForm.controls.modelo.value,
      color: this.remoteForm.controls.color.value,
      precio: Number(this.remoteForm.controls.precio.value),
      televisor: televisorId ? { id: televisorId } : null
    };

    this.isSubmitting.set(true);
    this.feedback.set('');

    const request = this.editingId()
      ? this.http.put(`${this.baseUrl}/${this.editingId()}`, payload, { responseType: 'text' as const })
      : this.http.post(this.baseUrl, payload, { responseType: 'text' as const });

    request.subscribe({
      next: () => {
        this.feedback.set(this.editingId() ? 'Control actualizado correctamente.' : 'Control agregado.');
        this.resetForm();
        this.loadRemotes();
      },
      error: () => this.feedback.set('No se pudo guardar el control remoto.'),
      complete: () => this.isSubmitting.set(false)
    });
  }

  editRemote(remote: ControlRemoto): void {
    this.editingId.set(remote.id);
    this.remoteForm.patchValue({
      marca: remote.marca,
      modelo: remote.modelo,
      color: remote.color,
      precio: remote.precio,
      televisorId: remote.televisor?.id ?? null
    });
  }

  deleteRemote(id: number): void {
    if (!confirm('¿Eliminar este control remoto?')) {
      return;
    }
    this.isSubmitting.set(true);
    this.feedback.set('');
    this.http.delete(`${this.baseUrl}/${id}`, { responseType: 'text' as const }).subscribe({
      next: () => {
        this.feedback.set('Control eliminado.');
        this.loadRemotes();
      },
      error: () => this.feedback.set('No se pudo eliminar el control.'),
      complete: () => this.isSubmitting.set(false)
    });
  }

  cancelEdit(): void {
    this.resetForm();
  }

  trackByRemote = (_: number, remote: ControlRemoto) => remote.id;

  private resetForm(): void {
    this.editingId.set(null);
    this.remoteForm.reset({
      marca: '',
      modelo: '',
      color: '',
      precio: '',
      televisorId: null
    });
  }
}
