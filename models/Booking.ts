import mongoose, { Document, Schema } from 'mongoose';

export interface IBooking extends Document {
  patient: mongoose.Types.ObjectId;
  doctor: mongoose.Types.ObjectId;
  appointmentDate: Date;
  appointmentTime: string;
  duration: number;
  status: 'scheduled' | 'completed' | 'cancelled' | 'no-show';
  consultationType: 'in-person' | 'video' | 'phone';
  symptoms?: string;
  notes?: string;
  fee?: number;
  paymentStatus: 'pending' | 'paid' | 'refunded';
  reminderSent: boolean;
  cancelReason?: string;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const BookingSchema: Schema = new Schema(
  {
    patient: {
      type: Schema.Types.ObjectId,
      ref: 'Patient',
      required: [true, 'Patient is required'],
    },
    doctor: {
      type: Schema.Types.ObjectId,
      ref: 'Doctor',
      required: [true, 'Doctor is required'],
    },
    appointmentDate: {
      type: Date,
      required: [true, 'Appointment date is required'],
    },
    appointmentTime: {
      type: String,
      required: [true, 'Appointment time is required'],
    },
    duration: {
      type: Number,
      default: 30,
      min: 15,
    },
    status: {
      type: String,
      enum: ['scheduled', 'completed', 'cancelled', 'no-show'],
      default: 'scheduled',
    },
    consultationType: {
      type: String,
      enum: ['in-person', 'video', 'phone'],
      default: 'in-person',
    },
    symptoms: {
      type: String,
      trim: true,
    },
    notes: {
      type: String,
      trim: true,
    },
    fee: {
      type: Number,
      min: 0,
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'refunded'],
      default: 'pending',
    },
    reminderSent: {
      type: Boolean,
      default: false,
    },
    cancelReason: {
      type: String,
      trim: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.models.Booking || mongoose.model<IBooking>('Booking', BookingSchema);
