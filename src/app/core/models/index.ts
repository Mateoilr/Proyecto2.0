// Interfaces para los modelos del sistema

export interface Patient {
  id: string;
  nombres: string;
  apellidos: string;
  tipoDocumento: 'CEDULA' | 'PASAPORTE' | 'RUC';
  documento: string;
  fechaNacimiento: Date;
  sexo: 'M' | 'F' | 'OTRO';
  direccion?: string;
  contacto?: string;
  email?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Exam {
  id: string;
  codigo: string;
  nombre: string;
  descripcion?: string;
  precio: number;
  tipoMuestra?: string;
  estado: 'ACTIVE' | 'INACTIVE';
  createdAt: Date;
  updatedAt: Date;
}

export interface Result {
  id: string;
  orderItemId: string;
  valor: string;
  unidad?: string;
  valorMin?: number;
  valorMax?: number;
  interpretacion?: string;
  estado: 'PENDIENTE' | 'ENTREGADO' | 'VALIDADO';
  createdById?: string;
  validatedById?: string;
  validatedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderItem {
  id: string;
  labOrderId: string;
  examId: string;
  exam: Exam;
  result?: Result;
  estado: 'PENDIENTE' | 'EN_PROCESO' | 'COMPLETADO' | 'CANCELADO';
  sampleType?: string;
  observaciones?: string;
}

export interface LabOrder {
  id: string;
  patientId: string;
  patient: Patient;
  codigo: string;
  prioridad: 'NORMAL' | 'URGENTE';
  estado: 'CREADA' | 'EN_PROCESO' | 'COMPLETADA' | 'CERRADA' | 'CANCELADA';
  observaciones?: string;
  items: OrderItem[];
  createdById: string;
  updatedById?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface NotificationResponse {
  success: boolean;
  message: string;
  auditLogId?: string;
}

export interface SendEmailDto {
  email: string;
}

export interface SendWhatsAppDto {
  phoneNumber: string;
}
