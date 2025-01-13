import express  from 'express'
const router = express.Router();
import {
  getAllShoes,
  getShoeById,
  createShoe,
  updateShoe,
  deleteShoe,
} from '../controllers/product.controller.mjs';
import { upload } from '../middlewares/multer.middleware.mjs';

// Routes
router.get('/', getAllShoes);
router.get('/:id', getShoeById);
router.post('/',upload.single("image"), createShoe);
router.put('/:id', updateShoe);
router.delete('/:id', deleteShoe);

 export default router;
