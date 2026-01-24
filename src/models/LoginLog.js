import mongoose from 'mongoose';

const LoginLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
  email: { type: String, required: true },
  ip: { type: String, required: true },
  date: { type: Date, default: Date.now }
});

export default mongoose.models.LoginLog || mongoose.model('LoginLog', LoginLogSchema);
