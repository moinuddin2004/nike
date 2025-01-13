import { PrismaClient } from '@prisma/client';
import { uploadOnCloudinary } from '../utils/cloudinary.mjs';
const prisma = new PrismaClient();

// Get all shoes
const getAllShoes = async (req, res) => {
  try {
    const shoes = await prisma.shoes.findMany();
    res.status(200).json({ success: true, data: shoes });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get a single shoe
const getShoeById = async (req, res) => {
  const { id } = req.params;
  try {
    const shoe = await prisma.shoes.findUnique({ where: { id: parseInt(id) } });
    if (!shoe) return res.status(404).json({ success: false, message: 'Shoe not found' });
    res.status(200).json({ success: true, data: shoe });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create a new shoe
const createShoe = async (req, res) => {
  const { name, price, description } = req.body;

  try {
    // Check if an image is provided in the request
    const imageLocalPath = req.file?.path;
    if (!imageLocalPath) {
      return res.status(400).json({ success: false, message: "Image is required" });
    }

    // Upload the image to a cloud storage (e.g., Cloudinary)
    const uploadedImage = await uploadOnCloudinary(imageLocalPath);

    // Create a new shoe entry in the database
    const newShoe = await prisma.shoes.create({
      data: {
        name,
        price: Number(price),
        description,
        image: uploadedImage.url, // Use the URL returned from the cloud storage
      },
    });

    res.status(201).json({ success: true, data: newShoe });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// Update a shoe
const updateShoe = async (req, res) => {
  const { id } = req.params;
  const { name, price, image } = req.body;
  try {
    const updatedShoe = await prisma.shoes.update({
      where: { id: parseInt(id) },
      data: { name, price, image },
    });
    res.status(200).json({ success: true, data: updatedShoe });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete a shoe
const deleteShoe = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.shoes.delete({ where: { id: parseInt(id) } });
    res.status(200).json({ success: true, message: 'Shoe deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};



export { getAllShoes, getShoeById, createShoe, updateShoe, deleteShoe };