const ProfilePhotoSelector = ({ image, setImage, preview, setPreview }) => {
  return (
    <div className="flex flex-col items-center space-y-2">
      {preview && (
        <img
          src={preview}
          alt="Profile Preview"
          className="w-20 h-20 rounded-full object-cover border"
        />
      )}
      <input
        type="file"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files[0];
          if (file) {
            setImage(file); // File object
            setPreview(URL.createObjectURL(file)); // Preview
          }
        }}
        className="text-sm"
      />
    </div>
  );
};

export default ProfilePhotoSelector;
