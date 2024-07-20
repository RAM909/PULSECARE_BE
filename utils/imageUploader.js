const cloudinary = require("cloudinary").v2;

const tmp = require("tmp");
const fs = require("fs");

exports.uploadImageToCloudinary = async (
  fileBuffer,
  folder,
  height,
  quality
) => {
  const options = { folder };
  if (height) {
    options.height = height;
  }
  if (quality) {
    options.quality = quality;
  }
  options.resource_type = "auto";

  // Create a temporary file
  const tempFile = tmp.fileSync();

  // Write the file buffer to the temporary file
  fs.writeFileSync(tempFile.name, fileBuffer);

  // Pass the file path to the upload function
  return await cloudinary.uploader.upload(tempFile.name, options);
};

exports.deleteImageFromCloudinary = async (imageUrl) => {
  try {
    // Extract the public ID of the image from its URL
    const publicId = getImagePublicId(imageUrl);

    // Delete the image from Cloudinary
    const deletionResult = await cloudinary.uploader.destroy(publicId);

    return deletionResult;
  } catch (error) {
    console.error("Error deleting image from Cloudinary:", error);
    throw error; // Propagate the error to the calling function
  }
};

// Function to extract the public ID from the Cloudinary image URL
const getImagePublicId = (imageUrl) => {
  const parts = imageUrl.split("/");
  const fileName = parts[parts.length - 1];
  const publicId = fileName.split(".")[0]; // Remove the file extension
  return publicId;
};
