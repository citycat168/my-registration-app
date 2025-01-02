import mongoose from 'mongoose';

const gaitSpeedSchema = new mongoose.Schema({
  username: { 
    type: String, 
    required: true 
  },
  date: { 
    type: Date, 
    required: true 
  },
  speed: { 
    type: Number, 
    required: true 
  }
});

export default mongoose.model('GaitSpeed', gaitSpeedSchema);