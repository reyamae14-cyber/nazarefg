import mongoose from 'mongoose';

const profileIconSchema = new mongoose.Schema({
  title: {
    type: Object
  },
  src: {
    type: Array
  }
});

const ProfileIcon = mongoose.models.ProfileIcon || mongoose.model("profileIcon", profileIconSchema);

export default ProfileIcon;